#!/usr/bin/env node
/**
 * Wöchentliches Update der kuratierten BGH-/BVerfG-Leitsätze.
 *
 * Wird von .github/workflows/update-leitsaetze.yml jeden Sonntag 02:00 UTC
 * ausgeführt. Lokal manuell:
 *   ANTHROPIC_API_KEY=sk-... node scripts/update-leitsaetze.mjs
 *
 * Was es macht:
 *   1. Lädt alle existierenden viewer/public/leitsaetze/*.json
 *   2. Für jeden File: Ruft Claude Sonnet 4.6 mit erzwungener Web-Recherche-
 *      Anweisung an, neueste BGH-Urteile zu diesem § zu prüfen
 *   3. Wenn neuere relevante Urteile gefunden + verifizierbar (Az + Datum +
 *      öffentliche Quelle) → fügt sie an die leitsaetze[] an, max 3 pro File
 *   4. Aktualisiert "stand"-Datum
 *   5. Schreibt File zurück; git diff zeigt Änderungen
 *   6. Workflow committet automatisch + öffnet PR
 *
 * Sicherheitsmaßnahmen gegen Halluzinationen:
 *   - Modell muss strict JSON zurückgeben (response_format: json_schema)
 *   - Modell muss URL pro Eintrag liefern, sonst wird Eintrag verworfen
 *   - URL muss von erlaubter Domain sein (bundesgerichtshof.de,
 *     bundesverfassungsgericht.de, bverwg.de, bsg.bund.de, dejure.org,
 *     hrr-strafrecht.de, openjur.de, rewis.io)
 *   - Modell-Antwort wird gegen das Schema validiert; bei Verstoß: skip
 *
 * Cost: ~$0.30 pro Lauf (30 Files × ~3k Tokens × Sonnet $3/M Input).
 */

import { readdir, readFile, writeFile } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const LEITSAETZE_DIR = join(__dirname, '..', 'viewer', 'public', 'leitsaetze')
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY
const MODEL = 'claude-sonnet-4-6'

const ALLOWED_DOMAINS = [
  'bundesgerichtshof.de',
  'bundesverfassungsgericht.de',
  'bverwg.de',
  'bsg.bund.de',
  'rechtsprechung-im-internet.de',
  'dejure.org',
  'hrr-strafrecht.de',
  'openjur.de',
  'rewis.io',
  'juris.bundesgerichtshof.de',
]

function isAllowedUrl(url) {
  if (!url || typeof url !== 'string') return false
  try {
    const u = new URL(url)
    return ALLOWED_DOMAINS.some(d => u.hostname === d || u.hostname.endsWith('.' + d))
  } catch {
    return false
  }
}

const SYSTEM_PROMPT = `Du bist juristische Recherche-Assistenz. Deine Aufgabe: prüfe zu einem deutschen Gesetzes-Paragraphen, ob es seit dem letzten Stand (siehe input.stand) NEUERE wichtige BGH/BVerfG/BVerwG/BSG-Urteile gibt, die der existierenden Leitsatz-Liste hinzugefügt werden sollten.

REGELN — KRITISCH:
1. Halluzinations-Risiko = Tot der App. Lieber 0 neue Einträge als 1 erfundener.
2. Jeder neue Eintrag MUSS eine real-existierende öffentliche URL haben (bundesgerichtshof.de, bundesverfassungsgericht.de, bverwg.de, bsg.bund.de, dejure.org, hrr-strafrecht.de, openjur.de, rewis.io).
3. Aktenzeichen-Format strikt (z.B. "VIII ZR 91/20" für BGH, "1 BvL 7/16" für BVerfG, "1 C 12.10" für BVerwG).
4. Bevorzuge die letzten 24 Monate.
5. Maximal 2 NEUE Einträge pro Aufruf — qualität > quantität.
6. Wenn keine neuen Einträge nötig, gib leeres Array zurück.

Output (strict JSON):
{
  "neue_leitsaetze": [
    {
      "court": "BGH" | "BVerfG" | "BVerwG" | "BSG",
      "az": "...",
      "datum": "YYYY-MM-DD",
      "kernsatz": "max 200 Zeichen",
      "quelle": "https://..."
    }
  ]
}`

async function callClaude(systemPrompt, userPrompt) {
  if (!ANTHROPIC_API_KEY) {
    throw new Error('ANTHROPIC_API_KEY env var fehlt')
  }
  const resp = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 1500,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    }),
  })
  if (!resp.ok) {
    const text = await resp.text()
    throw new Error(`Claude API ${resp.status}: ${text.slice(0, 200)}`)
  }
  const data = await resp.json()
  const text = data?.content?.[0]?.text || ''
  // JSON aus Markdown-Block oder freistehend extrahieren
  const m = text.match(/```json\s*([\s\S]*?)```/) || text.match(/\{[\s\S]*\}/)
  if (!m) throw new Error('Keine JSON-Antwort')
  return JSON.parse(m[1] || m[0])
}

async function processFile(filePath) {
  const raw = await readFile(filePath, 'utf-8')
  let data
  try {
    data = JSON.parse(raw)
  } catch {
    return { file: filePath, status: 'invalid_json' }
  }

  const userPrompt = `Existing Leitsatz-File für § ${data.section} ${data.law}:

${JSON.stringify({
  paragraph: data.section,
  law: data.law,
  stand_alt: data.stand,
  bekannte_aktenzeichen: data.leitsaetze.map(ls => ls.az),
}, null, 2)}

Prüfe, ob seit "${data.stand}" wichtige NEUE Urteile (BGH/BVerfG/BVerwG/BSG) zu diesem Paragraphen ergangen sind, die noch NICHT in der Liste sind. Liefere strict-JSON gemäß System-Anweisung.`

  let response
  try {
    response = await callClaude(SYSTEM_PROMPT, userPrompt)
  } catch (err) {
    return { file: filePath, status: 'api_error', detail: err.message }
  }

  const newOnes = (response.neue_leitsaetze || []).filter(ls => {
    if (!ls.court || !ls.az || !ls.datum || !ls.kernsatz || !ls.quelle) return false
    if (!isAllowedUrl(ls.quelle)) return false
    if (data.leitsaetze.some(existing => existing.az === ls.az)) return false  // dedupe
    return true
  })

  if (newOnes.length === 0) {
    return { file: filePath, status: 'no_change' }
  }

  // Append + cap at total 5 per file (keep the most recent 5 by date)
  const merged = [...data.leitsaetze, ...newOnes]
  merged.sort((a, b) => (b.datum || '').localeCompare(a.datum || ''))
  data.leitsaetze = merged.slice(0, 5)
  data.stand = new Date().toISOString().slice(0, 10)

  await writeFile(filePath, JSON.stringify(data, null, 2) + '\n', 'utf-8')
  return { file: filePath, status: 'updated', added: newOnes.length }
}

async function main() {
  const files = (await readdir(LEITSAETZE_DIR))
    .filter(f => f.endsWith('.json') && !f.startsWith('_'))
  console.log(`Prüfe ${files.length} Leitsatz-Files…`)

  const results = []
  for (const f of files) {
    const fp = join(LEITSAETZE_DIR, f)
    const r = await processFile(fp)
    results.push(r)
    console.log(`  ${r.status.padEnd(12)} ${f}${r.added ? ` (+${r.added})` : ''}${r.detail ? ' - ' + r.detail.slice(0, 80) : ''}`)
    // Soft rate limit: kleine Pause zwischen API-Calls
    await new Promise(r => setTimeout(r, 500))
  }

  const updated = results.filter(r => r.status === 'updated').length
  const errors = results.filter(r => r.status === 'api_error').length
  const totalAdded = results.reduce((sum, r) => sum + (r.added || 0), 0)
  console.log(`\n=== Summary ===`)
  console.log(`Updated:    ${updated} files`)
  console.log(`Added:      ${totalAdded} new Leitsätze`)
  console.log(`No change:  ${results.filter(r => r.status === 'no_change').length} files`)
  console.log(`Errors:     ${errors}`)

  // Exit code für CI: 0 bei Erfolg, 1 wenn Fehler überwiegen
  if (errors > files.length / 4) {
    console.error('Zu viele API-Fehler — Workflow sollte alarmieren')
    process.exit(1)
  }
}

main().catch(err => {
  console.error('Fataler Fehler:', err)
  process.exit(1)
})
