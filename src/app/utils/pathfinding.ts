import { Node, Edge, PathSegment } from '../types/map';

export function findShortestPath(
  startNodeId: string,
  endNodeId: string,
  nodes: Node[],
  edges: Edge[]
): PathSegment[] {
  if (startNodeId === endNodeId) return [];

  // Build undirected adjacency list
  const graph = new Map<string, Array<{ id: string; dist: number }>>();
  for (const n of nodes) graph.set(n.id, []);
  for (const e of edges) {
    graph.get(e.from)?.push({ id: e.to, dist: e.distance });
    graph.get(e.to)?.push({ id: e.from, dist: e.distance });
  }

  // Dijkstra
  const dist = new Map<string, number>();
  const prev = new Map<string, string | null>();
  const visited = new Set<string>();

  for (const n of nodes) {
    dist.set(n.id, n.id === startNodeId ? 0 : Infinity);
    prev.set(n.id, null);
  }

  while (true) {
    // Pick unvisited node with smallest distance
    let curr: string | null = null;
    let best = Infinity;
    for (const [id, d] of dist) {
      if (!visited.has(id) && d < best) { best = d; curr = id; }
    }
    if (curr === null || best === Infinity) break;
    if (curr === endNodeId) break;
    visited.add(curr);

    for (const { id: nb, dist: w } of graph.get(curr) ?? []) {
      if (visited.has(nb)) continue;
      const nd = best + w;
      if (nd < dist.get(nb)!) {
        dist.set(nb, nd);
        prev.set(nb, curr);
      }
    }
  }

  // Reconstruct
  const path: string[] = [];
  let cur: string | null = endNodeId;
  while (cur) { path.unshift(cur); cur = prev.get(cur) ?? null; }

  if (path.length < 2 || path[0] !== startNodeId) return [];

  const nodeMap = new Map(nodes.map(n => [n.id, n]));
  const segs: PathSegment[] = [];
  for (let i = 0; i < path.length - 1; i++) {
    const from = nodeMap.get(path[i]);
    const to   = nodeMap.get(path[i + 1]);
    if (from && to) segs.push({ from, to });
  }
  return segs;
}

export function pathDistance(segments: PathSegment[]): number {
  return segments.reduce((s, seg) => {
    const dx = seg.to.x - seg.from.x, dy = seg.to.y - seg.from.y;
    return s + Math.sqrt(dx * dx + dy * dy);
  }, 0);
}
