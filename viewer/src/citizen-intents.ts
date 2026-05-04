export interface CitizenIntentSource {
  law: string
  section: string
}

export interface CitizenIntent {
  id: string
  title: string
  category: string
  terms: string[]
  sourceLawIds: string[]
  preferredSections: string[]
  summary: string
  legalCore: string
  nextSteps: string[]
  urgentNote?: string
  sources: CitizenIntentSource[]
}

interface CitizenTopicFallback {
  id: string
  title: string
  terms: string[]
  clarification: string
}

export const citizenIntents: CitizenIntent[] = [
  {
    id: 'rent-eigenbedarf',
    title: 'Eigenbedarfskündigung',
    category: 'Miete & Wohnen',
    terms: ['eigenbedarf', 'vermieter', 'wohnung', 'rausschmei', 'kuendigung', 'kündigung'],
    sourceLawIds: ['bgb'],
    preferredSections: ['§ 573', '§ 574'],
    summary: 'Nein, dein Vermieter kann dich nicht einfach sofort wegen Eigenbedarf herauswerfen.',
    legalCore: 'Eine Eigenbedarfskündigung muss schriftlich sein und nachvollziehbar erklären, wer die Wohnung braucht und warum. Außerdem gelten Kündigungsfristen. In manchen Fällen kannst du wegen besonderer Härte widersprechen, zum Beispiel bei Krankheit, hohem Alter oder fehlendem Ersatzwohnraum.',
    nextSteps: [
      'Kündigungsschreiben und Begründung sichern.',
      'Datum notieren und Kündigungsfrist prüfen.',
      'Prüfen, ob der Eigenbedarf konkret erklärt ist.',
      'Bei besonderer Härte früh Widerspruch prüfen lassen.',
    ],
    sources: [
      { law: 'BGB', section: '§ 573' },
      { law: 'BGB', section: '§ 574' },
    ],
  },
  {
    id: 'job-termination',
    title: 'Kündigung im Job',
    category: 'Arbeit & Job',
    terms: ['chef', 'arbeitgeber', 'kuendig', 'kündig', 'rausschmei', 'arbeitsplatz'],
    sourceLawIds: ['kschg'],
    preferredSections: ['§ 1', '§ 4'],
    summary: 'Nein, eine Kündigung ist nicht automatisch wirksam.',
    legalCore: 'Wichtig ist vor allem, ob das Kündigungsschutzgesetz greift und ob die Kündigung sozial gerechtfertigt ist. Sehr oft zählt außerdem die 3-Wochen-Frist, innerhalb der man gegen die Kündigung vorgehen muss. Auch Formfehler können wichtig sein.',
    nextSteps: [
      'Kündigungsschreiben sichern.',
      'Zugangstag genau notieren.',
      'Sofort prüfen, ob die 3-Wochen-Frist läuft.',
      'Arbeitsvertrag und bisherige Schreiben bereitlegen.',
    ],
    urgentNote: 'Wenn du schon ein schriftliches Kündigungsschreiben hast, ist die Frist oft das Wichtigste.',
    sources: [
      { law: 'KSchG', section: '§ 1' },
      { law: 'KSchG', section: '§ 4' },
    ],
  },
  {
    id: 'animal-cruelty',
    title: 'Tierquälerei melden',
    category: 'Tierschutz',
    terms: ['tierquaelerei', 'tierquälerei', 'tierschutz', 'tier', 'hund', 'katze'],
    sourceLawIds: ['tierschg'],
    preferredSections: ['§ 3', '§ 17', '§ 18'],
    summary: 'Tierquälerei kann verboten und in schweren Fällen sogar strafbar sein.',
    legalCore: 'Nach dem Tierschutzgesetz darf niemand Tieren ohne vernünftigen Grund Schmerzen, Leiden oder Schäden zufügen. Besonders schwere Fälle mit Wirbeltieren können strafrechtlich relevant sein.',
    nextSteps: [
      'Ort, Zeit und Beobachtung notieren.',
      'Wenn möglich Fotos oder Zeugen sichern.',
      'In dringenden Fällen die Polizei kontaktieren.',
      'Sonst beim Veterinäramt oder Ordnungsamt melden.',
    ],
    sources: [
      { law: 'TierSchG', section: '§ 3' },
      { law: 'TierSchG', section: '§ 17' },
      { law: 'TierSchG', section: '§ 18' },
    ],
  },
  {
    id: 'medicine-costs',
    title: 'Medikamente zu teuer',
    category: 'Gesundheit',
    terms: ['medikament', 'arznei', 'krankenkasse', 'zuzahlung', 'nicht leisten', 'zu teuer', 'bezahlen'],
    sourceLawIds: ['sgb_5'],
    preferredSections: ['§ 27', '§ 31', '§ 61', '§ 62'],
    summary: 'Wenn du gesetzlich versichert bist, musst du Medikamente oft nicht komplett selbst zahlen.',
    legalCore: 'Häufig gibt es nur eine Zuzahlung. Bei geringerem Einkommen oder hoher Belastung kann auch eine Befreiung oder Entlastung in Betracht kommen. Entscheidend ist außerdem, ob es ein Kassenrezept gibt und ob die Krankenkasse die Leistung grundsätzlich übernimmt.',
    nextSteps: [
      'Rezept, Preis und Kassenstatus prüfen.',
      'Arztpraxis nach günstiger oder erstattungsfähiger Alternative fragen.',
      'Krankenkasse nach Zuzahlung, Befreiung oder Kostenübernahme fragen.',
    ],
    sources: [
      { law: 'SGB 5', section: '§ 27' },
      { law: 'SGB 5', section: '§ 61' },
    ],
  },
  {
    id: 'rent-increase',
    title: 'Mieterhöhung',
    category: 'Miete & Wohnen',
    terms: ['mieterhoehung', 'mieterhöhung', 'miete erhöhen', 'miete erhoehen'],
    sourceLawIds: ['bgb'],
    preferredSections: ['§ 558'],
    summary: 'Nein, dein Vermieter darf die Miete nicht einfach beliebig erhöhen.',
    legalCore: 'Wichtig ist, ob die Erhöhung formell richtig begründet ist und ob gesetzliche Grenzen eingehalten werden, zum Beispiel Vergleichsmiete und Sperrfristen. Du musst eine Erhöhung nicht ungeprüft sofort akzeptieren.',
    nextSteps: [
      'Schreiben sichern.',
      'Datum notieren.',
      'Begründung und Vergleichsmiete prüfen.',
      'Fristen für Zustimmung oder Reaktion prüfen.',
    ],
    sources: [{ law: 'BGB', section: '§ 558' }],
  },
  {
    id: 'rent-reduction',
    title: 'Mietminderung',
    category: 'Miete & Wohnen',
    terms: ['mietminderung', 'miete kuerzen', 'miete kürzen', 'heizung kaputt', 'schimmel'],
    sourceLawIds: ['bgb'],
    preferredSections: ['§ 536'],
    summary: 'Bei einem erheblichen Wohnungsmangel kann eine Mietminderung in Betracht kommen.',
    legalCore: 'Wichtig ist, den Mangel zuerst zu dokumentieren und dem Vermieter zu melden. Einfach sofort weniger zu zahlen ist riskant. Wie hoch eine Mietminderung sein kann, hängt vom Einzelfall ab.',
    nextSteps: [
      'Mangel mit Fotos oder Videos sichern.',
      'Vermieter schriftlich informieren.',
      'Datum und Reaktion dokumentieren.',
      'Erst danach die Höhe einer möglichen Minderung prüfen.',
    ],
    sources: [{ law: 'BGB', section: '§ 536' }],
  },
  {
    id: 'citizen-income',
    title: 'Bürgergeld',
    category: 'Geld & Steuern',
    terms: ['bürgergeld', 'jobcenter', 'regelsatz', 'sanktion', 'grundsicherung'],
    sourceLawIds: ['sgb_2'],
    preferredSections: ['§ 19', '§ 31'],
    summary: 'Beim Bürgergeld kommt es stark auf Bescheid, Fristen und anerkannte Bedarfe an.',
    legalCore: 'Streit entsteht oft bei Kürzungen, Anrechnung von Einkommen oder Pflichten gegenüber dem Jobcenter. Wichtig ist, Bescheide nicht liegen zu lassen, weil Fehler oft nur rechtzeitig angegriffen werden können.',
    nextSteps: [
      'Bescheid sichern.',
      'Zugangstag notieren.',
      'Prüfen, ob Einkommen oder Bedarf falsch angerechnet wurde.',
      'Frist für Widerspruch oder Nachweise prüfen.',
    ],
    sources: [
      { law: 'SGB 2', section: '§ 19' },
      { law: 'SGB 2', section: '§ 31' },
    ],
  },
  {
    id: 'housing-benefit',
    title: 'Wohngeld',
    category: 'Miete & Wohnen',
    terms: ['wohngeld', 'miete zu hoch', 'wohnen nicht leisten'],
    sourceLawIds: ['wofg'],
    preferredSections: ['§ 3', '§ 13'],
    summary: 'Ob du Wohngeld bekommen kannst, hängt vor allem von Einkommen, Miete und Haushaltsgröße ab.',
    legalCore: 'Wohngeld ist keine Standardleistung für alle, sondern hängt von deinen Lebensumständen ab. Entscheidend sind meist Einkommen, Zahl der Haushaltsmitglieder und wie hoch die berücksichtigungsfähige Miete ist.',
    nextSteps: [
      'Monatliches Einkommen und Haushaltsgröße notieren.',
      'Mietvertrag und aktuelle Miethöhe bereitlegen.',
      'Prüfen, ob bereits andere Leistungen bezogen werden, die Wohngeld ausschließen können.',
      'Dann den Wohngeldantrag bei der zuständigen Stelle prüfen oder stellen.',
    ],
    sources: [
      { law: 'WoFG', section: '§ 3' },
      { law: 'WoFG', section: '§ 13' },
    ],
  },
  {
    id: 'online-insult',
    title: 'Online-Beleidigung',
    category: 'Internet & Recht',
    terms: ['online beleidigt', 'beleidigt', 'beleidigung', 'instagram', 'tiktok', 'facebook', 'kommentar'],
    sourceLawIds: ['stgb', 'netzdg'],
    preferredSections: ['§ 185'],
    summary: 'Online-Beleidigungen können rechtlich relevant sein und du musst sie nicht einfach hinnehmen.',
    legalCore: 'Entscheidend ist, was genau geschrieben wurde, ob du es sichern kannst und ob zusätzlich Plattform-Meldungen oder Strafanzeige sinnvoll sind. Ohne Beweise wird es später oft schwerer.',
    nextSteps: [
      'Screenshots mit Datum und Profil sichern.',
      'Beitrag oder Nachricht bei der Plattform melden.',
      'Prüfen, ob eine Strafanzeige oder zivilrechtliche Schritte sinnvoll sind.',
      'Keine Beweise löschen oder nur auf Erinnerung vertrauen.',
    ],
    sources: [
      { law: 'StGB', section: '§ 185' },
      { law: 'NetzDG', section: '§ 3' },
    ],
  },
  {
    id: 'child-support',
    title: 'Unterhalt fürs Kind',
    category: 'Familie & Kinder',
    terms: ['unterhalt', 'vater zahlt nicht', 'mutter zahlt nicht', 'kindesunterhalt'],
    sourceLawIds: ['bgb'],
    preferredSections: ['§ 1601', '§ 1602'],
    summary: 'Eltern sind ihrem Kind grundsätzlich zum Unterhalt verpflichtet.',
    legalCore: 'Entscheidend ist, ob ein Unterhaltsanspruch besteht, wer zahlen muss und ob bereits Titel, Jugendamtsurkunde oder andere Unterlagen vorliegen. Oft geht es auch um schnelle Sicherung für das Kind.',
    nextSteps: [
      'Unterlagen zum Kind und zum anderen Elternteil sammeln.',
      'Prüfen, ob bereits ein Unterhaltstitel oder eine Jugendamtsurkunde existiert.',
      'Bei Ausfall des anderen Elternteils auch Unterhaltsvorschuss prüfen.',
      'Früh dokumentieren, seit wann nicht gezahlt wird.',
    ],
    sources: [
      { law: 'BGB', section: '§ 1601' },
      { law: 'BGB', section: '§ 1602' },
    ],
  },
  {
    id: 'child-benefit',
    title: 'Kindergeld',
    category: 'Familie & Kinder',
    terms: ['kindergeld', 'familienkasse', 'geld für mein kind'],
    sourceLawIds: ['estg'],
    preferredSections: ['§ 62', '§ 66'],
    summary: 'Kindergeld steht nicht automatisch jeder Person zu, sondern knüpft an gesetzliche Voraussetzungen an.',
    legalCore: 'Wichtig sind vor allem, für welches Kind du Leistungen beantragst, wer anspruchsberechtigt ist und ob die Familienkasse schon entschieden hat. Bei Ablehnung zählen Bescheid und Fristen.',
    nextSteps: [
      'Bescheid der Familienkasse sichern oder Antrag vorbereiten.',
      'Kind, Haushalt und Sorgeverhältnis sauber dokumentieren.',
      'Fristen bei Ablehnung oder Rückforderung prüfen.',
    ],
    sources: [
      { law: 'EStG', section: '§ 62' },
      { law: 'EStG', section: '§ 66' },
    ],
  },
  {
    id: 'parental-benefit',
    title: 'Elterngeld / Elternzeit',
    category: 'Familie & Kinder',
    terms: ['elterngeld', 'elternzeit', 'mutterschutz vorbei', 'baby geboren'],
    sourceLawIds: ['beeg'],
    preferredSections: ['§ 1', '§ 15'],
    summary: 'Elterngeld und Elternzeit hängen von Erwerbssituation, Kind und Antrag ab.',
    legalCore: 'Wichtig ist, ob es um Geld, Freistellung oder beides geht. Häufig sind Einkommen vor der Geburt, Arbeitsverhältnis und der rechtzeitige Antrag entscheidend.',
    nextSteps: [
      'Klären, ob es um Elterngeld, Elternzeit oder beides geht.',
      'Geburtsdatum und Erwerbssituation notieren.',
      'Antragsfristen und Arbeitgeber-Mitteilung prüfen.',
    ],
    sources: [
      { law: 'BEEG', section: '§ 1' },
      { law: 'BEEG', section: '§ 15' },
    ],
  },
  {
    id: 'discrimination',
    title: 'Diskriminierung',
    category: 'Internet & Recht',
    terms: ['diskriminierung', 'benachteiligt', 'rassismus', 'wegen meiner herkunft', 'wegen meines geschlechts'],
    sourceLawIds: ['agg'],
    preferredSections: ['§ 1', '§ 21'],
    summary: 'Benachteiligung wegen bestimmter persönlicher Merkmale kann rechtswidrig sein.',
    legalCore: 'Wichtig ist, wodurch du benachteiligt wurdest, in welchem Bereich das passiert ist und ob du Belege hast. Ohne Dokumentation wird es später oft schwerer.',
    nextSteps: [
      'Vorfall mit Datum, Ort und Beteiligten dokumentieren.',
      'Nachrichten, E-Mails oder Zeugen sichern.',
      'Prüfen, ob es um Arbeit, Wohnen oder Dienstleistungen geht.',
    ],
    sources: [
      { law: 'AGG', section: '§ 1' },
      { law: 'AGG', section: '§ 21' },
    ],
  },
  {
    id: 'sick-note',
    title: 'Krankmeldung im Job',
    category: 'Arbeit & Job',
    terms: ['krankmeldung', 'krankgeschrieben', 'krank im job', 'arbeitsunfaehig', 'arbeitsunfähig'],
    sourceLawIds: ['bgb'],
    preferredSections: ['§ 611a', '§ 616'],
    summary: 'Wenn du krank bist, sind Meldung, Nachweis und Zeitpunkt oft das Wichtigste.',
    legalCore: 'Streit entsteht häufig nicht, weil man krank ist, sondern weil Arbeitgeber sagen, dass Meldung oder Nachweis zu spät waren. Deshalb zählen Kommunikation und Dokumentation besonders.',
    nextSteps: [
      'Arbeitgeber sofort informieren.',
      'Arbeitsunfähigkeitsbescheinigung rechtzeitig sichern.',
      'Nachfragen, ab wann dein Arbeitgeber einen Nachweis verlangt.',
    ],
    sources: [
      { law: 'BGB', section: '§ 611a' },
      { law: 'BGB', section: '§ 616' },
    ],
  },
  {
    id: 'warning-at-work',
    title: 'Abmahnung im Job',
    category: 'Arbeit & Job',
    terms: ['abmahnung', 'abgemahnt', 'warnung vom chef'],
    sourceLawIds: ['bgb'],
    preferredSections: ['§ 314'],
    summary: 'Eine Abmahnung ist nicht automatisch wirksam, aber sie sollte ernst genommen werden.',
    legalCore: 'Wichtig ist, was dir konkret vorgeworfen wird, ob der Vorwurf stimmt und ob die Abmahnung später für weitere arbeitsrechtliche Schritte genutzt werden könnte.',
    nextSteps: [
      'Abmahnung vollständig sichern.',
      'Vorwurf und Datum genau prüfen.',
      'Eigene Darstellung und mögliche Belege sammeln.',
      'Nicht vorschnell inhaltlich zustimmen.',
    ],
    sources: [{ law: 'BGB', section: '§ 314' }],
  },
  {
    id: 'service-charge',
    title: 'Nebenkostenabrechnung',
    category: 'Miete & Wohnen',
    terms: ['nebenkosten', 'abrechnung', 'heizkostenabrechnung', 'zu hoch'],
    sourceLawIds: ['bgb'],
    preferredSections: ['§ 556'],
    summary: 'Eine hohe Nebenkostenabrechnung ist nicht automatisch richtig.',
    legalCore: 'Wichtig ist, ob die Abrechnung formell stimmt, rechtzeitig kam und ob die einzelnen Positionen nachvollziehbar sind. Nicht jede Ausgabe darf einfach auf Mieter umgelegt werden.',
    nextSteps: [
      'Abrechnung und Zugangstag sichern.',
      'Einzelpositionen und Zeitraum prüfen.',
      'Belegeinsicht oder genauere Aufschlüsselung verlangen, wenn etwas unklar ist.',
    ],
    sources: [{ law: 'BGB', section: '§ 556' }],
  },
  {
    id: 'deposit',
    title: 'Mietkaution',
    category: 'Miete & Wohnen',
    terms: ['kaution', 'mietkaution', 'kaution zurück', 'kaution zurueck'],
    sourceLawIds: ['bgb'],
    preferredSections: ['§ 551'],
    summary: 'Die Mietkaution gehört nicht einfach dauerhaft dem Vermieter.',
    legalCore: 'Nach dem Mietende darf der Vermieter die Kaution nicht unbegrenzt ohne Grund einbehalten. Es kommt darauf an, ob noch berechtigte Forderungen offen sind und wie lange die Prüfung dauern darf.',
    nextSteps: [
      'Auszug und Übergabeprotokoll sichern.',
      'Schriftlich nach dem Stand der Kaution fragen.',
      'Prüfen, ob der Vermieter konkrete Gegenforderungen nennt.',
    ],
    sources: [{ law: 'BGB', section: '§ 551' }],
  },
]

const citizenTopicFallbacks: CitizenTopicFallback[] = [
  {
    id: 'rent-topic',
    title: 'Mietrecht',
    terms: ['miete', 'vermieter', 'wohnung', 'nebenkosten', 'kaution', 'schimmel'],
    clarification: 'Das klingt nach Mietrecht. Geht es eher um Kündigung, Mieterhöhung, Nebenkosten, Kaution oder einen Mangel in der Wohnung?',
  },
  {
    id: 'job-topic',
    title: 'Arbeitsrecht',
    terms: ['chef', 'arbeitgeber', 'job', 'arbeitsvertrag', 'kündigung', 'abmahnung', 'krankgeschrieben'],
    clarification: 'Das klingt nach Arbeitsrecht. Geht es eher um Kündigung, Abmahnung, Krankheit, Arbeitszeit oder Lohn?',
  },
  {
    id: 'health-topic',
    title: 'Krankenversicherung',
    terms: ['krankenkasse', 'medikament', 'arzt', 'behandlung', 'zuzahlung', 'rezept'],
    clarification: 'Das klingt nach Krankenversicherung oder Gesundheitsrecht. Geht es um Medikamente, Behandlungskosten, Krankengeld oder eine Entscheidung der Krankenkasse?',
  },
  {
    id: 'family-topic',
    title: 'Familie & Kinder',
    terms: ['kind', 'unterhalt', 'elterngeld', 'elternzeit', 'familienkasse', 'sorgerecht'],
    clarification: 'Das klingt nach Familienrecht oder Familienleistungen. Geht es eher um Unterhalt, Kindergeld, Elterngeld, Elternzeit oder Sorgefragen?',
  },
  {
    id: 'social-topic',
    title: 'Sozialleistungen',
    terms: ['jobcenter', 'bürgergeld', 'bescheid', 'wohngeld', 'grundsicherung', 'familienkasse'],
    clarification: 'Das klingt nach Sozialleistungen. Von welcher Stelle kommt der Bescheid oder die Frage genau, zum Beispiel Jobcenter, Wohngeldstelle, Familienkasse oder Krankenkasse?',
  },
  {
    id: 'digital-topic',
    title: 'Internet & Recht',
    terms: ['online', 'instagram', 'facebook', 'tiktok', 'kommentar', 'beleidigt', 'internet'],
    clarification: 'Das klingt nach einem Problem im Internet. Geht es eher um Beleidigung, Bedrohung, Daten, Plattform-Meldung oder Betrug?',
  },
  {
    id: 'migration-topic',
    title: 'Aufenthalt & Migration',
    terms: ['aufenthalt', 'visum', 'abschiebung', 'einbürgerung', 'familie nachholen'],
    clarification: 'Das klingt nach Aufenthaltsrecht. Geht es eher um Aufenthaltstitel, Visum, Einbürgerung, Arbeitserlaubnis oder eine drohende Maßnahme?',
  },
]

export function scoreCitizenIntents(question: string) {
  const q = question.toLowerCase()
  return citizenIntents
    .map(intent => ({
      intent,
      score: intent.terms.reduce((acc, term) => {
        if (!q.includes(term)) return acc
        const phraseWeight = term.includes(' ') ? 100 : 10
        return acc + phraseWeight + term.length
      }, 0),
    }))
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
}

export function detectCitizenIntent(question: string): CitizenIntent | null {
  return scoreCitizenIntents(question)[0]?.intent || null
}

export function detectCitizenClarification(question: string): string | null {
  const q = question.toLowerCase()
  const scored = scoreCitizenIntents(question)
  const top = scored[0]
  const second = scored[1]

  if (
    q.includes('vermieter') &&
    !q.includes('eigenbedarf') &&
    !q.includes('mieterhöhung') &&
    !q.includes('mieterhoehung') &&
    !q.includes('heizung') &&
    !q.includes('schimmel') &&
    !q.includes('nebenkosten') &&
    !q.includes('kaution')
  ) {
    return 'Das klingt nach Mietrecht. Geht es eher um Kündigung, Mieterhöhung, Nebenkosten, Kaution oder einen Mangel in der Wohnung?'
  }

  if (
    q.includes('krankenkasse') &&
    !q.includes('medikament') &&
    !q.includes('arznei') &&
    !q.includes('rezept') &&
    !q.includes('zuzahlung') &&
    !q.includes('krankengeld')
  ) {
    return 'Das klingt nach Krankenversicherung oder Gesundheitsrecht. Geht es um Medikamente, Behandlungskosten, Krankengeld oder eine Entscheidung der Krankenkasse?'
  }

  if (q.includes('kündig') && !q.includes('vermieter') && !q.includes('chef') && !q.includes('arbeitgeber')) {
    return 'Geht es bei der Kündigung um deinen Job oder um deine Wohnung?'
  }

  if ((q.includes('kasse') || q.includes('zahlt')) && !q.includes('medikament') && !q.includes('arzt') && !q.includes('krankenkasse')) {
    return 'Geht es um Medikamente, eine Behandlung oder etwas anderes? Und bist du gesetzlich oder privat versichert?'
  }

  if (q.includes('bescheid') && !q.includes('jobcenter') && !q.includes('familienkasse') && !q.includes('krankenkasse')) {
    return 'Von welcher Stelle kommt der Bescheid genau, zum Beispiel Jobcenter, Familienkasse oder Krankenkasse?'
  }

  if (top && second && top.score - second.score <= 8 && top.intent.id !== second.intent.id) {
    return `Ich bin noch nicht sicher, welches Problem genau gemeint ist. Meinst du eher "${top.intent.title}" oder "${second.intent.title}"?`
  }

  const topicFallback = citizenTopicFallbacks.find(topic =>
    topic.terms.some(term => q.includes(term)),
  )
  if (!top && topicFallback) {
    return topicFallback.clarification
  }

  return null
}

export function renderCitizenIntentAnswer(intent: CitizenIntent): string {
  const steps = intent.nextSteps.map((step, index) => `${index + 1}. ${step}`).join('\n')
  const urgent = intent.urgentNote ? `\n\nWann du schnell handeln solltest:\n${intent.urgentNote}` : ''

  return [
    'Kurz gesagt:',
    intent.summary,
    '',
    'Worauf es ankommt:',
    intent.legalCore,
    '',
    'Was du jetzt tun kannst:',
    steps,
    urgent,
  ]
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}
