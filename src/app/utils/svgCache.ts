// ─────────────────────────────────────────────────────────────────────────────
// SVG Cache
//
// Fetches all floor map SVGs once at startup and stores the inner content
// (everything inside the <svg> tag) in memory. SchoolMap reads from here
// instead of fetching each time the floor changes, eliminating the lag.
// ─────────────────────────────────────────────────────────────────────────────

import { floorMaps } from '../data/floorMaps';

// Module-level cache: svgPath → inner SVG content string
const cache = new Map<string, string>();

// Track which paths are currently being fetched so we don't double-fetch
const pending = new Set<string>();

function extractInner(txt: string): string {
  return txt
    .replace(/^[\s\S]*?<svg[^>]*>/, '')
    .replace(/<\/svg>\s*$/, '');
}

// Fetch one SVG and store it in the cache
async function fetchOne(svgPath: string): Promise<void> {
  if (cache.has(svgPath) || pending.has(svgPath)) return;
  pending.add(svgPath);
  try {
    const res  = await fetch(svgPath);
    const text = await res.text();
    cache.set(svgPath, extractInner(text));
  } catch {
    // On error store empty string so we don't retry forever
    cache.set(svgPath, '');
  } finally {
    pending.delete(svgPath);
  }
}

// Preload all floor maps — called once from main.tsx
export function preloadAllSVGs(): void {
  for (const fm of floorMaps) {
    fetchOne(fm.svgPath);
  }
}

// Get cached content synchronously — returns null if not ready yet
export function getCachedSVG(svgPath: string): string | null {
  return cache.has(svgPath) ? cache.get(svgPath)! : null;
}

// Get cached content, fetching it if missing, returns a promise
export async function getSVG(svgPath: string): Promise<string> {
  if (!cache.has(svgPath)) await fetchOne(svgPath);
  return cache.get(svgPath) ?? '';
}
