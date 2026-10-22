// ─────────────────────────────────────────────────────────────────────────────
// schoolData.ts — main entry point for all navigation data
//
// Data is split across three files for readability:
//   rooms.ts  — every room in every building (names, numbers, teachers)
//   nodes.ts  — map coordinates for navigation (rooms, hallways, staircases)
//   edges.ts  — connections between nodes with walking distances
//
// Import from this file; don't import the sub-files directly.
// ─────────────────────────────────────────────────────────────────────────────

export { rooms }         from './rooms';
export { nodes }         from './nodes';
export { edges }         from './edges';
