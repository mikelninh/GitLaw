/**
 * GET /api/sync/{key}  → return last snapshot for kanzleiKey, 404 if none
 * PUT /api/sync/{key}  → store snapshot
 *
 * Storage: Vercel KV (Redis). Aktivierung:
 *   1. `vercel kv create gitlaw-pro-sync`
 *   2. `vercel link` + `vercel env pull .env.local`
 *   3. KV_REST_API_URL und KV_REST_API_TOKEN sind dann automatisch da.
 *
 * WICHTIG für Beta:
 *   - kanzleiKey ist die einzige "Auth". Wer ihn rät, kann lesen/schreiben.
 *     Für Pilotbetrieb mit handverteilten Keys vertretbar; vor Public-Launch
 *     auf token-basierte Auth (Magic-Link + JWT) umstellen.
 *   - Snapshot-Größe ist begrenzt (Vercel KV erlaubt ~1MB pro Eintrag).
 *     Bei Überschreitung in Chunks splitten oder S3-kompatibles Storage.
 *   - DSGVO: AVV mit Vercel notwendig. Falls EU-Region erforderlich, nutze
 *     Upstash Redis statt Vercel KV — Upstash hat EU-Regionen.
 */

import type { VercelRequest, VercelResponse } from '@vercel/node'

// Lazy import so the function can be deployed even before KV is provisioned
async function getKv() {
  try {
    const mod = await import('@vercel/kv')
    return mod.kv
  } catch {
    return null
  }
}

const MAX_SNAPSHOT_SIZE = 900_000  // ~900 KB — leave room for KV overhead

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()

  const { key } = req.query
  if (typeof key !== 'string' || !key.trim() || key.length > 200) {
    return res.status(400).json({ error: 'Invalid key' })
  }

  const kv = await getKv()
  if (!kv) {
    return res.status(503).json({
      error: 'Cloud-Sync ist serverseitig noch nicht provisioniert.',
      hint: 'Admin: vercel kv create gitlaw-pro-sync && vercel env pull',
    })
  }

  const namespacedKey = `proSync:${key}`

  if (req.method === 'GET') {
    try {
      const snapshot = await kv.get(namespacedKey)
      if (!snapshot) return res.status(404).json({ error: 'No snapshot for this key' })
      return res.status(200).json(snapshot)
    } catch (err) {
      return res.status(500).json({ error: 'KV read failed', detail: String(err) })
    }
  }

  if (req.method === 'PUT') {
    const body = req.body
    if (!body || typeof body !== 'object') {
      return res.status(400).json({ error: 'Body must be a JSON snapshot' })
    }
    const size = JSON.stringify(body).length
    if (size > MAX_SNAPSHOT_SIZE) {
      return res.status(413).json({
        error: 'Snapshot too large',
        sizeBytes: size,
        limitBytes: MAX_SNAPSHOT_SIZE,
        hint: 'Bitte ZIP-Export der Akten archivieren und alte Akten lokal löschen.',
      })
    }
    try {
      // Store with 90-day TTL — explicit cleanup signal to user
      await kv.set(namespacedKey, body, { ex: 60 * 60 * 24 * 90 })
      return res.status(200).json({ ok: true, sizeBytes: size })
    } catch (err) {
      return res.status(500).json({ error: 'KV write failed', detail: String(err) })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
