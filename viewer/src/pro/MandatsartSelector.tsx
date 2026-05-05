/**
 * MandatsartSelector — Dropdown zur Auswahl der Mandatsart.
 *
 * Zeigt alle 11 Migrations-Mandatsarten mit Anzahl Pflicht-Unterlagen.
 * Gruppenstruktur ist vorbereitet für spätere Kategorien.
 */

import { MANDATSART_CHECKLISTS, getRequiredDocsCount } from './mandatsart-checklists'
import type { MandatsartCategory } from './types'

interface Props {
  value: string | undefined
  onChange: (id: string | undefined) => void
}

const CATEGORY_LABELS: Record<MandatsartCategory, string> = {
  migration: 'Migrations-Mandate',
  strafrecht: 'Strafrecht',
  familie: 'Familienrecht',
  sozial: 'Sozialrecht',
  sonstiges: 'Sonstiges',
}

// Group and sort checklists by category
const grouped = MANDATSART_CHECKLISTS.reduce<Partial<Record<MandatsartCategory, typeof MANDATSART_CHECKLISTS>>>(
  (acc, cl) => {
    if (!acc[cl.category]) acc[cl.category] = []
    acc[cl.category]!.push(cl)
    return acc
  },
  {},
)

// Priority order for categories
const CATEGORY_ORDER: MandatsartCategory[] = ['migration', 'strafrecht', 'familie', 'sozial', 'sonstiges']

export default function MandatsartSelector({ value, onChange }: Props) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <label className="text-sm font-medium text-[var(--color-ink)] whitespace-nowrap">
        Mandatsart:
      </label>
      <select
        value={value ?? ''}
        onChange={e => onChange(e.target.value || undefined)}
        className="border border-[var(--color-border)] rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-[var(--color-gold)] bg-white min-w-[280px]"
        title="Mandatsart wählen — lädt passende Unterlagen-Checkliste"
      >
        <option value="">— Mandatsart wählen —</option>
        {CATEGORY_ORDER.filter(cat => grouped[cat]).map(cat => (
          <optgroup key={cat} label={CATEGORY_LABELS[cat]}>
            {grouped[cat]!.map(cl => {
              const reqCount = getRequiredDocsCount(cl)
              return (
                <option key={cl.id} value={cl.id}>
                  {cl.title} ({reqCount} Pflicht-Unterlagen)
                </option>
              )
            })}
          </optgroup>
        ))}
      </select>
      {value && (
        <button
          onClick={() => onChange(undefined)}
          className="text-xs text-[var(--color-ink-muted)] hover:text-[var(--color-danger)]"
          title="Mandatsart zurücksetzen"
        >
          Zurücksetzen
        </button>
      )}
    </div>
  )
}
