/**
 * StatusBadge — farbige Pille mit Icon + Label für den aktuellen Verfahrens-Status.
 * Modul B, Sprint 1.
 */

import { getStatusInfo } from './case-status'
import type { CaseStatus } from './case-status'

const COLOR_CLASSES: Record<string, string> = {
  amber: 'bg-amber-100 text-amber-800 border-amber-300',
  blue: 'bg-blue-100 text-blue-800 border-blue-300',
  orange: 'bg-orange-100 text-orange-800 border-orange-300',
  green: 'bg-green-100 text-green-800 border-green-300',
  gray: 'bg-slate-100 text-slate-700 border-slate-300',
}

interface Props {
  status: CaseStatus
  size?: 'sm' | 'md'
}

export default function StatusBadge({ status, size = 'md' }: Props) {
  const info = getStatusInfo(status)
  const colorClass = COLOR_CLASSES[info.color] ?? COLOR_CLASSES.gray
  const textSize = size === 'sm' ? 'text-[10px]' : 'text-xs'

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-medium ${textSize} ${colorClass}`}
      title={info.internalDescription}
    >
      {info.icon && <span aria-hidden="true">{info.icon}</span>}
      {info.label}
    </span>
  )
}
