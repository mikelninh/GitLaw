/**
 * StatusDropdown — zeigt den aktuellen Status + Dropdown der erlaubten Folgezustände.
 * Deaktivierte Übergänge werden angezeigt, aber nicht klickbar.
 * Modul B, Sprint 1.
 */

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import StatusBadge from './StatusBadge'
import { CASE_STATUSES, canTransition, getStatusInfo } from './case-status'
import type { CaseStatus } from './case-status'
import type { MandantCase } from './types'

interface Props {
  case: MandantCase
  onChange: (updated: MandantCase) => void
}

export default function StatusDropdown({ case: c, onChange }: Props) {
  const [open, setOpen] = useState(false)

  const currentStatus = (c.caseStatus as CaseStatus | undefined) ?? 'unterlagen_fehlen'
  const currentInfo = getStatusInfo(currentStatus)
  const isTerminal = currentInfo.allowedNextStates.length === 0

  function handleSelect(next: CaseStatus) {
    if (!canTransition(currentStatus, next)) return
    onChange({ ...c, caseStatus: next })
    setOpen(false)
  }

  return (
    <div className="relative inline-block">
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-[var(--color-ink-muted)] uppercase tracking-wide">
          Status
        </span>
        <button
          onClick={() => !isTerminal && setOpen(s => !s)}
          className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
            isTerminal
              ? 'cursor-default opacity-80'
              : 'hover:border-[var(--color-gold)] cursor-pointer'
          } border-[var(--color-border)] bg-white`}
          aria-haspopup="listbox"
          aria-expanded={open}
          title={isTerminal ? 'Verfahren abgeschlossen — kein weiterer Übergang möglich' : 'Status ändern'}
        >
          <StatusBadge status={currentStatus} />
          {!isTerminal && <ChevronDown className={`w-3.5 h-3.5 text-[var(--color-ink-muted)] transition-transform ${open ? 'rotate-180' : ''}`} />}
        </button>
      </div>

      {open && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          {/* Dropdown panel */}
          <div className="absolute left-0 top-full mt-1 z-20 bg-white border border-[var(--color-border)] rounded-xl shadow-lg py-1 min-w-[280px]">
            <p className="px-3 pt-2 pb-1 text-[10px] uppercase tracking-wide text-[var(--color-ink-muted)] font-semibold">
              Übergang zu
            </p>
            <ul role="listbox">
              {CASE_STATUSES.filter(s => s.id !== currentStatus).map(s => {
                const allowed = canTransition(currentStatus, s.id)
                return (
                  <li key={s.id} role="option" aria-selected={false}>
                    <button
                      onClick={() => allowed && handleSelect(s.id)}
                      disabled={!allowed}
                      title={
                        !allowed
                          ? `Übergang nicht erlaubt von "${currentInfo.label}" zu "${s.label}"`
                          : undefined
                      }
                      className={`w-full text-left px-3 py-2 flex items-start gap-2.5 transition-colors ${
                        allowed
                          ? 'hover:bg-[var(--color-bg-alt)] cursor-pointer'
                          : 'opacity-40 cursor-not-allowed'
                      }`}
                    >
                      <span className="mt-0.5 text-base leading-none" aria-hidden="true">
                        {s.icon}
                      </span>
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-[var(--color-ink)]">{s.label}</div>
                        {s.labelVi && (
                          <div className="text-[11px] text-[var(--color-ink-muted)]">{s.labelVi}</div>
                        )}
                      </div>
                      {!allowed && (
                        <span className="ml-auto text-[10px] text-[var(--color-ink-muted)] shrink-0">
                          nicht erlaubt
                        </span>
                      )}
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        </>
      )}
    </div>
  )
}
