/**
 * Citation drawer — click a verified § badge to see the full paragraph text
 * inline, without leaving the Pro research page.
 *
 * Maria (Strafrechtlerin) complained she had to tab-switch to check a cited
 * paragraph's wording. This is the fastest path: on click, fetch the law
 * markdown and extract the paragraph content between `### § N` and the
 * next `### §`.
 */

import { useEffect, useState } from 'react'
import { X, ExternalLink, BookOpen, Loader2, Pencil, Save, Scale, Gavel } from 'lucide-react'
import type { Citation } from './types'
import { getParagraphNote, saveParagraphNote } from './store'

/**
 * Curated BGH-/BVerfG-/BVerwG-/BSG-Leitsätze pro Paragraph.
 * Source: rechtsprechung-im-internet.de (BMJ Public-Domain).
 * Files liegen in viewer/public/leitsaetze/{lawId}_{section}.json
 * und werden von Sonnet-Recherche-Agents kuratiert + verifiziert.
 */
interface Leitsatz {
  court: string       // "BGH" | "BVerfG" | "BVerwG" | "BSG"
  az: string          // "VIII ZR 91/20"
  datum: string       // ISO "2021-10-13"
  kernsatz: string    // max ~200 chars
  quelle: string      // URL zur Volltextentscheidung
}
interface LeitsatzFile {
  lawId: string
  section: string
  law: string
  displayLaw?: string
  leitsaetze: Leitsatz[]
  stand: string
  hinweis?: string
}

const leitsaetzeCache = new Map<string, LeitsatzFile | null>()

async function loadLeitsaetze(lawId: string, section: string): Promise<LeitsatzFile | null> {
  const key = `${lawId}_${section}`
  if (leitsaetzeCache.has(key)) return leitsaetzeCache.get(key) || null
  try {
    // Files werden mit Vercel deployed (im Gegensatz zu /laws/ die von GH Pages kommen)
    const resp = await fetch(`./leitsaetze/${key}.json`)
    if (!resp.ok) {
      leitsaetzeCache.set(key, null)
      return null
    }
    const data: LeitsatzFile = await resp.json()
    leitsaetzeCache.set(key, data)
    return data
  } catch {
    leitsaetzeCache.set(key, null)
    return null
  }
}

/**
 * Stufe 3: Live-Lookup gegen OpenLegalData via unseren Vercel-Proxy.
 * Wird nur aufgerufen wenn KEIN curated Leitsatz existiert (oder zusätzlich
 * als breitere Coverage). Cached server-seitig in Upstash 60 Tage.
 */
interface LiveCase {
  court: string
  date: string
  slug: string
  url: string
  snippet: string
}
interface LiveResponse {
  lawId: string
  section: string
  abbrev: string
  totalCount: number
  results: LiveCase[]
  hinweis?: string
}

const liveCache = new Map<string, LiveResponse | null>()
const API_BASE = (typeof window !== 'undefined' && window.location.hostname === 'localhost')
  ? 'https://gitlaw-xi.vercel.app'  // dev: hit the live API (we don't run vercel dev)
  : ''  // prod: same-origin

async function loadLiveRechtsprechung(lawId: string, section: string): Promise<LiveResponse | null> {
  const key = `${lawId}_${section}`
  if (liveCache.has(key)) return liveCache.get(key) || null
  try {
    const resp = await fetch(`${API_BASE}/api/rechtsprechung/${lawId}/${encodeURIComponent(section)}`)
    if (!resp.ok) {
      liveCache.set(key, null)
      return null
    }
    const data: LiveResponse = await resp.json()
    liveCache.set(key, data)
    return data
  } catch {
    liveCache.set(key, null)
    return null
  }
}

/**
 * Deep-Link-URLs zu den Profi-Rechtsprechungs-Datenbanken.
 *
 * Wir versuchen NICHT eigene BGH-Datenbank-Hoheit zu beanspruchen
 * (Beck/dejure/openjur sind Profis darin). Stattdessen liefern wir
 * verifizierte Paragraphentexte UND einen Klick zur bevorzugten
 * Recherche-Quelle der Anwält:in. Das spart 30 Sek pro Lookup.
 *
 * Format-Mapping basiert auf den real-existierenden URL-Strukturen
 * dieser Anbieter (Stand 04/2026).
 */
function buildResearchLinks(lawAbbrev: string, paragraph: string) {
  const dejureSlug = lawAbbrev.toLowerCase().replace(/\s+/g, '_')
  const beckSearch = encodeURIComponent(`§ ${paragraph} ${lawAbbrev}`)
  const openjurSearch = encodeURIComponent(`§ ${paragraph} ${lawAbbrev}`)
  return [
    {
      label: 'dejure.org',
      url: `https://dejure.org/gesetze/${dejureSlug}/${paragraph}.html`,
      hint: 'Volltext + Querverweise',
    },
    {
      label: 'openjur.de',
      url: `https://openjur.de/suche.html?q=${openjurSearch}`,
      hint: 'Urteile + Volltext-Suche',
    },
    {
      label: 'Beck-Online',
      url: `https://beck-online.beck.de/Search?q=${beckSearch}`,
      hint: 'erfordert Beck-Account · BGH-Standardquelle',
    },
  ]
}

interface Props {
  citation: Citation | null
  onClose: () => void
}

const lawCache = new Map<string, string>()

const LAW_BASE_URL = (() => {
  if (typeof window !== 'undefined' && window.location.hostname.includes('mikelninh.github.io')) return './laws'
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') return './laws'
  return 'https://mikelninh.github.io/gitlaw/laws'
})()

async function loadLawSection(lawId: string, section: string): Promise<string | null> {
  let text = lawCache.get(lawId)
  if (!text) {
    try {
      const resp = await fetch(`${LAW_BASE_URL}/${lawId}.md`)
      if (!resp.ok) return null
      text = await resp.text()
      lawCache.set(lawId, text)
    } catch {
      return null
    }
  }
  const re = new RegExp(
    `^### § ${section.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&')}(?![\\dA-Za-z])[\\s\\S]*?(?=^### § |^### \\[|\\s*$)`,
    'm',
  )
  const m = re.exec(text)
  if (m) return m[0].trim()
  // Fallback: slice from the heading to 3000 chars or next heading
  const startRe = new RegExp(
    `^### § ${section.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&')}(?![\\dA-Za-z])`,
    'm',
  )
  const sm = startRe.exec(text)
  if (!sm) return null
  const rest = text.slice(sm.index)
  const nextIdx = rest.slice(5).search(/^### §/m)
  return nextIdx >= 0 ? rest.slice(0, nextIdx + 5).trim() : rest.slice(0, 3000).trim()
}

export default function CitationDrawer({ citation, onClose }: Props) {
  const [fullText, setFullText] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [noteBody, setNoteBody] = useState('')
  const [noteSaved, setNoteSaved] = useState(false)
  const [leitsaetze, setLeitsaetze] = useState<LeitsatzFile | null>(null)
  const [liveRsp, setLiveRsp] = useState<LiveResponse | null>(null)
  const [liveLoading, setLiveLoading] = useState(false)

  useEffect(() => {
    if (!citation || !citation.verified) return
    setLoading(true)
    setFullText(null)
    setLeitsaetze(null)
    setLiveRsp(null)
    loadLawSection(citation.lawId, citation.section)
      .then(t => setFullText(t))
      .finally(() => setLoading(false))
    // Lade kuratierte Leitsätze (Stufe 2) parallel
    loadLeitsaetze(citation.lawId, citation.section).then(setLeitsaetze)
    // Lade Live-Rechtsprechung (Stufe 3) parallel — nicht-blockierend
    setLiveLoading(true)
    loadLiveRechtsprechung(citation.lawId, citation.section)
      .then(setLiveRsp)
      .finally(() => setLiveLoading(false))
    // Load existing note for this paragraph
    const existing = getParagraphNote(citation.lawId, citation.section)
    setNoteBody(existing?.body || '')
    setNoteSaved(false)
  }, [citation])

  function onSaveNote() {
    if (!citation) return
    saveParagraphNote(citation.lawId, citation.section, noteBody)
    setNoteSaved(true)
    setTimeout(() => setNoteSaved(false), 2000)
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  if (!citation) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-stretch justify-end bg-black/30 backdrop-blur-sm animate-backdrop-in"
      onClick={onClose}
    >
      <aside
        className="bg-white w-full max-w-xl h-full overflow-y-auto border-l border-[var(--color-border)] shadow-xl animate-drawer-in"
        onClick={e => e.stopPropagation()}
      >
        <header className="sticky top-0 bg-white border-b border-[var(--color-border)] px-5 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <BookOpen className="w-4 h-4 text-[var(--color-gold)] shrink-0" />
            <span className="font-mono font-semibold text-sm truncate">{citation.display}</span>
            {!citation.verified && (
              <span className="text-xs text-amber-800 bg-amber-100 border border-amber-300 rounded px-1.5 py-0.5">
                ungeprüft
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {citation.verified && citation.lawId && (
              <a
                href={`/gitlaw/#/?law=${citation.lawId}&s=${encodeURIComponent(citation.section)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] inline-flex items-center gap-1"
                title="Im Bürger:innen-Viewer öffnen"
              >
                Viewer <ExternalLink className="w-3 h-3" />
              </a>
            )}
            <button
              onClick={onClose}
              className="text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
              aria-label="Schließen"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </header>

        <div className="px-5 py-5">
          {!citation.verified ? (
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
              <p className="font-medium mb-1">Paragraph nicht in unserer Gesetzessammlung verifiziert.</p>
              <p className="text-amber-800 leading-relaxed">
                Möglich: (a) die KI hat den Paragraphen halluziniert, (b) das Gesetz ist nicht in unserer lokalen
                Sammlung von 5.936 Bundesgesetzen, oder (c) die Abkürzung ist uns unbekannt. Bitte die Norm
                manuell in einer Primärquelle gegenprüfen (Beck-Online, dejure.org, gesetze-im-internet.de).
              </p>
            </div>
          ) : loading ? (
            <div className="flex items-center gap-2 text-sm text-[var(--color-ink-muted)]">
              <Loader2 className="w-4 h-4 animate-spin" /> Paragraphentext wird geladen…
            </div>
          ) : fullText ? (
            <>
              <article className="law-content text-sm leading-relaxed">
                <pre className="whitespace-pre-wrap font-sans">{fullText}</pre>
              </article>

              {/* Stufe 3: Weitere Treffer aus OpenLegalData (Live-Lookup, gecached) */}
              {(liveLoading || (liveRsp && liveRsp.results.length > 0)) && (
                <section className="mt-6 pt-5 border-t border-[var(--color-border)]">
                  <div className="flex items-center gap-2 mb-2">
                    <Scale className="w-4 h-4 text-[var(--color-gold)]" />
                    <h3 className="text-sm font-semibold">
                      Weitere Urteile{liveRsp && ` (${liveRsp.results.length})`}
                    </h3>
                    {liveRsp && liveRsp.totalCount > liveRsp.results.length && (
                      <span className="text-xs text-[var(--color-ink-muted)]">
                        von {liveRsp.totalCount.toLocaleString('de-DE')}
                      </span>
                    )}
                  </div>
                  {liveLoading && !liveRsp && (
                    <div className="flex items-center gap-2 text-xs text-[var(--color-ink-muted)]">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" /> Suche bei OpenLegalData…
                    </div>
                  )}
                  {liveRsp && liveRsp.results.length > 0 && (
                    <>
                      <ul className="space-y-2">
                        {liveRsp.results.map((r, i) => (
                          <li key={i} className="text-xs border border-[var(--color-border)] rounded-lg p-2.5 hover:border-[var(--color-gold)]">
                            <div className="flex items-baseline justify-between gap-2 mb-1">
                              <span className="font-mono font-semibold text-[var(--color-ink)]">{r.court}</span>
                              <span className="text-[var(--color-ink-muted)]">
                                {r.date && new Date(r.date).toLocaleDateString('de-DE')}
                              </span>
                            </div>
                            {r.snippet && (
                              <p className="text-[var(--color-ink-soft)] leading-relaxed mb-1.5">{r.snippet}</p>
                            )}
                            <a
                              href={r.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
                            >
                              Zur Entscheidung <ExternalLink className="w-3 h-3" />
                            </a>
                          </li>
                        ))}
                      </ul>
                      {liveRsp.hinweis && (
                        <p className="text-xs text-[var(--color-ink-muted)] mt-2 italic">{liveRsp.hinweis}</p>
                      )}
                    </>
                  )}
                </section>
              )}

              {/* Stufe 2: Kuratierte BGH-/BVerfG-/etc-Leitsätze (wenn vorhanden) */}
              {leitsaetze && leitsaetze.leitsaetze.length > 0 && (
                <section className="mt-6 pt-5 border-t border-[var(--color-border)]">
                  <div className="flex items-center gap-2 mb-3">
                    <Gavel className="w-4 h-4 text-[var(--color-gold)]" />
                    <h3 className="text-sm font-semibold">
                      Wichtige Rechtsprechung ({leitsaetze.leitsaetze.length})
                    </h3>
                  </div>
                  <ul className="space-y-3">
                    {leitsaetze.leitsaetze.map((ls, i) => (
                      <li key={i} className="bg-[var(--color-bg-alt)] border border-[var(--color-border)] rounded-lg p-3">
                        <div className="flex items-baseline justify-between gap-2 mb-1.5">
                          <span className="font-semibold text-xs text-[var(--color-gold)]">
                            {ls.court} · {ls.az}
                          </span>
                          <span className="text-xs text-[var(--color-ink-muted)]">
                            {new Date(ls.datum).toLocaleDateString('de-DE')}
                          </span>
                        </div>
                        <p className="text-sm text-[var(--color-ink)] leading-relaxed">{ls.kernsatz}</p>
                        {ls.quelle && (
                          <a
                            href={ls.quelle}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-2 inline-flex items-center gap-1 text-xs text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
                          >
                            Volltext-Entscheidung <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </li>
                    ))}
                  </ul>
                  {leitsaetze.hinweis && (
                    <p className="text-xs text-[var(--color-ink-muted)] mt-3 italic">
                      {leitsaetze.hinweis}
                    </p>
                  )}
                </section>
              )}

              {/* Rechtsprechungs-Recherche — Deep-Links zu Profi-DBs.
                  Wir haben keine eigene BGH-Datenbank (würde Lizenz-Konflikte
                  geben). Statt dessen: einen Klick zu der Quelle die der:die
                  Anwält:in eh nutzt. */}
              {citation.verified && (
                <section className="mt-6 pt-5 border-t border-[var(--color-border)]">
                  <div className="flex items-center gap-2 mb-2">
                    <Scale className="w-4 h-4 text-[var(--color-gold)]" />
                    <h3 className="text-sm font-semibold">Rechtsprechung suchen</h3>
                  </div>
                  <p className="text-xs text-[var(--color-ink-soft)] mb-3">
                    Wir bieten verifizierten Gesetzestext. Für aktuelle Rechtsprechung
                    nutze deine bevorzugte Profi-Datenbank — ein Klick:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {buildResearchLinks(citation.display.match(/§\s*\d+\w*\s+(.+)/)?.[1] || '', citation.section).map(link => (
                      <a
                        key={link.label}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block border border-[var(--color-border)] rounded-lg p-3 text-xs hover:border-[var(--color-gold)] transition-colors"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-[var(--color-ink)]">{link.label}</span>
                          <ExternalLink className="w-3 h-3 text-[var(--color-ink-muted)]" />
                        </div>
                        <span className="text-[var(--color-ink-muted)] text-[11px]">{link.hint}</span>
                      </a>
                    ))}
                  </div>
                </section>
              )}

              {/* Persönliche Notiz — baut Wissensdatenbank auf */}
              <section className="mt-6 pt-5 border-t border-[var(--color-border)]">
                <div className="flex items-center gap-2 mb-2">
                  <Pencil className="w-4 h-4 text-[var(--color-gold)]" />
                  <h3 className="text-sm font-semibold">Meine Notiz zu diesem Paragraphen</h3>
                </div>
                <textarea
                  value={noteBody}
                  onChange={e => {
                    setNoteBody(e.target.value)
                    setNoteSaved(false)
                  }}
                  placeholder="z. B. „BGH vom 29.03.2017 — Eigenbedarf nicht illusionär. Bei 70+ J. Mieter regelmäßig Härtefall."
                  rows={4}
                  className="w-full border border-[var(--color-border)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-gold)]"
                />
                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={onSaveNote}
                    className="inline-flex items-center gap-1.5 text-xs bg-[var(--color-ink)] text-white rounded-lg px-3 py-1.5 hover:opacity-90"
                  >
                    <Save className="w-3.5 h-3.5" /> Notiz speichern
                  </button>
                  {noteSaved && <span className="text-xs text-green-700">✓ gespeichert</span>}
                  <p className="text-xs text-[var(--color-ink-muted)] ml-auto">
                    Baut deine persönliche Paragraphen-Wissensdatenbank auf.
                  </p>
                </div>
              </section>
            </>
          ) : (
            <p className="text-sm text-[var(--color-ink-muted)] italic">
              Paragraphentext konnte nicht geladen werden.
            </p>
          )}
        </div>

        <footer className="px-5 py-3 border-t border-[var(--color-border)] text-xs text-[var(--color-ink-muted)]">
          Stand der Sammlung: wöchentlich aktualisiert aus gesetze-im-internet.de. Bitte vor Zitation in
          Schriftsätzen Aktualität verifizieren.
        </footer>
      </aside>
    </div>
  )
}
