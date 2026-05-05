/**
 * SachstandsGenerator — 2-Spalten-Drawer (DE | VI) mit copy-to-clipboard.
 *
 * Öffnet sich per Button "Sachstand-Antwort generieren" auf einer Akte.
 * Füllt automatisch DE + VI Templates auf Basis des aktuellen Status,
 * der Akten-Daten und der fehlenden Unterlagen aus Modul A.
 *
 * Modul B, Sprint 1 — Killer-Demo für Bao-Meeting.
 * Voice: respektvoll-warm, kein Marketing-Deutsch.
 */

import { useState, useEffect } from 'react'
import { X, Copy, Check, Users, User } from 'lucide-react'
import type { MandantCase } from './types'
import type { CaseStatus } from './case-status'
import { getStatusInfo, fillTemplate, buildSachstandsContext } from './case-status'
import { getTemplateForStatus } from './sachstand-templates'
import { getSettings } from './store'
import StatusBadge from './StatusBadge'
import { formatFehlendeUnterlagen } from './case-status'

type Empfaenger = 'mandant' | 'mittelsperson'

interface Props {
  case: MandantCase
  onClose: () => void
}

export default function SachstandsGenerator({ case: c, onClose }: Props) {
  const currentStatus = (c.caseStatus as CaseStatus | undefined) ?? 'unterlagen_fehlen'
  const statusInfo = getStatusInfo(currentStatus)
  const tpl = getTemplateForStatus(currentStatus)
  const settings = getSettings()

  const [empfaenger, setEmpfaenger] = useState<Empfaenger>('mandant')
  const [copiedDe, setCopiedDe] = useState(false)
  const [copiedVi, setCopiedVi] = useState(false)

  const ctxDe = buildSachstandsContext(c, settings, 'de')
  const ctxVi = buildSachstandsContext(c, settings, 'vi')

  function getTemplate(lang: 'de' | 'vi'): string {
    if (!tpl) return lang === 'de' ? '[Kein Template für diesen Status]' : '[Không có mẫu cho trạng thái này]'

    const ctx = lang === 'de' ? ctxDe : ctxVi

    if (empfaenger === 'mittelsperson') {
      const raw = lang === 'de' ? tpl.mittelsperson_de : tpl.mittelsperson_vi
      // Fallback to mandant template if mittelsperson variant doesn't exist
      const fallback = lang === 'de' ? tpl.mandant_de : tpl.mandant_vi
      return fillTemplate(raw ?? fallback, ctx)
    }

    const raw = lang === 'de' ? tpl.mandant_de : tpl.mandant_vi
    return fillTemplate(raw, ctx)
  }

  const textDe = getTemplate('de')
  const textVi = getTemplate('vi')

  const missingCount = formatFehlendeUnterlagen(c, 'de').split('\n').filter(Boolean).length

  function copyText(text: string, lang: 'de' | 'vi') {
    navigator.clipboard.writeText(text).then(() => {
      if (lang === 'de') {
        setCopiedDe(true)
        setTimeout(() => setCopiedDe(false), 2000)
      } else {
        setCopiedVi(true)
        setTimeout(() => setCopiedVi(false), 2000)
      }
    })
  }

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        className="bg-white w-full sm:max-w-4xl sm:rounded-2xl border border-[var(--color-border)] shadow-2xl flex flex-col max-h-[95vh] sm:max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 px-5 py-4 border-b border-[var(--color-border)] shrink-0">
          <div>
            <h2 className="text-base font-semibold">Sachstand-Antwort generieren</h2>
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              <span className="font-mono text-xs text-[var(--color-gold)]">{c.aktenzeichen}</span>
              <span className="text-xs text-[var(--color-ink-muted)]">{c.mandantName}</span>
              <StatusBadge status={currentStatus} size="sm" />
              {missingCount > 0 && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 border border-amber-300 text-amber-800">
                  {missingCount} Unterlagen fehlen
                </span>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] rounded-lg hover:bg-[var(--color-bg-alt)] transition-colors shrink-0"
            aria-label="Schließen"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Empfänger-Toggle */}
        <div className="px-5 py-3 border-b border-[var(--color-border)] shrink-0">
          <div className="flex items-center gap-1 bg-[var(--color-bg-alt)] rounded-lg p-1 w-fit">
            <button
              onClick={() => setEmpfaenger('mandant')}
              className={`inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-md transition-colors ${
                empfaenger === 'mandant'
                  ? 'bg-white shadow-sm text-[var(--color-ink)] font-medium'
                  : 'text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              Mandant:in
            </button>
            <button
              onClick={() => setEmpfaenger('mittelsperson')}
              className={`inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-md transition-colors ${
                empfaenger === 'mittelsperson'
                  ? 'bg-white shadow-sm text-[var(--color-ink)] font-medium'
                  : 'text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              Mittelsperson
            </button>
          </div>
          <p className="text-xs text-[var(--color-ink-muted)] mt-1.5">
            {empfaenger === 'mandant'
              ? 'Direkt an den/die Mandant:in adressiert.'
              : 'An eine autorisierte Kontaktperson adressiert (z. B. Familienangehörige).'}
          </p>
        </div>

        {/* 2-Spalten-Layout */}
        <div className="flex-1 overflow-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[var(--color-border)]">
            {/* Deutsch */}
            <div className="flex flex-col p-5 gap-3">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-semibold">Deutsch (DE)</h3>
                  <p className="text-[11px] text-[var(--color-ink-muted)]">{statusInfo.label}</p>
                </div>
                <button
                  onClick={() => copyText(textDe, 'de')}
                  className={`inline-flex items-center gap-1.5 text-xs rounded-lg border px-3 py-1.5 transition-all ${
                    copiedDe
                      ? 'bg-green-50 border-green-300 text-green-700'
                      : 'border-[var(--color-border)] text-[var(--color-ink-muted)] hover:border-[var(--color-gold)] hover:text-[var(--color-ink)]'
                  }`}
                >
                  {copiedDe ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedDe ? 'Kopiert ✓' : 'Kopieren'}
                </button>
              </div>
              <textarea
                readOnly
                value={textDe}
                className="flex-1 min-h-[280px] w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-alt)] px-3 py-2.5 text-sm font-mono leading-relaxed resize-y focus:outline-none focus:border-[var(--color-gold)]"
              />
            </div>

            {/* Vietnamesisch */}
            <div className="flex flex-col p-5 gap-3">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-semibold">Tiếng Việt (VI)</h3>
                  <p className="text-[11px] text-[var(--color-ink-muted)]">{statusInfo.labelVi}</p>
                </div>
                <button
                  onClick={() => copyText(textVi, 'vi')}
                  className={`inline-flex items-center gap-1.5 text-xs rounded-lg border px-3 py-1.5 transition-all ${
                    copiedVi
                      ? 'bg-green-50 border-green-300 text-green-700'
                      : 'border-[var(--color-border)] text-[var(--color-ink-muted)] hover:border-[var(--color-gold)] hover:text-[var(--color-ink)]'
                  }`}
                >
                  {copiedVi ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedVi ? 'Đã sao chép ✓' : 'Sao chép'}
                </button>
              </div>
              <textarea
                readOnly
                value={textVi}
                className="flex-1 min-h-[280px] w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-alt)] px-3 py-2.5 text-sm font-mono leading-relaxed resize-y focus:outline-none focus:border-[var(--color-gold)]"
              />
              <p className="text-[10px] text-[var(--color-ink-muted)] italic">
                VI-Texte: Entwurf, noch nicht muttersprachlich geprüft — Voice-Polish mit Bao (Tag 14).
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-[var(--color-border)] shrink-0 flex items-center justify-between gap-3">
          <p className="text-xs text-[var(--color-ink-muted)]">
            Kein automatischer Versand — copy-paste in E-Mail-Programm oder WhatsApp.
          </p>
          <button
            onClick={onClose}
            className="text-sm text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] px-3 py-1.5 rounded-lg border border-[var(--color-border)] hover:border-[var(--color-gold)] transition-colors"
          >
            Schließen
          </button>
        </div>
      </div>
    </div>
  )
}
