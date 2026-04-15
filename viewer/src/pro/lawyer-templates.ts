/**
 * 5 lawyer-grade letter templates for GitLaw Pro.
 *
 * Different from the citizen `templates.ts` (which generates Widerruf,
 * Kündigung Mietvertrag, etc.). These are templates an Anwält:in fills
 * out on behalf of a client.
 *
 * Format: each template has fields the lawyer fills in, then `render()`
 * builds the final letter body that goes into the branded PDF.
 *
 * IMPORTANT: These are starting points, NOT verified by a lawyer. Each
 * template carries a "bitte vor Verwendung gegenprüfen" note in the
 * generated PDF (handled in `pdf.ts`).
 */

export interface LawyerField {
  id: string
  label: string
  /** Hint shown below the input. */
  hint?: string
  type: 'text' | 'textarea' | 'date'
  required?: boolean
  placeholder?: string
}

export interface LawyerTemplate {
  id: string
  title: string
  /** Short description for the picker. */
  description: string
  /** Use-case context — when an Anwält:in would reach for this. */
  useCase: string
  fields: LawyerField[]
  /** Render the final letter body from filled fields. */
  render: (fields: Record<string, string>) => string
}

const SIGN_OFF = `Mit freundlichen kollegialen Grüßen`

export const LAWYER_TEMPLATES: LawyerTemplate[] = [
  // ---------------------------------------------------------------------
  {
    id: 'strafanzeige',
    title: 'Strafanzeige',
    description: 'Anzeige bei Polizei oder Staatsanwaltschaft.',
    useCase: 'Mandant:in ist Geschädigte:r einer Straftat (Bedrohung, Stalking, Beleidigung, Betrug).',
    fields: [
      { id: 'recipient', label: 'Empfänger:in (Polizei / StA)', type: 'text', required: true, placeholder: 'Polizeipräsidium Berlin – ZAC' },
      { id: 'mandant', label: 'Mandant:in (Geschädigte:r)', type: 'text', required: true },
      { id: 'beschuldigt', label: 'Beschuldigte:r (Name oder „unbekannt")', type: 'text', required: true },
      { id: 'tatort', label: 'Tatort / Plattform', type: 'text', placeholder: 'Instagram, Direktnachricht' },
      { id: 'tatzeit', label: 'Tatzeit (Datum oder Zeitraum)', type: 'text', required: true },
      { id: 'sachverhalt', label: 'Sachverhalt', type: 'textarea', required: true, hint: 'Chronologisch, nüchtern. 1–2 Absätze reichen.' },
      { id: 'paragraphen', label: 'Verdacht (rechtliche Würdigung)', type: 'textarea', placeholder: 'Verdacht der Bedrohung gem. § 241 StGB sowie Nachstellung gem. § 238 StGB.' },
      { id: 'anlagen', label: 'Anlagen', type: 'textarea', placeholder: 'Screenshots, Hash-Liste, Zeugenliste' },
    ],
    render: f => `An ${f.recipient || '[Empfänger:in]'}

Strafanzeige
in der Strafsache gegen ${f.beschuldigt || '[Beschuldigte:r]'}

Sehr geehrte Damen und Herren,

namens und im Auftrag meiner Mandantschaft, Frau/Herr ${f.mandant || '[Mandant:in]'}, erstatte ich hiermit

S t r a f a n z e i g e

und stelle Strafantrag wegen aller in Betracht kommenden Delikte.

I. Sachverhalt

Tatort/Plattform: ${f.tatort || '—'}
Tatzeit: ${f.tatzeit || '[Datum]'}

${f.sachverhalt || '[Sachverhalt einfügen]'}

II. Rechtliche Würdigung

${f.paragraphen || 'Es besteht der Verdacht von Straftaten zu Lasten meiner Mandantschaft. Eine vertiefte rechtliche Würdigung bleibt der Ermittlungsbehörde vorbehalten.'}

III. Anlagen

${f.anlagen || '—'}

Ich bitte um Übersendung des Aktenzeichens sowie um Akteneinsicht nach § 406e StPO, sobald Erkenntnisse vorliegen.

${SIGN_OFF}
`,
  },

  // ---------------------------------------------------------------------
  {
    id: 'widerspruch_bescheid',
    title: 'Widerspruch gegen Bescheid',
    description: 'Allgemeiner Widerspruch gegen Verwaltungsbescheid (Sozialamt, Jobcenter, Bauamt, …).',
    useCase: 'Mandant:in hat einen ungünstigen Verwaltungsbescheid erhalten. Frist meist 1 Monat (§ 70 VwGO / § 84 SGG).',
    fields: [
      { id: 'recipient', label: 'Empfänger:in (Behörde)', type: 'text', required: true },
      { id: 'mandant', label: 'Mandant:in', type: 'text', required: true },
      { id: 'mandantAdresse', label: 'Anschrift Mandant:in', type: 'textarea' },
      { id: 'aktenzeichen', label: 'Aktenzeichen der Behörde', type: 'text', required: true },
      { id: 'bescheidDatum', label: 'Datum des Bescheids', type: 'date', required: true },
      { id: 'begruendung', label: 'Widerspruchsbegründung', type: 'textarea', required: true },
    ],
    render: f => `An ${f.recipient || '[Behörde]'}

Widerspruch

in der Sache ${f.mandant || '[Mandant:in]'}
gegen den Bescheid vom ${f.bescheidDatum || '[Datum]'}, Az. ${f.aktenzeichen || '[Aktenzeichen]'}

Sehr geehrte Damen und Herren,

namens und im Auftrag meiner Mandantschaft, Frau/Herr ${f.mandant || '[Mandant:in]'}${f.mandantAdresse ? `, wohnhaft ${f.mandantAdresse.replace(/\n/g, ', ')}` : ''}, lege ich gegen den oben bezeichneten Bescheid

W i d e r s p r u c h

ein.

Begründung

${f.begruendung || '[Begründung einfügen]'}

Ich beantrage, den angefochtenen Bescheid aufzuheben.

Vorsorglich beantrage ich, die aufschiebende Wirkung anzuordnen, soweit gesetzlich erforderlich.

Die anwaltliche Vertretungsvollmacht wird anwaltlich versichert; sie wird auf Verlangen nachgereicht.

${SIGN_OFF}
`,
  },

  // ---------------------------------------------------------------------
  {
    id: 'mahnschreiben',
    title: 'Anwaltliches Mahnschreiben',
    description: 'Letzte außergerichtliche Aufforderung zur Zahlung mit Fristsetzung.',
    useCase: 'Mandant:in hat eine fällige Forderung, Schuldner:in zahlt trotz Mahnung nicht. Vor Mahnverfahren / Klage.',
    fields: [
      { id: 'schuldner', label: 'Schuldner:in', type: 'text', required: true },
      { id: 'mandant', label: 'Mandant:in (Gläubiger:in)', type: 'text', required: true },
      { id: 'betrag', label: 'Forderungsbetrag (€)', type: 'text', required: true, placeholder: '1.234,56' },
      { id: 'rechnung', label: 'Rechnung / Vertrag (Bezug)', type: 'text', placeholder: 'Rechnung Nr. 2025-042 vom 12.01.2025' },
      { id: 'faelligkeit', label: 'Ursprüngliche Fälligkeit', type: 'date' },
      { id: 'frist', label: 'Zahlungsfrist (z. B. „14 Tage")', type: 'text', required: true, placeholder: '14 Tage' },
      { id: 'verzugszinsen', label: 'Verzugszinsen-Hinweis aufnehmen?', type: 'text', placeholder: 'ja / nein' },
    ],
    render: f => `An ${f.schuldner || '[Schuldner:in]'}

Mahnschreiben
in der Sache ${f.mandant || '[Mandant:in]'} ./. ${f.schuldner || '[Schuldner:in]'}

Sehr geehrte Damen und Herren,

ich zeige an, dass mich Frau/Herr ${f.mandant || '[Mandant:in]'} mit der Wahrnehmung ihrer/seiner Interessen beauftragt hat. Die anwaltliche Vertretungsvollmacht wird anwaltlich versichert.

Bezug: ${f.rechnung || '[Rechnung/Vertrag]'}
Ursprüngliche Fälligkeit: ${f.faelligkeit || '—'}
Offener Betrag: € ${f.betrag || '[Betrag]'}

Trotz Fälligkeit ist die o. g. Forderung bislang nicht ausgeglichen. Ich fordere Sie hiermit letztmalig auf, den ausstehenden Betrag

binnen ${f.frist || '14 Tagen'} ab Zugang dieses Schreibens

auf das nachstehende Konto meiner Mandantschaft zu zahlen.

${(f.verzugszinsen || '').toLowerCase().startsWith('ja') ? 'Auf den Anfall von Verzugszinsen gem. § 288 BGB sowie auf die Pflicht zur Übernahme der durch den Verzug entstandenen Rechtsverfolgungskosten weise ich vorsorglich hin.\n\n' : ''}Sollte die Zahlung nicht fristgerecht eingehen, werden ohne weitere Ankündigung gerichtliche Schritte eingeleitet — insbesondere Antrag auf Erlass eines Mahnbescheids gem. §§ 688 ff. ZPO, andernfalls Klageerhebung.

${SIGN_OFF}
`,
  },

  // ---------------------------------------------------------------------
  {
    id: 'mandatsanzeige',
    title: 'Mandatsanzeige (Bestellungsanzeige)',
    description: 'Anzeige der eigenen Mandatsübernahme gegenüber Behörde / Gegenseite.',
    useCase: 'Erste Kommunikation an Gegenseite — „ich vertrete jetzt diese Person, schreiben Sie an mich".',
    fields: [
      { id: 'recipient', label: 'Empfänger:in', type: 'text', required: true },
      { id: 'mandant', label: 'Mandant:in', type: 'text', required: true },
      { id: 'aktenzeichen', label: 'Aktenzeichen Gegenseite (sofern bekannt)', type: 'text' },
      { id: 'sache', label: 'In der Sache (kurz)', type: 'text', required: true, placeholder: 'wegen Räumungsklage' },
    ],
    render: f => `An ${f.recipient || '[Empfänger:in]'}

Mandatsanzeige
in der Sache ${f.mandant || '[Mandant:in]'}${f.sache ? ` ${f.sache}` : ''}${f.aktenzeichen ? `\nIhr Az.: ${f.aktenzeichen}` : ''}

Sehr geehrte Damen und Herren,

namens und im Auftrag von Frau/Herr ${f.mandant || '[Mandant:in]'} zeige ich an, dass mich diese mit der Wahrnehmung ihrer/seiner rechtlichen Interessen beauftragt hat. Die anwaltliche Vertretungsvollmacht wird anwaltlich versichert; sie wird auf Verlangen nachgereicht.

Ich bitte, jeglichen weiteren Schriftwechsel ausschließlich mit mir zu führen und mir Akteneinsicht zu gewähren, soweit dies verfahrensrechtlich vorgesehen ist.

${SIGN_OFF}
`,
  },

  // ---------------------------------------------------------------------
  {
    id: 'akteneinsicht',
    title: 'Antrag auf Akteneinsicht',
    description: 'Nach § 147 StPO (Strafverfahren) oder § 29 VwVfG (Verwaltung).',
    useCase: 'Mandant:in ist Beschuldigte:r oder Beteiligte:r — Aktenstand muss geprüft werden.',
    fields: [
      { id: 'recipient', label: 'Empfänger:in (Gericht / StA / Behörde)', type: 'text', required: true },
      { id: 'mandant', label: 'Mandant:in', type: 'text', required: true },
      { id: 'aktenzeichen', label: 'Aktenzeichen der Behörde', type: 'text', required: true },
      { id: 'rolle', label: 'Rolle der Mandantschaft', type: 'text', required: true, placeholder: 'Beschuldigte:r / Geschädigte:r / Beteiligte:r' },
      { id: 'rechtsgrundlage', label: 'Rechtsgrundlage', type: 'text', placeholder: '§ 147 StPO / § 406e StPO / § 29 VwVfG' },
    ],
    render: f => `An ${f.recipient || '[Empfänger:in]'}

Antrag auf Akteneinsicht
in der Sache ${f.mandant || '[Mandant:in]'}, Az. ${f.aktenzeichen || '[Aktenzeichen]'}

Sehr geehrte Damen und Herren,

namens und im Auftrag von Frau/Herr ${f.mandant || '[Mandant:in]'} (${f.rolle || '[Rolle]'}) beantrage ich

A k t e n e i n s i c h t

gem. ${f.rechtsgrundlage || '§ 147 StPO ggf. § 406e StPO bzw. § 29 VwVfG'}.

Ich bitte um Übersendung der vollständigen Akte in elektronischer Form an mich oder hilfsweise um Mitteilung eines Termins für Einsicht in den Räumlichkeiten der Behörde.

Die anwaltliche Vertretungsvollmacht wird anwaltlich versichert.

${SIGN_OFF}
`,
  },
]

export function getLawyerTemplate(id: string): LawyerTemplate | undefined {
  return LAWYER_TEMPLATES.find(t => t.id === id)
}

/**
 * Notariats-Vorlagen (für Werner Gniosdorz & ähnliche Erbrecht/Immobilien-Schwerpunkte).
 *
 * Hinweis: Diese sind ENTWURFSVORLAGEN, keine geprüften Formulare. Vollmachten
 * und Erbausschlagungen sind formal heikel — zur echten Beurkundung braucht
 * es weiterhin das Notariat. Diese Templates sparen nur die Entwurfsphase.
 */
export const NOTAR_TEMPLATES: LawyerTemplate[] = [
  {
    id: 'vollmacht_allgemein',
    title: 'Vorsorgevollmacht (Entwurf)',
    description: 'Allgemeine Vorsorgevollmacht für gesundheitliche/vermögensrechtliche Angelegenheiten.',
    useCase: 'Mandant:in möchte eine bevollmächtigte Person für den Fall von Geschäftsunfähigkeit bestimmen. ENTWURF — Beurkundung erforderlich bei Grundstücksbezug.',
    fields: [
      { id: 'vollmachtgeber', label: 'Vollmachtgeber:in (Name)', type: 'text', required: true },
      { id: 'geboren', label: 'Geburtsdatum Vollmachtgeber:in', type: 'date', required: true },
      { id: 'anschrift', label: 'Anschrift Vollmachtgeber:in', type: 'textarea', required: true },
      { id: 'bevollmaechtigter', label: 'Bevollmächtigte:r (Name)', type: 'text', required: true },
      { id: 'bevGeboren', label: 'Geburtsdatum Bevollmächtigte:r', type: 'date' },
      { id: 'bevAnschrift', label: 'Anschrift Bevollmächtigte:r', type: 'textarea' },
      { id: 'umfang', label: 'Umfang', type: 'textarea', placeholder: 'z. B. Vermögenssorge, Gesundheitssorge, Aufenthaltsbestimmung' },
    ],
    render: f => `Vorsorgevollmacht

Ich, ${f.vollmachtgeber || '[Name]'}, geboren am ${f.geboren || '[Datum]'}, wohnhaft${f.anschrift ? ` ${f.anschrift.replace(/\n/g, ', ')}` : ' [Anschrift]'},

erteile hiermit

Vollmacht

an ${f.bevollmaechtigter || '[Bevollmächtigte:r]'}${f.bevGeboren ? `, geboren am ${f.bevGeboren}` : ''}${f.bevAnschrift ? `, wohnhaft ${f.bevAnschrift.replace(/\n/g, ', ')}` : ''},

mich in allen Angelegenheiten zu vertreten, und zwar insbesondere in folgenden Bereichen:

${f.umfang || '— Gesundheitssorge (Einwilligung in ärztliche Maßnahmen inklusive freiheitsentziehender Maßnahmen nach § 1906 BGB)\n— Vermögenssorge (Bankgeschäfte, Verwaltung von Vermögen, Abschluss und Auflösung von Verträgen)\n— Aufenthaltsbestimmung (Wohnen, Heimunterbringung)\n— Behördengänge und Korrespondenz'}

Die Vollmacht soll auch über den Tod hinaus gelten. Die bevollmächtigte Person ist von den Beschränkungen des § 181 BGB befreit.

Diese Vollmacht ist mit sofortiger Wirkung anzuwenden, ungeachtet meiner Geschäftsfähigkeit.

____________________________
Ort, Datum

____________________________
Unterschrift Vollmachtgeber:in

Hinweis: Für Grundstücks- und Handelsregister-Sachen ist notarielle Beurkundung (§ 29 GBO, § 12 HGB) erforderlich.
`,
  },

  {
    id: 'erbausschlagung',
    title: 'Erbausschlagungserklärung (Entwurf)',
    description: 'Gegenüber dem Nachlassgericht. 6-Wochen-Frist ab Kenntnis vom Erbfall beachten!',
    useCase: 'Mandant:in möchte die Erbschaft ausschlagen (z. B. wegen Überschuldung). Frist § 1944 BGB streng!',
    fields: [
      { id: 'nachlassgericht', label: 'Nachlassgericht', type: 'text', required: true, placeholder: 'Amtsgericht Berlin-Schöneberg, Nachlassabteilung' },
      { id: 'erklaerender', label: 'Erklärende:r (Name)', type: 'text', required: true },
      { id: 'erklaerAnschrift', label: 'Anschrift Erklärende:r', type: 'textarea' },
      { id: 'erblasser', label: 'Erblasser:in (Name)', type: 'text', required: true },
      { id: 'erbGeboren', label: 'Geburtsdatum Erblasser:in', type: 'date' },
      { id: 'sterbeDatum', label: 'Sterbedatum', type: 'date', required: true },
      { id: 'sterbeOrt', label: 'Sterbeort', type: 'text' },
      { id: 'kenntnisDatum', label: 'Kenntnis vom Erbfall (Fristbeginn)', type: 'date', required: true },
      { id: 'verwandtschaft', label: 'Verwandtschaftsverhältnis', type: 'text', required: true, placeholder: 'z. B. „als Tochter (§ 1924 BGB)"' },
      { id: 'grund', label: 'Kurzbegründung (optional)', type: 'textarea', placeholder: 'z. B. Überschuldung' },
    ],
    render: f => `An ${f.nachlassgericht || '[Nachlassgericht]'}

Erbausschlagungserklärung
in der Nachlasssache ${f.erblasser || '[Erblasser:in]'}${f.erbGeboren ? `, geboren am ${f.erbGeboren}` : ''}, verstorben am ${f.sterbeDatum || '[Sterbedatum]'}${f.sterbeOrt ? ` in ${f.sterbeOrt}` : ''}

Sehr geehrte Damen und Herren,

namens und im Auftrag meiner Mandantschaft, ${f.erklaerender || '[Erklärende:r]'}${f.erklaerAnschrift ? `, wohnhaft ${f.erklaerAnschrift.replace(/\n/g, ', ')}` : ''} — ${f.verwandtschaft || '[Verwandtschaftsverhältnis]'} —

erkläre ich hiermit gegenüber dem Nachlassgericht die

A u s s c h l a g u n g

der Erbschaft nach der/dem o.g. Erblasser:in gem. § 1942 BGB. Die Ausschlagung erfolgt vorsorglich auch für meine Mandantschaft als Erbe:Erbin jeglicher Berufungsgründe.

Von dem Anfall der Erbschaft hat meine Mandantschaft erstmals am ${f.kenntnisDatum || '[Datum]'} Kenntnis erlangt; die Sechs-Wochen-Frist des § 1944 Abs. 1 BGB ist gewahrt.

${f.grund ? `Begründung:\n${f.grund}\n\n` : ''}Eine anwaltliche Vollmacht wird anwaltlich versichert und auf Verlangen vorgelegt.

Ich bitte um schriftliche Bestätigung der Entgegennahme.

Mit freundlichen kollegialen Grüßen

Hinweis: Die Ausschlagung bedarf für Minderjährige ggf. familiengerichtlicher Genehmigung (§ 1643 Abs. 2 BGB). Prüfung im Einzelfall!
`,
  },

  {
    id: 'pflichtteil_geltendmachung',
    title: 'Pflichtteilsgeltendmachung',
    description: 'Außergerichtliche Geltendmachung des Pflichtteilsanspruchs gegenüber dem Erben.',
    useCase: 'Mandant:in ist pflichtteilsberechtigt (§ 2303 BGB), aber nicht Erbe. Erster Schritt: Auskunft + Zahlung vom Erben fordern.',
    fields: [
      { id: 'erbe', label: 'Erbe:Erbin (Empfänger:in)', type: 'text', required: true },
      { id: 'erbeAnschrift', label: 'Anschrift Erbe:Erbin', type: 'textarea' },
      { id: 'mandant', label: 'Mandant:in (Pflichtteilsberechtigt)', type: 'text', required: true },
      { id: 'erblasser', label: 'Erblasser:in', type: 'text', required: true },
      { id: 'sterbeDatum', label: 'Sterbedatum', type: 'date', required: true },
      { id: 'verhaeltnis', label: 'Verwandtschaftsverhältnis zur Erblasser:in', type: 'text', required: true, placeholder: 'z. B. „Sohn"' },
      { id: 'frist', label: 'Frist für Auskunft (Tage)', type: 'text', placeholder: '4 Wochen' },
    ],
    render: f => `An ${f.erbe || '[Erbe:Erbin]'}${f.erbeAnschrift ? `\n${f.erbeAnschrift}` : ''}

Pflichtteilsgeltendmachung
in der Nachlasssache ${f.erblasser || '[Erblasser:in]'}, verstorben am ${f.sterbeDatum || '[Datum]'}

Sehr geehrte:r,

ich zeige an, dass mich ${f.mandant || '[Mandant:in]'} — ${f.verhaeltnis || '[Verhältnis]'} der verstorbenen Person — mit der Wahrnehmung ihrer:seiner erbrechtlichen Interessen beauftragt hat.

Meine Mandantschaft ist gesetzlich pflichtteilsberechtigt (§ 2303 BGB). Ich mache hiermit ihre:seine Ansprüche aus §§ 2303 ff. BGB Ihnen gegenüber geltend und bitte um:

1. Auskunft über den Bestand des Nachlasses (§ 2314 Abs. 1 S. 1 BGB) durch Vorlage eines vollständigen und geordneten Bestandsverzeichnisses,
2. Auskunft über unentgeltliche Zuwendungen der Erblasser:in in den letzten 10 Jahren vor dem Erbfall (§ 2325 BGB),
3. sofern streitig: Vorlage durch notarielle Urkunde auf Kosten des Nachlasses (§ 2314 Abs. 1 S. 3 BGB).

Die Auskunft bitte ich mir binnen ${f.frist || '4 Wochen'} ab Zugang dieses Schreibens zu erteilen.

Nach Erteilung der Auskunft werde ich den Pflichtteilszahlungsanspruch beziffern und gesondert geltend machen. Bereits jetzt weise ich vorsorglich auf die Verjährungshemmung durch Verhandlungen (§ 203 BGB) hin.

Eine anwaltliche Vollmacht wird anwaltlich versichert.

Mit freundlichen Grüßen
`,
  },
// ---------------------------------
  {
    id: 'erbschein_antrag',
    title: 'Antrag auf Erbschein',
    description: 'Antrag auf Erteilung eines Erbscheins gem. §§ 2353 ff. BGB beim Nachlassgericht.',
    useCase: 'Mandantschaft benötigt Legitimationsnachweis für Banken, Grundbuch oder Versicherungen. Gesetzliche oder testamentarische Erbfolge.',
    fields: [
      { id: 'nachlassgericht', label: 'Nachlassgericht', type: 'text', required: true, placeholder: 'Amtsgericht Berlin-Schöneberg, Nachlassabteilung' },
      { id: 'antragsteller', label: 'Antragsteller:in (Name)', type: 'text', required: true },
      { id: 'antragstellerAnschrift', label: 'Anschrift Antragsteller:in', type: 'textarea' },
      { id: 'erblasser', label: 'Erblasser:in (Name)', type: 'text', required: true },
      { id: 'sterbeDatum', label: 'Sterbedatum', type: 'date', required: true },
      { id: 'letzterWohnsitz', label: 'Letzter gewöhnlicher Aufenthalt', type: 'text', required: true, placeholder: 'Berlin-Charlottenburg' },
      { id: 'erbfolgeArt', label: 'Erbfolge', type: 'text', required: true, placeholder: 'gesetzlich / testamentarisch (Testament v. ...)' },
      { id: 'erbquote', label: 'Beantragte Erbquote', type: 'text', required: true, hint: 'z. B. „1/2 als überlebende Ehegattin (§ 1931 i. V. m. § 1371 BGB)"' },
    ],
    render: f => `An ${f.nachlassgericht || '[Nachlassgericht]'}

Antrag auf Erteilung eines Erbscheins
in der Nachlasssache ${f.erblasser || '[Erblasser:in]'}, verstorben am ${f.sterbeDatum || '[Sterbedatum]'}

Sehr geehrte Damen und Herren,

namens und im Auftrag meiner Mandantschaft, ${f.antragsteller || '[Antragsteller:in]'}${f.antragstellerAnschrift ? `, wohnhaft ${f.antragstellerAnschrift.replace(/\n/g, ', ')}` : ''}, beantrage ich

die Erteilung eines Erbscheins

gem. §§ 2353 ff. BGB des Inhalts, dass meine Mandantschaft die/den o. g. Erblasser:in zu ${f.erbquote || '[Quote]'} beerbt hat.

I. Angaben zum Erblasser

Letzter gewöhnlicher Aufenthalt: ${f.letzterWohnsitz || '[Wohnsitz]'}
Sterbedatum: ${f.sterbeDatum || '[Datum]'}

Die Zuständigkeit des angerufenen Nachlassgerichts ergibt sich aus § 343 Abs. 1 FamFG.

II. Erbfolge

Die Erbfolge beruht auf ${f.erbfolgeArt || '[gesetzlicher/testamentarischer Grundlage]'}. Eine andere Verfügung von Todes wegen, die der beantragten Erbfolge entgegensteht, ist meiner Mandantschaft nicht bekannt.

III. Eidesstattliche Versicherung

Meine Mandantschaft ist bereit, die nach § 352 Abs. 3 FamFG, § 2356 Abs. 2 BGB erforderliche eidesstattliche Versicherung vor dem Nachlassgericht oder einem Notar abzugeben. Ich rege an, einen entsprechenden Termin anzuberaumen bzw. die Verweisung an ein Notariat nach Wahl der Mandantschaft zuzulassen.

IV. Anlagen

— Sterbeurkunde (beglaubigte Abschrift)
— Personenstandsurkunden zum Nachweis der Verwandtschaftsverhältnisse
— ggf. Eröffnungsprotokoll und letztwillige Verfügung

Die anwaltliche Vertretungsvollmacht wird anwaltlich versichert.

${SIGN_OFF}
`,
  },

  // ---------------------------------
  {
    id: 'patientenverfuegung',
    title: 'Patientenverfügung (Entwurf)',
    description: 'Schriftliche Patientenverfügung gem. § 1827 BGB für medizinische Behandlungssituationen.',
    useCase: 'Mandantschaft möchte für den Fall der Einwilligungsunfähigkeit verbindliche Behandlungswünsche festlegen. Schriftform genügt; notarielle Beurkundung empfohlen, aber nicht zwingend.',
    fields: [
      { id: 'verfasser', label: 'Verfasser:in (Name)', type: 'text', required: true },
      { id: 'geboren', label: 'Geburtsdatum', type: 'date', required: true },
      { id: 'anschrift', label: 'Anschrift', type: 'textarea', required: true },
      { id: 'situationen', label: 'Anwendungs-Situationen', type: 'textarea', required: true, hint: 'z. B. unmittelbarer Sterbeprozess, Endstadium unheilbarer Erkrankung, schwerer Hirnschaden' },
      { id: 'massnahmen', label: 'Gewünschte / abgelehnte Maßnahmen', type: 'textarea', required: true, hint: 'künstliche Ernährung, Beatmung, Wiederbelebung, Antibiotika' },
      { id: 'schmerz', label: 'Schmerz- und Symptombehandlung', type: 'textarea', placeholder: 'Schmerzlinderung auch bei lebensverkürzender Nebenwirkung erwünscht' },
      { id: 'bevollmaechtigter', label: 'Bevollmächtigte:r / Vertrauensperson', type: 'text' },
    ],
    render: f => `Patientenverfügung
gem. § 1827 BGB

Ich, ${f.verfasser || '[Name]'}, geboren am ${f.geboren || '[Geburtsdatum]'}, wohnhaft${f.anschrift ? ` ${f.anschrift.replace(/\n/g, ', ')}` : ' [Anschrift]'},

bestimme hiermit für den Fall, dass ich meinen Willen nicht mehr wirksam erklären kann, im Voraus folgende Festlegungen zu meiner ärztlichen Behandlung:

I. Anwendungsbereich

Diese Verfügung gilt in folgenden Situationen:

${f.situationen || '[Situationen]'}

II. Behandlungswünsche

${f.massnahmen || '[Maßnahmen]'}

III. Schmerz- und Symptombehandlung

${f.schmerz || 'Ich wünsche eine fachgerechte Schmerz- und Symptomlinderung; eine möglicherweise lebensverkürzende Nebenwirkung gebräuchlicher Schmerz- und Symptommittel nehme ich in Kauf.'}

IV. Verbindlichkeit

Diese Verfügung gibt meinen ausdrücklichen Willen wieder. Die Festlegungen sind gem. § 1827 Abs. 1 S. 2 BGB unmittelbar bindend, sofern sie auf die konkrete Lebens- und Behandlungssituation zutreffen. Ich erwarte von den behandelnden Ärzt:innen und ggf. dem Betreuungsgericht, dass mein Wille beachtet wird.

V. Vertrauensperson

${f.bevollmaechtigter ? `Als Vertrauensperson, die meinem Willen Geltung verschaffen soll, benenne ich: ${f.bevollmaechtigter}. Eine gesonderte Vorsorgevollmacht wird/wurde erteilt.` : 'Eine gesonderte Vorsorgevollmacht wird empfohlen.'}

Mir ist bewusst, dass ich diese Verfügung jederzeit formlos widerrufen kann (§ 1827 Abs. 1 S. 1 BGB).

____________________________
Ort, Datum

____________________________
Unterschrift

Hinweis: Die Schriftform genügt (§ 1827 Abs. 1 BGB). Eine notarielle Beurkundung ist nicht erforderlich, aber zur Beweissicherung sinnvoll. Regelmäßige Aktualisierung (alle 1–2 Jahre) wird empfohlen.
`,
  },

  // ---------------------------------
  {
    id: 'testamentseroeffnung_antrag',
    title: 'Antrag auf Testamentseröffnung',
    description: 'Anregung der Eröffnung einer letztwilligen Verfügung gem. §§ 348 ff. FamFG.',
    useCase: 'Eine letztwillige Verfügung ist im Besitz der Mandantschaft oder bei Dritten und muss dem Nachlassgericht zur Eröffnung vorgelegt werden.',
    fields: [
      { id: 'nachlassgericht', label: 'Nachlassgericht', type: 'text', required: true, placeholder: 'Amtsgericht Berlin-Schöneberg, Nachlassabteilung' },
      { id: 'einreicher', label: 'Einreicher:in (Mandantschaft)', type: 'text', required: true },
      { id: 'verhaeltnis', label: 'Verhältnis zur Erblasserin / zum Erblasser', type: 'text', placeholder: 'Tochter / Testamentsvollstrecker / Verwahrer' },
      { id: 'erblasser', label: 'Erblasser:in', type: 'text', required: true },
      { id: 'sterbeDatum', label: 'Sterbedatum', type: 'date', required: true },
      { id: 'letzterWohnsitz', label: 'Letzter gewöhnlicher Aufenthalt', type: 'text', required: true },
      { id: 'urkundenArt', label: 'Art der Verfügung', type: 'text', required: true, placeholder: 'eigenhändiges Testament v. ... / Erbvertrag URNr. ...' },
      { id: 'verwahrung', label: 'Bisherige Verwahrung', type: 'textarea', placeholder: 'in den persönlichen Unterlagen der Erblasserin aufgefunden' },
    ],
    render: f => `An ${f.nachlassgericht || '[Nachlassgericht]'}

Vorlage einer letztwilligen Verfügung — Anregung der Eröffnung
in der Nachlasssache ${f.erblasser || '[Erblasser:in]'}, verstorben am ${f.sterbeDatum || '[Sterbedatum]'}

Sehr geehrte Damen und Herren,

namens und im Auftrag meiner Mandantschaft, ${f.einreicher || '[Einreicher:in]'}${f.verhaeltnis ? ` (${f.verhaeltnis})` : ''}, überreiche ich anliegend in Erfüllung der Ablieferungspflicht gem. § 2259 Abs. 1 BGB die nachfolgend bezeichnete Urkunde mit der Bitte um Eröffnung gem. §§ 348 ff. FamFG.

I. Angaben zum Erblasser

Letzter gewöhnlicher Aufenthalt: ${f.letzterWohnsitz || '[Wohnsitz]'}
Sterbedatum: ${f.sterbeDatum || '[Datum]'}

Die Zuständigkeit ergibt sich aus § 343 Abs. 1 FamFG.

II. Vorgelegte Urkunde

${f.urkundenArt || '[Art der Verfügung]'}

Bisherige Verwahrung: ${f.verwahrung || '—'}

III. Anträge

Ich rege an,
1. die vorgelegte Verfügung zu eröffnen (§§ 348, 349 FamFG),
2. den gesetzlichen und ggf. testamentarisch berufenen Beteiligten beglaubigte Abschriften des Eröffnungsprotokolls und der Verfügung gem. § 348 Abs. 3 FamFG zu übersenden,
3. mir als Bevollmächtigter eine Mehrfertigung zu meinen Akten zukommen zu lassen.

Anlagen:
— Sterbeurkunde (beglaubigte Abschrift)
— Letztwillige Verfügung im Original
— Vollmacht wird anwaltlich versichert

${SIGN_OFF}
`,
  },

  // ---------------------------------
  {
    id: 'beurkundungs_vorbereitung',
    title: 'Anschreiben Beurkundungstermin',
    description: 'Vorbereitendes Anschreiben mit Ankündigung des Beurkundungs-Gegenstands und der Beteiligten.',
    useCase: 'Zur Vorbereitung eines Beurkundungstermins (§§ 6 ff. BeurkG) — Bestätigung des Termins, Übersendung des Entwurfs und Belehrung über die 14-Tage-Frist bei Verbraucherbeteiligung (§ 17 Abs. 2a BeurkG).',
    fields: [
      { id: 'empfaenger', label: 'Empfänger:in (Beteiligte:r)', type: 'text', required: true },
      { id: 'empfAnschrift', label: 'Anschrift Empfänger:in', type: 'textarea' },
      { id: 'gegenstand', label: 'Beurkundungs-Gegenstand', type: 'text', required: true, placeholder: 'Grundstückskaufvertrag / Übergabevertrag / Eheversprechen' },
      { id: 'weitereBeteiligte', label: 'Weitere Beteiligte', type: 'textarea', placeholder: 'Name, Rolle (Verkäufer:in / Käufer:in / Gläubiger:in)' },
      { id: 'terminDatum', label: 'Vorgeschlagener Termin (Datum)', type: 'date', required: true },
      { id: 'terminUhrzeit', label: 'Uhrzeit', type: 'text', placeholder: '10:30 Uhr' },
      { id: 'unterlagen', label: 'Mitzubringende Unterlagen', type: 'textarea', placeholder: 'Personalausweis, Steuer-ID, Grundbuchauszug' },
    ],
    render: f => `An ${f.empfaenger || '[Empfänger:in]'}${f.empfAnschrift ? `\n${f.empfAnschrift}` : ''}

Vorbereitung Beurkundungstermin
${f.gegenstand ? `Gegenstand: ${f.gegenstand}` : ''}

Sehr geehrte:r ${f.empfaenger || '[Empfänger:in]'},

ich darf den vorgesehenen Beurkundungstermin in der oben bezeichneten Sache wie folgt bestätigen:

Termin: ${f.terminDatum || '[Datum]'}${f.terminUhrzeit ? `, ${f.terminUhrzeit}` : ''}
Ort: in den Geschäftsräumen des Notariats

Beteiligte:
${f.weitereBeteiligte || '— wie gesondert mitgeteilt —'}

I. Übersendung des Entwurfs

Anliegend übersende ich Ihnen den vollständigen Entwurf der zu beurkundenden Urkunde zur Vorprüfung. Ich bitte, den Entwurf in Ruhe durchzusehen und Rückfragen vorab — gern fernmündlich oder per E-Mail — an mich zu richten.

II. Hinweis auf die Regelfrist (§ 17 Abs. 2a BeurkG)

Sofern auf Seiten eines Beteiligten Verbrauchereigenschaft vorliegt, soll der Entwurf in der Regel zwei Wochen vor der Beurkundung zur Verfügung stehen. Diese Frist dient dem Schutz der ausreichenden Vorbereitung; auf eine Verkürzung kann nur in begründeten Einzelfällen verzichtet werden.

III. Mitzubringende Unterlagen

${f.unterlagen || '— Personalausweis oder Reisepass\n— Steuer-Identifikationsnummer\n— ggf. weitere Urkunden nach gesonderter Anforderung'}

IV. Belehrung

Auf die notarielle Belehrungs- und Hinweispflicht (§ 17 Abs. 1 BeurkG) wird im Termin selbst eingegangen. Die Beurkundung erfolgt durch Verlesung, Genehmigung und Unterzeichnung gem. § 13 BeurkG.

Bei Verhinderung bitte ich um umgehende Mitteilung, damit ein Ersatztermin abgestimmt werden kann.

Mit freundlichen Grüßen
`,
  },

  // ---------------------------------
  {
    id: 'grundschuld_bestellung',
    title: 'Grundschuldbestellung (Entwurf)',
    description: 'Entwurf einer Grundschuldbestellungsurkunde mit Unterwerfungsklausel zur notariellen Beurkundung.',
    useCase: 'Mandantschaft (Eigentümer:in) bestellt zugunsten einer Bank eine Grundschuld zur Besicherung eines Darlehens. Beurkundung gem. § 873 BGB i. V. m. § 29 GBO erforderlich.',
    fields: [
      { id: 'eigentuemer', label: 'Eigentümer:in / Besteller:in', type: 'text', required: true },
      { id: 'eigentuemerAnschrift', label: 'Anschrift Eigentümer:in', type: 'textarea' },
      { id: 'glaeubiger', label: 'Gläubigerin (Bank)', type: 'text', required: true, placeholder: 'Berliner Sparkasse, NL der LBB AöR' },
      { id: 'grundbuch', label: 'Grundbuch (Amtsgericht, Bezirk, Blatt)', type: 'text', required: true, placeholder: 'AG Charlottenburg, Grundbuch von Wilmersdorf, Blatt 12345' },
      { id: 'flurstueck', label: 'Flurstück / lfd. Nr. BV', type: 'text', required: true },
      { id: 'betrag', label: 'Grundschuldbetrag (€)', type: 'text', required: true, placeholder: '350.000,00' },
      { id: 'zinssatz', label: 'Grundschuldzinssatz (% p. a.)', type: 'text', placeholder: '15' },
      { id: 'nebenleistung', label: 'Einmalige Nebenleistung (%)', type: 'text', placeholder: '5' },
    ],
    render: f => `Grundschuldbestellung
— Entwurf zur notariellen Beurkundung —

Beteiligte:
Besteller:in: ${f.eigentuemer || '[Eigentümer:in]'}${f.eigentuemerAnschrift ? `, wohnhaft ${f.eigentuemerAnschrift.replace(/\n/g, ', ')}` : ''}
Gläubigerin: ${f.glaeubiger || '[Bank]'}

I. Grundbesitz

Im Grundbuch ${f.grundbuch || '[Grundbuchstelle]'}, BV-Nr. ${f.flurstueck || '[Flurstück]'}, ist die Besteller:in als Eigentümer:in eingetragen.

II. Grundschuldbestellung

Die Besteller:in bestellt hiermit zugunsten der o. g. Gläubigerin an dem vorbezeichneten Grundbesitz eine

Buchgrundschuld

ohne Brief in Höhe von € ${f.betrag || '[Betrag]'} (in Worten: [Betrag in Worten] Euro), verzinslich mit ${f.zinssatz || '15'} % jährlich seit Bestellung, zuzüglich einer einmaligen Nebenleistung von ${f.nebenleistung || '5'} % des Grundschuldkapitals.

Die Grundschuld ist sofort fällig und kann ohne vorherige Kündigung in Anspruch genommen werden.

III. Rangbestimmung

Die Grundschuld soll im Grundbuch an nächstoffener Rangstelle eingetragen werden. Vorgehende oder gleichrangige Eintragungen werden ausgeschlossen, soweit sie nicht in dieser Urkunde ausdrücklich bewilligt sind.

IV. Zwangsvollstreckungsunterwerfung (§ 794 Abs. 1 Nr. 5 ZPO)

Die Besteller:in unterwirft sich wegen des Grundschuldkapitals nebst Zinsen und Nebenleistung der sofortigen Zwangsvollstreckung in den belasteten Grundbesitz dergestalt, dass die Zwangsvollstreckung aus dieser Urkunde gegen den jeweiligen Eigentümer zulässig ist.

Persönliche Schuldhaftung wird in gesonderter Urkunde übernommen.

V. Bewilligung und Antrag

Die Besteller:in bewilligt und beantragt die Eintragung der vorstehenden Grundschuld nebst Vollstreckungsklausel im Grundbuch.

VI. Vollzugsvollmacht

Die Besteller:in bevollmächtigt die Notariatsangestellten, alle zur Eintragung erforderlichen Erklärungen abzugeben und entgegenzunehmen, insbesondere Rangänderungen zu erklären, Anträge zu stellen und zurückzunehmen.

____________________________
Ort, Datum — Beurkundung erforderlich (§ 873 BGB, § 29 GBO)

Hinweis: Dieser Entwurf bedarf der notariellen Beurkundung. Verbraucherbeteiligung: Regelfrist von zwei Wochen gem. § 17 Abs. 2a BeurkG beachten.
`,
  },

  // ---------------------------------
  {
    id: 'schenkungsvertrag_entwurf',
    title: 'Schenkungsvertrag (Entwurf)',
    description: 'Entwurf eines Schenkungsvertrags, insbesondere für Generationenübergang Immobilie mit Pflichtteilsanrechnung.',
    useCase: 'Mandantschaft möchte zu Lebzeiten Vermögen (typisch: Immobilie) an Kinder übertragen. Bei Grundstücken zwingend notarielle Beurkundung gem. § 311b Abs. 1 BGB; Schenkungsversprechen gem. § 518 BGB ebenfalls beurkundungsbedürftig.',
    fields: [
      { id: 'schenker', label: 'Schenker:in', type: 'text', required: true },
      { id: 'schenkerAnschrift', label: 'Anschrift Schenker:in', type: 'textarea' },
      { id: 'beschenkter', label: 'Beschenkte:r', type: 'text', required: true },
      { id: 'beschenkterAnschrift', label: 'Anschrift Beschenkte:r', type: 'textarea' },
      { id: 'gegenstand', label: 'Schenkungsgegenstand', type: 'textarea', required: true, placeholder: 'Grundbesitz Berlin-Pankow, Grundbuch ..., Blatt ...' },
      { id: 'gegenleistung', label: 'Auflagen / Gegenleistungen', type: 'textarea', placeholder: 'Wohnungsrecht, Pflegeleistung, Leibrente' },
      { id: 'pflichtteilAnrechnung', label: 'Pflichtteilsanrechnung gewünscht?', type: 'text', placeholder: 'ja / nein' },
      { id: 'rueckforderung', label: 'Rückforderungsrechte', type: 'textarea', placeholder: 'Vorversterben, Insolvenz, Scheidung der/des Beschenkten' },
    ],
    render: f => `Schenkungsvertrag
— Entwurf zur notariellen Beurkundung —

zwischen

${f.schenker || '[Schenker:in]'}${f.schenkerAnschrift ? `, ${f.schenkerAnschrift.replace(/\n/g, ', ')}` : ''}
— nachfolgend „Schenker:in" —

und

${f.beschenkter || '[Beschenkte:r]'}${f.beschenkterAnschrift ? `, ${f.beschenkterAnschrift.replace(/\n/g, ', ')}` : ''}
— nachfolgend „Beschenkte:r" —

§ 1 Schenkungsgegenstand

Die Schenker:in überträgt der/dem Beschenkten unentgeltlich aus dem Stamm ihres Vermögens:

${f.gegenstand || '[Schenkungsgegenstand]'}

§ 2 Übertragung / Auflassung

${/(grund|immob|haus|wohnung|flurstück)/i.test(f.gegenstand || '') ? 'Die Vertragsparteien sind sich über den Eigentumsübergang einig (Auflassung, § 925 BGB). Sie bewilligen und beantragen die Eintragung des Eigentumswechsels im Grundbuch. Der Übergang von Besitz, Nutzungen, Lasten und Gefahr erfolgt mit Beurkundung dieses Vertrages, soweit nicht abweichend geregelt.' : 'Die Übertragung erfolgt mit Annahme der Schenkung; Übergabe ist erfolgt bzw. erfolgt mit Beurkundung dieser Urkunde.'}

§ 3 Auflagen / Gegenleistungen

${f.gegenleistung || 'Die Schenkung erfolgt ohne Auflagen.'}

§ 4 Pflichtteilsanrechnung (§ 2315 BGB)

${(f.pflichtteilAnrechnung || '').toLowerCase().startsWith('ja')
  ? 'Die Schenker:in bestimmt hiermit, dass die/der Beschenkte sich den Wert der vorstehenden Zuwendung auf einen ihm/ihr etwa zustehenden Pflichtteil nach der Schenker:in anrechnen lassen muss (§ 2315 BGB). Maßgeblich ist der Wert im Zeitpunkt der Schenkung.'
  : 'Eine Pflichtteilsanrechnung gem. § 2315 BGB wird nicht angeordnet. Auf die Folge, dass die Schenkung gem. § 2325 BGB nur abschmelzend pflichtteilsergänzungsrelevant ist (Zehnjahresfrist, beginnend mit Vollzug nach § 2325 Abs. 3 BGB), wird hingewiesen.'}

§ 5 Rückforderungsrechte

${f.rueckforderung || 'Die Schenker:in behält sich Rückforderungsrechte für die Fälle des Vorversterbens der/des Beschenkten, der Eröffnung des Insolvenzverfahrens über deren/dessen Vermögen sowie der Einleitung der Zwangsvollstreckung in den Schenkungsgegenstand vor.'}

§ 6 Steuern, Kosten

Die Beschenkte:r trägt die Kosten dieser Urkunde sowie etwaige Schenkungsteuer (ErbStG). Die Schenker:in wird auf die Anzeigepflicht nach § 30 ErbStG hingewiesen.

§ 7 Hinweise

Auf die Beurkundungsbedürftigkeit (§ 311b Abs. 1 BGB für Grundstücke; § 518 Abs. 1 BGB für das Schenkungsversprechen) wird hingewiesen. Die Belehrung über die Folgen des Vertrages erfolgt im Beurkundungstermin (§ 17 Abs. 1 BeurkG).

____________________________
Ort, Datum — Beurkundung erforderlich

Hinweis: Bei Grundstücksschenkung zwingend notarielle Beurkundung. Heilung formloser Schenkungen erst durch Vollzug (§ 518 Abs. 2 BGB).
`,
  },

  // ---------------------------------
  {
    id: 'eheaufhebung_antrag',
    title: 'Antrag auf Eheaufhebung',
    description: 'Antrag auf Aufhebung der Ehe gem. §§ 1313 ff. BGB (Aufhebungsgründe nach § 1314 BGB).',
    useCase: 'Spezialisierter Antrag, wenn die Ehe an einem Aufhebungsgrund leidet (z. B. Geschäftsunfähigkeit bei Eheschließung, arglistige Täuschung, Drohung, Scheinehe). Abzugrenzen von der Scheidung (§ 1565 BGB).',
    fields: [
      { id: 'familiengericht', label: 'Familiengericht', type: 'text', required: true, placeholder: 'Amtsgericht — Familiengericht — Berlin-Pankow' },
      { id: 'antragsteller', label: 'Antragsteller:in', type: 'text', required: true },
      { id: 'antragsgegner', label: 'Antragsgegner:in', type: 'text', required: true },
      { id: 'eheschliessungDatum', label: 'Eheschließung (Datum)', type: 'date', required: true },
      { id: 'eheschliessungOrt', label: 'Eheschließung (Standesamt / Ort)', type: 'text', required: true },
      { id: 'aufhebungsgrund', label: 'Aufhebungsgrund (§ 1314 BGB)', type: 'text', required: true, placeholder: '§ 1314 Abs. 2 Nr. 3 BGB — arglistige Täuschung' },
      { id: 'sachverhalt', label: 'Sachverhalt', type: 'textarea', required: true, hint: 'Knappe, prozessuale Schilderung mit Tatzeitpunkt und Kenntnis (Jahresfrist § 1317 BGB!)' },
    ],
    render: f => `An ${f.familiengericht || '[Familiengericht]'}

Antrag auf Eheaufhebung
in der Familiensache ${f.antragsteller || '[Antragsteller:in]'} ./. ${f.antragsgegner || '[Antragsgegner:in]'}

Sehr geehrte Damen und Herren,

namens und im Auftrag meiner Mandantschaft, ${f.antragsteller || '[Antragsteller:in]'} — Antragsteller:in —, beantrage ich,

die zwischen den Beteiligten am ${f.eheschliessungDatum || '[Datum]'} vor dem ${f.eheschliessungOrt || '[Standesamt]'} geschlossene Ehe gem. §§ 1313, 1314 BGB aufzuheben.

Hilfsweise rege ich die Verfahrensverbindung mit einem etwaigen Scheidungsverfahren an.

I. Verfahrensrechtliches

Die Zuständigkeit des angerufenen Gerichts ergibt sich aus § 122 FamFG. Die Anwaltspflicht (§ 114 FamFG) ist gewahrt.

II. Aufhebungsgrund

${f.aufhebungsgrund || '[Aufhebungsgrund]'}

III. Sachverhalt

${f.sachverhalt || '[Sachverhalt]'}

Die Jahresfrist des § 1317 Abs. 1 BGB ist gewahrt; meine Mandantschaft hat erstmals zu dem im Sachverhalt genannten Zeitpunkt von dem Aufhebungsgrund Kenntnis erlangt. Eine Bestätigung der Ehe i. S. d. § 1315 Abs. 1 BGB ist nicht erfolgt.

IV. Rechtsfolgen

Auf die Rechtsfolgenverweisung des § 1318 BGB (Modifikation der Scheidungsfolgenvorschriften) wird hingewiesen. Die Regelung zum Versorgungsausgleich, Unterhalt und Güterrecht bleibt ggf. gesondertem Antrag vorbehalten.

V. Anträge

1. Die zwischen den Beteiligten geschlossene Ehe wird aufgehoben.
2. Die Kosten des Verfahrens werden der Antragsgegner:in auferlegt.

Anlagen:
— Eheurkunde (beglaubigte Abschrift)
— Nachweise zum Aufhebungsgrund

Die anwaltliche Vertretungsvollmacht wird anwaltlich versichert.

${SIGN_OFF}
`,
  },

  // ---------------------------------
  {
    id: 'generalvollmacht',
    title: 'General- und Vorsorgevollmacht (Entwurf)',
    description: 'Umfassende Generalvollmacht mit Vorsorgekomponente — über die einfache Vorsorgevollmacht hinausgehend.',
    useCase: 'Mandantschaft möchte einer Vertrauensperson eine umfassende Vertretungsmacht in allen vermögens-, gesundheits- und persönlichen Angelegenheiten erteilen. Für Grundstücks- und Handelsregistersachen ist notarielle Beglaubigung/Beurkundung erforderlich.',
    fields: [
      { id: 'vollmachtgeber', label: 'Vollmachtgeber:in', type: 'text', required: true },
      { id: 'geboren', label: 'Geburtsdatum', type: 'date', required: true },
      { id: 'anschrift', label: 'Anschrift Vollmachtgeber:in', type: 'textarea', required: true },
      { id: 'bevollmaechtigter', label: 'Bevollmächtigte:r', type: 'text', required: true },
      { id: 'bevAnschrift', label: 'Anschrift Bevollmächtigte:r', type: 'textarea' },
      { id: 'ersatz', label: 'Ersatzbevollmächtigte:r', type: 'text', placeholder: 'für den Fall der Verhinderung' },
      { id: 'ausnahmen', label: 'Ausnahmen vom Vollmachtsumfang', type: 'textarea', placeholder: 'z. B. keine Schenkungen über 5.000 €' },
    ],
    render: f => `General- und Vorsorgevollmacht

Ich, ${f.vollmachtgeber || '[Vollmachtgeber:in]'}, geboren am ${f.geboren || '[Datum]'}, wohnhaft${f.anschrift ? ` ${f.anschrift.replace(/\n/g, ', ')}` : ' [Anschrift]'},

erteile hiermit

${f.bevollmaechtigter || '[Bevollmächtigte:r]'}${f.bevAnschrift ? `, ${f.bevAnschrift.replace(/\n/g, ', ')}` : ''},

— nachfolgend „Bevollmächtigte:r" —

uneingeschränkte General- und Vorsorgevollmacht, mich in allen persönlichen, gesundheitlichen und vermögensrechtlichen Angelegenheiten gerichtlich und außergerichtlich umfassend zu vertreten.

I. Umfang der Vermögenssorge

Die Vollmacht umfasst insbesondere:
— Verwaltung und Verfügung über Vermögensgegenstände jeder Art, einschließlich Grundbesitz und Gesellschaftsbeteiligungen,
— Vornahme aller Bankgeschäfte und Verfügung über Kontoguthaben,
— Eingehung und Beendigung von Verbindlichkeiten und Verträgen aller Art,
— Vertretung gegenüber Behörden, Gerichten, Versicherungen und sonstigen Dritten,
— Annahme und Ausschlagung von Erbschaften (§§ 1942 ff. BGB),
— Erklärungen im Grundbuchverfahren (§ 29 GBO) und Handelsregisterverfahren (§ 12 HGB).

II. Umfang der Gesundheitssorge / Personensorge

Die Vollmacht umfasst:
— Einwilligung, Nichteinwilligung und Widerruf der Einwilligung in alle ärztlichen Maßnahmen, einschließlich solcher mit erheblichem Risiko (§ 1829 BGB),
— Entscheidung über freiheitsentziehende Maßnahmen i. S. d. § 1831 BGB,
— Entscheidung über Aufenthalt, Wohnung und ggf. Heimunterbringung,
— Vertretung gegenüber Ärzt:innen, Pflegeeinrichtungen, Krankenkassen, Sozialversicherungsträgern.

Eine etwaige Patientenverfügung gem. § 1827 BGB ist gesondert zu beachten und geht den Entscheidungen der/des Bevollmächtigten vor.

III. Innenverhältnis und Befreiungen

Die Bevollmächtigte:r ist von den Beschränkungen des § 181 BGB befreit. Die Vollmacht gilt mit sofortiger Wirkung, ungeachtet der Geschäftsfähigkeit der Vollmachtgeber:in, und über deren Tod hinaus (transmortale Vollmacht).

${f.ausnahmen ? `IV. Ausnahmen / Beschränkungen\n\n${f.ausnahmen}\n\n` : ''}${f.ersatz ? `V. Ersatzbevollmächtigte:r\n\nFür den Fall, dass die vorgenannte Bevollmächtigte:r nicht erreichbar oder verhindert ist, wird ${f.ersatz} mit denselben Befugnissen ersatzweise bevollmächtigt.\n\n` : ''}VI. Betreuungsverfügung

Sollte gleichwohl ein:e Betreuer:in zu bestellen sein, schlage ich die o. g. bevollmächtigte Person als Betreuer:in vor (§ 1816 Abs. 2 BGB).

VII. Widerruf

Diese Vollmacht kann jederzeit ohne Angabe von Gründen widerrufen werden. Der Widerruf bedarf zur Wirksamkeit gegenüber Dritten der Rückgabe der Urkunde.

____________________________
Ort, Datum

____________________________
Unterschrift Vollmachtgeber:in

Hinweis: Für Verfügungen über Grundbesitz (§ 29 GBO), Eintragungen im Handelsregister (§ 12 HGB) sowie für Erbausschlagungen (§ 1945 Abs. 1 BGB) ist öffentliche Beglaubigung der Unterschrift bzw. notarielle Beurkundung erforderlich. Empfehlung: Registrierung im Zentralen Vorsorgeregister (ZVR) der Bundesnotarkammer.
`,
  },

  // ---------------------------------
  {
    id: 'ehevertrag_entwurf',
    title: 'Ehevertrag (Entwurf)',
    description: 'Entwurf eines Ehevertrags zur Modifikation des gesetzlichen Güterstands gem. § 1408 BGB.',
    useCase: 'Eheleute / Verlobte möchten den gesetzlichen Zugewinnausgleich modifizieren oder ausschließen, ggf. Versorgungsausgleich und nachehelichen Unterhalt regeln. Notarielle Beurkundung zwingend (§ 1410 BGB).',
    fields: [
      { id: 'ehegatte1', label: 'Ehegatte 1 (Name)', type: 'text', required: true },
      { id: 'ehegatte1Anschrift', label: 'Anschrift Ehegatte 1', type: 'textarea' },
      { id: 'ehegatte2', label: 'Ehegatte 2 (Name)', type: 'text', required: true },
      { id: 'ehegatte2Anschrift', label: 'Anschrift Ehegatte 2', type: 'textarea' },
      { id: 'gueterstand', label: 'Gewählter Güterstand', type: 'text', required: true, placeholder: 'modifizierte Zugewinngemeinschaft / Gütertrennung / Wahl-Zugewinngemeinschaft' },
      { id: 'modifikationen', label: 'Modifikationen Zugewinn', type: 'textarea', hint: 'z. B. Herausnahme Unternehmen, Kappung Ausgleich' },
      { id: 'versorgungsausgleich', label: 'Versorgungsausgleich', type: 'text', placeholder: 'Ausschluss / Modifikation / gesetzlich' },
      { id: 'unterhalt', label: 'Nachehelicher Unterhalt', type: 'textarea', placeholder: 'Verzicht / Höchstdauer / Höchstbetrag' },
    ],
    render: f => `Ehevertrag
— Entwurf zur notariellen Beurkundung —

zwischen

${f.ehegatte1 || '[Ehegatte 1]'}${f.ehegatte1Anschrift ? `, ${f.ehegatte1Anschrift.replace(/\n/g, ', ')}` : ''}

und

${f.ehegatte2 || '[Ehegatte 2]'}${f.ehegatte2Anschrift ? `, ${f.ehegatte2Anschrift.replace(/\n/g, ', ')}` : ''}

— nachfolgend gemeinsam „die Ehegatten" —

Vorbemerkung

Die Ehegatten leben im gesetzlichen Güterstand der Zugewinngemeinschaft (§ 1363 BGB) bzw. beabsichtigen die Eheschließung. Sie wünschen, ihre güter- und versorgungsrechtlichen Verhältnisse für den Fall der Scheidung und des Todes verbindlich zu regeln. Ihnen ist bekannt, dass der gesetzliche Güterstand bei Scheidung zum Zugewinnausgleich gem. §§ 1372 ff. BGB führt.

§ 1 Güterstand

${(f.gueterstand || '').toLowerCase().includes('trennung')
  ? 'Die Ehegatten vereinbaren mit Wirkung ab Beurkundung Gütertrennung gem. § 1414 BGB. Der Güterstand der Zugewinngemeinschaft wird hiermit aufgehoben. Ein etwaiger bis heute entstandener Zugewinn gilt als ausgeglichen.'
  : `Es wird folgender Güterstand vereinbart: ${f.gueterstand || '[Güterstand]'}.`}

§ 2 Modifikationen Zugewinn

${f.modifikationen || 'Soweit die Zugewinngemeinschaft aufrechterhalten bleibt, gelten die gesetzlichen Vorschriften der §§ 1373 ff. BGB unverändert.'}

§ 3 Versorgungsausgleich

${(f.versorgungsausgleich || '').toLowerCase().includes('ausschluss')
  ? 'Die Ehegatten schließen den Versorgungsausgleich für den Fall der Scheidung in beiderseitigem Einvernehmen aus (§ 6 Abs. 1 Nr. 2 VersAusglG). Sie sind über die Wirksamkeitskontrolle nach § 8 VersAusglG belehrt worden.'
  : `Versorgungsausgleich: ${f.versorgungsausgleich || 'gesetzliche Regelung'}.`}

§ 4 Nachehelicher Unterhalt

${f.unterhalt || 'Die gesetzlichen Regelungen zum nachehelichen Unterhalt (§§ 1569 ff. BGB) bleiben unberührt. Auf die Grenzen vertraglicher Disponibilität und die Wirksamkeitskontrolle nach § 138 BGB / Kernbereichslehre des BGH wurde hingewiesen.'}

§ 5 Erbrechtliche Hinweise

Etwaige erbrechtliche Regelungen (Berliner Testament, Erbvertrag, Pflichtteilsverzicht) bleiben einer gesonderten letztwilligen Verfügung bzw. einem gesonderten Erbvertrag (§ 2274 BGB) vorbehalten. Auf die Wechselwirkung des § 1371 BGB mit dem hier gewählten Güterstand wurde hingewiesen.

§ 6 Belehrungen

Die Ehegatten wurden ausführlich belehrt über:
— die Beurkundungsbedürftigkeit (§ 1410 BGB),
— die Inhalts- und Ausübungskontrolle ehevertraglicher Vereinbarungen (§§ 138, 242 BGB; BVerfG, BGH-Rechtsprechung zur Kernbereichslehre),
— die Folgen für gemeinsame minderjährige Kinder (Kindesunterhalt ist nicht disponibel),
— die Auswirkungen auf erbschaftsteuerliche Freibeträge.

§ 7 Schlussbestimmungen

Sollten einzelne Bestimmungen unwirksam sein, bleibt der Vertrag im Übrigen wirksam; an die Stelle der unwirksamen Regelung tritt diejenige Regelung, die dem wirtschaftlichen Zweck am nächsten kommt.

____________________________
Ort, Datum — Beurkundung erforderlich (§ 1410 BGB)

Hinweis: Eheverträge bedürfen zwingend der gleichzeitigen Anwesenheit beider Ehegatten vor dem Notar (§ 1410 BGB). Eine Vertretung durch Boten ist ausgeschlossen.
`,
  },
]

/**
 * Migrationsrecht-Pack — für Fachanwält:innen für Migrationsrecht und Solos
 * mit hoher Migrant:innen-Mandantschaft (z. B. Berliner Kanzleien mit
 * vietnamesischer/türkischer/arabischer Community).
 *
 * 12 Templates: Aufenthaltstitel-Erteilung/-Verlängerung, Niederlassung,
 * Familiennachzug, Beschäftigungserlaubnis, Einbürgerung, Widersprüche,
 * Eilanträge gegen Abschiebung, Fiktionsbescheinigung, Härtefall,
 * Familienasyl. Frist-Hinweise und Anlagen-Listen sind in render() drin.
 */
export const MIGRATION_TEMPLATES: LawyerTemplate[] = [
// ---------------------------------
  {
    id: 'aufenthaltserlaubnis_antrag',
    title: 'Antrag auf Aufenthaltserlaubnis',
    description: 'Erstantrag auf Erteilung einer Aufenthaltserlaubnis gem. §§ 7, 8 AufenthG bei der zuständigen Ausländerbehörde.',
    useCase: 'Mandantschaft hält sich rechtmäßig in Deutschland auf (z. B. mit nationalem Visum) und benötigt erstmals eine Aufenthaltserlaubnis zu einem konkreten Aufenthaltszweck.',
    fields: [
      { id: 'behoerde', label: 'Ausländerbehörde', type: 'text', required: true, placeholder: 'Landesamt für Einwanderung Berlin (LEA)' },
      { id: 'mandant', label: 'Antragsteller:in (Mandant:in)', type: 'text', required: true },
      { id: 'mandantAnschrift', label: 'Anschrift Antragsteller:in', type: 'textarea' },
      { id: 'geboren', label: 'Geburtsdatum', type: 'date', required: true },
      { id: 'staatsang', label: 'Staatsangehörigkeit', type: 'text', required: true },
      { id: 'zweck', label: 'Aufenthaltszweck', type: 'text', required: true, placeholder: 'Studium (§ 16b) / Beschäftigung (§ 18b) / Familiennachzug (§ 28)', hint: 'Bitte konkrete Norm des AufenthG benennen.' },
      { id: 'bisherigeTitel', label: 'Bisheriger Aufenthaltsstatus / Visum', type: 'textarea', placeholder: 'Nationales Visum Typ D v. 12.01.2026, gültig bis 11.04.2026' },
      { id: 'anlagen', label: 'Anlagen', type: 'textarea', placeholder: 'Pass, biometrisches Lichtbild, Mietvertrag, Krankenversicherung, Immatrikulation, Arbeitsvertrag' },
    ],
    render: f => `An ${f.behoerde || '[Ausländerbehörde]'}

Antrag auf Erteilung einer Aufenthaltserlaubnis
gem. §§ 7, 8 AufenthG i. V. m. ${f.zweck ? `§ ${f.zweck.replace(/^.*§\s*/, '')}` : '[einschlägiger Spezialnorm]'}

Sehr geehrte Damen und Herren,

namens und im Auftrag meiner Mandantschaft, ${f.mandant || '[Mandant:in]'}${f.geboren ? `, geboren am ${f.geboren}` : ''}${f.staatsang ? `, ${f.staatsang}e:r Staatsangehörige:r` : ''}${f.mandantAnschrift ? `, wohnhaft ${f.mandantAnschrift.replace(/\n/g, ', ')}` : ''}, beantrage ich

die Erteilung einer Aufenthaltserlaubnis

gem. §§ 7, 8 AufenthG zum Zweck ${f.zweck || '[Aufenthaltszweck]'}.

I. Bisheriger Aufenthalt

${f.bisherigeTitel || '[Angaben zu Einreise, Visum und bisherigem Status]'}

II. Erteilungsvoraussetzungen (§ 5 AufenthG)

Die allgemeinen Erteilungsvoraussetzungen nach § 5 Abs. 1 AufenthG liegen vor: Die Identität und Staatsangehörigkeit meiner Mandantschaft sind geklärt, der Lebensunterhalt ist gesichert (§ 2 Abs. 3 AufenthG), ein Ausweisungsinteresse besteht nicht. Die Passpflicht (§ 3 AufenthG) ist erfüllt.

III. Anlagen

${f.anlagen || '— gültiger Pass (Kopie)\n— biometrisches Lichtbild\n— Nachweis des Lebensunterhalts\n— Nachweis Krankenversicherung\n— Meldebestätigung\n— zweckbezogene Nachweise'}

Ich bitte um Terminvergabe zur persönlichen Vorsprache meiner Mandantschaft sowie um Ausstellung einer Fiktionsbescheinigung gem. § 81 Abs. 4 AufenthG für die Dauer des Verfahrens. Die anwaltliche Vertretungsvollmacht wird anwaltlich versichert.

${SIGN_OFF}
`,
  },

  // ---------------------------------
  {
    id: 'niederlassungserlaubnis',
    title: 'Antrag auf Niederlassungserlaubnis',
    description: 'Antrag auf Erteilung einer unbefristeten Niederlassungserlaubnis gem. § 9 AufenthG nach fünfjährigem Besitz einer Aufenthaltserlaubnis.',
    useCase: 'Mandantschaft erfüllt die Voraussetzungen des § 9 Abs. 2 AufenthG (fünf Jahre Aufenthaltserlaubnis, Lebensunterhalt, B1, Rentenversicherung, ausreichender Wohnraum).',
    fields: [
      { id: 'behoerde', label: 'Ausländerbehörde', type: 'text', required: true },
      { id: 'mandant', label: 'Mandant:in', type: 'text', required: true },
      { id: 'mandantAnschrift', label: 'Anschrift Mandant:in', type: 'textarea' },
      { id: 'bisherigerTitel', label: 'Bisheriger Aufenthaltstitel', type: 'text', required: true, placeholder: 'Aufenthaltserlaubnis § 18b AufenthG' },
      { id: 'titelSeit', label: 'Titel erteilt am', type: 'date', required: true, hint: '5-Jahres-Frist § 9 Abs. 2 Nr. 1 AufenthG' },
      { id: 'beschaeftigung', label: 'Aktuelle Beschäftigung', type: 'textarea', placeholder: 'Arbeitgeber, Position, sozialversicherungspflichtig seit ...' },
      { id: 'sprachnachweis', label: 'Sprachnachweis B1', type: 'text', placeholder: 'Zertifikat telc Deutsch B1 v. 03.11.2025' },
      { id: 'lebensunterhalt', label: 'Sicherung Lebensunterhalt', type: 'textarea', hint: 'Monatliches Nettoeinkommen, Bedarf, ggf. Ehegatte.' },
    ],
    render: f => `An ${f.behoerde || '[Ausländerbehörde]'}

Antrag auf Erteilung einer Niederlassungserlaubnis
gem. § 9 AufenthG

Sehr geehrte Damen und Herren,

namens und im Auftrag meiner Mandantschaft, ${f.mandant || '[Mandant:in]'}${f.mandantAnschrift ? `, wohnhaft ${f.mandantAnschrift.replace(/\n/g, ', ')}` : ''}, beantrage ich

die Erteilung einer Niederlassungserlaubnis

gem. § 9 Abs. 2 AufenthG.

I. Besitz einer Aufenthaltserlaubnis seit fünf Jahren (§ 9 Abs. 2 Nr. 1 AufenthG)

Meine Mandantschaft ist seit ${f.titelSeit || '[Datum]'} im Besitz einer ${f.bisherigerTitel || '[Aufenthaltserlaubnis]'}. Die Fünfjahresfrist ist damit gewahrt.

II. Sicherung des Lebensunterhalts (§ 9 Abs. 2 Nr. 2 AufenthG)

${f.lebensunterhalt || '[Angaben zur Einkommenssituation, Nachweise liegen bei]'}

III. Beiträge zur gesetzlichen Rentenversicherung (§ 9 Abs. 2 Nr. 3 AufenthG)

Meine Mandantschaft hat Pflichtbeiträge bzw. freiwillige Beiträge zur gesetzlichen Rentenversicherung für mindestens 60 Monate geleistet; der entsprechende Versicherungsverlauf ist beigefügt.

IV. Beschäftigung (§ 9 Abs. 2 Nr. 5 AufenthG)

${f.beschaeftigung || '[Angaben zur aktuellen Erwerbstätigkeit]'}

V. Sprachkenntnisse und Kenntnisse der Rechts- und Gesellschaftsordnung (§ 9 Abs. 2 Nr. 7, 8 AufenthG)

Ausreichende Deutschkenntnisse auf Niveau B1 sind durch ${f.sprachnachweis || '[Zertifikat]'} nachgewiesen. Kenntnisse der Rechts- und Gesellschaftsordnung sind durch erfolgreichen Abschluss des Einbürgerungs- bzw. Orientierungskurses belegt.

VI. Weitere Voraussetzungen

Ausweisungsinteressen i. S. v. § 54 AufenthG bestehen nicht. Ausreichender Wohnraum (§ 9 Abs. 2 Nr. 9 AufenthG) ist vorhanden; der Mietvertrag liegt bei.

VII. Anlagen

— bisheriger Aufenthaltstitel (Kopie)
— Rentenversicherungsverlauf
— Arbeitsvertrag und 3 aktuelle Gehaltsabrechnungen
— B1-Zertifikat
— Nachweis Integrationskurs / „Leben in Deutschland"-Test
— Mietvertrag

Die anwaltliche Vertretungsvollmacht wird anwaltlich versichert.

${SIGN_OFF}
`,
  },

  // ---------------------------------
  {
    id: 'verlaengerung_aufenthaltstitel',
    title: 'Verlängerung Aufenthaltstitel',
    description: 'Antrag auf Verlängerung einer laufenden Aufenthaltserlaubnis gem. § 8 AufenthG.',
    useCase: 'Laufender Aufenthaltstitel läuft in Kürze ab. Verlängerungsantrag ist rechtzeitig vor Ablauf zu stellen; bei fristgerechter Antragstellung greift die Fiktionswirkung des § 81 Abs. 4 AufenthG.',
    fields: [
      { id: 'behoerde', label: 'Ausländerbehörde', type: 'text', required: true },
      { id: 'mandant', label: 'Mandant:in', type: 'text', required: true },
      { id: 'mandantAnschrift', label: 'Anschrift Mandant:in', type: 'textarea' },
      { id: 'bisherigerTitel', label: 'Bisheriger Titel (Rechtsgrundlage)', type: 'text', required: true, placeholder: 'Aufenthaltserlaubnis § 28 Abs. 1 S. 1 Nr. 1 AufenthG' },
      { id: 'ablaufDatum', label: 'Ablauf des Titels', type: 'date', required: true, hint: 'Antrag muss vor Ablauf gestellt sein — § 81 Abs. 4 AufenthG.' },
      { id: 'verhaeltnisse', label: 'Geänderte / unveränderte Verhältnisse', type: 'textarea', required: true, placeholder: 'Ehebestand fortbestehend seit ..., Arbeitsverhältnis unverändert bei ...' },
      { id: 'anlagen', label: 'Anlagen', type: 'textarea', placeholder: 'Pass, aktuelle Meldebescheinigung, Gehaltsabrechnungen, Krankenversicherung' },
    ],
    render: f => `An ${f.behoerde || '[Ausländerbehörde]'}

Antrag auf Verlängerung der Aufenthaltserlaubnis
gem. § 8 AufenthG

Sehr geehrte Damen und Herren,

namens und im Auftrag meiner Mandantschaft, ${f.mandant || '[Mandant:in]'}${f.mandantAnschrift ? `, wohnhaft ${f.mandantAnschrift.replace(/\n/g, ', ')}` : ''}, beantrage ich

die Verlängerung der Aufenthaltserlaubnis

meiner Mandantschaft, derzeit erteilt auf Grundlage von ${f.bisherigerTitel || '[Rechtsgrundlage]'}, gültig bis ${f.ablaufDatum || '[Ablaufdatum]'}.

I. Fortbestand des Aufenthaltszwecks (§ 8 Abs. 1 AufenthG)

${f.verhaeltnisse || '[Darlegung, dass die Erteilungsvoraussetzungen fortbestehen; relevante Veränderungen sind aufzuführen.]'}

II. Erteilungsvoraussetzungen

Die allgemeinen Erteilungsvoraussetzungen des § 5 AufenthG liegen weiterhin vor. Der Lebensunterhalt ist gesichert, die Passpflicht ist erfüllt, Ausweisungsinteressen bestehen nicht.

III. Fiktionswirkung

Der Antrag wird vor Ablauf des derzeitigen Titels gestellt, sodass der bisherige Titel gem. § 81 Abs. 4 S. 1 AufenthG bis zur Entscheidung der Behörde als fortbestehend gilt. Ich bitte vorsorglich um Ausstellung einer Fiktionsbescheinigung (§ 81 Abs. 5 AufenthG).

IV. Anlagen

${f.anlagen || '— Pass (Kopie)\n— Meldebescheinigung\n— aktuelle Einkommensnachweise\n— Nachweis Krankenversicherung\n— bisheriger Titel (Kopie)'}

Die anwaltliche Vertretungsvollmacht wird anwaltlich versichert.

${SIGN_OFF}
`,
  },

  // ---------------------------------
  {
    id: 'familiennachzug_ehegatte',
    title: 'Familiennachzug Ehegatt:in',
    description: 'Antrag auf Visum zum Ehegattennachzug gem. §§ 27, 28, 30 AufenthG bei der Auslandsvertretung.',
    useCase: 'Ehegatt:in einer/eines in Deutschland lebenden Stammberechtigten möchte zum Zweck der Herstellung der ehelichen Lebensgemeinschaft nachziehen. Grundsätzlich A1-Sprachnachweis erforderlich (§ 30 Abs. 1 S. 1 Nr. 2 AufenthG).',
    fields: [
      { id: 'behoerde', label: 'Empfänger:in (Botschaft / Ausländerbehörde)', type: 'text', required: true, placeholder: 'Deutsche Botschaft Ankara / LEA Berlin' },
      { id: 'antragsteller', label: 'Antragsteller:in (im Ausland)', type: 'text', required: true },
      { id: 'antragstellerDaten', label: 'Geburtsdatum / Staatsangehörigkeit Antragsteller:in', type: 'text', placeholder: '12.03.1992, türkisch' },
      { id: 'stammberechtigt', label: 'Stammberechtigte:r in Deutschland', type: 'text', required: true, hint: 'Name, Aufenthaltstitel / Staatsangehörigkeit' },
      { id: 'eheDatum', label: 'Eheschließung (Datum)', type: 'date', required: true },
      { id: 'eheOrt', label: 'Ort der Eheschließung', type: 'text', required: true },
      { id: 'sprachnachweis', label: 'Sprachnachweis A1', type: 'text', placeholder: 'Goethe A1 v. 14.02.2026 / Befreiungstatbestand § 30 Abs. 1 S. 3 AufenthG' },
      { id: 'anlagen', label: 'Anlagen', type: 'textarea', placeholder: 'Heiratsurkunde mit Apostille, Pässe, A1-Zertifikat, Mietvertrag, Einkommensnachweise' },
    ],
    render: f => `An ${f.behoerde || '[Botschaft / Ausländerbehörde]'}

Antrag auf Visum zum Ehegattennachzug
gem. §§ 27, 28 bzw. 30 AufenthG

Sehr geehrte Damen und Herren,

namens und im Auftrag meiner Mandantschaft, ${f.antragsteller || '[Antragsteller:in]'}${f.antragstellerDaten ? ` (${f.antragstellerDaten})` : ''}, beantrage ich

die Erteilung eines nationalen Visums zum Zweck des Ehegattennachzugs

zur Herstellung der ehelichen Lebensgemeinschaft mit ${f.stammberechtigt || '[Stammberechtigte:r]'} in der Bundesrepublik Deutschland.

I. Eheliche Lebensgemeinschaft (§ 27 Abs. 1 AufenthG)

Die Ehe wurde am ${f.eheDatum || '[Datum]'} in ${f.eheOrt || '[Ort]'} geschlossen. Die Heiratsurkunde nebst Apostille / Legalisation liegt bei. Beide Ehegatten beabsichtigen die Herstellung und Wahrung der ehelichen Lebensgemeinschaft im Bundesgebiet; eine Scheinehe liegt ausdrücklich nicht vor.

II. Voraussetzungen auf Seiten der stammberechtigten Person

${f.stammberechtigt || '[Stammberechtigte:r]'} hält sich rechtmäßig im Bundesgebiet auf (Nachweis als Anlage). Ausreichender Wohnraum (§ 29 Abs. 1 Nr. 2 AufenthG) und die Sicherung des Lebensunterhalts (§ 5 Abs. 1 Nr. 1 AufenthG) sind gegeben; entsprechende Nachweise liegen bei.

III. Sprachnachweis (§ 30 Abs. 1 S. 1 Nr. 2 AufenthG)

${f.sprachnachweis || 'Einfache Deutschkenntnisse auf Niveau A1 werden durch beigefügtes Zertifikat nachgewiesen. Hilfsweise liegt ein Befreiungstatbestand gem. § 30 Abs. 1 S. 3 AufenthG vor.'}

IV. Beteiligung der Ausländerbehörde

Ich rege an, die zuständige Ausländerbehörde am künftigen Wohnort zeitnah gem. § 31 AufenthV zu beteiligen, um Verfahrensverzögerungen zu vermeiden.

V. Anlagen

${f.anlagen || '— Reisepass Antragsteller:in\n— Heiratsurkunde mit Apostille / Legalisation\n— Aufenthaltstitel / Pass der stammberechtigten Person\n— Mietvertrag, Wohnflächenberechnung\n— Einkommensnachweise der letzten 6 Monate\n— A1-Zertifikat'}

Ich bitte um zeitnahe Terminvergabe und Bearbeitung. Die anwaltliche Vertretungsvollmacht wird anwaltlich versichert.

${SIGN_OFF}
`,
  },

  // ---------------------------------
  {
    id: 'familiennachzug_kind',
    title: 'Kindernachzug',
    description: 'Antrag auf Visum bzw. Aufenthaltserlaubnis zum Kindernachzug gem. § 32 AufenthG (minderjährige ledige Kinder bis 16/18 Jahre).',
    useCase: 'Eltern bzw. personensorgeberechtigter Elternteil leben rechtmäßig in Deutschland; minderjähriges lediges Kind soll nachziehen. Bei Kindern ab 16 J. zusätzliche Integrationsprognose (§ 32 Abs. 2 AufenthG).',
    fields: [
      { id: 'behoerde', label: 'Empfänger:in (Botschaft / Ausländerbehörde)', type: 'text', required: true },
      { id: 'eltern', label: 'Eltern / Sorgeberechtigte:r in DE', type: 'text', required: true, hint: 'Name + Aufenthaltstitel' },
      { id: 'kind', label: 'Kind (Name)', type: 'text', required: true },
      { id: 'kindGeboren', label: 'Geburtsdatum Kind', type: 'date', required: true, hint: 'Relevant für § 32 Abs. 2 AufenthG (Altersgrenze 16).' },
      { id: 'staatsang', label: 'Staatsangehörigkeit Kind', type: 'text' },
      { id: 'sorgerecht', label: 'Sorgerecht', type: 'textarea', placeholder: 'Alleiniges Sorgerecht der Mutter seit Scheidung v. ... / gemeinsames Sorgerecht' },
      { id: 'anlagen', label: 'Anlagen', type: 'textarea', placeholder: 'Geburtsurkunde, Sorgerechtsentscheidung, Pässe, Aufenthaltstitel Eltern' },
    ],
    render: f => `An ${f.behoerde || '[Botschaft / Ausländerbehörde]'}

Antrag auf Visum zum Kindernachzug
gem. § 32 AufenthG

Sehr geehrte Damen und Herren,

namens und im Auftrag meiner Mandantschaft, ${f.eltern || '[Eltern / Sorgeberechtigte:r]'}, beantrage ich für das gemeinsame Kind

${f.kind || '[Kind]'}${f.kindGeboren ? `, geboren am ${f.kindGeboren}` : ''}${f.staatsang ? `, ${f.staatsang}e:r Staatsangehörige:r` : ''},

die Erteilung eines Visums zum Nachzug gem. § 32 AufenthG.

I. Voraussetzungen des § 32 AufenthG

Das Kind ist minderjährig und ledig. Die sorgeberechtigten Eltern bzw. der allein personensorgeberechtigte Elternteil halten sich rechtmäßig im Bundesgebiet auf und verfügen über einen Aufenthaltstitel i. S. v. § 32 Abs. 1 AufenthG.

II. Sorgerecht

${f.sorgerecht || '[Angaben zum Sorgerecht und Vorlage der zugrundeliegenden Urkunden / Entscheidungen]'}

III. Sicherung des Lebensunterhalts und Wohnraum

Der Lebensunterhalt ist gesichert (§ 5 Abs. 1 Nr. 1 AufenthG), ausreichender Wohnraum steht zur Verfügung (§ 29 Abs. 1 Nr. 2 AufenthG). Entsprechende Nachweise liegen bei.

IV. ${(() => { const g = f.kindGeboren ? new Date(f.kindGeboren) : null; return g && (Date.now() - g.getTime()) / (1000*60*60*24*365.25) >= 16 ? 'Integrationsprognose (§ 32 Abs. 2 AufenthG)' : 'Hinweis'})()}

${(() => { const g = f.kindGeboren ? new Date(f.kindGeboren) : null; return g && (Date.now() - g.getTime()) / (1000*60*60*24*365.25) >= 16 ? 'Da das Kind das 16. Lebensjahr vollendet hat, wird auf die Integrationsprognose nach § 32 Abs. 2 AufenthG besonders hingewiesen; der Sprachnachweis C1 bzw. die Integrationsfähigkeit wird durch beiliegende Nachweise belegt.' : 'Das Kind hat das 16. Lebensjahr noch nicht vollendet; eine Integrationsprognose nach § 32 Abs. 2 AufenthG ist nicht erforderlich.'})()}

V. Anlagen

${f.anlagen || '— Geburtsurkunde des Kindes mit Apostille\n— Sorgerechtsnachweis / Einverständniserklärung des anderen Elternteils\n— Reisepass des Kindes\n— Aufenthaltstitel und Pass der Eltern\n— Einkommens- und Wohnraumnachweise'}

Ich bitte um zeitnahe Terminvergabe; die minderjährige Antragstellerin / der minderjährige Antragsteller ist auf die baldige Familienzusammenführung dringend angewiesen. Die anwaltliche Vertretungsvollmacht wird anwaltlich versichert.

${SIGN_OFF}
`,
  },

  // ---------------------------------
  {
    id: 'beschaeftigungserlaubnis',
    title: 'Antrag Beschäftigungserlaubnis',
    description: 'Antrag auf Erteilung der Erlaubnis zur Ausübung einer Erwerbstätigkeit gem. § 4a AufenthG („Erwerbstätigkeit gestattet").',
    useCase: 'Mandantschaft besitzt einen Aufenthaltstitel, der eine Erwerbstätigkeit nicht oder nur mit gesonderter Erlaubnis zulässt (z. B. Aufenthaltsgestattung, Duldung, bestimmte humanitäre Titel). Zustimmung der BA nach §§ 39 ff. AufenthG ggf. erforderlich.',
    fields: [
      { id: 'behoerde', label: 'Ausländerbehörde', type: 'text', required: true },
      { id: 'mandant', label: 'Mandant:in', type: 'text', required: true },
      { id: 'aktuellerStatus', label: 'Aktueller Aufenthaltsstatus', type: 'text', required: true, placeholder: 'Aufenthaltsgestattung / Duldung § 60a / AE § 25 Abs. 5' },
      { id: 'arbeitgeber', label: 'Arbeitgeber:in', type: 'text', required: true },
      { id: 'stelle', label: 'Stellenbezeichnung / Tätigkeit', type: 'textarea', required: true, placeholder: 'Fachkraft Pflege, 30h/Woche, EG P7 TVöD' },
      { id: 'vertragslaufzeit', label: 'Vertragslaufzeit', type: 'text', placeholder: 'unbefristet ab 01.05.2026 / befristet bis 30.04.2027' },
      { id: 'bruttolohn', label: 'Bruttolohn', type: 'text', placeholder: '€ 3.200,- monatlich' },
      { id: 'baZustimmung', label: 'BA-Zustimmung erforderlich?', type: 'text', placeholder: 'ja (§ 39 AufenthG) / nein (§ 32 BeschV)' },
    ],
    render: f => `An ${f.behoerde || '[Ausländerbehörde]'}

Antrag auf Erteilung der Erlaubnis zur Erwerbstätigkeit
gem. § 4a AufenthG

Sehr geehrte Damen und Herren,

namens und im Auftrag meiner Mandantschaft, ${f.mandant || '[Mandant:in]'} (aktueller Status: ${f.aktuellerStatus || '[Status]'}), beantrage ich

die Erteilung der Erlaubnis zur Ausübung einer Erwerbstätigkeit

gem. § 4a Abs. 1 und 2 AufenthG durch Eintragung des Zusatzes „Erwerbstätigkeit gestattet" in den Aufenthaltstitel bzw. die Bescheinigung meiner Mandantschaft.

I. Angaben zum Arbeitsverhältnis

Arbeitgeber:in: ${f.arbeitgeber || '[Arbeitgeber:in]'}
Tätigkeit: ${f.stelle || '[Stellenbezeichnung]'}
Vertragslaufzeit: ${f.vertragslaufzeit || '—'}
Bruttovergütung: ${f.bruttolohn || '—'}

Der Arbeitsvertrag sowie die „Erklärung zum Beschäftigungsverhältnis" der BA liegen bei.

II. Zustimmung der Bundesagentur für Arbeit

${(f.baZustimmung || '').toLowerCase().startsWith('ja') ? 'Die Zustimmung der Bundesagentur für Arbeit gem. §§ 39, 40 AufenthG ist einzuholen. Ich bitte die Ausländerbehörde, das Verfahren über das einheitliche Zustimmungsverfahren anzustoßen. Die Arbeitsbedingungen entsprechen den tariflichen bzw. ortsüblichen Bedingungen (§ 39 Abs. 3 AufenthG).' : 'Eine Zustimmung der Bundesagentur für Arbeit ist nicht erforderlich (zustimmungsfreie Beschäftigung gem. BeschV). Die einschlägige Norm ist in den Anlagen dargestellt.'}

III. Ermessen / gebundene Entscheidung

Die Voraussetzungen liegen vor; im Rahmen des Ermessens (soweit einschlägig) überwiegt das Integrationsinteresse meiner Mandantschaft sowie das Interesse des Arbeitgebers an einer zeitnahen Aufnahme der Beschäftigung.

IV. Eilbedürftigkeit

Der Arbeitsantritt ist auf den im Vertrag genannten Termin datiert. Eine Entscheidung innerhalb von drei Wochen wird höflich erbeten; andernfalls droht der Verlust des Arbeitsplatzes.

V. Anlagen

— Arbeitsvertrag
— „Erklärung zum Beschäftigungsverhältnis" (BA-Vordruck)
— Stellenbeschreibung
— Nachweis beruflicher Qualifikation
— Kopie Aufenthaltstitel / Duldung / Gestattung

Die anwaltliche Vertretungsvollmacht wird anwaltlich versichert.

${SIGN_OFF}
`,
  },

  // ---------------------------------
  {
    id: 'einbuergerung_antrag',
    title: 'Einbürgerungsantrag',
    description: 'Antrag auf Einbürgerung gem. §§ 8, 9, 10 StAG (Regelfrist 5 Jahre, bei besonderen Integrationsleistungen 3 Jahre).',
    useCase: 'Mandantschaft lebt langjährig und rechtmäßig in Deutschland und möchte die deutsche Staatsangehörigkeit erwerben. Seit Reform des StAG 2024 ist Mehrstaatigkeit grundsätzlich zulässig.',
    fields: [
      { id: 'behoerde', label: 'Einbürgerungsbehörde', type: 'text', required: true, placeholder: 'LEA Berlin — Staatsangehörigkeitsbehörde' },
      { id: 'mandant', label: 'Mandant:in', type: 'text', required: true },
      { id: 'mandantAnschrift', label: 'Anschrift Mandant:in', type: 'textarea' },
      { id: 'bisherigeStaatsang', label: 'Bisherige Staatsangehörigkeit(en)', type: 'text', required: true },
      { id: 'aufenthaltSeit', label: 'Rechtmäßiger Aufenthalt in DE seit', type: 'date', required: true, hint: '§ 10 Abs. 1 Nr. 3 StAG — 5 bzw. 3 Jahre.' },
      { id: 'sprachnachweis', label: 'Sprachnachweis', type: 'text', placeholder: 'B1 (§ 10 Abs. 1 Nr. 6) bzw. C1 bei 3-Jahres-Variante' },
      { id: 'einbuergerungstest', label: 'Einbürgerungstest', type: 'text', placeholder: 'Zertifikat v. ... / Befreiung gem. § 10 Abs. 6 StAG' },
      { id: 'lebensunterhalt', label: 'Sicherung Lebensunterhalt', type: 'textarea', hint: 'Keine Leistungen nach SGB II/XII (§ 10 Abs. 1 Nr. 3 StAG) — Ausnahmen bei Unverschulden.' },
    ],
    render: f => `An ${f.behoerde || '[Einbürgerungsbehörde]'}

Antrag auf Einbürgerung
gem. §§ 8, 10 StAG

Sehr geehrte Damen und Herren,

namens und im Auftrag meiner Mandantschaft, ${f.mandant || '[Mandant:in]'}${f.mandantAnschrift ? `, wohnhaft ${f.mandantAnschrift.replace(/\n/g, ', ')}` : ''}, bisher ${f.bisherigeStaatsang || '[Staatsangehörigkeit]'}, beantrage ich

die Einbürgerung in den deutschen Staatsverband

gem. § 10 StAG, hilfsweise § 8 StAG.

I. Rechtmäßiger gewöhnlicher Aufenthalt (§ 10 Abs. 1 Nr. 1 StAG)

Meine Mandantschaft hält sich seit ${f.aufenthaltSeit || '[Datum]'} rechtmäßig und mit gewöhnlichem Aufenthalt im Bundesgebiet auf. Die Voraussetzungen der 5-Jahres-Frist (§ 10 Abs. 1 Nr. 1 StAG) — ggf. der 3-Jahres-Frist bei besonderen Integrationsleistungen (§ 10 Abs. 3 StAG n. F.) — sind erfüllt.

II. Bekenntnis zur freiheitlichen demokratischen Grundordnung (§ 10 Abs. 1 Nr. 1 StAG)

Meine Mandantschaft bekennt sich zur freiheitlichen demokratischen Grundordnung des Grundgesetzes und erklärt, keine Bestrebungen verfolgt zu haben oder zu verfolgen, die gegen sie gerichtet sind. Eine entsprechende Loyalitätserklärung liegt bei.

III. Aufenthaltsrechtlicher Status (§ 10 Abs. 1 Nr. 2 StAG)

Meine Mandantschaft ist im Besitz eines nach § 10 Abs. 1 Nr. 2 StAG einbürgerungsgeeigneten Aufenthaltstitels (Nachweis als Anlage).

IV. Sicherung des Lebensunterhalts (§ 10 Abs. 1 Nr. 3 StAG)

${f.lebensunterhalt || '[Darlegung, dass der Lebensunterhalt ohne Inanspruchnahme von SGB II-/XII-Leistungen gesichert ist; ggf. Ausnahmen des § 10 Abs. 1 Nr. 3 a. E. StAG.]'}

V. Sprachkenntnisse (§ 10 Abs. 1 Nr. 6 StAG)

Ausreichende Deutschkenntnisse sind nachgewiesen durch: ${f.sprachnachweis || '[Sprachnachweis]'}.

VI. Staatsbürgerliche Kenntnisse (§ 10 Abs. 1 Nr. 7 StAG)

Kenntnisse der Rechts- und Gesellschaftsordnung: ${f.einbuergerungstest || 'bestandener Einbürgerungstest (Zertifikat als Anlage)'}.

VII. Straffreiheit (§ 10 Abs. 1 Nr. 5, § 12a StAG)

Meine Mandantschaft ist strafrechtlich nicht in einem einbürgerungsschädlichen Umfang in Erscheinung getreten; ein Führungszeugnis wird von der Behörde eingeholt (§ 41 StAG).

VIII. Mehrstaatigkeit

Nach dem Gesetz zur Modernisierung des Staatsangehörigkeitsrechts ist die bisherige Staatsangehörigkeit grundsätzlich beizubehalten (§ 12 StAG n. F.); ein Entlassungsverfahren ist nicht erforderlich.

IX. Anlagen

— Lebenslauf
— Pass / Passersatz und Aufenthaltstitel
— Einkommensnachweise der letzten 12 Monate
— B1-/C1-Zertifikat, Einbürgerungstest
— Loyalitätserklärung
— Meldebescheinigung, Geburts- und ggf. Eheurkunde

Die anwaltliche Vertretungsvollmacht wird anwaltlich versichert.

${SIGN_OFF}
`,
  },

  // ---------------------------------
  {
    id: 'widerspruch_ablehnung_aufenthalt',
    title: 'Widerspruch gegen Ablehnung Aufenthaltstitel',
    description: 'Widerspruch gegen einen ablehnenden Bescheid der Ausländerbehörde gem. §§ 68 ff. VwGO — Frist 1 Monat (§ 70 VwGO)!',
    useCase: 'Ausländerbehörde hat einen Antrag (Erteilung, Verlängerung, Niederlassung) abgelehnt. Statthafter Rechtsbehelf ist — soweit das Vorverfahren nicht landesrechtlich abgeschafft ist — der Widerspruch binnen eines Monats. In Berlin/Brandenburg: unmittelbar Verpflichtungsklage!',
    fields: [
      { id: 'behoerde', label: 'Ausländerbehörde (Widerspruchsgegnerin)', type: 'text', required: true },
      { id: 'mandant', label: 'Mandant:in', type: 'text', required: true },
      { id: 'bescheidDatum', label: 'Datum des Bescheids', type: 'date', required: true, hint: 'Frist § 70 VwGO: 1 Monat ab Bekanntgabe!' },
      { id: 'aktenzeichen', label: 'Aktenzeichen Bescheid', type: 'text', required: true },
      { id: 'bescheidGegenstand', label: 'Gegenstand des Bescheids', type: 'text', placeholder: 'Ablehnung der Verlängerung § 28 AufenthG' },
      { id: 'begruendung', label: 'Widerspruchsbegründung', type: 'textarea', required: true, hint: 'Sach- und Rechtsfehler, neue Tatsachen, Ermessensfehler.' },
    ],
    render: f => `An ${f.behoerde || '[Ausländerbehörde]'}

Widerspruch
in der Ausländersache ${f.mandant || '[Mandant:in]'}
gegen den Bescheid vom ${f.bescheidDatum || '[Datum]'}, Az. ${f.aktenzeichen || '[Aktenzeichen]'}
${f.bescheidGegenstand ? `— ${f.bescheidGegenstand} —` : ''}

Sehr geehrte Damen und Herren,

namens und im Auftrag meiner Mandantschaft, ${f.mandant || '[Mandant:in]'}, lege ich gegen den oben bezeichneten Bescheid

W i d e r s p r u c h

ein und beantrage,

1. den angefochtenen Bescheid aufzuheben,
2. dem Antrag meiner Mandantschaft in vollem Umfang stattzugeben,
3. hilfsweise, die Sache unter Beachtung der Rechtsauffassung der Widerspruchsbehörde erneut zu bescheiden.

Die Widerspruchsfrist des § 70 Abs. 1 VwGO ist gewahrt.

I. Sachverhalt

Auf den Akteninhalt wird Bezug genommen. Ergänzende Tatsachen werden im Rahmen der Begründung vorgetragen.

II. Begründung

${f.begruendung || '[Ausführliche rechtliche Begründung: Verkennung der Tatsachen, fehlerhafte Anwendung der §§ AufenthG, Ermessensfehler (§ 114 VwGO), Verhältnismäßigkeit, Art. 6 GG / Art. 8 EMRK bei familiärem Bezug.]'}

III. Aufschiebende Wirkung

Der Widerspruch entfaltet aufschiebende Wirkung (§ 80 Abs. 1 VwGO), soweit diese nicht nach § 84 AufenthG entfällt. Vorsorglich beantrage ich im Falle des § 84 AufenthG die Anordnung bzw. Wiederherstellung der aufschiebenden Wirkung gem. § 80 Abs. 4 VwGO bei der Behörde sowie ggf. § 80 Abs. 5 VwGO beim Verwaltungsgericht.

IV. Abhilfe

Ich rege eine Abhilfeentscheidung gem. § 72 VwGO an. Andernfalls bitte ich um Vorlage an die Widerspruchsbehörde und Akteneinsicht gem. § 29 VwVfG.

Die anwaltliche Vertretungsvollmacht wird anwaltlich versichert.

${SIGN_OFF}
`,
  },

  // ---------------------------------
  {
    id: 'eilantrag_abschiebung',
    title: 'Eilantrag gegen Abschiebung (§ 80 Abs. 5 VwGO)',
    description: 'Antrag auf Anordnung / Wiederherstellung der aufschiebenden Wirkung beim Verwaltungsgericht gegen eine Abschiebungsanordnung.',
    useCase: 'Mandantschaft ist von drohender Abschiebung betroffen. Höchste Eilbedürftigkeit — Antrag muss vor Vollzug gestellt werden; ggf. zusätzlich „Hängebeschluss" nach § 123 VwGO analog.',
    fields: [
      { id: 'gericht', label: 'Verwaltungsgericht', type: 'text', required: true, placeholder: 'Verwaltungsgericht Berlin' },
      { id: 'mandant', label: 'Mandant:in (Antragsteller:in)', type: 'text', required: true },
      { id: 'mandantAnschrift', label: 'Anschrift / Unterbringung', type: 'textarea', placeholder: 'Abschiebungshaft JVA Berlin-Grünau' },
      { id: 'antragsgegnerin', label: 'Antragsgegnerin (Behörde)', type: 'text', required: true, placeholder: 'Land Berlin, vertreten durch das LEA' },
      { id: 'anordnungDatum', label: 'Datum der Abschiebungsanordnung', type: 'date', required: true },
      { id: 'aktenzeichen', label: 'Aktenzeichen der Behörde', type: 'text' },
      { id: 'eilbeduerftigkeit', label: 'Eilbedürftigkeit', type: 'textarea', required: true, placeholder: 'Flug gebucht auf ..., Vollzug unmittelbar bevorstehend' },
      { id: 'haerte', label: 'Härtegründe / Rechtsverstöße', type: 'textarea', required: true, hint: 'Art. 6 GG, Art. 8 EMRK, Art. 3 EMRK, Krankheit, familiäre Bindung.' },
    ],
    render: f => `An das ${f.gericht || '[Verwaltungsgericht]'}

Antrag nach § 80 Abs. 5 VwGO (Eilantrag)

in dem verwaltungsgerichtlichen Verfahren

${f.mandant || '[Mandant:in]'}${f.mandantAnschrift ? `, derzeit ${f.mandantAnschrift.replace(/\n/g, ', ')}` : ''}
— Antragsteller:in —
Prozessbevollmächtigte: Unterzeichnerin / Unterzeichner

gegen

${f.antragsgegnerin || '[Antragsgegnerin]'}
— Antragsgegnerin —

wegen Abschiebungsanordnung vom ${f.anordnungDatum || '[Datum]'}${f.aktenzeichen ? `, Az. ${f.aktenzeichen}` : ''}

namens und in Vollmacht der/des Antragstellerin:s beantrage ich,

1. die aufschiebende Wirkung des gleichzeitig erhobenen Widerspruchs / der Klage gegen die Abschiebungsanordnung vom ${f.anordnungDatum || '[Datum]'} gem. § 80 Abs. 5 VwGO anzuordnen bzw. wiederherzustellen,
2. der Antragsgegnerin im Wege des Hängebeschlusses aufzugeben, bis zur Entscheidung über diesen Eilantrag von Vollzugsmaßnahmen — insbesondere der Abschiebung — abzusehen,
3. der Antragsgegnerin die Kosten des Verfahrens aufzuerlegen,
4. meiner Mandantschaft Prozesskostenhilfe zu bewilligen und die Unterzeichnerin / den Unterzeichner beizuordnen (§ 166 VwGO i. V. m. §§ 114 ff. ZPO).

I. Sachverhalt

${f.eilbeduerftigkeit || '[Darstellung der unmittelbaren Vollzugsgefahr, Buchung Flug, Termin, Ingewahrsamnahme.]'}

II. Zulässigkeit

Der Antrag ist statthaft nach § 80 Abs. 5 VwGO. Eine aufschiebende Wirkung entfällt gem. § 84 Abs. 1 AufenthG bzw. § 75 AsylG, sodass die gerichtliche Anordnung geboten ist.

III. Begründetheit — Interessenabwägung

Das Suspensivinteresse meiner Mandantschaft überwiegt das Vollzugsinteresse der Antragsgegnerin erheblich:

${f.haerte || '[Ausführungen zu Art. 6 GG (Familie), Art. 8 EMRK (Privatleben), Art. 3 EMRK (Behandlung im Zielstaat), gesundheitlichen Abschiebungsverboten nach § 60 Abs. 7 AufenthG, Reiseunfähigkeit.]'}

Die Abschiebung würde irreparable Nachteile verursachen; der Bescheid erweist sich zudem bei summarischer Prüfung als offensichtlich rechtswidrig.

IV. Glaubhaftmachung

Zur Glaubhaftmachung dienen die anliegenden Unterlagen sowie die anwaltlich versicherten Angaben.

V. Anlagen

— Abschiebungsanordnung in Kopie
— Widerspruch / Klageschrift
— Atteste, Urkunden, eidesstattliche Versicherungen
— PKH-Erklärung nebst Belegen

Die anwaltliche Vertretungsvollmacht wird anwaltlich versichert.

${SIGN_OFF}
`,
  },

  // ---------------------------------
  {
    id: 'fiktionsbescheinigung',
    title: 'Antrag auf Fiktionsbescheinigung',
    description: 'Antrag auf Ausstellung einer Fiktionsbescheinigung gem. § 81 Abs. 5 AufenthG i. V. m. § 81 Abs. 4 AufenthG.',
    useCase: 'Laufender Aufenthaltstitel läuft ab, Verlängerungsantrag ist rechtzeitig gestellt — die Behörde zögert die Entscheidung hinaus. Fiktionsbescheinigung wird für Arbeit, Reise, Banken benötigt.',
    fields: [
      { id: 'behoerde', label: 'Ausländerbehörde', type: 'text', required: true },
      { id: 'mandant', label: 'Mandant:in', type: 'text', required: true },
      { id: 'ablaufenderTitel', label: 'Ablaufender Aufenthaltstitel', type: 'text', required: true, placeholder: 'AE § 18b AufenthG, gültig bis 12.05.2026' },
      { id: 'antragEingang', label: 'Verlängerungsantrag eingegangen am', type: 'date', required: true, hint: 'Fristwahrung § 81 Abs. 4 AufenthG.' },
      { id: 'eilbeduerftigkeit', label: 'Eilbedürftigkeit', type: 'textarea', required: true, placeholder: 'Dienstreise ins Ausland am ..., Arbeitgeber fordert Nachweis, Bank sperrt Konto' },
    ],
    render: f => `An ${f.behoerde || '[Ausländerbehörde]'}

Antrag auf Ausstellung einer Fiktionsbescheinigung
gem. § 81 Abs. 5 i. V. m. Abs. 4 AufenthG

Sehr geehrte Damen und Herren,

namens und im Auftrag meiner Mandantschaft, ${f.mandant || '[Mandant:in]'}, beantrage ich die unverzügliche

Ausstellung einer Fiktionsbescheinigung

gem. § 81 Abs. 5 AufenthG.

I. Rechtzeitige Antragstellung (§ 81 Abs. 4 AufenthG)

Meine Mandantschaft ist Inhaberin / Inhaber des Aufenthaltstitels ${f.ablaufenderTitel || '[Titel]'}. Der Antrag auf Verlängerung bzw. Erteilung eines neuen Titels wurde am ${f.antragEingang || '[Datum]'} und damit vor Ablauf des bisherigen Titels bei der Behörde eingereicht. Der bisherige Titel gilt gem. § 81 Abs. 4 S. 1 AufenthG bis zur Entscheidung der Behörde als fortbestehend.

II. Eilbedürftigkeit

${f.eilbeduerftigkeit || '[Konkrete Nachteile ohne Bescheinigung: Arbeitsplatzverlust, Reise, Sozialleistungsbezug, Bank, Mietvertrag.]'}

Ohne Aushändigung einer Fiktionsbescheinigung ist meine Mandantschaft nicht in der Lage, den Fortbestand des Aufenthaltstitels gegenüber Dritten (Arbeitgeber, Banken, Grenzbehörden) nachzuweisen. Dies ist mit dem Sinn und Zweck des § 81 Abs. 4 AufenthG unvereinbar.

III. Rechtsanspruch

§ 81 Abs. 5 AufenthG begründet einen Anspruch auf Ausstellung der Bescheinigung; ein Ermessen besteht insoweit nicht. Die Behörde ist zur unverzüglichen Ausstellung verpflichtet.

IV. Bitte um Terminvergabe

Ich bitte um kurzfristige Terminvergabe innerhalb der nächsten zehn Tage und weise vorsorglich darauf hin, dass bei weiterer Verzögerung ein Eilrechtsschutzverfahren nach § 123 VwGO geprüft werden wird.

V. Anlagen

— bisheriger Aufenthaltstitel (Kopie)
— Eingangsbestätigung des Verlängerungsantrags
— Nachweise Eilbedürftigkeit (Arbeitgeber-Bescheinigung, Reisebuchung etc.)

Die anwaltliche Vertretungsvollmacht wird anwaltlich versichert.

${SIGN_OFF}
`,
  },

  // ---------------------------------
  {
    id: 'haertefall_antrag',
    title: 'Härtefallantrag (§ 23a AufenthG)',
    description: 'Antrag auf Ersuchen der Härtefallkommission um Erteilung einer Aufenthaltserlaubnis aus dringenden humanitären oder persönlichen Gründen.',
    useCase: 'Mandantschaft ist ausreisepflichtig, aber tief in Deutschland verwurzelt; andere Wege sind ausgeschöpft. Die Härtefallkommission des Landes kann ein Ersuchen an die oberste Landesbehörde richten (§ 23a AufenthG).',
    fields: [
      { id: 'kommission', label: 'Härtefallkommission (Bundesland)', type: 'text', required: true, placeholder: 'Härtefallkommission des Landes Berlin bei der Senatsverwaltung für Inneres' },
      { id: 'mandant', label: 'Mandant:in', type: 'text', required: true },
      { id: 'mandantDaten', label: 'Geburtsdatum / Staatsangehörigkeit', type: 'text' },
      { id: 'aufenthaltSeit', label: 'Aufenthalt in Deutschland seit', type: 'date', required: true },
      { id: 'aktuellerStatus', label: 'Aktueller Status', type: 'text', placeholder: 'Duldung § 60a AufenthG seit ...' },
      { id: 'verwurzelung', label: 'Soziale und wirtschaftliche Verwurzelung', type: 'textarea', required: true, hint: 'Arbeit, Sprache, Familie, Schule der Kinder, Ehrenamt.' },
      { id: 'haertegruende', label: 'Besondere Härtegründe', type: 'textarea', required: true, hint: 'Warum wäre die Ausreise unzumutbar? Krankheit, Kinder, kulturelle Entwurzelung.' },
    ],
    render: f => `An die ${f.kommission || '[Härtefallkommission]'}

Eingabe an die Härtefallkommission
gem. § 23a AufenthG i. V. m. der Härtefallkommissionsverordnung des Landes

in der Ausländersache ${f.mandant || '[Mandant:in]'}${f.mandantDaten ? ` (${f.mandantDaten})` : ''}

Sehr geehrte Mitglieder der Härtefallkommission,

namens und im Auftrag meiner Mandantschaft wende ich mich mit der Bitte an die Kommission,

ein Ersuchen an die oberste Landesbehörde zu richten,

der oder dem Mandantin / Mandanten abweichend von den Erteilungs- und Verlängerungsvoraussetzungen des Aufenthaltsgesetzes eine Aufenthaltserlaubnis gem. § 23a AufenthG zu erteilen.

I. Persönliche Verhältnisse

Meine Mandantschaft hält sich seit ${f.aufenthaltSeit || '[Datum]'} ununterbrochen im Bundesgebiet auf. Aktueller Status: ${f.aktuellerStatus || '[Status]'}.

II. Soziale und wirtschaftliche Verwurzelung

${f.verwurzelung || '[Dichte Schilderung: Sprachniveau, Erwerbstätigkeit, Familie, Schule/Ausbildung der Kinder, Wohnsituation, Ehrenamt, Freundeskreis.]'}

III. Besondere Härtegründe (§ 23a Abs. 1 AufenthG)

${f.haertegruende || '[Warum rechtfertigen die persönlichen Umstände eine Aufenthaltsgewährung aus dringenden humanitären oder persönlichen Gründen? Warum wäre die Ausreise eine besondere Härte — Krankheit, Kindeswohl, Entwurzelung, Bleibeinteresse Art. 8 EMRK.]'}

IV. Ausschlussgründe

Ausschlussgründe i. S. d. § 23a Abs. 1 S. 3 AufenthG (schwere Straftaten, Bezug zu Extremismus) liegen nicht vor. Die Passbeschaffung ist — soweit erforderlich — eingeleitet bzw. unmöglich und wird nachgewiesen.

V. Sicherung des Lebensunterhalts / Verpflichtungserklärung

Der Lebensunterhalt ist gesichert bzw. kann durch die beigefügte Verpflichtungserklärung gesichert werden. Ein Bezug öffentlicher Leistungen ist nicht bzw. nur in unvermeidbarem Umfang gegeben.

VI. Anträge

Ich bitte die Kommission,
1. die Sache zur Beratung und Entscheidung anzunehmen,
2. ein Ersuchen gem. § 23a AufenthG an die oberste Landesbehörde zu richten,
3. bis zur Entscheidung bei der Ausländerbehörde auf Aussetzung etwaiger aufenthaltsbeendender Maßnahmen hinzuwirken.

VII. Anlagen

— Lebenslauf, Lichtbild
— Nachweise Aufenthalt, Duldungen
— Arbeits-/Ausbildungsnachweise, Sprachzertifikate
— Schul- und Zeugnisbescheinigungen der Kinder
— ärztliche Atteste
— Referenzschreiben (Arbeitgeber, Schule, Gemeinde, Nachbarschaft)

Die anwaltliche Vertretungsvollmacht wird anwaltlich versichert.

${SIGN_OFF}
`,
  },

  // ---------------------------------
  {
    id: 'familienasyl_antrag',
    title: 'Antrag auf Familienasyl / Familienflüchtlingsschutz',
    description: 'Antrag gem. § 26 AsylG auf Ableitung des Schutzstatus von einer stammberechtigten Person.',
    useCase: 'Stammberechtigte Person hat bestandskräftig Asyl, Flüchtlingsschutz oder subsidiären Schutz; Ehegatt:in oder minderjähriges lediges Kind leitet den Status ab.',
    fields: [
      { id: 'bamf', label: 'Empfänger:in', type: 'text', required: true, placeholder: 'Bundesamt für Migration und Flüchtlinge, Außenstelle Berlin' },
      { id: 'antragsteller', label: 'Antragsteller:in', type: 'text', required: true },
      { id: 'antragstellerDaten', label: 'Geburtsdatum / Staatsangehörigkeit', type: 'text' },
      { id: 'stamm', label: 'Stammberechtigte Person', type: 'text', required: true, hint: 'Name, BAMF-Az.' },
      { id: 'verhaeltnis', label: 'Verwandtschaftsverhältnis', type: 'text', required: true, placeholder: 'Ehegatte / minderjähriges lediges Kind / Elternteil eines minderj. Stammberechtigten' },
      { id: 'bestandskraft', label: 'Bestandskraft der Stamm-Anerkennung', type: 'date', required: true, hint: '§ 26 Abs. 1 Nr. 3 / Abs. 2 Nr. 2 / Abs. 3 Nr. 3 AsylG.' },
      { id: 'einreise', label: 'Einreise der/des Antragsteller:in', type: 'date', hint: '§ 26 Abs. 1 Nr. 2 AsylG — vor/innerhalb welcher Frist?' },
    ],
    render: f => `An das ${f.bamf || '[Bundesamt für Migration und Flüchtlinge]'}

Antrag auf Familienasyl / Familienflüchtlingsschutz / internationalen Schutz
gem. § 26 AsylG

in der Asylsache ${f.antragsteller || '[Antragsteller:in]'}${f.antragstellerDaten ? ` (${f.antragstellerDaten})` : ''}

Sehr geehrte Damen und Herren,

namens und im Auftrag meiner Mandantschaft beantrage ich

die Zuerkennung der Flüchtlingseigenschaft bzw. Anerkennung als Asylberechtigte:r, hilfsweise die Zuerkennung des subsidiären Schutzstatus,

abgeleitet gem. § 26 AsylG von der stammberechtigten Person.

I. Stammberechtigte Person

${f.stamm || '[Name und Aktenzeichen der stammberechtigten Person]'} wurde mit unanfechtbarem Bescheid des Bundesamtes vom ${f.bestandskraft || '[Datum]'} als Asylberechtigte:r anerkannt bzw. ihr/ihm wurde die Flüchtlingseigenschaft oder der subsidiäre Schutzstatus zuerkannt. Die Bestandskraft ist gewahrt (§ 26 Abs. 1 Nr. 3, Abs. 2 Nr. 2, Abs. 3 Nr. 3 AsylG).

II. Verwandtschaftsverhältnis

Meine Mandantschaft steht zu der stammberechtigten Person in folgendem Verhältnis: ${f.verhaeltnis || '[Verhältnis]'}. Die Verwandtschaft wird durch die anliegenden Personenstandsurkunden nachgewiesen.

III. Weitere Voraussetzungen

1. Die eheliche Lebensgemeinschaft / familiäre Lebensgemeinschaft bestand bereits in dem Staat, in dem die stammberechtigte Person politisch verfolgt wird (§ 26 Abs. 1 Nr. 2 AsylG).
2. Die Einreise der/des Antragsteller:in erfolgte am ${f.einreise || '[Einreisedatum]'}; der Antrag wird unverzüglich nach der Einreise gestellt (§ 26 Abs. 1 Nr. 1 AsylG).
3. Ausschlussgründe nach § 26 Abs. 4 AsylG (§§ 3 Abs. 2, 4 Abs. 2 AsylG) liegen nicht vor.

IV. Minderjährigkeit (bei Kindernachzug)

Sofern der Antrag für ein minderjähriges lediges Kind gestellt wird: Die Minderjährigkeit bestand auch zum Zeitpunkt der Asylantragstellung der stammberechtigten Person bzw. ist gem. § 26 Abs. 2 AsylG maßgeblich.

V. Antrag auf bevorzugte Bearbeitung

Da die familiäre Trennung Grundrechtspositionen aus Art. 6 GG und Art. 8 EMRK berührt, bitte ich um vorrangige Bearbeitung und Anhörung.

VI. Anlagen

— Pass / Passersatz
— Geburts- und Heiratsurkunden mit Apostille
— Anerkennungsbescheid der stammberechtigten Person
— Nachweise zur Einreise
— Anhörungsvorbereitung folgt gesondert

Die anwaltliche Vertretungsvollmacht wird anwaltlich versichert.

${SIGN_OFF}
`,
  },
]

/** Combined list for UI pickers: built-in + notar + migration. */
export const ALL_BUILTIN_TEMPLATES: LawyerTemplate[] = [
  ...LAWYER_TEMPLATES,
  ...NOTAR_TEMPLATES,
  ...MIGRATION_TEMPLATES,
]

export function getAnyBuiltinTemplate(id: string): LawyerTemplate | undefined {
  return ALL_BUILTIN_TEMPLATES.find(t => t.id === id)
}
