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

/** Combined list for UI pickers: built-in + notar-spezial. */
export const ALL_BUILTIN_TEMPLATES: LawyerTemplate[] = [...LAWYER_TEMPLATES, ...NOTAR_TEMPLATES]

export function getAnyBuiltinTemplate(id: string): LawyerTemplate | undefined {
  return ALL_BUILTIN_TEMPLATES.find(t => t.id === id)
}
