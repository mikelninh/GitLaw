/**
 * Word .docx export for Pro research notes and letters.
 *
 * Mirrors the existing pdf.ts API (exportResearchPDF / exportLetterPDF) so the
 * UI just needs an extra button next to the PDF one. Anwält:innen leben in
 * Word — handing them an editable file beats a locked PDF every time.
 *
 * Implementation note: `docx` is pure-JS, generates the .docx blob client-side,
 * and `file-saver` triggers the download. No server round-trip, no Vercel
 * function, no extra cost. Works offline.
 *
 * Document structure:
 *   - Briefkopf (Kanzlei-Anschrift, rechtsbündig)
 *   - Titel (z.B. "Rechtliche Recherche-Notiz")
 *   - Metadaten (Datum, Anwalt, Akte)
 *   - Fragestellung
 *   - Antwort
 *   - Zitierte Vorschriften (mit Verifikations-Status)
 *   - Footer mit Disclaimer + Anwalt-Kontakt
 */

import {
  AlignmentType,
  Document,
  Footer,
  HeadingLevel,
  Packer,
  Paragraph,
  TextRun,
  PageNumber,
  ImageRun,
} from 'docx'
import { saveAs } from 'file-saver'
import type { KanzleiSettings, ResearchQuery, GeneratedLetter, MandantCase, Citation } from './types'

// ─── Building blocks ─────────────────────────────────────────────────

function letterhead(settings: KanzleiSettings): Paragraph[] {
  const lines: string[] = []
  if (settings.name) lines.push(settings.name)
  if (settings.address) lines.push(...settings.address.split('\n'))
  if (settings.anwaltName) lines.push(settings.anwaltName)

  return lines.map(
    line =>
      new Paragraph({
        alignment: AlignmentType.RIGHT,
        children: [new TextRun({ text: line, size: 18, color: '555555' })],
      }),
  )
}

function paragraph(
  text: string,
  opts: { bold?: boolean; size?: number; color?: string; italics?: boolean } = {},
): Paragraph {
  // docx uses half-points; size 11 in Word == 22 here.
  // We keep the pdf.ts mental model (numeric pt) and convert.
  const sizeHalfPt = (opts.size ?? 11) * 2
  return new Paragraph({
    spacing: { after: 120 },
    children: [
      new TextRun({
        text,
        bold: opts.bold,
        italics: opts.italics,
        size: sizeHalfPt,
        color: opts.color,
      }),
    ],
  })
}

function heading(text: string, level: 1 | 2 | 3 = 2): Paragraph {
  return new Paragraph({
    heading: level === 1 ? HeadingLevel.HEADING_1 : level === 2 ? HeadingLevel.HEADING_2 : HeadingLevel.HEADING_3,
    spacing: { before: 240, after: 120 },
    children: [new TextRun({ text, bold: true })],
  })
}

function citationBlock(c: Citation): Paragraph[] {
  const status = c.verified
    ? '✓ verifiziert'
    : c.verificationReason === 'repealed'
      ? '🚨 aufgehoben'
      : '⚠ nicht verifiziert'
  const blocks: Paragraph[] = [
    new Paragraph({
      spacing: { after: 60 },
      children: [
        new TextRun({ text: c.display, bold: true, size: 22 }),
        new TextRun({ text: `   ${status}`, size: 18, color: c.verified ? '15803d' : c.verificationReason === 'repealed' ? 'b91c1c' : 'b45309' }),
      ],
    }),
  ]
  if (c.excerpt) {
    blocks.push(paragraph(c.excerpt, { size: 10, color: '555555', italics: true }))
  }
  if (!c.verified && c.verificationHint) {
    blocks.push(paragraph(`Hinweis: ${c.verificationHint}`, { size: 10, color: 'b45309' }))
  }
  return blocks
}

function disclaimer(settings: KanzleiSettings, reviewed: boolean): Paragraph[] {
  return [
    paragraph(
      reviewed
        ? `Status: anwaltlich geprüft am ${new Date().toLocaleDateString('de-DE')}.`
        : 'Status: noch nicht anwaltlich geprüft. Bitte vor Verwendung gegenlesen.',
      { size: 10, color: reviewed ? '15803d' : '888888' },
    ),
    paragraph(
      `Generiert mit GitLaw Pro · KI-gestützte Recherche mit Korpus-Verifikation. Verifizierte Zitate wurden gegen 5.936 deutsche Bundesgesetze geprüft.${
        settings.anwaltName ? ' · Erstellt durch ' + settings.anwaltName : ''
      }`,
      { size: 9, color: 'aaaaaa', italics: true },
    ),
  ]
}

function footerSection(settings: KanzleiSettings): Footer {
  return new Footer({
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: `${settings.name || 'GitLaw Pro'} · Seite `,
            size: 16,
            color: '888888',
          }),
          new TextRun({ children: [PageNumber.CURRENT], size: 16, color: '888888' }),
        ],
      }),
    ],
  })
}

// ─── Public exports — mirror pdf.ts API ──────────────────────────────

function safeFilename(s: string): string {
  return s.replace(/[^\w-]/g, '_').slice(0, 80)
}

export async function exportResearchDOCX(args: {
  settings: KanzleiSettings
  research: ResearchQuery
  caseInfo?: MandantCase
}): Promise<void> {
  const { settings, research, caseInfo } = args

  const children: Paragraph[] = [
    ...letterhead(settings),
    paragraph(' '),
    heading('Rechtliche Recherche-Notiz', 1),
    paragraph(
      `Erstellt am ${new Date(research.createdAt).toLocaleString('de-DE')}${
        settings.anwaltName ? ' durch ' + settings.anwaltName : ''
      }`,
      { size: 9, color: '888888' },
    ),
  ]

  if (caseInfo) {
    children.push(paragraph(`Aktenzeichen: ${caseInfo.aktenzeichen}`, { bold: true, size: 11 }))
    children.push(paragraph(`Mandant:in: ${caseInfo.mandantName}`, { bold: true, size: 11 }))
  }

  children.push(heading('Fragestellung', 2))
  children.push(paragraph(research.question))

  children.push(heading('KI-gestützte Antwort', 2))
  // Split the answer by double-newlines into paragraphs for proper Word formatting
  for (const block of research.answer.split(/\n\n+/)) {
    if (block.trim()) children.push(paragraph(block.trim()))
  }

  if (research.citations && research.citations.length > 0) {
    children.push(heading('Zitierte Vorschriften', 2))
    for (const c of research.citations) {
      children.push(...citationBlock(c))
    }
  }

  children.push(paragraph(' '))
  children.push(...disclaimer(settings, !!research.reviewed))

  const doc = new Document({
    creator: settings.anwaltName || 'GitLaw Pro',
    title: 'Rechtliche Recherche-Notiz',
    description: research.question.slice(0, 200),
    sections: [
      {
        properties: {},
        footers: { default: footerSection(settings) },
        children,
      },
    ],
  })

  const blob = await Packer.toBlob(doc)
  const filename = `Recherche_${safeFilename(caseInfo?.aktenzeichen || 'GitLawPro')}_${research.id}.docx`
  saveAs(blob, filename)
}

export async function exportLetterDOCX(args: {
  settings: KanzleiSettings
  letter: GeneratedLetter
  caseInfo?: MandantCase
}): Promise<void> {
  const { settings, letter, caseInfo } = args

  const children: Paragraph[] = [
    ...letterhead(settings),
    paragraph(' '),
    paragraph(new Date().toLocaleDateString('de-DE'), { size: 10, color: '666666' }),
    paragraph(' '),
    heading(letter.templateTitle || 'Anwaltsschreiben', 1),
  ]

  if (caseInfo) {
    children.push(paragraph(`Aktenzeichen: ${caseInfo.aktenzeichen}`, { bold: true, size: 11 }))
    children.push(paragraph(' '))
  }

  for (const block of (letter.body || '').split(/\n\n+/)) {
    if (block.trim()) children.push(paragraph(block.trim()))
  }

  children.push(paragraph(' '))
  children.push(paragraph('Mit freundlichen Grüßen'))
  children.push(paragraph(' '))
  if (settings.anwaltName) {
    children.push(paragraph(settings.anwaltName, { bold: true }))
  }
  if (settings.name) {
    children.push(paragraph(settings.name, { color: '666666', size: 10 }))
  }

  const doc = new Document({
    creator: settings.anwaltName || 'GitLaw Pro',
    title: letter.templateTitle || 'Anwaltsschreiben',
    sections: [
      {
        properties: {},
        footers: { default: footerSection(settings) },
        children,
      },
    ],
  })

  const blob = await Packer.toBlob(doc)
  const filename = `${safeFilename(letter.templateTitle || 'Brief')}_${safeFilename(caseInfo?.aktenzeichen || 'GitLawPro')}.docx`
  saveAs(blob, filename)
}

// Keep-alive imports check (for tree-shaking sanity)
void ImageRun
