/**
 * Modul B — 8-Stati-Status-Modell für GitLaw Pro (Sprint 1, Bao-Pilot)
 *
 * Status-Enum, Übergangs-Regeln aus BAO_KI_DATENVERARBEITUNG_ANTWORT.md Anhang A,
 * und Hilfs-Funktionen für den Sachstands-Generator.
 *
 * Voice: respektvoll-warm, klar, kein Marketing-Deutsch.
 */

import type { MandantCase, KanzleiSettings } from './types'
import { getChecklistById } from './mandatsart-checklists'

// ---------------------------------------------------------------------------
// B.1 — Status-Enum + Übergangs-Regeln
// ---------------------------------------------------------------------------

export type CaseStatus =
  | 'unterlagen_fehlen'
  | 'unterlagen_in_pruefung'
  | 'antrag_in_vorbereitung'
  | 'antrag_eingereicht'
  | 'behoerdliche_rueckmeldung_ausstehend'
  | 'behoerde_nachforderung'
  | 'termin_steht_aus'
  | 'verfahren_abgeschlossen'

export interface CaseStatusInfo {
  id: CaseStatus
  label: string
  labelVi?: string  // TODO: VI-review by native speaker
  internalDescription: string
  color: 'amber' | 'blue' | 'orange' | 'green' | 'gray'
  icon?: string
  allowedNextStates: CaseStatus[]
}

export const CASE_STATUSES: CaseStatusInfo[] = [
  {
    id: 'unterlagen_fehlen',
    label: 'Unterlagen fehlen',
    // TODO: VI-review by native speaker
    labelVi: 'Hồ sơ chưa đầy đủ',
    internalDescription: 'Antrag kann nicht eingereicht werden — fehlende Unterlagen blockieren den Prozess.',
    color: 'amber',
    icon: '📋',
    allowedNextStates: ['unterlagen_in_pruefung'],
  },
  {
    id: 'unterlagen_in_pruefung',
    label: 'Unterlagen in Prüfung',
    // TODO: VI-review by native speaker
    labelVi: 'Hồ sơ đang được kiểm tra',
    internalDescription: 'Alle Unterlagen eingegangen — Refa/Anwalt prüft Vollständigkeit und Richtigkeit.',
    color: 'blue',
    icon: '🔍',
    allowedNextStates: ['antrag_in_vorbereitung', 'unterlagen_fehlen'],
  },
  {
    id: 'antrag_in_vorbereitung',
    label: 'Antrag in Vorbereitung',
    // TODO: VI-review by native speaker
    labelVi: 'Đơn đang được chuẩn bị',
    internalDescription: 'Prüfung abgeschlossen — Anwalt bereitet die Einreichung vor.',
    color: 'blue',
    icon: '✍️',
    allowedNextStates: ['antrag_eingereicht'],
  },
  {
    id: 'antrag_eingereicht',
    label: 'Antrag eingereicht',
    // TODO: VI-review by native speaker
    labelVi: 'Đơn đã được nộp',
    internalDescription: 'Antrag liegt bei der Behörde. Bearbeitung liegt jetzt bei der Behörde — nicht bei der Kanzlei.',
    color: 'green',
    icon: '📬',
    allowedNextStates: ['behoerdliche_rueckmeldung_ausstehend'],
  },
  {
    id: 'behoerdliche_rueckmeldung_ausstehend',
    label: 'Behördliche Rückmeldung ausstehend',
    // TODO: VI-review by native speaker
    labelVi: 'Đang chờ phản hồi từ cơ quan',
    internalDescription: 'Antrag eingereicht, Behörde hat noch nicht reagiert. Wartezeit erfahrungsgemäß mehrere Wochen.',
    color: 'orange',
    icon: '⏳',
    allowedNextStates: [
      'behoerde_nachforderung',
      'termin_steht_aus',
      'verfahren_abgeschlossen',
    ],
  },
  {
    id: 'behoerde_nachforderung',
    label: 'Behörde hat Nachforderung gestellt',
    // TODO: VI-review by native speaker
    labelVi: 'Cơ quan yêu cầu bổ sung hồ sơ',
    internalDescription: 'Behörde fordert weitere Unterlagen oder Klärung. Rückkehr in Prüfungs-Phase nach Eingang.',
    color: 'amber',
    icon: '📩',
    allowedNextStates: ['unterlagen_in_pruefung'],
  },
  {
    id: 'termin_steht_aus',
    label: 'Termin / Entscheidung steht aus',
    // TODO: VI-review by native speaker
    labelVi: 'Đang chờ lịch hẹn / quyết định',
    internalDescription: 'Behörde hat Termin oder Entscheidung angekündigt — Ergebnis ausstehend.',
    color: 'orange',
    icon: '📅',
    allowedNextStates: ['verfahren_abgeschlossen'],
  },
  {
    id: 'verfahren_abgeschlossen',
    label: 'Verfahren abgeschlossen',
    // TODO: VI-review by native speaker
    labelVi: 'Hồ sơ đã hoàn tất',
    internalDescription: 'Verfahren beendet — Bescheid erhalten, Ergebnis dokumentiert. Akte kann archiviert werden.',
    color: 'gray',
    icon: '✅',
    allowedNextStates: [],
  },
]

export function getStatusInfo(s: CaseStatus): CaseStatusInfo {
  const info = CASE_STATUSES.find(i => i.id === s)
  if (!info) throw new Error(`Unknown CaseStatus: ${s}`)
  return info
}

export function canTransition(from: CaseStatus, to: CaseStatus): boolean {
  return getStatusInfo(from).allowedNextStates.includes(to)
}

// ---------------------------------------------------------------------------
// B.3 — Helper functions
// ---------------------------------------------------------------------------

/**
 * Füllt einen Template-String mit {placeholder}-Werten.
 * Unbekannte Platzhalter bleiben als {placeholder} erhalten.
 */
export function fillTemplate(template: string, vars: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (match, key) => {
    return Object.prototype.hasOwnProperty.call(vars, key) ? vars[key] : match
  })
}

/**
 * Formatiert die fehlenden Unterlagen als Aufzählung.
 * Liest checklistStates und liefert alle required-Items mit status ≠ 'received'.
 */
export function formatFehlendeUnterlagen(c: MandantCase, lang: 'de' | 'vi'): string {
  if (!c.mandatsartId) return ''
  const checklist = getChecklistById(c.mandatsartId)
  if (!checklist) return ''

  const states = c.checklistStates ?? {}
  const missing = checklist.requiredDocuments.filter(
    item => item.level === 'required' && states[item.id] !== 'received'
  )

  if (missing.length === 0) return ''

  return missing
    .map(item => {
      const label = lang === 'vi' && item.labelVi ? item.labelVi : item.label
      return `– ${label}`
    })
    .join('\n')
}

/**
 * Baut den Kontext-Record für fillTemplate() aus einer Akte.
 * Alle Platzhalter, die in den Sachstands-Templates vorkommen.
 */
export function buildSachstandsContext(
  c: MandantCase,
  settings: KanzleiSettings,
  lang: 'de' | 'vi'
): Record<string, string> {
  const anrede =
    lang === 'vi'
      ? `Kính gửi ${c.mandantName},`
      : `Sehr geehrte/r Frau/Herr ${c.mandantName},`

  const antragDatum = c.createdAt
    ? new Date(c.createdAt).toLocaleDateString('de-DE')
    : '—'

  const unterschrift =
    lang === 'vi'
      ? `Trân trọng,\n${settings.anwaltName}\n${settings.name}`
      : `Mit freundlichen Grüßen\n${settings.anwaltName}\n${settings.name}`

  // Derive Mandatsart label from mandatsartId if available
  const mandatsartLabel = c.mandatsartId
    ? c.mandatsartId
        .replace(/_/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase())
    : lang === 'vi' ? 'Vụ việc di trú' : 'Migrationsmandat'

  return {
    mandant_anrede: anrede,
    mandant_name: c.mandantName,
    aktenzeichen: c.aktenzeichen,
    mandatsart: mandatsartLabel,
    behoerde: lang === 'vi' ? 'Cơ quan có thẩm quyền' : 'zuständige Behörde',
    antrag_datum: antragDatum,
    fehlende_unterlagen: formatFehlendeUnterlagen(c, lang),
    naechster_schritt:
      lang === 'vi'
        ? 'Chúng tôi sẽ thông báo khi có thông tin mới.'
        : 'Wir informieren Sie, sobald es Neuigkeiten gibt.',
    kanzlei_unterschrift: unterschrift,
  }
}
