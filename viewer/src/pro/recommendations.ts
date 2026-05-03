import type { MandantCase } from './types'
import { listLetters, listResearch } from './store'

export interface WorkflowRecommendation {
  id: string
  caseId: string
  priority: number
  title: string
  reason: string
  cta: string
  to: string
  tone: 'urgent' | 'action' | 'review'
  stage: 'documents' | 'ocr' | 'translation' | 'research' | 'draft'
}

function daysUntil(iso: string): number {
  const diff = new Date(iso).getTime() - Date.now()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

export function getCaseRecommendations(c: MandantCase): WorkflowRecommendation[] {
  const docs = c.documents || []
  const research = listResearch(c.id)
  const letters = listLetters(c.id)
  const recs: WorkflowRecommendation[] = []
  const frist = c.fristDatum ? daysUntil(c.fristDatum) : null

  if (docs.length === 0) {
    recs.push({
      id: `${c.id}:documents`,
      caseId: c.id,
      priority: 92,
      title: 'Dokumente zuerst sichern',
      reason: 'Ohne Bescheid, Vertrag oder Foto fehlt dem Fall die Arbeitsgrundlage fuer OCR, Recherche und Schreiben.',
      cta: 'Zur Akte',
      to: `/pro/akten/${c.id}`,
      tone: 'action',
      stage: 'documents',
    })
  }

  const docWithoutText = docs.find(d => !d.ocrText && !d.textContent)
  if (docWithoutText) {
    recs.push({
      id: `${c.id}:ocr`,
      caseId: c.id,
      priority: 88,
      title: 'OCR fuer Dokument starten',
      reason: `${docWithoutText.originalName} hat noch keinen nutzbaren Text. Erst danach wird Recherche und Entwurf deutlich schneller.`,
      cta: 'OCR starten',
      to: `/pro/akten/${c.id}`,
      tone: 'action',
      stage: 'ocr',
    })
  }

  const foreignDoc = docs.find(d =>
    d.languageHint &&
    d.languageHint !== 'de' &&
    (d.ocrText || d.textContent) &&
    !d.translatedTextDe,
  )
  if (foreignDoc) {
    recs.push({
      id: `${c.id}:translate`,
      caseId: c.id,
      priority: 82,
      title: 'DE-Arbeitsfassung erzeugen',
      reason: `${foreignDoc.originalName} ist nicht deutsch. Eine DE-Fassung macht Recherche, Rueckfragen und Schreiben sofort belastbarer.`,
      cta: 'Zur Uebersetzung',
      to: `/pro/akten/${c.id}`,
      tone: 'action',
      stage: 'translation',
    })
  }

  const unreviewedTranslation = docs.find(d => d.translatedTextDe && !d.translationReviewed)
  if (unreviewedTranslation) {
    recs.push({
      id: `${c.id}:translation-review`,
      caseId: c.id,
      priority: 76,
      title: 'DE-Fassung kurz freigeben',
      reason: `${unreviewedTranslation.originalName} hat eine maschinelle DE-Fassung, die noch nicht anwaltlich geprueft ist.`,
      cta: 'Zur Pruefung',
      to: `/pro/akten/${c.id}`,
      tone: 'review',
      stage: 'translation',
    })
  }

  if (research.length === 0) {
    recs.push({
      id: `${c.id}:research`,
      caseId: c.id,
      priority: frist !== null && frist <= 3 ? 96 : 74,
      title: frist !== null && frist <= 3 ? 'Recherche jetzt priorisieren' : 'Erstfrage zur Akte stellen',
      reason: frist !== null && frist <= 3
        ? 'Die Frist ist nah. Eine erste belastbare Recherche sollte vor dem Entwurf stehen.'
        : 'Zur Akte liegt noch keine Recherche vor. Das ist meist der naechste produktive Schritt.',
      cta: 'Recherche oeffnen',
      to: `/pro/recherche?case=${c.id}`,
      tone: frist !== null && frist <= 3 ? 'urgent' : 'action',
      stage: 'research',
    })
  }

  if (research.length > 0 && letters.length === 0) {
    recs.push({
      id: `${c.id}:draft`,
      caseId: c.id,
      priority: frist !== null && frist <= 3 ? 94 : 68,
      title: 'Ersten Entwurf erzeugen',
      reason: 'Recherche ist vorhanden, aber noch kein Schreiben. Jetzt kann der Fall in einen versendbaren Entwurf uebergehen.',
      cta: 'Schreiben oeffnen',
      to: `/pro/schreiben?case=${c.id}`,
      tone: frist !== null && frist <= 3 ? 'urgent' : 'action',
      stage: 'draft',
    })
  }

  if (research.some(r => r.reviewed) && letters.length > 0) {
    recs.push({
      id: `${c.id}:follow-through`,
      caseId: c.id,
      priority: 50,
      title: 'Freigabe und Versand vorbereiten',
      reason: 'Es gibt bereits gepruefte Recherche und einen Entwurf. Jetzt geht es um Finalisierung, PDF und Versand.',
      cta: 'Zur Akte',
      to: `/pro/akten/${c.id}`,
      tone: 'review',
      stage: 'draft',
    })
  }

  return recs.sort((a, b) => b.priority - a.priority)
}

export function getGlobalRecommendations(cases: MandantCase[]): WorkflowRecommendation[] {
  return cases
    .filter(c => c.status === 'aktiv')
    .flatMap(c => getCaseRecommendations(c))
    .sort((a, b) => b.priority - a.priority)
    .slice(0, 4)
}
