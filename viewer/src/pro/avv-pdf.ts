/**
 * AVV-Entwurf-PDF Generator (Auftragsverarbeitungsvertrag).
 *
 * WICHTIG: Dieser Text ist ein nicht anwaltlich geprüfter ENTWURF, basierend
 * auf gängigen DSGVO-Mustern (eRecht24, IHK-Muster). Vor Verwendung mit
 * echten Mandant:innen-Daten muss eine anwaltliche Prüfung erfolgen.
 *
 * Der Entwurf wird als PDF auf dem Kanzlei-Briefkopf generiert, sodass die
 * Anwält:in ihn sofort lesen und ggf. eine signaturreife Version mit ihrem
 * Datenschutz-Anwalt finalisieren kann.
 */

import { jsPDF } from 'jspdf'
import type { KanzleiSettings } from './types'

const MARGIN = 20
const PAGE_WIDTH = 210
const CONTENT_WIDTH = PAGE_WIDTH - 2 * MARGIN
const PAGE_HEIGHT = 297

interface RenderCtx {
  doc: jsPDF
  y: number
}

function ensureRoom(ctx: RenderCtx, needed: number): void {
  if (ctx.y + needed > PAGE_HEIGHT - 25) {
    ctx.doc.addPage()
    ctx.y = MARGIN
  }
}

function paragraph(ctx: RenderCtx, text: string, opts?: { bold?: boolean; size?: number; color?: number }): void {
  const { doc } = ctx
  doc.setFont('helvetica', opts?.bold ? 'bold' : 'normal')
  doc.setFontSize(opts?.size ?? 10.5)
  doc.setTextColor(opts?.color ?? 0)
  const lines = doc.splitTextToSize(text, CONTENT_WIDTH) as string[]
  for (const line of lines) {
    ensureRoom(ctx, 6)
    doc.text(line, MARGIN, ctx.y)
    ctx.y += 5
  }
  doc.setTextColor(0)
}

function spacer(ctx: RenderCtx, mm = 4): void {
  ctx.y += mm
}

export function generateAvvPdf(settings: KanzleiSettings): void {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  const ctx: RenderCtx = { doc, y: MARGIN }

  // Letterhead
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  doc.text(settings.name || 'Kanzlei', MARGIN, ctx.y + 4)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(80)
  const addrLines = (settings.address || '').split('\n').filter(Boolean)
  let addrY = ctx.y + 9
  for (const line of addrLines.slice(0, 3)) {
    doc.text(line, MARGIN, addrY)
    addrY += 4
  }
  doc.setTextColor(0)
  doc.setDrawColor(180)
  doc.line(MARGIN, ctx.y + 25, PAGE_WIDTH - MARGIN, ctx.y + 25)
  doc.setDrawColor(0)
  ctx.y += 32

  paragraph(ctx, 'Vereinbarung über die Auftragsverarbeitung', { bold: true, size: 16 })
  paragraph(ctx, 'gemäß Art. 28 DSGVO — ENTWURF', { bold: true, size: 11, color: 100 })
  spacer(ctx, 6)

  paragraph(ctx, 'zwischen', { bold: true, size: 11 })
  paragraph(ctx, `${settings.name || '[Kanzlei]'}, ${(settings.address || '[Anschrift]').replace(/\n/g, ', ')}`)
  paragraph(ctx, '— nachfolgend „Verantwortliche" —', { color: 100, size: 9 })
  spacer(ctx)

  paragraph(ctx, 'und', { bold: true, size: 11 })
  paragraph(ctx, '[Auftragsverarbeiter — Name, Anschrift einsetzen]')
  paragraph(ctx, '— nachfolgend „Auftragsverarbeiter" —', { color: 100, size: 9 })
  spacer(ctx, 6)

  // Sections
  const sections: Array<[string, string]> = [
    ['§ 1 Gegenstand und Dauer', 'Der Auftragsverarbeiter erbringt für die Verantwortliche Leistungen im Bereich [Leistungsbeschreibung — z. B. KI-gestützte juristische Recherche und Dokumentenerstellung]. Die Vereinbarung gilt für die Dauer des Hauptvertrags und endet mit dessen Beendigung.'],

    ['§ 2 Art und Zweck der Verarbeitung', 'Verarbeitet werden personenbezogene Daten von Mandant:innen, Verfahrensbeteiligten sowie sonstigen am Mandat beteiligten Personen. Zweck ist die technische Bereitstellung der vereinbarten Leistung.'],

    ['§ 3 Art der personenbezogenen Daten', 'Insbesondere: Name, Anschrift, Kontaktdaten, Aktenzeichen, Sachverhaltsdarstellungen, Bescheide, Kommunikation, sowie ggf. besondere Kategorien personenbezogener Daten i. S. v. Art. 9 DSGVO (z. B. Gesundheits-, Sozialdaten), wenn diese Bestandteil der Mandatsbearbeitung sind.'],

    ['§ 4 Kategorien betroffener Personen', 'Mandant:innen, Gegenpartei:innen, Zeug:innen, Behördenmitarbeiter:innen, sonstige Verfahrensbeteiligte.'],

    ['§ 5 Pflichten des Auftragsverarbeiters', 'Der Auftragsverarbeiter verarbeitet personenbezogene Daten ausschließlich auf dokumentierte Weisung der Verantwortlichen. Er wahrt die Vertraulichkeit, ergreift technische und organisatorische Maßnahmen nach Art. 32 DSGVO, unterstützt die Verantwortliche bei der Wahrnehmung der Rechte betroffener Personen und meldet Datenschutzverletzungen unverzüglich nach Bekanntwerden, spätestens binnen 24 Stunden.'],

    ['§ 6 Unterauftragsverarbeiter', 'Der Auftragsverarbeiter darf Unterauftragsverarbeiter nur mit vorheriger schriftlicher Zustimmung der Verantwortlichen einsetzen. Eine Liste der derzeit eingesetzten Unterauftragsverarbeiter wird als Anlage 1 beigefügt. Änderungen sind mindestens 30 Tage im Voraus anzukündigen.'],

    ['§ 7 Ort der Datenverarbeitung / Drittstaatentransfer', 'Die Datenverarbeitung erfolgt grundsätzlich innerhalb der Europäischen Union bzw. des Europäischen Wirtschaftsraums. Übermittlungen in Drittländer erfolgen nur unter Einhaltung der Voraussetzungen der Art. 44 ff. DSGVO (insbesondere Standardvertragsklauseln gem. Art. 46 Abs. 2 lit. c DSGVO).'],

    ['§ 8 Technische und organisatorische Maßnahmen', 'Die Maßnahmen sind in Anlage 2 detailliert beschrieben (u. a. Zugangskontrolle, Verschlüsselung in Transit und Ruhe, Backup, Logging, Notfallkonzept, regelmäßige Audits).'],

    ['§ 9 Kontroll- und Auskunftsrechte', 'Die Verantwortliche hat das Recht, sich nach vorheriger Anmeldung von der Einhaltung dieser Vereinbarung zu überzeugen. Der Auftragsverarbeiter erteilt jederzeit schriftliche Auskunft über Art, Umfang und Zweck der Verarbeitung.'],

    ['§ 10 Löschung und Rückgabe', 'Nach Beendigung der Erbringung der Verarbeitungsleistungen löscht oder retourniert der Auftragsverarbeiter — nach Wahl der Verantwortlichen — alle personenbezogenen Daten und vernichtet vorhandene Kopien, sofern nicht eine gesetzliche Aufbewahrungspflicht besteht.'],

    ['§ 11 Haftung', 'Es gelten die Regelungen der Art. 82 DSGVO sowie ergänzend die Regelungen des Hauptvertrags.'],

    ['§ 12 Schlussbestimmungen', 'Änderungen und Ergänzungen dieser Vereinbarung bedürfen der Schriftform. Bei Widersprüchen zwischen dieser Vereinbarung und dem Hauptvertrag gelten die Regelungen dieser Vereinbarung vorrangig.'],
  ]
  for (const [title, body] of sections) {
    paragraph(ctx, title, { bold: true, size: 11 })
    paragraph(ctx, body)
    spacer(ctx, 3)
  }

  spacer(ctx, 8)
  paragraph(ctx, 'Ort, Datum: _____________________________________________', { size: 10 })
  spacer(ctx, 12)
  paragraph(ctx, '________________________________________________________', { size: 10 })
  paragraph(ctx, 'Verantwortliche', { size: 9, color: 100 })
  spacer(ctx, 12)
  paragraph(ctx, '________________________________________________________', { size: 10 })
  paragraph(ctx, 'Auftragsverarbeiter', { size: 9, color: 100 })

  // Footer disclaimer
  const total = doc.getNumberOfPages()
  for (let i = 1; i <= total; i++) {
    doc.setPage(i)
    doc.setFontSize(7)
    doc.setTextColor(120)
    doc.text(
      'Hinweis: Dies ist ein nicht anwaltlich geprüfter Mustertext-Entwurf. Vor produktivem Einsatz bitte ' +
        'durch eine:n Datenschutz-Anwält:in finalisieren lassen. Vorlage erstellt mit GitLaw Pro.',
      MARGIN,
      PAGE_HEIGHT - 10,
      { maxWidth: CONTENT_WIDTH },
    )
    doc.text(`Seite ${i}/${total}`, PAGE_WIDTH - MARGIN - 15, PAGE_HEIGHT - 4)
    doc.setTextColor(0)
  }

  doc.save(`AVV-Entwurf_${(settings.name || 'Kanzlei').replace(/[^\w-]/g, '_').slice(0, 30)}.pdf`)
}
