/**
 * Favorites system — P3 Feature
 * Uses localStorage. No account needed.
 * Can be migrated to Supabase later.
 */

export interface Favorite {
  lawId: string
  lawTitle: string
  section?: string
  note?: string
  addedAt: string
  tag?: string
}

const STORAGE_KEY = 'gitlaw_favorites'

function load(): Favorite[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch {
    return []
  }
}

function save(favs: Favorite[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(favs))
}

export function addFavorite(lawId: string, lawTitle: string, section?: string, note?: string, tag?: string) {
  const favs = load()
  // Don't add duplicates
  if (favs.some(f => f.lawId === lawId && f.section === section)) return
  favs.push({ lawId, lawTitle, section, note, tag, addedAt: new Date().toISOString() })
  save(favs)
}

export function removeFavorite(lawId: string, section?: string) {
  const favs = load().filter(f => !(f.lawId === lawId && f.section === section))
  save(favs)
}

export function isFavorite(lawId: string, section?: string): boolean {
  return load().some(f => f.lawId === lawId && f.section === section)
}

export function getFavorites(): Favorite[] {
  return load()
}

export function getFavoritesByTag(tag: string): Favorite[] {
  return load().filter(f => f.tag === tag)
}

export function getAllTags(): string[] {
  return [...new Set(load().map(f => f.tag).filter(Boolean) as string[])]
}
