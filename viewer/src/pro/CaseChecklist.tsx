/**
 * CaseChecklist — zeigt die Unterlagen-Checkliste für eine Akte.
 *
 * Liest case.mandatsartId, lädt die passende Checkliste,
 * und erlaubt das Toggeln des Status pro Item.
 * Voice: respektvoll-warm, kein Marketing-Deutsch.
 */

import { useState } from 'react'
import { getChecklistById } from './mandatsart-checklists'
import type { MandantCase } from './types'

type ItemState = 'received' | 'pending' | 'problem'

function nextState(current: ItemState): ItemState {
  if (current === 'pending') return 'received'
  if (current === 'received') return 'problem'
  return 'pending'
}

function StatusIcon({ state }: { state: ItemState }) {
  if (state === 'received') {
    return (
      <span
        className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-green-100 text-green-700 border border-green-300 cursor-pointer select-none flex-shrink-0"
        aria-label="Erhalten"
      >
        ✓
      </span>
    )
  }
  if (state === 'problem') {
    return (
      <span
        className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-100 text-amber-700 border border-amber-300 cursor-pointer select-none flex-shrink-0"
        aria-label="Problem"
      >
        ⚠
      </span>
    )
  }
  return (
    <span
      className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-100 text-slate-500 border border-slate-300 cursor-pointer select-none flex-shrink-0"
      aria-label="Ausstehend"
    >
      ⏳
    </span>
  )
}

function LevelBadge({ level }: { level: 'required' | 'optional' | 'conditional' }) {
  if (level === 'required') {
    return (
      <span className="text-[10px] uppercase px-1.5 py-0.5 rounded border bg-red-50 border-red-200 text-red-700">
        Pflicht
      </span>
    )
  }
  if (level === 'optional') {
    return (
      <span className="text-[10px] uppercase px-1.5 py-0.5 rounded border bg-slate-50 border-slate-200 text-slate-500">
        Optional
      </span>
    )
  }
  return (
    <span className="text-[10px] uppercase px-1.5 py-0.5 rounded border bg-blue-50 border-blue-200 text-blue-700">
      Bedingt
    </span>
  )
}

interface Props {
  case: MandantCase
  onChange: (updated: MandantCase) => void
}

export default function CaseChecklist({ case: c, onChange }: Props) {
  const [showMissingOnly, setShowMissingOnly] = useState(false)

  if (!c.mandatsartId) {
    return (
      <div className="bg-[var(--color-bg-alt)] border border-dashed border-[var(--color-border)] rounded-xl px-5 py-4 text-sm text-[var(--color-ink-soft)]">
        Mandatsart nicht zugeordnet — bitte oben wählen, damit die passende Unterlagen-Checkliste angezeigt wird.
      </div>
    )
  }

  const checklist = getChecklistById(c.mandatsartId)

  if (!checklist) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 text-sm text-amber-800">
        Checkliste für Mandatsart „{c.mandatsartId}" nicht gefunden. Bitte Mandatsart neu wählen.
      </div>
    )
  }

  const states: Record<string, ItemState> = c.checklistStates ?? {}

  function getState(itemId: string): ItemState {
    return states[itemId] ?? 'pending'
  }

  function toggle(itemId: string) {
    const current = getState(itemId)
    const next = nextState(current)
    const newStates = { ...states, [itemId]: next }
    onChange({ ...c, checklistStates: newStates })
  }

  const requiredItems = checklist.requiredDocuments.filter(d => d.level === 'required')
  const receivedRequired = requiredItems.filter(d => getState(d.id) === 'received').length
  const totalRequired = requiredItems.length
  const progressPct = totalRequired > 0 ? Math.round((receivedRequired / totalRequired) * 100) : 0

  const visibleItems = showMissingOnly
    ? checklist.requiredDocuments.filter(d => d.level === 'required' && getState(d.id) !== 'received')
    : checklist.requiredDocuments

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <div className="flex items-baseline gap-2 flex-wrap">
          <h3 className="font-semibold">{checklist.title}</h3>
          {checklist.titleVi && (
            <span className="text-sm text-[var(--color-ink-muted)]">{checklist.titleVi}</span>
          )}
        </div>
        {checklist.typicalDuration && (
          <p className="text-xs text-[var(--color-ink-muted)] mt-0.5">
            Typische Bearbeitungsdauer: {checklist.typicalDuration}
          </p>
        )}
      </div>

      {/* Fortschritt */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">
            {receivedRequired}/{totalRequired} Pflicht-Unterlagen erhalten
          </span>
          <span className="text-xs text-[var(--color-ink-muted)]">{progressPct}%</span>
        </div>
        <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
          <div
            className="h-full rounded-full bg-green-500 transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setShowMissingOnly(s => !s)}
          className={`text-xs rounded-lg border px-3 py-1.5 transition-colors ${
            showMissingOnly
              ? 'bg-[var(--color-ink)] text-white border-[var(--color-ink)]'
              : 'bg-white text-[var(--color-ink-muted)] border-[var(--color-border)] hover:border-[var(--color-gold)]'
          }`}
        >
          Nur fehlende Pflicht-Unterlagen
        </button>
        {showMissingOnly && (
          <span className="text-xs text-[var(--color-ink-muted)]">
            {visibleItems.length} fehlend
          </span>
        )}
      </div>

      {/* Checkliste */}
      {visibleItems.length === 0 ? (
        <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-3">
          Alle Pflicht-Unterlagen erhalten. Gut gemacht!
        </p>
      ) : (
        <ul className="divide-y divide-[var(--color-border)] border border-[var(--color-border)] rounded-xl bg-white">
          {visibleItems.map(item => {
            const state = getState(item.id)
            return (
              <li key={item.id} className="px-4 py-3 flex items-start gap-3">
                <button
                  onClick={() => toggle(item.id)}
                  title="Klicken zum Wechseln: ausstehend → erhalten → Problem → ausstehend"
                  className="mt-0.5"
                >
                  <StatusIcon state={state} />
                </button>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-2 flex-wrap">
                    <span
                      className={`text-sm flex-1 min-w-0 ${state === 'received' ? 'text-[var(--color-ink-muted)] line-through' : 'text-[var(--color-ink)]'}`}
                      title={item.description}
                    >
                      {item.label}
                    </span>
                    <LevelBadge level={item.level} />
                  </div>
                  {item.labelVi && (
                    <p className="text-xs text-[var(--color-ink-muted)] mt-0.5">{item.labelVi}</p>
                  )}
                  {item.level === 'conditional' && item.conditionalNote && (
                    <p className="text-xs text-blue-700 bg-blue-50 rounded px-2 py-1 mt-1">
                      Bedingung: {item.conditionalNote}
                    </p>
                  )}
                  {state === 'problem' && (
                    <p className="text-xs text-amber-700 mt-0.5">
                      Als Problem markiert — bitte klären.
                    </p>
                  )}
                  {item.typicalIssues && item.typicalIssues.length > 0 && (
                    <ul className="mt-1.5 space-y-0.5">
                      {item.typicalIssues.map((issue, i) => (
                        <li key={i} className="text-[11px] text-[var(--color-ink-muted)] flex items-start gap-1">
                          <span className="mt-0.5 shrink-0">·</span>
                          <span>{issue}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
