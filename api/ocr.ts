import type { VercelRequest, VercelResponse } from '@vercel/node'
import { Redis } from '@upstash/redis'
import { requireProSession } from './_auth'
import { applyCors, applySecurityHeaders } from './_http'

const redis = Redis.fromEnv()

async function openAIChat(messages: Array<Record<string, unknown>>, maxTokens = 1000): Promise<string> {
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY
  if (!OPENAI_API_KEY) throw new Error('OpenAI key not configured')
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages,
      temperature: 0.1,
      max_tokens: maxTokens,
    }),
  })
  const data = await response.json()
  const content = data.choices?.[0]?.message?.content
  if (!response.ok || !content) {
    throw new Error(data?.error?.message || 'Empty LLM response')
  }
  return String(content).trim()
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  applySecurityHeaders(res)
  const corsAllowed = applyCors(req, res, 'POST, OPTIONS')
  if (!corsAllowed) return res.status(403).json({ error: 'Origin not allowed' })

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  const session = requireProSession(req, res, 'assistenz')
  if (!session) return
  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
    return res.status(503).json({ error: 'Document vault not configured' })
  }

  const { caseId, attachmentInternalName, mode, sourceLanguage, targetLanguage, serverDocumentId, sourceText } = req.body || {}
  if (!caseId || !attachmentInternalName || !mode) {
    return res.status(400).json({ error: 'caseId, attachmentInternalName and mode are required' })
  }

  try {
    let mimeType = 'text/plain'
    let base64 = ''
    if (typeof serverDocumentId === 'string' && serverDocumentId.trim()) {
      const key = `proDoc:${session.tenantId}:${serverDocumentId.trim()}`
      const payload = await redis.get<{ mimeType: string; base64: string }>(key)
      if (!payload) return res.status(404).json({ error: 'Server document not found' })
      mimeType = payload.mimeType
      base64 = payload.base64
    }

    if (mode === 'ocr') {
      if (mimeType.startsWith('text/')) {
        const ocrText = Buffer.from(base64, 'base64').toString('utf8')
        return res.status(200).json({ ok: true, status: 'done', provider: 'native-text', ocrText })
      }
      if (mimeType.startsWith('image/')) {
        const dataUrl = `data:${mimeType};base64,${base64}`
        const ocrText = await openAIChat([
          {
            role: 'system',
            content: 'You perform OCR for legal documents. Transcribe the document faithfully into plain text. Do not summarize.',
          },
          {
            role: 'user',
            content: [
              { type: 'text', text: 'Please transcribe this legal document exactly into plain text.' },
              { type: 'image_url', image_url: { url: dataUrl } },
            ],
          },
        ], 1600)
        return res.status(200).json({ ok: true, status: 'done', provider: 'openai-vision', ocrText })
      }
      return res.status(501).json({
        ok: false,
        status: 'not_supported_yet',
        message: 'OCR is currently supported for text and image documents. PDF OCR worker is the next step.',
      })
    }

    if (mode === 'translate') {
      const source =
        (typeof sourceText === 'string' && sourceText.trim())
          ? sourceText.trim()
          : mimeType.startsWith('text/')
            ? Buffer.from(base64, 'base64').toString('utf8')
            : ''
      if (!source) {
        return res.status(400).json({
          error: 'No source text available for translation',
          hint: 'Run OCR first or provide sourceText',
        })
      }
      const translatedTextDe = await openAIChat([
        {
          role: 'system',
          content: 'You translate legal working texts into German. Preserve legal meaning, keep names, dates, and identifiers unchanged where possible. Return only the German working translation.',
        },
        {
          role: 'user',
          content: `Source language: ${sourceLanguage || 'unknown'}\nTarget language: ${targetLanguage || 'de'}\n\nText:\n${source}`,
        },
      ], 1400)
      return res.status(200).json({ ok: true, status: 'done', provider: 'openai-translation', translatedTextDe })
    }

    return res.status(400).json({ error: 'Unsupported mode' })
  } catch (err) {
    return res.status(500).json({
      error: 'OCR/translation request failed',
      detail: err instanceof Error ? err.message : 'unknown',
    })
  }
}
