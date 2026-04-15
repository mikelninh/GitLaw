/**
 * Frist-Berechnung aus Bescheid-/Zustellungsdatum.
 *
 * Beispiele:
 *   Bescheid v. 28.03.2026 + Widerspruchsfrist 1 Monat (§ 84 SGG / § 70 VwGO)
 *     → Frist endet 28.04.2026
 *
 * Heuristik nach §§ 187, 188 BGB ("Beginn fällt nicht in Berechnung"):
 *   Bescheid am 28.03. zugestellt → Frist beginnt 29.03., endet je nach Frist-Typ.
 *   Aber: viele Verfahrensvorschriften nutzen direkte Tagesberechnung.
 *
 * Vereinfachung für Tool: wir nehmen das Zustellungsdatum + Frist und
 * geben den Endtag aus. Anwält:in prüft im Einzelfall.
 *
 * WICHTIG: Diese Berechnung ist eine HILFE, kein Garant. Bei Wochenenden /
 * Feiertagen verschiebt sich die Frist auf den nächsten Werktag (§ 193 BGB).
 * Wir markieren das in der UI.
 */

import type { MandantCase } from './types'

export const FRIST_PRESETS = [
  { id: 'widerspruch_sgg', label: 'Widerspruchsfrist § 84 SGG (1 Monat)', months: 1 },
  { id: 'widerspruch_vwgo', label: 'Widerspruchsfrist § 70 VwGO (1 Monat)', months: 1 },
  { id: 'klage_sgg', label: 'Klagefrist § 87 SGG (1 Monat)', months: 1 },
  { id: 'klage_vwgo', label: 'Klagefrist § 74 VwGO (1 Monat)', months: 1 },
  { id: 'erbausschlagung', label: 'Erbausschlagung § 1944 BGB (6 Wochen)', weeks: 6 },
  { id: 'pflichtteil', label: 'Pflichtteilsverjährung § 2332 BGB (3 Jahre)', years: 3 },
  { id: 'weg_anfechtung', label: 'WEG-Anfechtung § 44 WEG (1 Monat Klage / 2 Mon. Begründung)', months: 1 },
  { id: 'weg_begruendung', label: 'WEG-Anfechtungsbegründung § 44 WEG (2 Monate)', months: 2 },
  { id: 'kuendigung_arbzg', label: 'Kündigungsschutzklage § 4 KSchG (3 Wochen)', weeks: 3 },
  { id: 'mahnbescheid_widerspruch', label: 'Widerspruch Mahnbescheid § 692 ZPO (2 Wochen)', weeks: 2 },
  { id: 'verjaehrung_3j', label: 'Regelverjährung § 195 BGB (3 Jahre)', years: 3 },
  { id: 'gewaehrleistung_kauf', label: 'Gewährleistung Kaufrecht § 438 BGB (2 Jahre)', years: 2 },
  { id: 'schonfrist_miete', label: 'Schonfristzahlung § 569 Abs. 3 BGB (2 Monate ab Räumungsklage)', months: 2 },
] as const

export type FristPresetId = (typeof FRIST_PRESETS)[number]['id']

export interface FristCalcResult {
  /** ISO-Datum YYYY-MM-DD */
  enddatum: string
  /** Wochentag des Enddatums */
  wochentag: string
  /** True wenn Enddatum auf Sa/So fällt */
  istWochenende: boolean
  /** Hinweis-Text */
  hinweis: string
}

/**
 * Berechne Endtermin aus Startdatum + Frist-Spec.
 * Folgt grob §§ 187, 188 BGB: bei „Tag, Woche, Monat" zählt der erste
 * Tag NICHT mit (Frist beginnt am Folgetag). Bei Monatsfristen entspricht
 * der Endtag dem Tag des Folgemonats mit der gleichen Zahl.
 */
export function berechneFrist(startIso: string, spec: { days?: number; weeks?: number; months?: number; years?: number }): FristCalcResult {
  const start = new Date(startIso + 'T00:00:00Z')
  // §§ 187 Abs. 1 BGB: Beginn am Folgetag — wir zählen einen Tag dazu.
  const beginn = new Date(start)
  beginn.setUTCDate(beginn.getUTCDate() + 1)

  const end = new Date(beginn)
  if (spec.days) end.setUTCDate(end.getUTCDate() + spec.days - 1)
  if (spec.weeks) end.setUTCDate(end.getUTCDate() + spec.weeks * 7 - 1)
  if (spec.months) {
    // § 188 Abs. 2 BGB: Frist endet am Tag des Folgemonats, der dem Beginnstag entspricht
    end.setUTCMonth(end.getUTCMonth() + spec.months)
    end.setUTCDate(end.getUTCDate() - 1)
  }
  if (spec.years) {
    end.setUTCFullYear(end.getUTCFullYear() + spec.years)
    end.setUTCDate(end.getUTCDate() - 1)
  }

  const wochentagNum = end.getUTCDay()
  const wochentage = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa']
  const istWochenende = wochentagNum === 0 || wochentagNum === 6

  let hinweis = `Berechnet nach §§ 187, 188 BGB.`
  if (istWochenende) {
    const verschoben = new Date(end)
    while (verschoben.getUTCDay() === 0 || verschoben.getUTCDay() === 6) {
      verschoben.setUTCDate(verschoben.getUTCDate() + 1)
    }
    hinweis += ` Da der Endtag auf ${wochentage[wochentagNum]} fällt, verschiebt sich die Frist gem. § 193 BGB auf ${verschoben.toLocaleDateString('de-DE')} (nächster Werktag, Feiertage nicht geprüft).`
  }
  hinweis += ` Bitte im Einzelfall prüfen — Feiertagsregelungen werden nicht berücksichtigt.`

  return {
    enddatum: end.toISOString().slice(0, 10),
    wochentag: wochentage[wochentagNum],
    istWochenende,
    hinweis,
  }
}

/** Convenience: aus einem Preset-Eintrag den Endtag berechnen */
export function berechneFristAusPreset(startIso: string, presetId: FristPresetId): FristCalcResult | null {
  const preset = FRIST_PRESETS.find(p => p.id === presetId)
  if (!preset) return null
  return berechneFrist(startIso, preset as { days?: number; weeks?: number; months?: number; years?: number })
}

/** Helper: pretty-format a Frist preset label for display in select */
export function formatPresetLabel(presetId: FristPresetId): string {
  const preset = FRIST_PRESETS.find(p => p.id === presetId)
  return preset?.label || presetId
}

/** Helper: Frist-Bezeichnung-Vorschlag aus Preset (für das fristBezeichnung-Feld der Akte) */
export function presetToBezeichnung(presetId: FristPresetId): string {
  return formatPresetLabel(presetId).replace(/\s*\(.+?\)$/, '')
}

/** Helper: Frist-Eintrag für eine Akte vorbereiten */
export function fristForCase(presetId: FristPresetId, startIso: string): Pick<MandantCase, 'fristDatum' | 'fristBezeichnung'> | null {
  const r = berechneFristAusPreset(startIso, presetId)
  if (!r) return null
  return {
    fristDatum: r.enddatum,
    fristBezeichnung: presetToBezeichnung(presetId),
  }
}
