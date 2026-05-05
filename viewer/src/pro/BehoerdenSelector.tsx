/**
 * BehoerdenSelector — Searchable Dropdown für Berliner Migrations-Behörden.
 *
 * Analog zu MandatsartSelector: Tailwind-Styling, kein neues Dependency.
 * Nutzt eine <input list="..."> + <datalist>-Kombo für native Autofill,
 * mit eigenem Dropdown-Overlay für bessere Darstellung von abteilung/plzOrt.
 *
 * Free-Text ist explizit erlaubt — falls die richtige Behörde nicht in der
 * Liste ist, gibt der Anwalt einfach freihand ein.
 */

import { useState, useRef, useEffect } from 'react'
import { BEHOERDEN, searchBehoerden, type BehoerdenEintrag } from './behoerden'

interface Props {
  value: string | undefined
  onChange: (name: string | undefined) => void
}

export default function BehoerdenSelector({ value, onChange }: Props) {
  const [query, setQuery] = useState(value ?? '')
  const [open, setOpen] = useState(false)
  const [results, setResults] = useState<BehoerdenEintrag[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Sync query wenn value extern geändert wird (z.B. Demo-Akte lädt Wert)
  useEffect(() => {
    setQuery(value ?? '')
  }, [value])

  // Suche neu auslösen wenn Query sich ändert
  useEffect(() => {
    if (query.trim()) {
      setResults(searchBehoerden(query))
    } else {
      setResults(BEHOERDEN.slice(0, 8))
    }
  }, [query])

  // Klick außerhalb schließt Dropdown
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  function handleSelect(entry: BehoerdenEintrag) {
    const name = entry.name + (entry.abteilung ? ` – ${entry.abteilung}` : '')
    setQuery(name)
    onChange(name)
    setOpen(false)
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const v = e.target.value
    setQuery(v)
    onChange(v || undefined)
    setOpen(true)
  }

  function handleClear() {
    setQuery('')
    onChange(undefined)
    inputRef.current?.focus()
  }

  const displayResults = open ? results : []

  return (
    <div ref={containerRef} className="flex items-start gap-2 flex-wrap relative">
      <label className="text-sm font-medium text-[var(--color-ink)] whitespace-nowrap pt-1.5">
        Behörde:
      </label>
      <div className="flex-1 min-w-[280px] relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => setOpen(true)}
          placeholder="Behörde suchen oder freihand eingeben…"
          className="w-full border border-[var(--color-border)] rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-[var(--color-gold)] bg-white pr-8"
          autoComplete="off"
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--color-ink-muted)] hover:text-[var(--color-danger)] text-xs"
            title="Zurücksetzen"
            tabIndex={-1}
          >
            ✕
          </button>
        )}

        {/* Dropdown */}
        {open && displayResults.length > 0 && (
          <ul className="absolute z-50 top-full left-0 right-0 mt-1 bg-white border border-[var(--color-border)] rounded-lg shadow-lg max-h-64 overflow-y-auto">
            {displayResults.map(entry => (
              <li key={entry.id}>
                <button
                  type="button"
                  onMouseDown={e => { e.preventDefault(); handleSelect(entry) }}
                  className="w-full text-left px-3 py-2 hover:bg-[var(--color-bg-alt)] transition-colors"
                >
                  <div className="text-sm font-medium text-[var(--color-ink)] leading-tight">
                    {entry.name}
                  </div>
                  {(entry.abteilung || entry.plzOrt) && (
                    <div className="text-xs text-[var(--color-ink-muted)] mt-0.5">
                      {[entry.abteilung, entry.plzOrt].filter(Boolean).join(' · ')}
                    </div>
                  )}
                  {entry.zustaendig_fuer && entry.zustaendig_fuer.length > 0 && (
                    <div className="text-[10px] text-[var(--color-ink-muted)] mt-0.5 truncate">
                      {entry.zustaendig_fuer.slice(0, 3).join(', ')}
                    </div>
                  )}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
