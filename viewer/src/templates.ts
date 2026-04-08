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
]
