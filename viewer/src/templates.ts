/**
 * Musterbrief-Generator — P3 Feature
 *
 * Generates template letters for common legal situations.
 * No AI needed — static templates with fill-in fields.
 */

export interface LetterTemplate {
  id: string
  emoji: string
  title: string
  category: string
  description: string
  searchVolume?: number // Monthly Google searches — for prioritization
  premium?: boolean // true = only for paying users
  fields: { id: string; label: string; placeholder: string; type?: 'text' | 'date' | 'textarea' }[]
  template: string // Uses {{field_id}} placeholders
  lawReference: string
}

export const letterTemplates: LetterTemplate[] = [
  {
    id: 'mietminderung',
    emoji: '🏠',
    title: 'Mietminderung wegen Mangel',
    category: 'Mietrecht',
    description: 'Dein Vermieter muss Mängel beseitigen. Bis dahin darfst du die Miete kürzen (§ 536 BGB).',
    fields: [
      { id: 'vermieter_name', label: 'Name des Vermieters', placeholder: 'Herr/Frau Mustermann' },
      { id: 'vermieter_adresse', label: 'Adresse des Vermieters', placeholder: 'Musterstraße 1, 12345 Berlin' },
      { id: 'dein_name', label: 'Dein Name', placeholder: 'Max Mustermann' },
      { id: 'deine_adresse', label: 'Deine Adresse', placeholder: 'Mietstraße 5, 12345 Berlin' },
      { id: 'mangel', label: 'Beschreibung des Mangels', placeholder: 'Schimmel im Bad, defekte Heizung, etc.', type: 'textarea' },
      { id: 'seit_wann', label: 'Mangel besteht seit', placeholder: '01.01.2026', type: 'date' },
      { id: 'minderung_prozent', label: 'Minderung in %', placeholder: '20' },
    ],
    template: `{{dein_name}}
{{deine_adresse}}

An:
{{vermieter_name}}
{{vermieter_adresse}}

Datum: {{datum}}

Betreff: Mängelanzeige und Mietminderung gemäß § 536 BGB

Sehr geehrte/r {{vermieter_name}},

hiermit zeige ich Ihnen folgenden Mangel in meiner Mietwohnung an:

{{mangel}}

Dieser Mangel besteht seit dem {{seit_wann}} und beeinträchtigt die vertragsgemäße Nutzung der Wohnung erheblich.

Gemäß § 536 Abs. 1 BGB bin ich berechtigt, die Miete für die Dauer des Mangels um {{minderung_prozent}}% zu mindern. Ich fordere Sie auf, den Mangel innerhalb von 14 Tagen zu beseitigen.

Sollte der Mangel nicht fristgerecht beseitigt werden, behalte ich mir weitere rechtliche Schritte vor (§ 536a BGB — Schadensersatz, § 543 BGB — fristlose Kündigung).

Mit freundlichen Grüßen
{{dein_name}}`,
    lawReference: '§ 536 BGB — Mietminderung bei Sach- und Rechtsmängeln',
  },
  {
    id: 'widerspruch_mieterhöhung',
    emoji: '📝',
    title: 'Widerspruch Mieterhöhung',
    category: 'Mietrecht',
    description: 'Du musst einer Mieterhöhung nicht zustimmen. Hier ist dein Widerspruch (§ 558 BGB).',
    fields: [
      { id: 'vermieter_name', label: 'Name des Vermieters', placeholder: 'Herr/Frau Mustermann' },
      { id: 'vermieter_adresse', label: 'Adresse des Vermieters', placeholder: '' },
      { id: 'dein_name', label: 'Dein Name', placeholder: '' },
      { id: 'deine_adresse', label: 'Deine Adresse', placeholder: '' },
      { id: 'aktuelle_miete', label: 'Aktuelle Miete (€)', placeholder: '650' },
      { id: 'geforderte_miete', label: 'Geforderte neue Miete (€)', placeholder: '750' },
      { id: 'grund', label: 'Grund des Widerspruchs', placeholder: 'Kappungsgrenze überschritten, Mietspiegel nicht beigefügt, etc.', type: 'textarea' },
    ],
    template: `{{dein_name}}
{{deine_adresse}}

An:
{{vermieter_name}}
{{vermieter_adresse}}

Datum: {{datum}}

Betreff: Widerspruch gegen Mieterhöhung gemäß § 558 BGB

Sehr geehrte/r {{vermieter_name}},

Ihr Mieterhöhungsverlangen vom ______ habe ich erhalten. Meine aktuelle Miete beträgt {{aktuelle_miete}} €, Sie verlangen {{geforderte_miete}} €.

Ich widerspreche der Mieterhöhung aus folgendem Grund:

{{grund}}

Ich bitte Sie, die Rechtmäßigkeit Ihres Mieterhöhungsverlangens zu überprüfen. Gemäß § 558 Abs. 3 BGB darf die Miete innerhalb von drei Jahren nicht um mehr als 20% (in Gebieten mit angespanntem Wohnungsmarkt: 15%) steigen (Kappungsgrenze).

Bis zur Klärung zahle ich weiterhin die bisherige Miete von {{aktuelle_miete}} €.

Mit freundlichen Grüßen
{{dein_name}}`,
    lawReference: '§ 558 BGB — Mieterhöhung bis zur ortsüblichen Vergleichsmiete',
  },
  {
    id: 'kuendigung_arbeit',
    emoji: '💼',
    title: 'Widerspruch gegen Kündigung',
    category: 'Arbeitsrecht',
    description: 'Du hast 3 Wochen Zeit nach Zugang der Kündigung! (§ 4 KSchG)',
    fields: [
      { id: 'arbeitgeber', label: 'Name des Arbeitgebers', placeholder: 'Firma Mustermann GmbH' },
      { id: 'arbeitgeber_adresse', label: 'Adresse', placeholder: '' },
      { id: 'dein_name', label: 'Dein Name', placeholder: '' },
      { id: 'deine_adresse', label: 'Deine Adresse', placeholder: '' },
      { id: 'kuendigung_datum', label: 'Datum der Kündigung', placeholder: '01.03.2026', type: 'date' },
      { id: 'grund', label: 'Warum ist die Kündigung ungerechtfertigt?', placeholder: 'Keine Sozialauswahl, kein wichtiger Grund, etc.', type: 'textarea' },
    ],
    template: `{{dein_name}}
{{deine_adresse}}

An:
{{arbeitgeber}}
{{arbeitgeber_adresse}}

Datum: {{datum}}

Betreff: Widerspruch gegen die Kündigung vom {{kuendigung_datum}}

Sehr geehrte Damen und Herren,

ich widerspreche hiermit der mir am {{kuendigung_datum}} zugegangenen Kündigung meines Arbeitsverhältnisses.

Die Kündigung ist aus folgenden Gründen sozial ungerechtfertigt im Sinne des § 1 KSchG:

{{grund}}

Ich fordere Sie auf, die Kündigung zurückzunehmen und mich weiterhin vertragsgemäß zu beschäftigen.

Vorsorglich weise ich darauf hin, dass ich die Drei-Wochen-Frist des § 4 KSchG zur Erhebung einer Kündigungsschutzklage wahren werde.

Mit freundlichen Grüßen
{{dein_name}}

WICHTIG: Diese Frist (3 Wochen ab Zugang!) ist NICHT verlängerbar. Verpasst du sie, gilt die Kündigung als wirksam — egal wie unfair sie war.`,
    lawReference: '§ 1 KSchG — Sozial ungerechtfertigte Kündigung / § 4 KSchG — 3-Wochen-Frist',
  },
  {
    id: 'beschwerde_hassrede',
    emoji: '🌐',
    title: 'Beschwerde über Online-Hassrede',
    category: 'Internetrecht',
    description: 'Plattformen MÜSSEN offensichtlich rechtswidrige Inhalte in 24h löschen (§ 3 NetzDG).',
    fields: [
      { id: 'plattform', label: 'Plattform', placeholder: 'Instagram, TikTok, X, Facebook...' },
      { id: 'dein_name', label: 'Dein Name', placeholder: '' },
      { id: 'deine_email', label: 'Deine E-Mail', placeholder: '' },
      { id: 'url_beitrag', label: 'URL des Beitrags', placeholder: 'https://...' },
      { id: 'beschreibung', label: 'Was wurde geschrieben?', placeholder: 'Wörtliches Zitat oder Beschreibung', type: 'textarea' },
      { id: 'straftat', label: 'Vermutete Straftat', placeholder: 'Beleidigung (§185), Volksverhetzung (§130), Bedrohung (§241)...' },
    ],
    template: `Beschwerde gemäß § 3 Abs. 1 NetzDG

An: {{plattform}} — Beschwerdestelle gemäß NetzDG

Von: {{dein_name}} ({{deine_email}})
Datum: {{datum}}

Meldung eines rechtswidrigen Inhalts:

URL: {{url_beitrag}}

Beschreibung des Inhalts:
{{beschreibung}}

Vermuteter Straftatbestand:
{{straftat}}

Gemäß § 3 Abs. 2 NetzDG sind Sie verpflichtet, offensichtlich rechtswidrige Inhalte innerhalb von 24 Stunden nach Eingang der Beschwerde zu entfernen oder den Zugang zu ihnen zu sperren.

Ich bitte um Bestätigung des Eingangs und Information über die getroffenen Maßnahmen.

{{dein_name}}

HINWEIS: Parallel zur NetzDG-Beschwerde solltest du Strafanzeige bei der Online-Wache deines Bundeslandes erstatten. Screenshots sichern!`,
    lawReference: '§ 3 NetzDG — Umgang mit Beschwerden über rechtswidrige Inhalte',
  },
  {
    id: 'tierschutz_anzeige',
    emoji: '🐾',
    title: 'Anzeige wegen Tierquälerei',
    category: 'Tierschutz',
    description: 'Tierquälerei ist eine Straftat — bis zu 3 Jahre Gefängnis (§ 17 TierSchG).',
    fields: [
      { id: 'dein_name', label: 'Dein Name', placeholder: '' },
      { id: 'deine_adresse', label: 'Deine Adresse', placeholder: '' },
      { id: 'ort', label: 'Ort des Vorfalls', placeholder: '' },
      { id: 'datum_vorfall', label: 'Datum des Vorfalls', placeholder: '', type: 'date' },
      { id: 'beschreibung', label: 'Was hast du beobachtet?', placeholder: 'Detaillierte Beschreibung', type: 'textarea' },
      { id: 'taeter', label: 'Beschreibung des Täters (wenn bekannt)', placeholder: '' },
    ],
    template: `{{dein_name}}
{{deine_adresse}}

An: Polizeidienststelle / Veterinäramt
{{ort}}

Datum: {{datum}}

Strafanzeige wegen Verstoßes gegen § 17 TierSchG (Tierquälerei)

Hiermit erstatte ich Strafanzeige gegen:
{{taeter}}

Tatort: {{ort}}
Tatzeit: {{datum_vorfall}}

Sachverhalt:
{{beschreibung}}

Der beschriebene Sachverhalt erfüllt den Tatbestand des § 17 TierSchG (Strafbare Tiermisshandlung). Danach wird mit Freiheitsstrafe bis zu drei Jahren oder mit Geldstrafe bestraft, wer ein Wirbeltier ohne vernünftigen Grund tötet oder einem Wirbeltier erhebliche Schmerzen oder Leiden zufügt.

Ich bitte um Aufnahme der Anzeige und Einleitung von Ermittlungen.

{{dein_name}}

TIPP: Fotos/Videos als Beweise sichern. Zeugen notieren. Auch das Veterinäramt informieren — die können sofortige Maßnahmen anordnen.`,
    lawReference: '§ 17 TierSchG — Strafvorschriften bei Tierquälerei',
  },

  // ── TOP 15 MEISTGESUCHTE (300K+ Suchen/Monat) ──

  {
    id: 'widerruf_online',
    emoji: '🛒',
    title: 'Widerruf Online-Kauf (14 Tage)',
    category: 'Verbraucherrecht',
    description: 'Du hast 14 Tage Widerrufsrecht bei Online-Käufen — ohne Begründung. (~40.000 Suchen/Monat)',
    searchVolume: 40000,
    fields: [
      { id: 'haendler', label: 'Name des Händlers', placeholder: 'Amazon, Zalando, etc.' },
      { id: 'haendler_adresse', label: 'Adresse/E-Mail', placeholder: '' },
      { id: 'dein_name', label: 'Dein Name', placeholder: '' },
      { id: 'bestellnr', label: 'Bestellnummer', placeholder: '' },
      { id: 'bestelldatum', label: 'Bestelldatum', placeholder: '', type: 'date' },
      { id: 'produkt', label: 'Produkt', placeholder: 'z.B. Laptop, Schuhe, Kamera' },
    ],
    template: `{{dein_name}}

An: {{haendler}}
{{haendler_adresse}}

Datum: {{datum}}

Betreff: Widerruf meiner Bestellung {{bestellnr}} vom {{bestelldatum}}

Sehr geehrte Damen und Herren,

hiermit widerrufe ich fristgerecht gemäß § 355 BGB meinen am {{bestelldatum}} geschlossenen Kaufvertrag über folgendes Produkt:

{{produkt}} (Bestellnummer: {{bestellnr}})

Bitte erstatten Sie mir den Kaufpreis innerhalb von 14 Tagen auf das ursprüngliche Zahlungsmittel zurück (§ 357 Abs. 1 BGB).

[Falls Ware bereits erhalten: Die Ware sende ich Ihnen auf Ihre Kosten zurück.]

Mit freundlichen Grüßen
{{dein_name}}

HINWEIS: Die 14-Tage-Frist beginnt ab Erhalt der Ware (nicht ab Bestellung!). Dieser Widerruf muss rechtzeitig ABGESENDET werden.`,
    lawReference: '§ 355 BGB — Widerrufsrecht bei Verbraucherverträgen',
  },
  {
    id: 'reklamation',
    emoji: '🔧',
    title: 'Reklamation / Mängelrüge',
    category: 'Verbraucherrecht',
    description: 'Gekaufte Ware defekt? Du hast 2 Jahre Gewährleistung. (~25.000 Suchen/Monat)',
    searchVolume: 25000,
    fields: [
      { id: 'haendler', label: 'Händler', placeholder: '' },
      { id: 'haendler_adresse', label: 'Adresse', placeholder: '' },
      { id: 'dein_name', label: 'Dein Name', placeholder: '' },
      { id: 'produkt', label: 'Produkt', placeholder: '' },
      { id: 'kaufdatum', label: 'Kaufdatum', placeholder: '', type: 'date' },
      { id: 'mangel', label: 'Beschreibung des Mangels', placeholder: 'Display flackert, Knopf gebrochen, etc.', type: 'textarea' },
    ],
    template: `{{dein_name}}

An: {{haendler}}
{{haendler_adresse}}

Datum: {{datum}}

Betreff: Reklamation — Mangel an {{produkt}} (Kauf vom {{kaufdatum}})

Sehr geehrte Damen und Herren,

am {{kaufdatum}} habe ich bei Ihnen folgendes Produkt gekauft: {{produkt}}

Leider weist das Produkt folgenden Mangel auf:
{{mangel}}

Gemäß § 437 Nr. 1 i.V.m. § 439 BGB fordere ich Sie auf, innerhalb von 14 Tagen Nacherfüllung zu leisten (Reparatur oder Ersatzlieferung — die Wahl liegt bei mir).

Sollte die Nacherfüllung nicht fristgerecht erfolgen, behalte ich mir vor, vom Vertrag zurückzutreten (§ 437 Nr. 2 BGB) oder den Kaufpreis zu mindern (§ 441 BGB).

Mit freundlichen Grüßen
{{dein_name}}

TIPP: Beweisfotos beifügen. Kassenbon/Rechnung als Nachweis. Gewährleistung = 2 Jahre ab Kauf.`,
    lawReference: '§ 437 BGB — Rechte des Käufers bei Mängeln',
  },
  {
    id: 'kuendigung_mietvertrag',
    emoji: '🏠',
    title: 'Kündigung Mietvertrag (als Mieter)',
    category: 'Mietrecht',
    description: 'Korrekte Kündigung deiner Wohnung mit allen Formalien. (~22.000 Suchen/Monat)',
    searchVolume: 22000,
    fields: [
      { id: 'vermieter', label: 'Vermieter', placeholder: '' },
      { id: 'vermieter_adresse', label: 'Adresse', placeholder: '' },
      { id: 'dein_name', label: 'Dein Name', placeholder: '' },
      { id: 'wohnung', label: 'Wohnungsadresse', placeholder: 'Musterstr. 5, 3. OG links' },
      { id: 'kuendigungsdatum', label: 'Gewünschtes Ende', placeholder: '', type: 'date' },
    ],
    template: `{{dein_name}}

An: {{vermieter}}
{{vermieter_adresse}}

Datum: {{datum}}

Betreff: Ordentliche Kündigung des Mietverhältnisses

Sehr geehrte/r {{vermieter}},

hiermit kündige ich das Mietverhältnis über die Wohnung {{wohnung}} ordentlich und fristgerecht zum {{kuendigungsdatum}}, hilfsweise zum nächstmöglichen Termin.

Bitte bestätigen Sie mir den Erhalt dieser Kündigung und das Mietende schriftlich.

Ich bitte um einen Termin zur Wohnungsübergabe und zur Rückgabe der Schlüssel. Die Rückzahlung meiner Mietkaution erwarte ich gemäß § 551 BGB innerhalb einer angemessenen Frist nach Mietende.

Mit freundlichen Grüßen
{{dein_name}}

WICHTIG: Kündigungsfrist = 3 Monate zum Monatsende (§ 573c BGB). Kündigung muss SCHRIFTLICH sein (Brief, nicht E-Mail/WhatsApp). Am besten per Einschreiben.`,
    lawReference: '§ 573c BGB — Fristen der ordentlichen Kündigung',
  },
  {
    id: 'widerspruch_bussgeld',
    emoji: '🚗',
    title: 'Einspruch gegen Bußgeldbescheid',
    category: 'Behörden',
    description: 'Blitzer-Ticket oder Parkknöllchen? 14 Tage Einspruchsfrist! (~20.000 Suchen/Monat)',
    searchVolume: 20000,
    fields: [
      { id: 'behoerde', label: 'Bußgeldbehörde', placeholder: 'Stadt/Kreis, z.B. Bußgeldstelle Berlin' },
      { id: 'behoerde_adresse', label: 'Adresse', placeholder: '' },
      { id: 'dein_name', label: 'Dein Name', placeholder: '' },
      { id: 'aktenzeichen', label: 'Aktenzeichen', placeholder: 'Steht auf dem Bescheid' },
      { id: 'grund', label: 'Warum ist der Bescheid falsch?', placeholder: 'Ich war nicht der Fahrer, Messgerät fehlerhaft, etc.', type: 'textarea' },
    ],
    template: `{{dein_name}}

An: {{behoerde}}
{{behoerde_adresse}}

Datum: {{datum}}

Betreff: Einspruch gegen Bußgeldbescheid — Az. {{aktenzeichen}}

Sehr geehrte Damen und Herren,

gegen den Bußgeldbescheid vom ______ (Az. {{aktenzeichen}}) lege ich hiermit fristgerecht Einspruch gemäß § 67 OWiG ein.

Begründung:
{{grund}}

Ich bitte um Überprüfung des Vorgangs und Einstellung des Verfahrens.

Mit freundlichen Grüßen
{{dein_name}}

WICHTIG: Einspruchsfrist = 14 Tage ab Zustellung (§ 67 Abs. 1 OWiG). Einen Tag zu spät = Einspruch unwirksam!`,
    lawReference: '§ 67 OWiG — Einspruch gegen Bußgeldbescheid',
  },
  {
    id: 'widerspruch_nebenkosten',
    emoji: '💧',
    title: 'Widerspruch Nebenkostenabrechnung',
    category: 'Mietrecht',
    description: '50% aller Nebenkostenabrechnungen enthalten Fehler! 12 Monate Frist. (~18.000 Suchen/Monat)',
    searchVolume: 18000,
    fields: [
      { id: 'vermieter', label: 'Vermieter', placeholder: '' },
      { id: 'vermieter_adresse', label: 'Adresse', placeholder: '' },
      { id: 'dein_name', label: 'Dein Name', placeholder: '' },
      { id: 'abrechnungsjahr', label: 'Abrechnungsjahr', placeholder: '2025' },
      { id: 'nachzahlung', label: 'Geforderte Nachzahlung (€)', placeholder: '450' },
      { id: 'einwand', label: 'Was ist falsch?', placeholder: 'Falsche Wohnfläche, nicht umlagefähige Kosten, fehlende Belege, etc.', type: 'textarea' },
    ],
    template: `{{dein_name}}

An: {{vermieter}}
{{vermieter_adresse}}

Datum: {{datum}}

Betreff: Einwendung gegen Nebenkostenabrechnung {{abrechnungsjahr}}

Sehr geehrte/r {{vermieter}},

gegen die Nebenkostenabrechnung für das Jahr {{abrechnungsjahr}} erhebe ich hiermit fristgerecht Einwendungen gemäß § 556 Abs. 3 S. 5 BGB.

Die geforderte Nachzahlung von {{nachzahlung}} € ist aus folgenden Gründen nicht gerechtfertigt:

{{einwand}}

Ich bitte Sie, die Abrechnung zu berichtigen. Gleichzeitig fordere ich Einsicht in die Originalbelege gemäß meinem Recht als Mieter.

Bis zur Klärung behalte ich mir vor, die Nachzahlung zurückzuhalten.

Mit freundlichen Grüßen
{{dein_name}}

TIPP: Du hast 12 Monate nach Erhalt der Abrechnung Zeit für Einwendungen. Fordere IMMER Belegeinsicht!`,
    lawReference: '§ 556 BGB — Vereinbarungen über Betriebskosten',
  },
  {
    id: 'kuendigung_versicherung',
    emoji: '📋',
    title: 'Kündigung Versicherung',
    category: 'Versicherung',
    description: 'KFZ, Haftpflicht, Hausrat — korrekt kündigen. (~18.000 Suchen/Monat)',
    searchVolume: 18000,
    fields: [
      { id: 'versicherung', label: 'Versicherungsunternehmen', placeholder: 'Allianz, HUK-COBURG, etc.' },
      { id: 'versicherung_adresse', label: 'Adresse', placeholder: '' },
      { id: 'dein_name', label: 'Dein Name', placeholder: '' },
      { id: 'vertragsnr', label: 'Vertragsnummer', placeholder: '' },
      { id: 'versicherungsart', label: 'Art der Versicherung', placeholder: 'KFZ-Haftpflicht, Hausrat, etc.' },
    ],
    template: `{{dein_name}}

An: {{versicherung}}
{{versicherung_adresse}}

Datum: {{datum}}

Betreff: Kündigung meines Versicherungsvertrags Nr. {{vertragsnr}}

Sehr geehrte Damen und Herren,

hiermit kündige ich meinen {{versicherungsart}}-Vertrag (Nr. {{vertragsnr}}) ordentlich zum nächstmöglichen Termin gemäß § 11 VVG.

Bitte bestätigen Sie mir die Kündigung und das Vertragsende schriftlich.

Mit freundlichen Grüßen
{{dein_name}}

WICHTIG KFZ: Stichtag für KFZ-Versicherungswechsel ist der 30. November! Kündigung muss bis dahin beim Versicherer eingegangen sein.`,
    lawReference: '§ 11 VVG — Kündigungsrecht',
  },
  {
    id: 'widerspruch_fitnessstudio',
    emoji: '💪',
    title: 'Kündigung / Widerruf Fitnessstudio',
    category: 'Verbraucherrecht',
    description: 'Fitnessstudio-Vertrag loswerden — außerordentlich bei Umzug oder Krankheit. (~15.000 Suchen/Monat)',
    searchVolume: 15000,
    fields: [
      { id: 'studio', label: 'Name des Studios', placeholder: 'McFit, FitX, etc.' },
      { id: 'studio_adresse', label: 'Adresse', placeholder: '' },
      { id: 'dein_name', label: 'Dein Name', placeholder: '' },
      { id: 'mitgliedsnr', label: 'Mitgliedsnummer', placeholder: '' },
      { id: 'grund', label: 'Grund der Kündigung', placeholder: 'Umzug, Krankheit (ärztliches Attest), Vertragslaufzeit', type: 'textarea' },
    ],
    template: `{{dein_name}}

An: {{studio}}
{{studio_adresse}}

Datum: {{datum}}

Betreff: Kündigung meiner Mitgliedschaft (Nr. {{mitgliedsnr}})

Sehr geehrte Damen und Herren,

hiermit kündige ich meine Mitgliedschaft (Nr. {{mitgliedsnr}}) fristgerecht zum nächstmöglichen Termin.

Hilfsweise kündige ich aus wichtigem Grund gemäß § 314 BGB außerordentlich:
{{grund}}

Bitte bestätigen Sie mir die Kündigung und das Ende der Mitgliedschaft schriftlich. Weitere Abbuchungen von meinem Konto weise ich zurück.

Mit freundlichen Grüßen
{{dein_name}}

TIPP: Bei Umzug >30km oder ärztlichem Attest hast du ein Sonderkündigungsrecht. Immer per Einschreiben kündigen!`,
    lawReference: '§ 314 BGB — Kündigung aus wichtigem Grund',
  },
  {
    id: 'widerspruch_jobcenter',
    emoji: '📋',
    title: 'Widerspruch Jobcenter-Bescheid',
    category: 'Behörden',
    description: 'Bürgergeld-Bescheid falsch? 1 Monat Frist! (~15.000 Suchen/Monat)',
    searchVolume: 15000,
    fields: [
      { id: 'jobcenter', label: 'Jobcenter', placeholder: 'Jobcenter Berlin Mitte' },
      { id: 'jobcenter_adresse', label: 'Adresse', placeholder: '' },
      { id: 'dein_name', label: 'Dein Name', placeholder: '' },
      { id: 'bg_nummer', label: 'BG-Nummer', placeholder: '' },
      { id: 'bescheid_datum', label: 'Datum des Bescheids', placeholder: '', type: 'date' },
      { id: 'grund', label: 'Was ist falsch am Bescheid?', placeholder: 'Regelsatz falsch berechnet, KdU zu niedrig angesetzt, etc.', type: 'textarea' },
    ],
    template: `{{dein_name}}

An: {{jobcenter}}
{{jobcenter_adresse}}

Datum: {{datum}}

Betreff: Widerspruch gegen Bescheid vom {{bescheid_datum}} — BG-Nr. {{bg_nummer}}

Sehr geehrte Damen und Herren,

gegen den Bescheid vom {{bescheid_datum}} (BG-Nr. {{bg_nummer}}) lege ich hiermit fristgerecht Widerspruch gemäß § 84 SGG ein.

Begründung:
{{grund}}

Ich bitte um Überprüfung und Erteilung eines rechtsmittelfähigen Widerspruchsbescheids.

Mit freundlichen Grüßen
{{dein_name}}

WICHTIG: Widerspruchsfrist = 1 Monat ab Zustellung des Bescheids. Steht in der Rechtsbehelfsbelehrung am Ende des Bescheids. NICHT VERPASSEN!`,
    lawReference: '§ 84 SGG — Widerspruchsverfahren',
  },
  {
    id: 'dsgvo_auskunft',
    emoji: '🔒',
    title: 'DSGVO-Auskunft (Art. 15)',
    category: 'Datenschutz',
    description: 'Welche Daten hat ein Unternehmen über dich? Du hast das Recht zu fragen. (~10.000 Suchen/Monat)',
    searchVolume: 10000,
    fields: [
      { id: 'unternehmen', label: 'Unternehmen', placeholder: 'Schufa, Facebook, ehemaliger Arbeitgeber, etc.' },
      { id: 'unternehmen_adresse', label: 'Adresse / Datenschutz-E-Mail', placeholder: '' },
      { id: 'dein_name', label: 'Dein Name', placeholder: '' },
      { id: 'geburtsdatum', label: 'Geburtsdatum (zur Identifikation)', placeholder: '', type: 'date' },
    ],
    template: `{{dein_name}}

An: Datenschutzbeauftragte/r
{{unternehmen}}
{{unternehmen_adresse}}

Datum: {{datum}}

Betreff: Auskunftsersuchen gemäß Art. 15 DSGVO

Sehr geehrte Damen und Herren,

auf Grundlage von Art. 15 DSGVO bitte ich Sie um Auskunft über alle personenbezogenen Daten, die Sie über mich gespeichert haben.

Meine Identifikationsdaten:
Name: {{dein_name}}
Geburtsdatum: {{geburtsdatum}}

Insbesondere bitte ich um Auskunft über:
1. Welche personenbezogenen Daten über mich gespeichert sind
2. Den Zweck der Verarbeitung
3. Die Empfänger, denen meine Daten offengelegt wurden
4. Die geplante Speicherdauer
5. Die Herkunft der Daten (falls nicht direkt bei mir erhoben)

Gemäß Art. 12 Abs. 3 DSGVO haben Sie 1 Monat Zeit zu antworten. Die Auskunft ist kostenlos (Art. 12 Abs. 5 DSGVO).

Mit freundlichen Grüßen
{{dein_name}}`,
    lawReference: 'Art. 15 DSGVO — Auskunftsrecht der betroffenen Person',
  },
  {
    id: 'dsgvo_loeschung',
    emoji: '🗑️',
    title: 'DSGVO-Löschantrag (Art. 17)',
    category: 'Datenschutz',
    description: 'Recht auf Vergessenwerden — Daten löschen lassen. (~8.000 Suchen/Monat)',
    searchVolume: 8000,
    fields: [
      { id: 'unternehmen', label: 'Unternehmen', placeholder: '' },
      { id: 'unternehmen_adresse', label: 'Adresse', placeholder: '' },
      { id: 'dein_name', label: 'Dein Name', placeholder: '' },
      { id: 'welche_daten', label: 'Welche Daten sollen gelöscht werden?', placeholder: 'Benutzerkonto, Fotos, Sucheinträge, etc.', type: 'textarea' },
    ],
    template: `{{dein_name}}

An: {{unternehmen}}
{{unternehmen_adresse}}

Datum: {{datum}}

Betreff: Löschantrag gemäß Art. 17 DSGVO ("Recht auf Vergessenwerden")

Sehr geehrte Damen und Herren,

hiermit fordere ich Sie auf, unverzüglich folgende personenbezogene Daten zu löschen:

{{welche_daten}}

Die Löschung ist gemäß Art. 17 DSGVO vorzunehmen, da die Daten für den ursprünglichen Zweck nicht mehr erforderlich sind / ich meine Einwilligung widerrufe.

Bitte bestätigen Sie mir die vollständige Löschung innerhalb von 1 Monat (Art. 12 Abs. 3 DSGVO).

Mit freundlichen Grüßen
{{dein_name}}`,
    lawReference: 'Art. 17 DSGVO — Recht auf Löschung',
  },
  {
    id: 'kaution_rueckforderung',
    emoji: '💶',
    title: 'Rückforderung Mietkaution',
    category: 'Mietrecht',
    description: 'Vermieter gibt Kaution nicht zurück? Fristsetzung! (~12.000 Suchen/Monat)',
    searchVolume: 12000,
    premium: true,
    fields: [
      { id: 'vermieter', label: 'Vermieter', placeholder: '' },
      { id: 'vermieter_adresse', label: 'Adresse', placeholder: '' },
      { id: 'dein_name', label: 'Dein Name', placeholder: '' },
      { id: 'kaution_hoehe', label: 'Kautionshöhe (€)', placeholder: '1.500' },
      { id: 'mietende', label: 'Mietende', placeholder: '', type: 'date' },
    ],
    template: `{{dein_name}}

An: {{vermieter}}
{{vermieter_adresse}}

Datum: {{datum}}

Betreff: Rückzahlung der Mietkaution in Höhe von {{kaution_hoehe}} €

Sehr geehrte/r {{vermieter}},

das Mietverhältnis über meine ehemalige Wohnung endete am {{mietende}}. Die von mir gezahlte Kaution in Höhe von {{kaution_hoehe}} € zuzüglich aufgelaufener Zinsen wurde mir bisher nicht zurückgezahlt.

Ich fordere Sie auf, die Kaution nebst Zinsen innerhalb von 14 Tagen auf mein Konto zurückzuzahlen.

Sollte die Zahlung nicht fristgerecht erfolgen, werde ich den Anspruch gerichtlich geltend machen.

Mit freundlichen Grüßen
{{dein_name}}

HINWEIS: Der Vermieter hat in der Regel 3-6 Monate nach Mietende Zeit, die Kaution abzurechnen. Danach kannst du die volle Rückzahlung fordern.`,
    lawReference: '§ 551 BGB — Begrenzung und Anlage von Mietsicherheiten',
  },
  {
    id: 'widerspruch_krankenkasse',
    emoji: '🏥',
    title: 'Widerspruch Krankenkassen-Ablehnung',
    category: 'Versicherung',
    description: 'Krankenkasse lehnt Behandlung ab? Widerspruch! (~12.000 Suchen/Monat)',
    searchVolume: 12000,
    premium: true,
    fields: [
      { id: 'krankenkasse', label: 'Krankenkasse', placeholder: 'AOK, TK, Barmer, etc.' },
      { id: 'krankenkasse_adresse', label: 'Adresse', placeholder: '' },
      { id: 'dein_name', label: 'Dein Name', placeholder: '' },
      { id: 'versichertennr', label: 'Versichertennummer', placeholder: '' },
      { id: 'abgelehnte_leistung', label: 'Was wurde abgelehnt?', placeholder: 'Reha, Hilfsmittel, Therapie, etc.', type: 'textarea' },
      { id: 'bescheid_datum', label: 'Datum des Ablehnungsbescheids', placeholder: '', type: 'date' },
    ],
    template: `{{dein_name}}

An: {{krankenkasse}}
{{krankenkasse_adresse}}

Datum: {{datum}}

Betreff: Widerspruch gegen Bescheid vom {{bescheid_datum}} — Versicherten-Nr. {{versichertennr}}

Sehr geehrte Damen und Herren,

gegen Ihren Ablehnungsbescheid vom {{bescheid_datum}} lege ich fristgerecht Widerspruch ein.

Sie haben folgende Leistung abgelehnt:
{{abgelehnte_leistung}}

Diese Leistung ist medizinisch notwendig und von meinem Arzt verordnet. Ich bitte um erneute Prüfung.

HINWEIS: Gemäß § 13 Abs. 3a SGB V gilt eine Genehmigungsfiktion: Wenn die Krankenkasse nicht innerhalb von 3 Wochen (5 Wochen bei Gutachten) entscheidet, gilt die Leistung als genehmigt. Bitte prüfen Sie, ob diese Frist eingehalten wurde.

Mit freundlichen Grüßen
{{dein_name}}

TIPP: Widerspruchsfrist = 1 Monat. Ärztliche Stellungnahme beifügen! Bei Ablehnung des Widerspruchs: Klage beim Sozialgericht (kostenfrei!).`,
    lawReference: '§ 13 Abs. 3a SGB V — Genehmigungsfiktion',
  },
  {
    id: 'arbeitszeugnis',
    emoji: '📄',
    title: 'Berichtigung Arbeitszeugnis',
    category: 'Arbeitsrecht',
    description: 'Schlechtes oder codiertes Zeugnis? Du hast Anspruch auf Berichtigung. (~12.000 Suchen/Monat)',
    searchVolume: 12000,
    premium: true,
    fields: [
      { id: 'arbeitgeber', label: 'Arbeitgeber', placeholder: '' },
      { id: 'arbeitgeber_adresse', label: 'Adresse', placeholder: '' },
      { id: 'dein_name', label: 'Dein Name', placeholder: '' },
      { id: 'beanstandung', label: 'Was ist falsch/unfair am Zeugnis?', placeholder: 'Fehlende Tätigkeiten, negative Formulierungen, falsche Daten, etc.', type: 'textarea' },
    ],
    template: `{{dein_name}}

An: {{arbeitgeber}}
{{arbeitgeber_adresse}}

Datum: {{datum}}

Betreff: Berichtigung meines Arbeitszeugnisses gemäß § 109 GewO

Sehr geehrte Damen und Herren,

das mir erteilte Arbeitszeugnis vom ______ entspricht nicht den Anforderungen des § 109 GewO. Es ist nicht wohlwollend formuliert und/oder enthält sachliche Fehler.

Konkret beanstande ich:
{{beanstandung}}

Gemäß § 109 GewO muss das Zeugnis wahrheitsgemäß UND wohlwollend sein. Ich fordere Sie auf, innerhalb von 14 Tagen ein berichtigtes Zeugnis auszustellen.

Mit freundlichen Grüßen
{{dein_name}}

TIPP: "Er hat sich bemüht" = Note 5. "Stets zu unserer vollsten Zufriedenheit" = Note 1. Lerne die Zeugnis-Codes!`,
    lawReference: '§ 109 GewO — Zeugnis',
  },
  {
    id: 'erbschaft_ausschlagen',
    emoji: '⚰️',
    title: 'Ausschlagung einer Erbschaft',
    category: 'Erbrecht',
    description: 'Schulden geerbt? 6 Wochen Frist zum Ausschlagen! (~10.000 Suchen/Monat)',
    searchVolume: 10000,
    premium: true,
    fields: [
      { id: 'nachlassgericht', label: 'Zuständiges Nachlassgericht', placeholder: 'Amtsgericht...' },
      { id: 'nachlassgericht_adresse', label: 'Adresse', placeholder: '' },
      { id: 'dein_name', label: 'Dein Name', placeholder: '' },
      { id: 'verstorbener', label: 'Name des Verstorbenen', placeholder: '' },
      { id: 'todesdatum', label: 'Todesdatum', placeholder: '', type: 'date' },
      { id: 'verwandtschaft', label: 'Verwandtschaftsverhältnis', placeholder: 'Sohn/Tochter, Enkel, etc.' },
    ],
    template: `{{dein_name}}

An: {{nachlassgericht}}
{{nachlassgericht_adresse}}

Datum: {{datum}}

Betreff: Ausschlagung der Erbschaft nach {{verstorbener}}, verstorben am {{todesdatum}}

Sehr geehrte Damen und Herren,

hiermit schlage ich die Erbschaft nach {{verstorbener}}, verstorben am {{todesdatum}}, gemäß §§ 1942, 1944, 1945 BGB aus.

Mein Verwandtschaftsverhältnis zum Verstorbenen: {{verwandtschaft}}

Ich erkläre die Ausschlagung für mich persönlich [und für meine minderjährigen Kinder, soweit diese als Nacherben berufen sind].

Mit freundlichen Grüßen
{{dein_name}}

WICHTIG: Die Ausschlagung muss innerhalb von 6 WOCHEN nach Kenntnis des Erbfalls beim Nachlassgericht erklärt werden — schriftlich mit notariell beglaubigter Unterschrift ODER persönlich beim Nachlassgericht. Diese Frist ist NICHT verlängerbar!`,
    lawReference: '§ 1944 BGB — Ausschlagungsfrist (6 Wochen)',
  },
]
