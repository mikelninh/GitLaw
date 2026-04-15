/**
 * GET /api/rechtsprechung/{lawId}/{section}
 * → liefert Top-Urteile aus OpenLegalData für einen Paragraph.
 *
 * Architektur (Stufe 3):
 *   1. Cache-Lookup in Upstash Redis (Key: rsp:{lawId}:{section})
 *   2. Cache-Miss → OpenLegalData-API anfragen (https://de.openlegaldata.io/api/cases/search/)
 *   3. Top 5 Treffer extrahieren, Snippet kürzen, in Cache schreiben (60 Tage TTL)
 *   4. JSON zurückgeben
 *
 * Stufe 1 (Deep-Links zu Beck/dejure/openjur) bleibt im CitationDrawer.
 * Stufe 2 (kuratierte Leitsätze) wird zuerst angezeigt.
 * Stufe 3 ist Fallback wenn keine kuratierten Leitsätze für den § existieren
 * — oder ergänzend für bredere Coverage.
 */

import type { VercelRequest, VercelResponse } from '@vercel/node'
import { Redis } from '@upstash/redis'

// Mapping lawId → official Abbreviation (umgekehrt von verify.ts)
// Wir nutzen die Abkürzung als OpenLegalData-Suchstring.
const LAW_ID_TO_ABBREV: Record<string, string> = {
  bgb: 'BGB', stgb: 'StGB', stpo: 'StPO', zpo: 'ZPO', gg: 'GG',
  estg: 'EStG', ao_1977: 'AO', netzdg: 'NetzDG', tierschg: 'TierSchG',
  aufenthg_2004: 'AufenthG', arbzg: 'ArbZG', kschg: 'KSchG',
  muschg_2018: 'MuSchG', agg: 'AGG', geg: 'GEG', beeg: 'BEEG',
  bimschg: 'BImSchG', uwg_2004: 'UWG', hgb: 'HGB', aktg: 'AktG',
  betrvg: 'BetrVG', inso: 'InsO', vwgo: 'VwGO', gwb: 'GWB',
  vwvfg: 'VwVfG', gvg: 'GVG', gewschg: 'GewSchG', sgg: 'SGG',
  stvo_2013: 'StVO', stvg: 'StVG', ustg_1980: 'UStG', woeigg: 'WEG',
  sgb_1: 'SGB I', sgb_2: 'SGB II', sgb_3: 'SGB III', sgb_4: 'SGB IV',
  sgb_5: 'SGB V', sgb_6: 'SGB VI', sgb_7: 'SGB VII', sgb_8: 'SGB VIII',
  sgb_9: 'SGB IX', sgb_10: 'SGB X', sgb_11: 'SGB XI', sgb_12: 'SGB XII',
}

const TTL_SECONDS = 60 * 60 * 24 * 60  // 60 Tage
const MAX_RESULTS = 5

interface RechtsprechungEntry {
  court: string
  date: string  // ISO YYYY-MM-DD
  slug: string
  url: string
  snippet: string
}

interface CachedResponse {
  lawId: string
  section: string
  abbrev: string
  query: string
  totalCount: number
  results: RechtsprechungEntry[]
  source: 'openlegaldata.io'
  cachedAt: string
  hinweis: string
}

const redis = (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN)
  ? Redis.fromEnv()
  : null

function stripHtml(s: string): string {
  return s.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()
}

function buildOpenLegalDataUrl(abbrev: string, section: string): string {
  // OpenLegalData unterstützt Volltext-Suche. Wir suchen nach
  // "{Abbrev} {Section}" — z. B. "BGB 573" oder "StGB 238".
  const q = `${abbrev} ${section}`
  return `https://de.openlegaldata.io/api/cases/search/?text=${encodeURIComponent(q)}&format=json`
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

  const { lawId, section } = req.query
  if (typeof lawId !== 'string' || typeof section !== 'string') {
    return res.status(400).json({ error: 'lawId und section müssen Strings sein' })
  }
  if (!/^[a-z0-9_]+$/.test(lawId) || !/^[\dA-Za-z]+$/.test(section)) {
    return res.status(400).json({ error: 'Invalid lawId/section format' })
  }

  const abbrev = LAW_ID_TO_ABBREV[lawId]
  if (!abbrev) {
    return res.status(404).json({
      error: 'Unknown lawId',
      hint: 'Diese Law-ID ist (noch) nicht für Live-Rechtsprechung gemappt.',
    })
  }

  const cacheKey = `rsp:${lawId}:${section}`

  // 1. Cache-Lookup
  if (redis) {
    try {
      const cached = await redis.get(cacheKey) as CachedResponse | null
      if (cached) {
        res.setHeader('X-Cache', 'HIT')
        return res.status(200).json(cached)
      }
    } catch (err) {
      // Cache-Fehler nicht fatal — durchgehen zu Live-Lookup
      console.warn('Cache read failed', err)
    }
  }

  // 2. OpenLegalData-Live-Lookup
  const url = buildOpenLegalDataUrl(abbrev, section)
  let response: Response
  try {
    response = await fetch(url, {
      headers: { 'Accept': 'application/json', 'User-Agent': 'GitLaw-Pro/1.0' },
    })
  } catch (err) {
    return res.status(502).json({
      error: 'OpenLegalData-Anfrage fehlgeschlagen',
      detail: err instanceof Error ? err.message : 'unbekannt',
    })
  }
  if (!response.ok) {
    return res.status(response.status).json({
      error: `OpenLegalData HTTP ${response.status}`,
    })
  }

  let payload: { count: number; results: Array<Record<string, unknown>> }
  try {
    payload = await response.json()
  } catch {
    return res.status(502).json({ error: 'OpenLegalData lieferte kein valides JSON' })
  }

  // 3. Top-N Treffer extrahieren
  const results: RechtsprechungEntry[] = (payload.results || [])
    .slice(0, MAX_RESULTS)
    .map(r => {
      const snippets = (r.snippets as Array<{ text?: string }> | undefined) || []
      const snippet = snippets[0]?.text ? stripHtml(snippets[0].text).slice(0, 280) : ''
      return {
        court: String(r.court || ''),
        date: String(r.date || ''),
        slug: String(r.slug || ''),
        url: r.slug ? `https://de.openlegaldata.io/case/${r.slug}/` : '',
        snippet,
      }
    })
    .filter(r => r.court && r.url)

  const result: CachedResponse = {
    lawId,
    section,
    abbrev,
    query: `${abbrev} ${section}`,
    totalCount: payload.count || 0,
    results,
    source: 'openlegaldata.io',
    cachedAt: new Date().toISOString(),
    hinweis: 'Open-Data-Quelle (OpenLegalData OSS). Qualität variabel — Snippets sind Fundstellen, keine Leitsätze. Vor Zitation gegenprüfen.',
  }

  // 4. In Cache schreiben (best effort)
  if (redis) {
    try {
      await redis.set(cacheKey, result, { ex: TTL_SECONDS })
    } catch (err) {
      console.warn('Cache write failed', err)
    }
  }

  res.setHeader('X-Cache', 'MISS')
  return res.status(200).json(result)
}
