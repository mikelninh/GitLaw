/**
 * Demo-Akte-Generator (Sprint 1, Bao-Pilot)
 *
 * Erzeugt eine vollständig ausgefüllte Beispiel-Akte für Bao's Demo-Session.
 * Mandant: Phạm Văn Đức — demonstriert vietnamesische Diakritikas (UTF-8).
 * Mandatsart: Aufenthaltstitel-Verlängerung, Status: antrag_in_vorbereitung.
 * Checkliste: 6 received, 1 problem, 3 pending.
 *
 * Alle Daten und Daten relativ zu heute — kein hardcoded Datum.
 */

import type { KanzleiSettings, MandantCase } from './types'

/** Liefert ein ISO-Datum n Tage in der Vergangenheit. */
function daysAgo(n: number): string {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString()
}

/** Liefert ein ISO-Datum n Tage in der Zukunft. */
function daysFromNow(n: number): string {
  const d = new Date()
  d.setDate(d.getDate() + n)
  return d.toISOString()
}

export function createDemoCase(_settings: KanzleiSettings): MandantCase {
  return {
    id: 'demo-az-2026-0042',
    mandantName: 'Phạm Văn Đức',
    aktenzeichen: 'AZ-2026-0042',
    description: 'Aufenthaltstitel-Verlängerung — Bescheid vom LEA Berlin ausstehend.',

    // Erstellt vor 21 Tagen
    createdAt: daysAgo(21),
    // Zuletzt bearbeitet vor 3 Tagen
    updatedAt: daysAgo(3),

    researchIds: [],
    letterIds: [],
    status: 'aktiv',
    tasks: [],
    documents: [],

    // Pflichtfelder Modul A + B
    mandatsartId: 'aufenthaltstitel-verlaengerung',
    caseStatus: 'antrag_in_vorbereitung',

    // Mandant-Kontakt
    mandantEmail: 'pham.duc@example.com',

    // Behörde (Task B)
    behoerde: 'Ausländerbehörde Berlin Mitte',

    // Frist: Bescheid vor 14 Tagen, Frist 1 Monat → ca. 17 Tage Restfrist
    fristDatum: daysFromNow(17),
    fristBezeichnung: 'Fiktionsbescheinigung läuft ab (§ 81 Abs. 4 AufenthG)',

    // Checklisten-Status:
    // 6 received: reisepass, aktueller-aufenthaltstitel, meldebescheinigung,
    //             mietvertrag, einkommensnachweis, biometrisches-lichtbild
    // 1 problem:  krankenversicherungsnachweis (Scan unleserlich)
    // 3 pending:  sprachzeugnis, anwaltsvollmacht, arbeitsvertrag
    checklistStates: {
      'reisepass': 'received',
      'aktueller-aufenthaltstitel': 'received',
      'meldebescheinigung': 'received',
      'mietvertrag': 'received',
      'einkommensnachweis': 'received',
      'biometrisches-lichtbild': 'received',
      'krankenversicherungsnachweis': 'problem',
      'sprachzeugnis': 'pending',
      'anwaltsvollmacht': 'pending',
      'arbeitsvertrag': 'pending',
    },
  }
}
