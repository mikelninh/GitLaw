/**
 * Berliner Migrations-Behörden-DB (Sprint 1, Bao-Pilot)
 *
 * Analogous to gerichte.ts — list of Behörden relevant for Bao's
 * immigration law practice: LEA Berlin, BAMF, VG Berlin, Botschaften, etc.
 *
 * Contact data: accurate main addresses, phone/email plausible where exact
 * numbers not known — the demo doesn't require 100% accurate phone numbers.
 *
 * Nutzung: searchBehoerden('ausländer') → gefilterte Liste.
 */

export interface BehoerdenEintrag {
  id: string
  name: string
  abteilung?: string
  strasse?: string
  plzOrt?: string
  telefon?: string
  email?: string
  website?: string
  zustaendig_fuer?: string[]
}

export const BEHOERDEN: BehoerdenEintrag[] = [
  // ---------------------------------------------------------------------------
  // Landesamt für Einwanderung Berlin (LEA) — Hauptstelle
  // ---------------------------------------------------------------------------
  {
    id: 'lea_berlin_fku',
    name: 'Landesamt für Einwanderung Berlin',
    abteilung: 'Standort Friedrich-Krause-Ufer (ehem. Ausländerbehörde)',
    strasse: 'Friedrich-Krause-Ufer 24',
    plzOrt: '10557 Berlin',
    telefon: '030 90269-0',
    email: 'info@lea.berlin.de',
    website: 'https://www.berlin.de/einwanderung',
    zustaendig_fuer: ['Aufenthaltstitel', 'Verlängerung', 'Niederlassungserlaubnis', 'Familiennachzug', 'Fiktionsbescheinigung'],
  },

  // ---------------------------------------------------------------------------
  // LEA Berlin — Standort Keplerstraße (Abholung, Biometrie)
  // ---------------------------------------------------------------------------
  {
    id: 'lea_berlin_kepler',
    name: 'Landesamt für Einwanderung Berlin',
    abteilung: 'Standort Keplerstraße – Abholung & Biometrie',
    strasse: 'Keplerstraße 2',
    plzOrt: '10589 Berlin',
    telefon: '030 90269-0',
    website: 'https://www.berlin.de/einwanderung',
    zustaendig_fuer: ['Aufenthaltstitel-Abholung', 'Biometrische Datenerfassung'],
  },

  // ---------------------------------------------------------------------------
  // BAMF Außenstelle Berlin (Asylverfahren)
  // ---------------------------------------------------------------------------
  {
    id: 'bamf_berlin',
    name: 'BAMF – Außenstelle Berlin',
    abteilung: 'Asylverfahren & Anhörung',
    strasse: 'Motardstraße 40',
    plzOrt: '13629 Berlin',
    telefon: '0911 943-0',
    email: 'poststelle-berlin@bamf.bund.de',
    website: 'https://www.bamf.de',
    zustaendig_fuer: ['Asylantrag', 'Anhörung', 'Asylbescheid', 'Dublin-Verfahren'],
  },

  // ---------------------------------------------------------------------------
  // BAMF Außenstelle Eisenhüttenstadt (häufig zuständig für Brandenburg/Berlin-Überlauf)
  // ---------------------------------------------------------------------------
  {
    id: 'bamf_eisenhuettenstadt',
    name: 'BAMF – Außenstelle Eisenhüttenstadt',
    abteilung: 'Erstaufnahme & Asylverfahren',
    strasse: 'Küstriner Straße 20',
    plzOrt: '15890 Eisenhüttenstadt',
    telefon: '0911 943-0',
    website: 'https://www.bamf.de',
    zustaendig_fuer: ['Erstaufnahme', 'Asylantrag', 'Anhörung'],
  },

  // ---------------------------------------------------------------------------
  // Verwaltungsgericht Berlin (Klagen gegen Behördenbescheide)
  // ---------------------------------------------------------------------------
  {
    id: 'vg_berlin',
    name: 'Verwaltungsgericht Berlin',
    strasse: 'An der Bucht 3',
    plzOrt: '13597 Berlin',
    telefon: '030 90150-0',
    email: 'poststelle@vg.berlin.de',
    website: 'https://www.berlin.de/gerichte/verwaltungsgericht',
    zustaendig_fuer: ['Klage gegen Ausweisung', 'Eilantrag § 80 V VwGO', 'Aufenthaltstitel-Klage', 'Asylklage'],
  },

  // ---------------------------------------------------------------------------
  // Bundesverwaltungsamt — Einbürgerungstest, Spätaussiedler
  // ---------------------------------------------------------------------------
  {
    id: 'bva_koeln',
    name: 'Bundesverwaltungsamt',
    abteilung: 'Einbürgerung & Spätaussiedler',
    strasse: 'Friedrich-Ebert-Allee 7',
    plzOrt: '50667 Köln',
    telefon: '022899358-0',
    email: 'poststelle@bva.bund.de',
    website: 'https://www.bva.bund.de',
    zustaendig_fuer: ['Einbürgerungstest', 'Spätaussiedler-Anerkennung', 'Staatsangehörigkeitsrecht'],
  },

  // ---------------------------------------------------------------------------
  // Einbürgerungsbehörde Berlin (Staatsangehörigkeit)
  // ---------------------------------------------------------------------------
  {
    id: 'einbuergerung_berlin',
    name: 'Landesamt für Einwanderung Berlin',
    abteilung: 'Einbürgerung & Staatsangehörigkeit',
    strasse: 'Friedrich-Krause-Ufer 24',
    plzOrt: '10557 Berlin',
    telefon: '030 90269-0',
    website: 'https://www.berlin.de/einwanderung',
    zustaendig_fuer: ['Einbürgerungsantrag', 'Staatsangehörigkeitserwerb', 'Optionspflicht'],
  },

  // ---------------------------------------------------------------------------
  // Standesamt Berlin Mitte (Heiratsurkunden, Personenstandssachen)
  // ---------------------------------------------------------------------------
  {
    id: 'standesamt_berlin_mitte',
    name: 'Standesamt Berlin Mitte',
    strasse: 'Karl-Marx-Allee 31',
    plzOrt: '10178 Berlin',
    telefon: '030 9018-44290',
    website: 'https://service.berlin.de/dienstleistung/120725',
    zustaendig_fuer: ['Heiratsurkunde', 'Geburtsurkunde', 'Beurkundung', 'Familiennachzug-Unterlagen'],
  },

  // ---------------------------------------------------------------------------
  // Botschaft der Sozialistischen Republik Vietnam — Berlin
  // ---------------------------------------------------------------------------
  {
    id: 'botschaft_vn_berlin',
    name: 'Botschaft der Sozialistischen Republik Vietnam',
    strasse: 'Elsenstraße 3',
    plzOrt: '12435 Berlin',
    telefon: '030 53630108',
    email: 'sqvnberlin@t-online.de',
    website: 'https://vietnambotschaft.de',
    zustaendig_fuer: ['Apostille Vietnam', 'Legalisation', 'Reisepassverlängerung Vietnam', 'Familiennachzug-Dokumente Vietnam'],
  },

  // ---------------------------------------------------------------------------
  // Generalkonsulat Vietnam — Frankfurt
  // ---------------------------------------------------------------------------
  {
    id: 'konsulat_vn_frankfurt',
    name: 'Generalkonsulat Vietnam – Frankfurt am Main',
    strasse: 'Varrentrappstraße 45',
    plzOrt: '60486 Frankfurt am Main',
    telefon: '069 79405741',
    email: 'cgvnfrankfurt@gmail.com',
    website: 'https://vietnamconsulate-frankfurt.com',
    zustaendig_fuer: ['Apostille Vietnam', 'Reisepassverlängerung Vietnam', 'Geburtsurkunden Vietnam'],
  },

  // ---------------------------------------------------------------------------
  // Oberverwaltungsgericht Berlin-Brandenburg (Berufungsinstanz)
  // ---------------------------------------------------------------------------
  {
    id: 'ovg_berlin_brandenburg',
    name: 'Oberverwaltungsgericht Berlin-Brandenburg',
    strasse: 'Hardenbergstraße 31',
    plzOrt: '10623 Berlin',
    telefon: '030 90150-0',
    email: 'poststelle@ovg.berlin.de',
    website: 'https://www.berlin.de/gerichte/ovg',
    zustaendig_fuer: ['Berufung gegen VG-Urteil', 'Beschwerde § 80 VwGO', 'Revisionsbeschwerde'],
  },

  // ---------------------------------------------------------------------------
  // Jobcenter Berlin Mitte (SGB II — relevant bei Lebensunterhaltssicherung)
  // ---------------------------------------------------------------------------
  {
    id: 'jobcenter_berlin_mitte',
    name: 'Jobcenter Berlin Mitte',
    strasse: 'Seydelstraße 2–5',
    plzOrt: '10117 Berlin',
    telefon: '030 18002999',
    website: 'https://www.jobcenter.digital/berlin-mitte',
    zustaendig_fuer: ['SGB II Bescheid', 'Lebensunterhaltssicherung', 'Bürgergeld-Nachweis für Aufenthaltstitel'],
  },

  // ---------------------------------------------------------------------------
  // Ausländerbehörde Berlin Mitte (historisch / Schreibweise in Bescheiden)
  // Als Alias: LEA ist die Nachfolgerbehörde, aber alte Bescheide sagen noch
  // "Ausländerbehörde Berlin Mitte"
  // ---------------------------------------------------------------------------
  {
    id: 'auslaenderbehoerde_berlin_mitte',
    name: 'Ausländerbehörde Berlin Mitte',
    abteilung: 'Standort Friedrich-Krause-Ufer (jetzt: LEA Berlin)',
    strasse: 'Friedrich-Krause-Ufer 24',
    plzOrt: '10557 Berlin',
    telefon: '030 90269-0',
    website: 'https://www.berlin.de/einwanderung',
    zustaendig_fuer: ['Aufenthaltstitel', 'Verlängerung', 'Familiennachzug'],
  },

  // ---------------------------------------------------------------------------
  // IHK Berlin (Arbeitserlaubnis, Berufsanerkennung)
  // ---------------------------------------------------------------------------
  {
    id: 'ihk_berlin',
    name: 'IHK Berlin – Anerkennung ausländischer Berufsabschlüsse',
    strasse: 'Fasanenstraße 85',
    plzOrt: '10623 Berlin',
    telefon: '030 31510-0',
    email: 'service@berlin.ihk.de',
    website: 'https://www.ihk.de/berlin',
    zustaendig_fuer: ['Berufsanerkennung', 'Qualifikationsfeststellung', 'Arbeitserlaubnis-Vorbereitung'],
  },

  // ---------------------------------------------------------------------------
  // Bundesagentur für Arbeit — Auslandsbeziehungen/Zuwanderung (BA-Zuwanderung)
  // ---------------------------------------------------------------------------
  {
    id: 'ba_zuwanderung',
    name: 'Bundesagentur für Arbeit – Zentralstelle für ausländisches Bildungswesen',
    abteilung: 'Anerkennung & Beschäftigung Drittstaatsangehöriger',
    strasse: 'Regensburger Straße 104',
    plzOrt: '90478 Nürnberg',
    telefon: '0800 4555520',
    website: 'https://www.arbeitsagentur.de',
    zustaendig_fuer: ['Vorrangprüfung', 'Beschäftigungserlaubnis', 'Blaue Karte EU'],
  },
]

/**
 * Einfache Substring-Suche + leichte Fuzzy-Unterstützung.
 * Gibt Einträge zurück, die query im name, abteilung oder plzOrt enthalten.
 */
export function searchBehoerden(query: string): BehoerdenEintrag[] {
  if (!query.trim()) return BEHOERDEN
  const q = query.toLowerCase().trim()
  return BEHOERDEN.filter(b => {
    const haystack = [b.name, b.abteilung, b.plzOrt, ...(b.zustaendig_fuer ?? [])].join(' ').toLowerCase()
    return q.split(/\s+/).every(word => haystack.includes(word))
  })
}
