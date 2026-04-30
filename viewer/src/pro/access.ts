import { getAccessContext } from './store'

export type ProRole = 'owner' | 'anwalt' | 'assistenz' | 'read_only'

const RANK: Record<ProRole, number> = {
  read_only: 1,
  assistenz: 2,
  anwalt: 3,
  owner: 4,
}

export function currentRole(): ProRole {
  return getAccessContext()?.role || 'read_only'
}

export function hasRole(minRole: ProRole): boolean {
  return RANK[currentRole()] >= RANK[minRole]
}

export function canAccessRoute(route: string): boolean {
  if (route.startsWith('/pro/einstellungen')) return hasRole('owner')
  if (route.startsWith('/pro/import')) return hasRole('assistenz')
  if (route.startsWith('/pro/recherche')) return hasRole('assistenz')
  if (route.startsWith('/pro/schreiben')) return hasRole('assistenz')
  if (route.startsWith('/pro/akten')) return hasRole('assistenz')
  if (route.startsWith('/pro/eingaenge')) return hasRole('assistenz')
  if (route.startsWith('/pro/audit')) return hasRole('anwalt')
  return hasRole('read_only')
}
