/**
 * RelatedParagraphs — graph-walked "verwandte Paragraphen" panel for the
 * CitationDrawer. Shows two lists:
 *   - Wird zitiert von:  paragraphs that cite the current one (in-edges)
 *   - Zitiert:           paragraphs the current one cites      (out-edges)
 *
 * Data lives in viewer/public/data/citation-graph/{lawId}.json (one shard
 * per law, ~12 KB avg). Generated offline by gitlaw_mcp/graph_builder.py.
 *
 * Failure modes are silent — if the shard doesn't exist (rare laws, build
 * not run), we just don't render anything. Better no UI than broken UI.
 */
import { useEffect, useState } from 'react'
import { Network, ArrowDownLeft, ArrowUpRight } from 'lucide-react'

interface PeerRef {
  lawId: string
  section: string
  marker: '§' | 'Art'
  title: string | null
}

interface SectionEntry {
  marker: string
  title: string | null
  referenced_by: PeerRef[]
  references: PeerRef[]
}

interface ShardFile {
  law_abbr: string
  by_section: Record<string, SectionEntry>
}

const shardCache = new Map<string, ShardFile | null>()

async function loadShard(lawId: string): Promise<ShardFile | null> {
  if (shardCache.has(lawId)) return shardCache.get(lawId)!
  try {
    const resp = await fetch(`./data/citation-graph/${lawId}.json`)
    if (!resp.ok) {
      shardCache.set(lawId, null)
      return null
    }
    const data: ShardFile = await resp.json()
    shardCache.set(lawId, data)
    return data
  } catch {
    shardCache.set(lawId, null)
    return null
  }
}

interface Props {
  lawId: string
  section: string
  /** Called when user clicks a peer to navigate to it. */
  onOpenPeer?: (lawId: string, section: string, display: string) => void
}

const VISIBLE_LIMIT = 8

export function RelatedParagraphs({ lawId, section, onOpenPeer }: Props) {
  const [entry, setEntry] = useState<SectionEntry | null>(null)
  const [loading, setLoading] = useState(true)
  const [showAllIn, setShowAllIn] = useState(false)
  const [showAllOut, setShowAllOut] = useState(false)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setEntry(null)
    setShowAllIn(false)
    setShowAllOut(false)
    if (!lawId) {
      setLoading(false)
      return
    }
    loadShard(lawId).then(shard => {
      if (cancelled) return
      const e = shard?.by_section?.[section] ?? null
      setEntry(e)
      setLoading(false)
    })
    return () => { cancelled = true }
  }, [lawId, section])

  if (loading) return null
  if (!entry) return null

  const incoming = entry.referenced_by ?? []
  const outgoing = entry.references ?? []
  if (incoming.length === 0 && outgoing.length === 0) return null

  const incomingShown = showAllIn ? incoming : incoming.slice(0, VISIBLE_LIMIT)
  const outgoingShown = showAllOut ? outgoing : outgoing.slice(0, VISIBLE_LIMIT)

  const renderPeer = (p: PeerRef, dirIcon: React.ReactNode) => {
    const display = `${p.marker} ${p.section} ${p.lawId.toUpperCase()}`
    const titleSuffix = p.title ? ` — ${p.title}` : ''
    return (
      <li key={`${p.lawId}-${p.marker}-${p.section}`}>
        <button
          type="button"
          onClick={() => onOpenPeer?.(p.lawId, p.section, display)}
          className="w-full text-left px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-paper)] hover:bg-[var(--color-cream)] hover:border-[var(--color-gold)] transition-colors flex items-start gap-2"
          title={`${display}${titleSuffix}`}
        >
          <span className="text-[var(--color-gold)] mt-0.5 flex-shrink-0">{dirIcon}</span>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-mono font-semibold text-[var(--color-ink)]">{display}</div>
            {p.title && (
              <div className="text-xs text-[var(--color-ink-muted)] mt-0.5 line-clamp-2">
                {p.title}
              </div>
            )}
          </div>
        </button>
      </li>
    )
  }

  return (
    <section className="mt-6 pt-5 border-t border-[var(--color-border)]">
      <div className="flex items-center gap-2 mb-2">
        <Network className="w-4 h-4 text-[var(--color-gold)]" />
        <h3 className="text-sm font-semibold">Verwandte Paragraphen</h3>
        <span className="text-xs text-[var(--color-ink-muted)] ml-auto">
          {incoming.length + outgoing.length} aus dem Citation-Graph
        </span>
      </div>
      <p className="text-xs text-[var(--color-ink-soft)] mb-4">
        Andere Paragraphen, die im Korpus diesen Paragraphen erwähnen — oder die hier zitiert werden. Klicken öffnet das jeweilige Detail.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {incoming.length > 0 && (
          <div>
            <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-[var(--color-ink-muted)] font-semibold mb-2">
              <ArrowDownLeft className="w-3.5 h-3.5" />
              Wird zitiert von ({incoming.length})
            </div>
            <ul className="space-y-1.5">
              {incomingShown.map(p => renderPeer(p, <ArrowDownLeft className="w-3.5 h-3.5" />))}
            </ul>
            {incoming.length > VISIBLE_LIMIT && (
              <button
                onClick={() => setShowAllIn(!showAllIn)}
                className="mt-2 text-xs text-[var(--color-gold)] hover:underline"
              >
                {showAllIn ? 'Weniger anzeigen' : `+ ${incoming.length - VISIBLE_LIMIT} weitere anzeigen`}
              </button>
            )}
          </div>
        )}

        {outgoing.length > 0 && (
          <div>
            <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-[var(--color-ink-muted)] font-semibold mb-2">
              <ArrowUpRight className="w-3.5 h-3.5" />
              Zitiert ({outgoing.length})
            </div>
            <ul className="space-y-1.5">
              {outgoingShown.map(p => renderPeer(p, <ArrowUpRight className="w-3.5 h-3.5" />))}
            </ul>
            {outgoing.length > VISIBLE_LIMIT && (
              <button
                onClick={() => setShowAllOut(!showAllOut)}
                className="mt-2 text-xs text-[var(--color-gold)] hover:underline"
              >
                {showAllOut ? 'Weniger anzeigen' : `+ ${outgoing.length - VISIBLE_LIMIT} weitere anzeigen`}
              </button>
            )}
          </div>
        )}
      </div>

      <p className="text-[11px] text-[var(--color-ink-muted)] mt-4 italic">
        Aus 200.464 extrahierten Cross-References im Korpus · {' '}
        <a href="../gitlaw_mcp/graph_viewer.html" target="_blank" rel="noopener" className="underline hover:text-[var(--color-gold)]">
          Knowledge-Graph-Viewer ↗
        </a>
      </p>
    </section>
  )
}
