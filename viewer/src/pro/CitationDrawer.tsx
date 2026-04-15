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
import { X, ExternalLink, BookOpen, Loader2, Pencil, Save, Scale } from 'lucide-react'
import type { Citation } from './types'
import { getParagraphNote, saveParagraphNote } from './store'

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

  useEffect(() => {
    if (!citation || !citation.verified) return
    setLoading(true)
    setFullText(null)
    loadLawSection(citation.lawId, citation.section)
      .then(t => setFullText(t))
      .finally(() => setLoading(false))
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
