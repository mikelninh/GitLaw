/**
 * RAG (Retrieval Augmented Generation) for GitLaw
 *
 * Flow:
 * 1. User asks a question ("Kann mein Vermieter mich rausschmeißen?")
 * 2. RETRIEVE: Search law index for relevant laws + sections
 * 3. AUGMENT: Build context from actual law text + pre-cached explanations
 * 4. GENERATE: OpenAI answers WITH legal context → no hallucination
 *
 * Uses OpenAI API key (set VITE_OPENAI_API_KEY in .env)
 */

import OpenAI from 'openai'
import Fuse from 'fuse.js'

const API_KEY = import.meta.env.VITE_OPENAI_API_KEY || ''

interface LawChunk {
  law: string
  section: string
  text: string
  explanation?: string
}

// Search terms for common legal questions → relevant law abbreviations
const topicMap: Record<string, string[]> = {
  'miete': ['bgb', 'bgb', 'bgb'],
  'mieterhöhung': ['bgb'],
  'kündigung': ['bgb', 'kschg'],
  'arbeitszeit': ['arbzg'],
  'schwangerschaft': ['muschg'],
  'mutterschutz': ['muschg'],
  'elternzeit': ['beeg'],
  'elterngeld': ['beeg'],
  'rente': ['sgb_6'],
  'krankenversicherung': ['sgb_5'],
  'bürgergeld': ['sgb_2'],
  'hartz': ['sgb_2'],
  'beleidigung': ['stgb'],
  'stalking': ['stgb'],
  'diebstahl': ['stgb'],
  'betrug': ['stgb'],
  'tierschutz': ['tierschg'],
  'steuer': ['estg', 'ao_1977'],
  'diskriminierung': ['agg'],
  'grundgesetz': ['gg'],
  'grundrechte': ['gg'],
  'aufenthalt': ['aufenthg_2004'],
  'asyl': ['aufenthg_2004', 'gg'],
  'heizung': ['geg'],
  'wärmepumpe': ['geg'],
  'internet': ['netzdg'],
  'hassrede': ['netzdg', 'stgb'],
  'schwarzfahren': ['stgb'],
}

async function findRelevantChunks(question: string): Promise<LawChunk[]> {
  const chunks: LawChunk[] = []
  const q = question.toLowerCase()

  // Find relevant laws by topic keywords
  const relevantLaws = new Set<string>()
  for (const [keyword, laws] of Object.entries(topicMap)) {
    if (q.includes(keyword)) {
      laws.forEach(l => relevantLaws.add(l))
    }
  }

  // If no keyword match, default to the most common laws
  if (relevantLaws.size === 0) {
    relevantLaws.add('bgb')
    relevantLaws.add('stgb')
    relevantLaws.add('gg')
  }

  // Load explanations for relevant laws
  for (const lawId of relevantLaws) {
    try {
      const resp = await fetch(`./explanations/${lawId}.json`)
      if (!resp.ok) continue
      const data = await resp.json()

      for (const [section, explanation] of Object.entries(data.explanations)) {
        chunks.push({
          law: data.law,
          section,
          text: explanation as string,
          explanation: explanation as string,
        })
      }
    } catch { /* skip */ }
  }

  // Fuzzy search within chunks to find most relevant
  if (chunks.length > 0) {
    const fuse = new Fuse(chunks, {
      keys: ['section', 'text'],
      threshold: 0.4,
      ignoreLocation: true,
    })
    const results = fuse.search(question)
    if (results.length > 0) {
      return results.slice(0, 5).map(r => r.item)
    }
  }

  return chunks.slice(0, 5)
}

export async function askLegalQuestion(question: string, persona?: string): Promise<{
  answer: string
  sources: { law: string; section: string }[]
}> {
  if (!API_KEY) {
    return {
      answer: '⚠️ Bitte VITE_OPENAI_API_KEY in viewer/.env setzen. Einen OpenAI API Key bekommst du auf platform.openai.com.',
      sources: [],
    }
  }

  // 1. RETRIEVE
  const chunks = await findRelevantChunks(question)

  // 2. AUGMENT — build context
  const context = chunks.map(c =>
    `[${c.law} — ${c.section}]\n${c.text}`
  ).join('\n\n---\n\n')

  const sources = chunks.map(c => ({ law: c.law, section: c.section }))

  // 3. GENERATE
  const client = new OpenAI({ apiKey: API_KEY, dangerouslyAllowBrowser: true })

  const personaContext = persona
    ? `\n\nDie Person die fragt: ${persona}. Beziehe dich auf ihre Situation.`
    : ''

  const resp = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `Du bist ein freundlicher Rechtsberater der Fragen zum deutschen Recht beantwortet.

WICHTIG:
- Antworte NUR basierend auf den bereitgestellten Gesetzestexten
- Wenn die Antwort nicht in den Quellen steht, sag das ehrlich
- Nenne immer die relevanten Paragraphen
- Erkläre einfach und verständlich (für einen 16-Jährigen)
- Gib ein konkretes Alltagsbeispiel
- Weise darauf hin, dass dies keine Rechtsberatung ist
- Maximal 5-6 Sätze${personaContext}

GESETZLICHE QUELLEN:
${context}`
      },
      { role: 'user', content: question }
    ],
    max_tokens: 400,
    temperature: 0.2,
  })

  const answer = resp.choices[0]?.message?.content || 'Keine Antwort möglich.'

  return { answer, sources }
}
