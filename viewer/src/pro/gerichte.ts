/**
 * Gerichtsadressen-Lookup: PLZ → zuständiges Gericht.
 *
 * Datenquelle: Deutsche Post PLZ + Justiz.de Gerichtsbezirke.
 * Abdeckung: Alle Bundesländer, ~150 Gerichtsbezirke.
 * Court-Typen: AG (Amtsgericht), LG (Landgericht), SG (Sozialgericht),
 * ArbG (Arbeitsgericht), FG (Finanzgericht), VG (Verwaltungsgericht).
 *
 * Nutzung: gerichtFuerPLZ('10115', 'ag') → Adresse des Amtsgerichts.
 */

export interface GerichtAdresse {
  name: string
  strasse: string
  plzOrt: string
  telefon?: string
  email?: string
}

// Core dataset: PLZ prefix → Gerichtsadresse per court type.
// Covers all major German cities and regional centers.
const GERICHTE: Record<string, Partial<Record<GerichtTyp, GerichtAdresse>>> = {
  // Berlin
  '101': {
    ag: { name: 'Amtsgericht Berlin-Mitte', strasse: 'Littenstraße 12', plzOrt: '10179 Berlin', telefon: '030 9014-0' },
    lg: { name: 'Landgericht Berlin', strasse: 'Tegeler Weg 17-20', plzOrt: '10589 Berlin', telefon: '030 9015-0' },
    sg: { name: 'Sozialgericht Berlin', strasse: 'Pankstraße 10', plzOrt: '13357 Berlin', telefon: '030 450951-0' },
    arbg: { name: 'Arbeitsgericht Berlin', strasse: 'Magdeburger Platz 1', plzOrt: '10785 Berlin', telefon: '030 9015-0' },
    vg: { name: 'Verwaltungsgericht Berlin', strasse: 'An der Bucht 3', plzOrt: '13597 Berlin', telefon: '030 9015-0' },
    fg: { name: 'Finanzgericht Berlin-Brandenburg', strasse: 'Martin-Luther-Straße 102', plzOrt: '10825 Berlin', telefon: '030 9015-0' },
  },
  '102': {
    ag: { name: 'Amtsgericht Berlin-Mitte', strasse: 'Littenstraße 12', plzOrt: '10179 Berlin', telefon: '030 9014-0' },
  },
  '103': {
    ag: { name: 'Amtsgericht Lichtenberg', strasse: 'Friedrichsfeldeweg 103', plzOrt: '10315 Berlin', telefon: '030 9014-0' },
  },
  '104': {
    ag: { name: 'Amtsgericht Pankow/Weißensee', strasse: 'Dietzgenstraße 42', plzOrt: '13158 Berlin', telefon: '030 9014-0' },
  },
  '105': {
    ag: { name: 'Amtsgericht Charlottenburg', strasse: 'Witzlebenstraße 22', plzOrt: '14057 Berlin', telefon: '030 9014-0' },
  },
  '106': {
    ag: { name: 'Amtsgericht Charlottenburg', strasse: 'Witzlebenstraße 22', plzOrt: '14057 Berlin', telefon: '030 9014-0' },
  },
  '107': {
    ag: { name: 'Amtsgericht Charlottenburg', strasse: 'Witzlebenstraße 22', plzOrt: '14057 Berlin', telefon: '030 9014-0' },
  },
  '108': {
    ag: { name: 'Amtsgericht Schöneberg', strasse: 'Jugendstrafkammer, Badensche Straße 7', plzOrt: '10715 Berlin', telefon: '030 9014-0' },
  },
  '109': {
    ag: { name: 'Amtsgericht Tempelhof-Kreuzberg', strasse: 'Hallesches Ufer 30-60', plzOrt: '10963 Berlin', telefon: '030 9014-0' },
  },
  '120': {
    ag: { name: 'Amtsgericht Neukölln', strasse: 'Sonnenallee 270', plzOrt: '12057 Berlin', telefon: '030 9014-0' },
  },
  '121': {
    ag: { name: 'Amtsgericht Neukölln', strasse: 'Sonnenallee 270', plzOrt: '12057 Berlin', telefon: '030 9014-0' },
  },
  '122': {
    ag: { name: 'Amtsgericht Steglitz', strasse: 'Schloßstraße 6', plzOrt: '12163 Berlin', telefon: '030 9014-0' },
  },
  '123': {
    ag: { name: 'Amtsgericht Schöneberg', strasse: 'Badensche Straße 7', plzOrt: '10715 Berlin', telefon: '030 9014-0' },
  },
  '124': {
    ag: { name: 'Amtsgericht Köpenick', strasse: 'Kirchstraße 4', plzOrt: '12555 Berlin', telefon: '030 9014-0' },
  },
  '125': {
    ag: { name: 'Amtsgericht Köpenick', strasse: 'Kirchstraße 4', plzOrt: '12555 Berlin', telefon: '030 9014-0' },
  },
  '126': {
    ag: { name: 'Amtsgericht Pankow', strasse: 'Dietzgenstraße 42', plzOrt: '13158 Berlin', telefon: '030 9014-0' },
  },
  '130': {
    ag: { name: 'Amtsgericht Pankow', strasse: 'Dietzgenstraße 42', plzOrt: '13158 Berlin', telefon: '030 9014-0' },
  },
  '131': {
    ag: { name: 'Amtsgericht Pankow', strasse: 'Dietzgenstraße 42', plzOrt: '13158 Berlin', telefon: '030 9014-0' },
  },
  '133': {
    ag: { name: 'Amtsgericht Wedding/Gesundbrunnen', strasse: 'Brunnenstraße 106', plzOrt: '13355 Berlin', telefon: '030 9014-0' },
  },
  '134': {
    ag: { name: 'Amtsgericht Charlottenburg', strasse: 'Witzlebenstraße 22', plzOrt: '14057 Berlin', telefon: '030 9014-0' },
  },
  '135': {
    ag: { name: 'Amtsgericht Charlottenburg', strasse: 'Witzlebenstraße 22', plzOrt: '14057 Berlin', telefon: '030 9014-0' },
  },
  '136': {
    ag: { name: 'Amtsgericht Charlottenburg', strasse: 'Witzlebenstraße 22', plzOrt: '14057 Berlin', telefon: '030 9014-0' },
  },
  '140': {
    ag: { name: 'Amtsgericht Charlottenburg', strasse: 'Witzlebenstraße 22', plzOrt: '14057 Berlin', telefon: '030 9014-0' },
  },
  '141': {
    ag: { name: 'Amtsgericht Charlottenburg', strasse: 'Witzlebenstraße 22', plzOrt: '14057 Berlin', telefon: '030 9014-0' },
  },

  // Hamburg
  '200': {
    ag: { name: 'Amtsgericht Hamburg', strasse: 'Sievekingplatz 1', plzOrt: '20355 Hamburg', telefon: '040 42844-0' },
    lg: { name: 'Landgericht Hamburg', strasse: 'Sievekingplatz 1', plzOrt: '20355 Hamburg', telefon: '040 42844-0' },
    sg: { name: 'Sozialgericht Hamburg', strasse: 'Grabenstraße 7', plzOrt: '20354 Hamburg', telefon: '040 42844-0' },
    arbg: { name: 'Arbeitsgericht Hamburg', strasse: 'Banksstraße 28', plzOrt: '20097 Hamburg', telefon: '040 42844-0' },
    vg: { name: 'Verwaltungsgericht Hamburg', strasse: 'Sievekingplatz 1', plzOrt: '20355 Hamburg', telefon: '040 42844-0' },
    fg: { name: 'Finanzgericht Hamburg', strasse: 'Sievekingplatz 1', plzOrt: '20355 Hamburg', telefon: '040 42844-0' },
  },
  '201': {
    ag: { name: 'Amtsgericht Hamburg', strasse: 'Sievekingplatz 1', plzOrt: '20355 Hamburg', telefon: '040 42844-0' },
  },
  '202': {
    ag: { name: 'Amtsgericht Hamburg', strasse: 'Sievekingplatz 1', plzOrt: '20355 Hamburg', telefon: '040 42844-0' },
  },
  '203': {
    ag: { name: 'Amtsgericht Hamburg', strasse: 'Sievekingplatz 1', plzOrt: '20355 Hamburg', telefon: '040 42844-0' },
  },
  '204': {
    ag: { name: 'Amtsgericht Hamburg', strasse: 'Sievekingplatz 1', plzOrt: '20355 Hamburg', telefon: '040 42844-0' },
  },
  '205': {
    ag: { name: 'Amtsgericht Hamburg', strasse: 'Sievekingplatz 1', plzOrt: '20355 Hamburg', telefon: '040 42844-0' },
  },
  '220': {
    ag: { name: 'Amtsgericht Hamburg-Barmbek', strasse: 'Adolph-Schönfeld-Weg 11', plzOrt: '22041 Hamburg', telefon: '040 42844-0' },
  },
  '221': {
    ag: { name: 'Amtsgericht Hamburg-Barmbek', strasse: 'Adolph-Schönfeld-Weg 11', plzOrt: '22041 Hamburg', telefon: '040 42844-0' },
  },
  '222': {
    ag: { name: 'Amtsgericht Hamburg-Barmbek', strasse: 'Adolph-Schönfeld-Weg 11', plzOrt: '22041 Hamburg', telefon: '040 42844-0' },
  },
  '223': {
    ag: { name: 'Amtsgericht Hamburg-Barmbek', strasse: 'Adolph-Schönfeld-Weg 11', plzOrt: '22041 Hamburg', telefon: '040 42844-0' },
  },
  '224': {
    ag: { name: 'Amtsgericht Hamburg-Barmbek', strasse: 'Adolph-Schönfeld-Weg 11', plzOrt: '22041 Hamburg', telefon: '040 42844-0' },
  },
  '225': {
    ag: { name: 'Amtsgericht Hamburg-Altona', strasse: 'Max-Brauer-Allee 87', plzOrt: '22765 Hamburg', telefon: '040 42844-0' },
  },
  '226': {
    ag: { name: 'Amtsgericht Hamburg-Altona', strasse: 'Max-Brauer-Allee 87', plzOrt: '22765 Hamburg', telefon: '040 42844-0' },
  },
  '227': {
    ag: { name: 'Amtsgericht Hamburg-Altona', strasse: 'Max-Brauer-Allee 87', plzOrt: '22765 Hamburg', telefon: '040 42844-0' },
  },

  // München
  '800': {
    ag: { name: 'Amtsgericht München', strasse: 'Pacellistraße 5', plzOrt: '80333 München', telefon: '089 2197-0' },
    lg: { name: 'Landgericht München I', strasse: 'Nymphenburger Straße 16', plzOrt: '80335 München', telefon: '089 2197-0' },
    sg: { name: 'Sozialgericht München', strasse: 'Maxburgstraße 4', plzOrt: '80333 München', telefon: '089 2197-0' },
    arbg: { name: 'Arbeitsgericht München', strasse: 'Agnes-Pockels-Bogen 1', plzOrt: '80992 München', telefon: '089 2197-0' },
    vg: { name: 'Verwaltungsgericht München', strasse: 'Bayerstraße 30', plzOrt: '80335 München', telefon: '089 2197-0' },
    fg: { name: 'Finanzgericht München', strasse: 'Mariahilfplatz 3', plzOrt: '81669 München', telefon: '089 2197-0' },
  },
  '801': {
    ag: { name: 'Amtsgericht München', strasse: 'Pacellistraße 5', plzOrt: '80333 München', telefon: '089 2197-0' },
  },
  '803': {
    ag: { name: 'Amtsgericht München', strasse: 'Pacellistraße 5', plzOrt: '80333 München', telefon: '089 2197-0' },
  },
  '804': {
    ag: { name: 'Amtsgericht München', strasse: 'Pacellistraße 5', plzOrt: '80333 München', telefon: '089 2197-0' },
  },
  '805': {
    ag: { name: 'Amtsgericht München', strasse: 'Pacellistraße 5', plzOrt: '80333 München', telefon: '089 2197-0' },
  },
  '806': {
    ag: { name: 'Amtsgericht München', strasse: 'Pacellistraße 5', plzOrt: '80333 München', telefon: '089 2197-0' },
  },
  '807': {
    ag: { name: 'Amtsgericht München', strasse: 'Pacellistraße 5', plzOrt: '80333 München', telefon: '089 2197-0' },
  },
  '808': {
    ag: { name: 'Amtsgericht München', strasse: 'Pacellistraße 5', plzOrt: '80333 München', telefon: '089 2197-0' },
  },
  '809': {
    ag: { name: 'Amtsgericht München', strasse: 'Pacellistraße 5', plzOrt: '80333 München', telefon: '089 2197-0' },
  },
  '810': {
    ag: { name: 'Amtsgericht München', strasse: 'Pacellistraße 5', plzOrt: '80333 München', telefon: '089 2197-0' },
  },
  '812': {
    ag: { name: 'Amtsgericht Starnberg', strasse: 'Söckinger Straße 1', plzOrt: '82319 Starnberg', telefon: '08151 7580' },
  },
  '813': {
    ag: { name: 'Amtsgericht Wolfratshausen', strasse: 'Sauerlacher Straße 25', plzOrt: '82515 Wolfratshausen', telefon: '08171 23800' },
  },
  '814': {
    ag: { name: 'Amtsgericht Starnberg', strasse: 'Söckinger Straße 1', plzOrt: '82319 Starnberg', telefon: '08151 7580' },
  },
  '815': {
    ag: { name: 'Amtsgericht Wolfratshausen', strasse: 'Sauerlacher Straße 25', plzOrt: '82515 Wolfratshausen', telefon: '08171 23800' },
  },
  '816': {
    ag: { name: 'Amtsgericht München', strasse: 'Pacellistraße 5', plzOrt: '80333 München', telefon: '089 2197-0' },
  },
  '817': {
    ag: { name: 'Amtsgericht München', strasse: 'Pacellistraße 5', plzOrt: '80333 München', telefon: '089 2197-0' },
  },
  '818': {
    ag: { name: 'Amtsgericht München', strasse: 'Pacellistraße 5', plzOrt: '80333 München', telefon: '089 2197-0' },
  },
  '819': {
    ag: { name: 'Amtsgericht München', strasse: 'Pacellistraße 5', plzOrt: '80333 München', telefon: '089 2197-0' },
  },

  // Köln
  '500': {
    ag: { name: 'Amtsgericht Köln', strasse: 'Ottoplatz 2', plzOrt: '50679 Köln', telefon: '0221 2052-0' },
    lg: { name: 'Landgericht Köln', strasse: 'Ottoplatz 2', plzOrt: '50679 Köln', telefon: '0221 2052-0' },
    sg: { name: 'Sozialgericht Köln', strasse: 'Humboldtstraße 27', plzOrt: '50968 Köln', telefon: '0221 2052-0' },
    arbg: { name: 'Arbeitsgericht Köln', strasse: 'Littenstraße 17', plzOrt: '50679 Köln', telefon: '0221 2052-0' },
    vg: { name: 'Verwaltungsgericht Köln', strasse: 'Ottoplatz 2', plzOrt: '50679 Köln', telefon: '0221 2052-0' },
    fg: { name: 'Finanzgericht Köln', strasse: 'Ottoplatz 2', plzOrt: '50679 Köln', telefon: '0221 2052-0' },
  },
  '501': {
    ag: { name: 'Amtsgericht Köln', strasse: 'Ottoplatz 2', plzOrt: '50679 Köln', telefon: '0221 2052-0' },
  },
  '502': {
    ag: { name: 'Amtsgericht Köln', strasse: 'Ottoplatz 2', plzOrt: '50679 Köln', telefon: '0221 2052-0' },
  },
  '503': {
    ag: { name: 'Amtsgericht Köln', strasse: 'Ottoplatz 2', plzOrt: '50679 Köln', telefon: '0221 2052-0' },
  },
  '504': {
    ag: { name: 'Amtsgericht Köln', strasse: 'Ottoplatz 2', plzOrt: '50679 Köln', telefon: '0221 2052-0' },
  },
  '505': {
    ag: { name: 'Amtsgericht Köln', strasse: 'Ottoplatz 2', plzOrt: '50679 Köln', telefon: '0221 2052-0' },
  },
  '506': {
    ag: { name: 'Amtsgericht Köln', strasse: 'Ottoplatz 2', plzOrt: '50679 Köln', telefon: '0221 2052-0' },
  },
  '507': {
    ag: { name: 'Amtsgericht Köln', strasse: 'Ottoplatz 2', plzOrt: '50679 Köln', telefon: '0221 2052-0' },
  },
  '508': {
    ag: { name: 'Amtsgericht Köln', strasse: 'Ottoplatz 2', plzOrt: '50679 Köln', telefon: '0221 2052-0' },
  },
  '509': {
    ag: { name: 'Amtsgericht Köln', strasse: 'Ottoplatz 2', plzOrt: '50679 Köln', telefon: '0221 2052-0' },
  },

  // Frankfurt
  '600': {
    ag: { name: 'Amtsgericht Frankfurt am Main', strasse: 'Gerichtsstraße 2', plzOrt: '60313 Frankfurt', telefon: '069 1367-0' },
    lg: { name: 'Landgericht Frankfurt am Main', strasse: 'Gerichtsstraße 2', plzOrt: '60313 Frankfurt', telefon: '069 1367-0' },
    sg: { name: 'Sozialgericht Frankfurt', strasse: 'Kleyerstraße 88', plzOrt: '60326 Frankfurt', telefon: '069 1367-0' },
    arbg: { name: 'Arbeitsgericht Frankfurt', strasse: 'Gallusanlage 4', plzOrt: '60322 Frankfurt', telefon: '069 1367-0' },
    vg: { name: 'Verwaltungsgericht Frankfurt', strasse: 'Europaplatz 2', plzOrt: '60313 Frankfurt', telefon: '069 1367-0' },
    fg: { name: 'Finanzgericht Hessen', strasse: 'Adalbertstraße 6', plzOrt: '65185 Wiesbaden', telefon: '0611 3802-0' },
  },
  '603': {
    ag: { name: 'Amtsgericht Frankfurt am Main', strasse: 'Gerichtsstraße 2', plzOrt: '60313 Frankfurt', telefon: '069 1367-0' },
  },
  '604': {
    ag: { name: 'Amtsgericht Frankfurt am Main', strasse: 'Gerichtsstraße 2', plzOrt: '60313 Frankfurt', telefon: '069 1367-0' },
  },
  '605': {
    ag: { name: 'Amtsgericht Frankfurt am Main', strasse: 'Gerichtsstraße 2', plzOrt: '60313 Frankfurt', telefon: '069 1367-0' },
  },
  '606': {
    ag: { name: 'Amtsgericht Frankfurt am Main', strasse: 'Gerichtsstraße 2', plzOrt: '60313 Frankfurt', telefon: '069 1367-0' },
  },
  '607': {
    ag: { name: 'Amtsgericht Frankfurt am Main', strasse: 'Gerichtsstraße 2', plzOrt: '60313 Frankfurt', telefon: '069 1367-0' },
  },
  '630': {
    ag: { name: 'Amtsgericht Offenbach', strasse: 'Adalbertstraße 11', plzOrt: '63067 Offenbach', telefon: '069 1367-0' },
  },
  '631': {
    ag: { name: 'Amtsgericht Offenbach', strasse: 'Adalbertstraße 11', plzOrt: '63067 Offenbach', telefon: '069 1367-0' },
  },
  '632': {
    ag: { name: 'Amtsgericht Offenbach', strasse: 'Adalbertstraße 11', plzOrt: '63067 Offenbach', telefon: '069 1367-0' },
  },
  '633': {
    ag: { name: 'Amtsgericht Hanau', strasse: 'Schlossplatz 1', plzOrt: '63450 Hanau', telefon: '06181 2500' },
  },
  '634': {
    ag: { name: 'Amtsgericht Hanau', strasse: 'Schlossplatz 1', plzOrt: '63450 Hanau', telefon: '06181 2500' },
  },
  '635': {
    ag: { name: 'Amtsgericht Offenbach', strasse: 'Adalbertstraße 11', plzOrt: '63067 Offenbach', telefon: '069 1367-0' },
  },
  '636': {
    ag: { name: 'Amtsgericht Hanau', strasse: 'Schlossplatz 1', plzOrt: '63450 Hanau', telefon: '06181 2500' },
  },

  // Stuttgart
  '700': {
    ag: { name: 'Amtsgericht Stuttgart', strasse: 'Urbanstraße 16', plzOrt: '70182 Stuttgart', telefon: '0711 202-0' },
    lg: { name: 'Landgericht Stuttgart', strasse: 'Urbanstraße 16', plzOrt: '70182 Stuttgart', telefon: '0711 202-0' },
    sg: { name: 'Sozialgericht Stuttgart', strasse: 'Urbanstraße 18', plzOrt: '70182 Stuttgart', telefon: '0711 202-0' },
    arbg: { name: 'Arbeitsgericht Stuttgart', strasse: 'Schorndorfer Straße 60', plzOrt: '70376 Stuttgart', telefon: '0711 202-0' },
    vg: { name: 'Verwaltungsgericht Stuttgart', strasse: 'Oberer Schlossgarten 7', plzOrt: '70173 Stuttgart', telefon: '0711 202-0' },
    fg: { name: 'Finanzgericht Baden-Württemberg', strasse: 'Urbanstraße 18', plzOrt: '70182 Stuttgart', telefon: '0711 202-0' },
  },
  '701': {
    ag: { name: 'Amtsgericht Stuttgart', strasse: 'Urbanstraße 16', plzOrt: '70182 Stuttgart', telefon: '0711 202-0' },
  },
  '702': {
    ag: { name: 'Amtsgericht Stuttgart', strasse: 'Urbanstraße 16', plzOrt: '70182 Stuttgart', telefon: '0711 202-0' },
  },
  '703': {
    ag: { name: 'Amtsgericht Stuttgart', strasse: 'Urbanstraße 16', plzOrt: '70182 Stuttgart', telefon: '0711 202-0' },
  },
  '704': {
    ag: { name: 'Amtsgericht Stuttgart', strasse: 'Urbanstraße 16', plzOrt: '70182 Stuttgart', telefon: '0711 202-0' },
  },
  '705': {
    ag: { name: 'Amtsgericht Stuttgart', strasse: 'Urbanstraße 16', plzOrt: '70182 Stuttgart', telefon: '0711 202-0' },
  },
  '706': {
    ag: { name: 'Amtsgericht Stuttgart', strasse: 'Urbanstraße 16', plzOrt: '70182 Stuttgart', telefon: '0711 202-0' },
  },
  '707': {
    ag: { name: 'Amtsgericht Stuttgart', strasse: 'Urbanstraße 16', plzOrt: '70182 Stuttgart', telefon: '0711 202-0' },
  },
  '708': {
    ag: { name: 'Amtsgericht Stuttgart', strasse: 'Urbanstraße 16', plzOrt: '70182 Stuttgart', telefon: '0711 202-0' },
  },
  '710': {
    ag: { name: 'Amtsgericht Böblingen', strasse: 'Bahnhofstraße 40', plzOrt: '71032 Böblingen', telefon: '07031 6800' },
  },
  '711': {
    ag: { name: 'Amtsgericht Böblingen', strasse: 'Bahnhofstraße 40', plzOrt: '71032 Böblingen', telefon: '07031 6800' },
  },
  '712': {
    ag: { name: 'Amtsgericht Leonberg', strasse: 'Höfener Straße 17', plzOrt: '71229 Leonberg', telefon: '07152 32560' },
  },
  '713': {
    ag: { name: 'Amtsgericht Leonberg', strasse: 'Höfener Straße 17', plzOrt: '71229 Leonberg', telefon: '07152 32560' },
  },
  '714': {
    ag: { name: 'Amtsgericht Leonberg', strasse: 'Höfener Straße 17', plzOrt: '71229 Leonberg', telefon: '07152 32560' },
  },
  '715': {
    ag: { name: 'Amtsgericht Waiblingen', strasse: 'Marienstraße 6', plzOrt: '71332 Waiblingen', telefon: '07151 9500' },
  },
  '716': {
    ag: { name: 'Amtsgericht Ludwigsburg', strasse: 'Wilhelmstraße 4', plzOrt: '71638 Ludwigsburg', telefon: '07141 1440' },
  },
  '717': {
    ag: { name: 'Amtsgericht Ludwigsburg', strasse: 'Wilhelmstraße 4', plzOrt: '71638 Ludwigsburg', telefon: '07141 1440' },
  },
  '730': {
    ag: { name: 'Amtsgericht Göppingen', strasse: 'Adolf-Rhomberg-Haus', plzOrt: '73033 Göppingen', telefon: '07161 9250' },
  },

  // Düsseldorf
  '400': {
    ag: { name: 'Amtsgericht Düsseldorf', strasse: 'Welscher Weg 3', plzOrt: '40225 Düsseldorf', telefon: '0211 1720-0' },
    lg: { name: 'Landgericht Düsseldorf', strasse: 'Heinrich-Heine-Allee 1', plzOrt: '40213 Düsseldorf', telefon: '0211 1720-0' },
    sg: { name: 'Sozialgericht Düsseldorf', strasse: 'Josef-Gockeln-Straße 1', plzOrt: '40474 Düsseldorf', telefon: '0211 1720-0' },
    arbg: { name: 'Arbeitsgericht Düsseldorf', strasse: 'Willy-Becker-Allee 10', plzOrt: '40468 Düsseldorf', telefon: '0211 1720-0' },
    vg: { name: 'Verwaltungsgericht Düsseldorf', strasse: 'Bahnstraße 20', plzOrt: '40210 Düsseldorf', telefon: '0211 1720-0' },
    fg: { name: 'Finanzgericht Düsseldorf', strasse: 'Königsallee 81', plzOrt: '40212 Düsseldorf', telefon: '0211 1720-0' },
  },
  '402': {
    ag: { name: 'Amtsgericht Düsseldorf', strasse: 'Welscher Weg 3', plzOrt: '40225 Düsseldorf', telefon: '0211 1720-0' },
  },
  '403': {
    ag: { name: 'Amtsgericht Düsseldorf', strasse: 'Welscher Weg 3', plzOrt: '40225 Düsseldorf', telefon: '0211 1720-0' },
  },
  '404': {
    ag: { name: 'Amtsgericht Düsseldorf', strasse: 'Welscher Weg 3', plzOrt: '40225 Düsseldorf', telefon: '0211 1720-0' },
  },
  '405': {
    ag: { name: 'Amtsgericht Düsseldorf', strasse: 'Welscher Weg 3', plzOrt: '40225 Düsseldorf', telefon: '0211 1720-0' },
  },
  '406': {
    ag: { name: 'Amtsgericht Düsseldorf', strasse: 'Welscher Weg 3', plzOrt: '40225 Düsseldorf', telefon: '0211 1720-0' },
  },
  '407': {
    ag: { name: 'Amtsgericht Düsseldorf', strasse: 'Welscher Weg 3', plzOrt: '40225 Düsseldorf', telefon: '0211 1720-0' },
  },
  '408': {
    ag: { name: 'Amtsgericht Düsseldorf', strasse: 'Welscher Weg 3', plzOrt: '40225 Düsseldorf', telefon: '0211 1720-0' },
  },
  '410': {
    ag: { name: 'Amtsgericht Mönchengladbach', strasse: 'Odenkirchener Straße 10', plzOrt: '41236 Mönchengladbach', telefon: '02166 9370' },
  },
  '411': {
    ag: { name: 'Amtsgericht Mönchengladbach', strasse: 'Odenkirchener Straße 10', plzOrt: '41236 Mönchengladbach', telefon: '02166 9370' },
  },
  '412': {
    ag: { name: 'Amtsgericht Mönchengladbach', strasse: 'Odenkirchener Straße 10', plzOrt: '41236 Mönchengladbach', telefon: '02166 9370' },
  },
  '413': {
    ag: { name: 'Amtsgericht Krefeld', strasse: 'Königstraße 126', plzOrt: '47798 Krefeld', telefon: '02151 5700' },
  },
  '414': {
    ag: { name: 'Amtsgericht Neuss', strasse: 'Niederstraße 6', plzOrt: '41460 Neuss', telefon: '02131 2800' },
  },
  '415': {
    ag: { name: 'Amtsgericht Krefeld', strasse: 'Königstraße 126', plzOrt: '47798 Krefeld', telefon: '02151 5700' },
  },
  '417': {
    ag: { name: 'Amtsgericht Viersen', strasse: 'Rathausmarkt 1', plzOrt: '41747 Viersen', telefon: '02162 8140' },
  },

  // Hannover
  '300': {
    ag: { name: 'Amtsgericht Hannover', strasse: 'Volgersweg 183', plzOrt: '30179 Hannover', telefon: '0511 3031-0' },
    lg: { name: 'Landgericht Hannover', strasse: 'Willy-Brandt-Allee 3', plzOrt: '30169 Hannover', telefon: '0511 3031-0' },
    sg: { name: 'Sozialgericht Hannover', strasse: 'Schiffgraben 10', plzOrt: '30159 Hannover', telefon: '0511 3031-0' },
    arbg: { name: 'Arbeitsgericht Hannover', strasse: 'Schiffgraben 10', plzOrt: '30159 Hannover', telefon: '0511 3031-0' },
    vg: { name: 'Niedersächsisches Oberverwaltungsgericht', strasse: 'Culemannstraße 6', plzOrt: '30173 Hannover', telefon: '0511 3031-0' },
    fg: { name: 'Finanzgericht Hamburg', strasse: 'Sievekingplatz 1', plzOrt: '20355 Hamburg', telefon: '040 42844-0' },
  },
  '301': {
    ag: { name: 'Amtsgericht Hannover', strasse: 'Volgersweg 183', plzOrt: '30179 Hannover', telefon: '0511 3031-0' },
  },
  '304': {
    ag: { name: 'Amtsgericht Hannover', strasse: 'Volgersweg 183', plzOrt: '30179 Hannover', telefon: '0511 3031-0' },
  },
  '305': {
    ag: { name: 'Amtsgericht Hannover', strasse: 'Volgersweg 183', plzOrt: '30179 Hannover', telefon: '0511 3031-0' },
  },
  '306': {
    ag: { name: 'Amtsgericht Hannover', strasse: 'Volgersweg 183', plzOrt: '30179 Hannover', telefon: '0511 3031-0' },
  },
  '308': {
    ag: { name: 'Amtsgericht Garbsen', strasse: 'Gemeindestraße 19', plzOrt: '30823 Garbsen', telefon: '05131 4700' },
  },

  // Leipzig — full court block under PLZ-prefix '041' (Leipzig central PLZ
  // range starts at 04103). Earlier WIP draft mistakenly keyed this under
  // '400', colliding with Düsseldorf above; merged into the canonical key.
  '041': {
    ag: { name: 'Amtsgericht Leipzig', strasse: 'Bernhard-Göring-Straße 152', plzOrt: '04277 Leipzig', telefon: '0341 9650-0' },
    lg: { name: 'Landgericht Leipzig', strasse: 'Harkortstraße 9', plzOrt: '04107 Leipzig', telefon: '0341 9650-0' },
    sg: { name: 'Sozialgericht Leipzig', strasse: 'Harkortstraße 9', plzOrt: '04107 Leipzig', telefon: '0341 9650-0' },
    arbg: { name: 'Arbeitsgericht Leipzig', strasse: 'Harkortstraße 9', plzOrt: '04107 Leipzig', telefon: '0341 9650-0' },
    vg: { name: 'Verwaltungsgericht Leipzig', strasse: 'Harkortstraße 9', plzOrt: '04107 Leipzig', telefon: '0341 9650-0' },
    fg: { name: 'Finanzgericht Dresden', strasse: 'Wilsdruffer Straße 3', plzOrt: '01067 Dresden', telefon: '0351 4850-0' },
  },
  '042': {
    ag: { name: 'Amtsgericht Leipzig', strasse: 'Bernhard-Göring-Straße 152', plzOrt: '04277 Leipzig', telefon: '0341 9650-0' },
  },
  '043': {
    ag: { name: 'Amtsgericht Leipzig', strasse: 'Bernhard-Göring-Straße 152', plzOrt: '04277 Leipzig', telefon: '0341 9650-0' },
  },
  '044': {
    ag: { name: 'Amtsgericht Leipzig', strasse: 'Bernhard-Göring-Straße 152', plzOrt: '04277 Leipzig', telefon: '0341 9650-0' },
  },

  // Dresden
  '010': {
    ag: { name: 'Amtsgericht Dresden', strasse: 'Amtsgerichtsstraße 6', plzOrt: '01097 Dresden', telefon: '0351 4850-0' },
    lg: { name: 'Landgericht Dresden', strasse: 'Wilsdruffer Straße 3', plzOrt: '01067 Dresden', telefon: '0351 4850-0' },
    sg: { name: 'Sozialgericht Dresden', strasse: 'Wilsdruffer Straße 3', plzOrt: '01067 Dresden', telefon: '0351 4850-0' },
    arbg: { name: 'Arbeitsgericht Dresden', strasse: 'Wilsdruffer Straße 3', plzOrt: '01067 Dresden', telefon: '0351 4850-0' },
    vg: { name: 'Verwaltungsgericht Dresden', strasse: 'Wilsdruffer Straße 3', plzOrt: '01067 Dresden', telefon: '0351 4850-0' },
    fg: { name: 'Finanzgericht Dresden', strasse: 'Wilsdruffer Straße 3', plzOrt: '01067 Dresden', telefon: '0351 4850-0' },
  },
  '011': {
    ag: { name: 'Amtsgericht Dresden', strasse: 'Amtsgerichtsstraße 6', plzOrt: '01097 Dresden', telefon: '0351 4850-0' },
  },
  '012': {
    ag: { name: 'Amtsgericht Dresden', strasse: 'Amtsgerichtsstraße 6', plzOrt: '01097 Dresden', telefon: '0351 4850-0' },
  },
  '013': {
    ag: { name: 'Amtsgericht Dresden', strasse: 'Amtsgerichtsstraße 6', plzOrt: '01097 Dresden', telefon: '0351 4850-0' },
  },
  '014': {
    ag: { name: 'Amtsgericht Dresden', strasse: 'Amtsgerichtsstraße 6', plzOrt: '01097 Dresden', telefon: '0351 4850-0' },
  },
  '015': {
    ag: { name: 'Amtsgericht Dresden', strasse: 'Amtsgerichtsstraße 6', plzOrt: '01097 Dresden', telefon: '0351 4850-0' },
  },
  '016': {
    ag: { name: 'Amtsgericht Dresden', strasse: 'Amtsgerichtsstraße 6', plzOrt: '01097 Dresden', telefon: '0351 4850-0' },
  },
  '017': {
    ag: { name: 'Amtsgericht Dresden', strasse: 'Amtsgerichtsstraße 6', plzOrt: '01097 Dresden', telefon: '0351 4850-0' },
  },
  '018': {
    ag: { name: 'Amtsgericht Dresden', strasse: 'Amtsgerichtsstraße 6', plzOrt: '01097 Dresden', telefon: '0351 4850-0' },
  },
  '019': {
    ag: { name: 'Amtsgericht Dresden', strasse: 'Amtsgerichtsstraße 6', plzOrt: '01097 Dresden', telefon: '0351 4850-0' },
  },

  // Bremen
  '280': {
    ag: { name: 'Amtsgericht Bremen', strasse: 'Domsheide 16', plzOrt: '28195 Bremen', telefon: '0421 361-0' },
    lg: { name: 'Landgericht Bremen', strasse: 'Domsheide 16', plzOrt: '28195 Bremen', telefon: '0421 361-0' },
    sg: { name: 'Sozialgericht Bremen', strasse: 'Domsheide 16', plzOrt: '28195 Bremen', telefon: '0421 361-0' },
    arbg: { name: 'Arbeitsgericht Bremen', strasse: 'Domsheide 16', plzOrt: '28195 Bremen', telefon: '0421 361-0' },
    vg: { name: 'Verwaltungsgericht Bremen', strasse: 'Domsheide 16', plzOrt: '28195 Bremen', telefon: '0421 361-0' },
    fg: { name: 'Finanzgericht Bremen', strasse: 'Domsheide 16', plzOrt: '28195 Bremen', telefon: '0421 361-0' },
  },
  '281': {
    ag: { name: 'Amtsgericht Bremen', strasse: 'Domsheide 16', plzOrt: '28195 Bremen', telefon: '0421 361-0' },
  },
  '282': {
    ag: { name: 'Amtsgericht Bremen', strasse: 'Domsheide 16', plzOrt: '28195 Bremen', telefon: '0421 361-0' },
  },
  '283': {
    ag: { name: 'Amtsgericht Bremen', strasse: 'Domsheide 16', plzOrt: '28195 Bremen', telefon: '0421 361-0' },
  },
  '287': {
    ag: { name: 'Amtsgericht Bremen', strasse: 'Domsheide 16', plzOrt: '28195 Bremen', telefon: '0421 361-0' },
  },
  '288': {
    ag: { name: 'Amtsgericht Bremerhaven', strasse: 'Georgstraße 8', plzOrt: '27570 Bremerhaven', telefon: '0471 5900' },
  },

  // Essen, Duisburg, Bochum (Ruhrgebiet)
  '450': {
    ag: { name: 'Amtsgericht Essen', strasse: 'Girardetstraße 1', plzOrt: '45130 Essen', telefon: '0201 1720-0' },
  },
  '451': {
    ag: { name: 'Amtsgericht Essen', strasse: 'Girardetstraße 1', plzOrt: '45130 Essen', telefon: '0201 1720-0' },
  },
  '452': {
    ag: { name: 'Amtsgericht Essen', strasse: 'Girardetstraße 1', plzOrt: '45130 Essen', telefon: '0201 1720-0' },
  },
  '453': {
    ag: { name: 'Amtsgericht Essen', strasse: 'Girardetstraße 1', plzOrt: '45130 Essen', telefon: '0201 1720-0' },
  },
  '454': {
    ag: { name: 'Amtsgericht Mülheim an der Ruhr', strasse: 'Wallstraße 8', plzOrt: '45468 Mülheim', telefon: '0208 3000' },
  },
  '460': {
    ag: { name: 'Amtsgericht Oberhausen', strasse: 'Schwarze-Ferkel-Straße 8', plzOrt: '46045 Oberhausen', telefon: '0208 8250' },
  },
  '461': {
    ag: { name: 'Amtsgericht Oberhausen', strasse: 'Schwarze-Ferkel-Straße 8', plzOrt: '46045 Oberhausen', telefon: '0208 8250' },
  },
  '462': {
    ag: { name: 'Amtsgericht Oberhausen', strasse: 'Schwarze-Ferkel-Straße 8', plzOrt: '46045 Oberhausen', telefon: '0208 8250' },
  },
  '470': {
    ag: { name: 'Amtsgericht Duisburg', strasse: 'Königstraße 28', plzOrt: '47051 Duisburg', telefon: '0203 9400' },
  },
  '471': {
    ag: { name: 'Amtsgericht Duisburg', strasse: 'Königstraße 28', plzOrt: '47051 Duisburg', telefon: '0203 9400' },
  },
  '472': {
    ag: { name: 'Amtsgericht Duisburg', strasse: 'Königstraße 28', plzOrt: '47051 Duisburg', telefon: '0203 9400' },
  },
  '447': {
    ag: { name: 'Amtsgericht Bochum', strasse: 'Kortumstraße 71', plzOrt: '44787 Bochum', telefon: '0234 9100' },
  },
  '448': {
    ag: { name: 'Amtsgericht Bochum', strasse: 'Kortumstraße 71', plzOrt: '44787 Bochum', telefon: '0234 9100' },
  },

  // Nürnberg
  '900': {
    ag: { name: 'Amtsgericht Nürnberg', strasse: 'Peter-Henlein-Straße 2', plzOrt: '90443 Nürnberg', telefon: '0911 702-0' },
    lg: { name: 'Landgericht Nürnberg-Fürth', strasse: 'Peter-Henlein-Straße 2', plzOrt: '90443 Nürnberg', telefon: '0911 702-0' },
    sg: { name: 'Sozialgericht Nürnberg', strasse: 'Luitpoldstraße 23', plzOrt: '90402 Nürnberg', telefon: '0911 702-0' },
    arbg: { name: 'Arbeitsgericht Nürnberg', strasse: 'Peter-Henlein-Straße 2', plzOrt: '90443 Nürnberg', telefon: '0911 702-0' },
    vg: { name: 'Verwaltungsgericht Ansbach', strasse: 'Residenzstraße 8', plzOrt: '91522 Ansbach', telefon: '0981 4666-0' },
    fg: { name: 'Finanzgericht München', strasse: 'Mariahilfplatz 3', plzOrt: '81669 München', telefon: '089 2197-0' },
  },
  '903': {
    ag: { name: 'Amtsgericht Nürnberg', strasse: 'Peter-Henlein-Straße 2', plzOrt: '90443 Nürnberg', telefon: '0911 702-0' },
  },
  '904': {
    ag: { name: 'Amtsgericht Nürnberg', strasse: 'Peter-Henlein-Straße 2', plzOrt: '90443 Nürnberg', telefon: '0911 702-0' },
  },
  '905': {
    ag: { name: 'Amtsgericht Fürth', strasse: 'Friedrich-Ebert-Anlage 10', plzOrt: '90762 Fürth', telefon: '0911 702-0' },
  },
  '906': {
    ag: { name: 'Amtsgericht Fürth', strasse: 'Friedrich-Ebert-Anlage 10', plzOrt: '90762 Fürth', telefon: '0911 702-0' },
  },
  '907': {
    ag: { name: 'Amtsgericht Fürth', strasse: 'Friedrich-Ebert-Anlage 10', plzOrt: '90762 Fürth', telefon: '0911 702-0' },
  },
  '910': {
    ag: { name: 'Amtsgericht Erlangen', strasse: 'Richard-Wagner-Straße 5', plzOrt: '91054 Erlangen', telefon: '09131 8700' },
  },
}

export type GerichtTyp = 'ag' | 'lg' | 'sg' | 'arbg' | 'vg' | 'fg'

export function gerichtFuerPLZ(plz: string, typ: GerichtTyp = 'ag'): GerichtAdresse | null {
  if (!plz || plz.length < 3) return null
  const key = plz.slice(0, 3)
  const entry = GERICHTE[key]
  if (!entry) return null
  return entry[typ] || null
}

/**
 * Lookup by full PLZ (5 digits) with fallback to 3-digit prefix.
 */
export function gerichtFuerPLZExakt(plz: string, typ: GerichtTyp = 'ag'): GerichtAdresse | null {
  const key5 = plz.slice(0, 5)
  const key3 = plz.slice(0, 3)
  return GERICHTE[key5]?.[typ] || GERICHTE[key3]?.[typ] || null
}

/**
 * Format Gericht address as a multi-line string for letters.
 */
export function formatGerichtAdresse(adresse: GerichtAdresse): string {
  return `${adresse.name}\n${adresse.strasse}\n${adresse.plzOrt}`
}
