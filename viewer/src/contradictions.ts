/**
 * Legal contradictions — where German laws contradict themselves or reality.
 * Each entry cites exact paragraphs from our law database.
 */

export interface Contradiction {
  id: string
  emoji: string
  title: string
  category: string
  severity: 'krass' | 'ernst' | 'absurd'
  lawSays: { law: string; paragraph: string; quote: string; lawId?: string }
  realitySays: string
  contradiction: string
  numbers?: string // hard data
  whyNothingHappens: string
  whatShouldChange: string
}

export const contradictions: Contradiction[] = [
  {
    id: "tierschutz-massentierhaltung",
    emoji: "🐷",
    title: "§ 1 TierSchG verbietet Tierquälerei — Massentierhaltung ist legal",
    category: "Tierschutz",
    severity: "krass",
    lawSays: {
      law: "Tierschutzgesetz",
      paragraph: "§ 1",
      quote: "Niemand darf einem Tier ohne vernünftigen Grund Schmerzen, Leiden oder Schäden zufügen.",
      lawId: "tierschg",
    },
    realitySays: "750 Millionen Tiere werden jährlich in Deutschland geschlachtet. Schweine haben 0,75m² Platz. Hühner werden in 35 Tagen auf 2kg gemästet — ihre Knochen brechen unter dem eigenen Gewicht.",
    contradiction: "Ist Geschmack ein 'vernünftiger Grund'? Wenn pflanzliche Ernährung für alle Lebensphasen geeignet ist (Academy of Nutrition and Dietetics), dann ist die Antwort: Nein. Dann ist jede Schlachtung für den Konsum ein Verstoß gegen § 1.",
    numbers: "750 Mio. Tiere/Jahr geschlachtet · 0,75m² pro Schwein · ~300.000 Fehlbetäubungen/Jahr (Uni Göttingen) · €0 Mindeststrafe für Tierquälerei",
    whyNothingHappens: "Die Tierschutz-Nutztierhaltungsverordnung LEGALISIERT was das Tierschutzgesetz verbietet. Ausnahmen fressen die Regel. Kein bundesweites Verbandsklagerecht — Tiere können nicht klagen.",
    whatShouldChange: "Art. 20a GG: 'schützt' → 'achtet die Würde'. Verbandsklagerecht bundesweit. Massentierhaltung auslaufen lassen (wie NL: 3.000 Höfe aufkaufen). Veganes Schulessen als Standard.",
  },
  {
    id: "qualzucht",
    emoji: "🐕",
    title: "§ 11b verbietet Qualzucht — Möpse und Bulldoggen sind frei verkäuflich",
    category: "Tierschutz",
    severity: "krass",
    lawSays: {
      law: "Tierschutzgesetz",
      paragraph: "§ 11b",
      quote: "Es ist verboten, Wirbeltiere zu züchten, soweit [...] erblich bedingt Körperteile oder Organe für den artgemäßen Gebrauch fehlen oder untauglich sind und hierdurch Schmerzen, Leiden oder Schäden auftreten.",
      lawId: "tierschg",
    },
    realitySays: "Möpse können kaum atmen (Brachycephales Syndrom). Bulldoggen können nicht natürlich gebären. Deutsche Schäferhunde haben Hüftdysplasie. Alle frei verkäuflich, auf jeder Hundeausstellung präsentiert.",
    contradiction: "§ 11b verbietet explizit Qualzucht. Trotzdem werden diese Rassen weiter gezüchtet, ausgestellt und verkauft. Das Gesetz wird schlicht nicht durchgesetzt.",
    numbers: "~10 Mio. Hunde in DE · Mops: 90% brauchen Nasen-OP · Englische Bulldogge: 80% per Kaiserschnitt geboren",
    whyNothingHappens: "Keine konsequente Durchsetzung durch Veterinärämter. Zuchtverbände regulieren sich selbst. Bußgelder so niedrig, dass sie als Betriebskosten einkalkuliert werden.",
    whatShouldChange: "Zuchtstandards gesetzlich definieren. Verkaufsverbot für Qualzuchtrassen. Verpflichtende Gesundheitstests vor Zucht.",
  },
  {
    id: "schwarzfahren-cumex",
    emoji: "🚃",
    title: "Schwarzfahren = Gefängnis. Cum-Ex-Betrug = Bewährung.",
    category: "Strafrecht",
    severity: "absurd",
    lawSays: {
      law: "Strafgesetzbuch",
      paragraph: "§ 265a",
      quote: "Wer die Leistung eines Automaten, die Beförderung durch ein Verkehrsmittel [...] erschleicht, wird mit Freiheitsstrafe bis zu einem Jahr oder mit Geldstrafe bestraft.",
      lawId: "stgb",
    },
    realitySays: "~7.000 Menschen sitzen jährlich in Deutschland im Gefängnis wegen Schwarzfahrens. Die Inhaftierung kostet den Staat ~€200 Mio./Jahr. Gleichzeitig: Cum-Ex-Betrug mit €55 Mrd. Schaden → die meisten Täter bekommen Bewährungsstrafen.",
    contradiction: "€2,80 Schaden = Gefängnis. €55.000.000.000 Schaden = Bewährung. Das Strafmaß steht in keinem Verhältnis zur gesellschaftlichen Schädlichkeit.",
    numbers: "7.000 Inhaftierte/Jahr · €200 Mio. Kosten · €2,80 vs. €55 Mrd. Schaden · Mehrere Parteien fordern Entkriminalisierung",
    whyNothingHappens: "Schwarzfahrer haben keine Lobby. Cum-Ex-Täter haben Top-Anwälte. Der Mythos 'wer nicht zahlt muss bestraft werden' sitzt tief.",
    whatShouldChange: "Schwarzfahren → Ordnungswidrigkeit statt Straftat. Spart €200 Mio./Jahr, entlastet Gerichte und Gefängnisse. Cum-Ex: Mindeststrafen einführen.",
  },
  {
    id: "klima-autobahn",
    emoji: "🛣️",
    title: "€22 Mrd./Jahr fossile Subventionen — trotz Klimaneutralitätsziel 2045",
    category: "Klimaschutz",
    severity: "ernst",
    lawSays: {
      law: "Klimaschutzgesetz",
      paragraph: "§ 3",
      quote: "Die Treibhausgasemissionen werden schrittweise gemindert. Ziel ist die Erreichung der Netto-Treibhausgasneutralität bis 2045.",
      lawId: "ksg",
    },
    realitySays: "Der Bundesverkehrswegeplan plant 850 km neue Autobahnen. Gleichzeitig: Dieselprivileg (€8,2 Mrd./Jahr Subvention), Kerosinsteuerbefreiung (Flüge künstlich verbilligt vs. Bahn), kein Tempolimit. Gegenargument: Wenn alle E-Autos fahren, wäre Autobahnausbau klimaneutral möglich.",
    contradiction: "Der Widerspruch liegt weniger im Straßenbau selbst als in den fossilen Subventionen: Diesel €8,2 Mrd./Jahr verbilligt, Kerosin steuerfrei, Dienstwagenprivileg — alles Anreize für fossile Mobilität. Mit 100% E-Mobilität + erneuerbarem Strom wäre Autobahnausbau weniger problematisch. Aber: Wir sind bei ~25% E-Auto-Neuzulassungen, nicht bei 100%.",
    numbers: "850 km neue Autobahn · Dieselprivileg: €8,2 Mrd./Jahr · Kerosin: steuerfrei · E-Auto-Anteil Neuzulassungen: ~25% · Dienstwagenprivileg: €5,5 Mrd./Jahr",
    whyNothingHappens: "Die fossilen Subventionen halten das alte System künstlich am Leben. Autolobby ist mächtig, 'Freie Fahrt' ist quasi-religiös. Aber: der echte Hebel liegt bei den Subventionen, nicht beim Straßenbau per se.",
    whatShouldChange: "Fossile Subventionen abschaffen (Diesel, Kerosin, Dienstwagen = €22 Mrd./Jahr). E-Mobilität + Ladeinfrastruktur beschleunigen. Tempolimit als Brückenmaßnahme bis E-Mobilität Standard ist. Schiene ausbauen als Alternative.",
  },
  {
    id: "splitting-gleichstellung",
    emoji: "⚖️",
    title: "Art. 3 GG fordert Gleichberechtigung — Ehegattensplitting belohnt Ungleichheit",
    category: "Gleichstellung",
    severity: "ernst",
    lawSays: {
      law: "Grundgesetz",
      paragraph: "Art. 3 Abs. 2",
      quote: "Männer und Frauen sind gleichberechtigt. Der Staat fördert die tatsächliche Durchsetzung der Gleichberechtigung.",
      lawId: "gg",
    },
    realitySays: "Ehegattensplitting (§ 32a EStG) gibt den größten Steuervorteil bei maximaler Einkommensungleichheit in der Ehe. Alleinverdiener-Ehe mit €100K: ~€9.000 Vorteil. Gleiche Einkommen: €0 Vorteil.",
    contradiction: "Der Staat soll Gleichberechtigung FÖRDERN (GG) — und belohnt gleichzeitig FINANZIELL das Gegenteil (EStG). Der Steueranreiz wirkt gegen die Erwerbstätigkeit des geringer verdienenden Partners, meist der Frau.",
    numbers: "25 Mrd. €/Jahr kostet Splitting · 91% der Begünstigten: Paare mit Kindern · Aber: Kinderlose Alleinverdiener-Ehen profitieren genauso",
    whyNothingHappens: "CDU/CSU blockiert: 'Familien dürfen nicht bestraft werden.' Aber Splitting fördert nicht Familien — es fördert Einverdiener-Ehen.",
    whatShouldChange: "Splitting deckeln bei €14.000 (DE-2030 Vorschlag). Kinderbonus €2.000/Kind stattdessen. Langfristig: Individualbesteuerung wie Schweden.",
  },
  {
    id: "foie-gras",
    emoji: "🦆",
    title: "Stopfmast in Deutschland verboten — Import von Foie Gras erlaubt",
    category: "Tierschutz",
    severity: "absurd",
    lawSays: {
      law: "Tierschutzgesetz",
      paragraph: "§ 3 Nr. 9",
      quote: "Es ist verboten, einem Tier durch Anwendung von Zwang Futter einzuverleiben, sofern dies nicht aus gesundheitlichen Gründen erforderlich ist.",
      lawId: "tierschg",
    },
    realitySays: "Foie Gras (Stopfleber) wird durch Zwangsfütterung hergestellt. Die PRODUKTION ist in Deutschland verboten — aber der IMPORT und KONSUM sind legal. In jedem Feinkostladen erhältlich.",
    contradiction: "Wenn Zwangsfütterung so schlimm ist, dass sie in Deutschland verboten ist — warum darf das Produkt dieser Zwangsfütterung frei importiert und verkauft werden?",
    numbers: "~200 Tonnen Foie Gras/Jahr in DE verkauft · Frankreich produziert ~20.000 Tonnen/Jahr",
    whyNothingHappens: "EU-Binnenmarkt: Freier Warenverkehr. Ein nationales Importverbot wäre juristisch schwierig. Aber politisch: es fehlt der Wille.",
    whatShouldChange: "EU-weites Verbot der Stopfmast. Bis dahin: Kennzeichnungspflicht + Aufklärungskampagne. GitLaw macht den Widerspruch sichtbar.",
  },
]
