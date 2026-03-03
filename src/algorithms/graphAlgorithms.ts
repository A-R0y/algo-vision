export type GraphAlgorithm =
  | 'bfs' | 'dfs' | 'bidirectional-bfs' | 'best-first' | 'a-star'
  | 'dijkstra' | 'bellman-ford' | 'floyd-warshall'
  | 'prims' | 'kruskals';

export type AlgoCategory = 'traversal' | 'shortest-path' | 'mst';

export interface GraphNode {
  id: number;
  x: number;
  y: number;
  label: string;
  heuristic?: number; // for A* / best-first
}

export interface GraphEdge {
  from: number;
  to: number;
  weight: number;
}

export interface Graph {
  nodes: GraphNode[];
  edges: GraphEdge[];
  directed: boolean;
}

export interface GraphStep {
  visited: number[];
  current: number | null;
  frontier: number[];
  highlightedEdges: [number, number][];
  path: number[];
  description: string;
  distances?: Record<number, number>;
  mstEdges?: [number, number][];
}

export const algoCategory: Record<GraphAlgorithm, AlgoCategory> = {
  'bfs': 'traversal', 'dfs': 'traversal', 'bidirectional-bfs': 'traversal',
  'best-first': 'traversal', 'a-star': 'shortest-path',
  'dijkstra': 'shortest-path', 'bellman-ford': 'shortest-path', 'floyd-warshall': 'shortest-path',
  'prims': 'mst', 'kruskals': 'mst',
};

export const graphAlgoInfo: Record<GraphAlgorithm, { name: string; time: string; space: string; description: string; category: AlgoCategory }> = {
  'bfs': { name: 'BFS', time: 'O(V+E)', space: 'O(V)', description: 'Breadth-First Search explores all neighbors at the current depth before moving deeper.', category: 'traversal' },
  'dfs': { name: 'DFS', time: 'O(V+E)', space: 'O(V)', description: 'Depth-First Search explores as far as possible along each branch before backtracking.', category: 'traversal' },
  'bidirectional-bfs': { name: 'Bi-BFS', time: 'O(b^(d/2))', space: 'O(b^(d/2))', description: 'Searches from both source and target simultaneously, meeting in the middle.', category: 'traversal' },
  'best-first': { name: 'Best-First', time: 'O(b^m)', space: 'O(b^m)', description: 'Greedy search that expands the node closest to the goal using a heuristic.', category: 'traversal' },
  'a-star': { name: 'A*', time: 'O(b^d)', space: 'O(b^d)', description: 'Combines actual cost and heuristic to find the optimal shortest path.', category: 'shortest-path' },
  'dijkstra': { name: "Dijkstra's", time: 'O((V+E)logV)', space: 'O(V)', description: 'Finds shortest paths from source to all vertices using a priority queue.', category: 'shortest-path' },
  'bellman-ford': { name: 'Bellman-Ford', time: 'O(VE)', space: 'O(V)', description: 'Finds shortest paths even with negative weights by relaxing all edges V-1 times.', category: 'shortest-path' },
  'floyd-warshall': { name: 'Floyd-Warshall', time: 'O(V³)', space: 'O(V²)', description: 'Finds shortest paths between all pairs of vertices using dynamic programming.', category: 'shortest-path' },
  'prims': { name: "Prim's", time: 'O(ElogV)', space: 'O(V)', description: 'Builds MST by greedily adding the cheapest edge from the tree to a new vertex.', category: 'mst' },
  'kruskals': { name: "Kruskal's", time: 'O(ElogE)', space: 'O(V)', description: 'Builds MST by sorting edges and adding them if they don\'t create a cycle.', category: 'mst' },
};

// Pre-built graph
export function generateSampleGraph(): Graph {
  const nodes: GraphNode[] = [
    { id: 0, x: 80, y: 60, label: 'A', heuristic: 10 },
    { id: 1, x: 200, y: 30, label: 'B', heuristic: 8 },
    { id: 2, x: 200, y: 120, label: 'C', heuristic: 6 },
    { id: 3, x: 320, y: 50, label: 'D', heuristic: 5 },
    { id: 4, x: 320, y: 140, label: 'E', heuristic: 3 },
    { id: 5, x: 440, y: 30, label: 'F', heuristic: 4 },
    { id: 6, x: 440, y: 120, label: 'G', heuristic: 2 },
    { id: 7, x: 540, y: 80, label: 'H', heuristic: 0 },
  ];
  const edges: GraphEdge[] = [
    { from: 0, to: 1, weight: 4 }, { from: 0, to: 2, weight: 2 },
    { from: 1, to: 3, weight: 5 }, { from: 1, to: 2, weight: 1 },
    { from: 2, to: 4, weight: 3 }, { from: 2, to: 3, weight: 8 },
    { from: 3, to: 5, weight: 2 }, { from: 3, to: 6, weight: 6 },
    { from: 4, to: 6, weight: 1 }, { from: 5, to: 7, weight: 3 },
    { from: 6, to: 7, weight: 5 }, { from: 4, to: 3, weight: 2 },
  ];
  return { nodes, edges, directed: false };
}

function neighbors(graph: Graph, nodeId: number): { id: number; weight: number }[] {
  const result: { id: number; weight: number }[] = [];
  for (const e of graph.edges) {
    if (e.from === nodeId) result.push({ id: e.to, weight: e.weight });
    if (!graph.directed && e.to === nodeId) result.push({ id: e.from, weight: e.weight });
  }
  return result;
}

export function runGraphAlgorithm(graph: Graph, algorithm: GraphAlgorithm, source: number, target: number): GraphStep[] {
  switch (algorithm) {
    case 'bfs': return bfs(graph, source, target);
    case 'dfs': return dfs(graph, source, target);
    case 'bidirectional-bfs': return bidirectionalBfs(graph, source, target);
    case 'best-first': return bestFirst(graph, source, target);
    case 'a-star': return aStar(graph, source, target);
    case 'dijkstra': return dijkstra(graph, source, target);
    case 'bellman-ford': return bellmanFord(graph, source, target);
    case 'floyd-warshall': return floydWarshall(graph, source, target);
    case 'prims': return prims(graph, source);
    case 'kruskals': return kruskals(graph);
  }
}

function buildPath(parent: Record<number, number | null>, target: number): number[] {
  const path: number[] = [];
  let cur: number | null = target;
  while (cur !== null) { path.unshift(cur); cur = parent[cur] ?? null; }
  return path;
}

function bfs(graph: Graph, source: number, target: number): GraphStep[] {
  const steps: GraphStep[] = [];
  const visited = new Set<number>();
  const parent: Record<number, number | null> = { [source]: null };
  const queue = [source];
  visited.add(source);
  steps.push({ visited: [], current: source, frontier: [source], highlightedEdges: [], path: [], description: `Start BFS from ${graph.nodes[source].label}` });

  while (queue.length > 0) {
    const cur = queue.shift()!;
    steps.push({ visited: [...visited], current: cur, frontier: [...queue], highlightedEdges: [], path: [], description: `Visit ${graph.nodes[cur].label}` });
    if (cur === target) {
      const path = buildPath(parent, target);
      steps.push({ visited: [...visited], current: target, frontier: [], highlightedEdges: [], path, description: `Found ${graph.nodes[target].label}! Path: ${path.map(n => graph.nodes[n].label).join('→')}` });
      return steps;
    }
    for (const nb of neighbors(graph, cur)) {
      if (!visited.has(nb.id)) {
        visited.add(nb.id);
        parent[nb.id] = cur;
        queue.push(nb.id);
        steps.push({ visited: [...visited], current: cur, frontier: [...queue], highlightedEdges: [[cur, nb.id]], path: [], description: `Enqueue ${graph.nodes[nb.id].label}` });
      }
    }
  }
  steps.push({ visited: [...visited], current: null, frontier: [], highlightedEdges: [], path: [], description: `Target not reachable` });
  return steps;
}

function dfs(graph: Graph, source: number, target: number): GraphStep[] {
  const steps: GraphStep[] = [];
  const visited = new Set<number>();
  const parent: Record<number, number | null> = { [source]: null };
  const stack = [source];

  steps.push({ visited: [], current: source, frontier: [source], highlightedEdges: [], path: [], description: `Start DFS from ${graph.nodes[source].label}` });

  while (stack.length > 0) {
    const cur = stack.pop()!;
    if (visited.has(cur)) continue;
    visited.add(cur);
    steps.push({ visited: [...visited], current: cur, frontier: [...stack], highlightedEdges: [], path: [], description: `Visit ${graph.nodes[cur].label}` });
    if (cur === target) {
      const path = buildPath(parent, target);
      steps.push({ visited: [...visited], current: target, frontier: [], highlightedEdges: [], path, description: `Found ${graph.nodes[target].label}! Path: ${path.map(n => graph.nodes[n].label).join('→')}` });
      return steps;
    }
    for (const nb of neighbors(graph, cur).reverse()) {
      if (!visited.has(nb.id)) {
        parent[nb.id] = cur;
        stack.push(nb.id);
      }
    }
  }
  steps.push({ visited: [...visited], current: null, frontier: [], highlightedEdges: [], path: [], description: `Target not reachable` });
  return steps;
}

function bidirectionalBfs(graph: Graph, source: number, target: number): GraphStep[] {
  const steps: GraphStep[] = [];
  const visitedS = new Set<number>([source]);
  const visitedT = new Set<number>([target]);
  const parentS: Record<number, number | null> = { [source]: null };
  const parentT: Record<number, number | null> = { [target]: null };
  let queueS = [source], queueT = [target];

  steps.push({ visited: [source, target], current: null, frontier: [source, target], highlightedEdges: [], path: [], description: `Start Bi-BFS from ${graph.nodes[source].label} and ${graph.nodes[target].label}` });

  while (queueS.length > 0 && queueT.length > 0) {
    // Expand from source
    const nextS: number[] = [];
    for (const cur of queueS) {
      for (const nb of neighbors(graph, cur)) {
        if (!visitedS.has(nb.id)) {
          visitedS.add(nb.id);
          parentS[nb.id] = cur;
          nextS.push(nb.id);
          steps.push({ visited: [...visitedS, ...visitedT], current: nb.id, frontier: [...nextS, ...queueT], highlightedEdges: [[cur, nb.id]], path: [], description: `Forward: explore ${graph.nodes[nb.id].label}` });
          if (visitedT.has(nb.id)) {
            const pathS = buildPath(parentS, nb.id);
            const pathT = buildPath(parentT, nb.id).reverse().slice(1);
            const path = [...pathS, ...pathT];
            steps.push({ visited: [...visitedS, ...visitedT], current: nb.id, frontier: [], highlightedEdges: [], path, description: `Paths met at ${graph.nodes[nb.id].label}! ${path.map(n => graph.nodes[n].label).join('→')}` });
            return steps;
          }
        }
      }
    }
    queueS = nextS;
    // Expand from target
    const nextT: number[] = [];
    for (const cur of queueT) {
      for (const nb of neighbors(graph, cur)) {
        if (!visitedT.has(nb.id)) {
          visitedT.add(nb.id);
          parentT[nb.id] = cur;
          nextT.push(nb.id);
          steps.push({ visited: [...visitedS, ...visitedT], current: nb.id, frontier: [...queueS, ...nextT], highlightedEdges: [[cur, nb.id]], path: [], description: `Backward: explore ${graph.nodes[nb.id].label}` });
          if (visitedS.has(nb.id)) {
            const pathS = buildPath(parentS, nb.id);
            const pathT = buildPath(parentT, nb.id).reverse().slice(1);
            const path = [...pathS, ...pathT];
            steps.push({ visited: [...visitedS, ...visitedT], current: nb.id, frontier: [], highlightedEdges: [], path, description: `Paths met at ${graph.nodes[nb.id].label}! ${path.map(n => graph.nodes[n].label).join('→')}` });
            return steps;
          }
        }
      }
    }
    queueT = nextT;
  }
  steps.push({ visited: [...visitedS, ...visitedT], current: null, frontier: [], highlightedEdges: [], path: [], description: 'No path found' });
  return steps;
}

function bestFirst(graph: Graph, source: number, target: number): GraphStep[] {
  const steps: GraphStep[] = [];
  const visited = new Set<number>();
  const parent: Record<number, number | null> = { [source]: null };
  // Priority queue as sorted array: [heuristic, nodeId]
  let pq: [number, number][] = [[graph.nodes[source].heuristic ?? 0, source]];

  steps.push({ visited: [], current: source, frontier: [source], highlightedEdges: [], path: [], description: `Start Best-First from ${graph.nodes[source].label} (h=${graph.nodes[source].heuristic})` });

  while (pq.length > 0) {
    pq.sort((a, b) => a[0] - b[0]);
    const [, cur] = pq.shift()!;
    if (visited.has(cur)) continue;
    visited.add(cur);
    steps.push({ visited: [...visited], current: cur, frontier: pq.map(p => p[1]), highlightedEdges: [], path: [], description: `Visit ${graph.nodes[cur].label} (h=${graph.nodes[cur].heuristic})` });
    if (cur === target) {
      const path = buildPath(parent, target);
      steps.push({ visited: [...visited], current: target, frontier: [], highlightedEdges: [], path, description: `Found! Path: ${path.map(n => graph.nodes[n].label).join('→')}` });
      return steps;
    }
    for (const nb of neighbors(graph, cur)) {
      if (!visited.has(nb.id)) {
        parent[nb.id] = cur;
        pq.push([graph.nodes[nb.id].heuristic ?? 0, nb.id]);
        steps.push({ visited: [...visited], current: cur, frontier: pq.map(p => p[1]), highlightedEdges: [[cur, nb.id]], path: [], description: `Add ${graph.nodes[nb.id].label} (h=${graph.nodes[nb.id].heuristic})` });
      }
    }
  }
  steps.push({ visited: [...visited], current: null, frontier: [], highlightedEdges: [], path: [], description: 'Target not reachable' });
  return steps;
}

function aStar(graph: Graph, source: number, target: number): GraphStep[] {
  const steps: GraphStep[] = [];
  const visited = new Set<number>();
  const gScore: Record<number, number> = { [source]: 0 };
  const parent: Record<number, number | null> = { [source]: null };
  let pq: [number, number][] = [[graph.nodes[source].heuristic ?? 0, source]]; // [fScore, node]

  steps.push({ visited: [], current: source, frontier: [source], highlightedEdges: [], path: [], distances: { ...gScore }, description: `Start A* from ${graph.nodes[source].label}` });

  while (pq.length > 0) {
    pq.sort((a, b) => a[0] - b[0]);
    const [fVal, cur] = pq.shift()!;
    if (visited.has(cur)) continue;
    visited.add(cur);
    steps.push({ visited: [...visited], current: cur, frontier: pq.map(p => p[1]), highlightedEdges: [], path: [], distances: { ...gScore }, description: `Visit ${graph.nodes[cur].label} (f=${fVal}, g=${gScore[cur]})` });
    if (cur === target) {
      const path = buildPath(parent, target);
      steps.push({ visited: [...visited], current: target, frontier: [], highlightedEdges: [], path, distances: { ...gScore }, description: `Optimal path found! Cost=${gScore[target]}. ${path.map(n => graph.nodes[n].label).join('→')}` });
      return steps;
    }
    for (const nb of neighbors(graph, cur)) {
      const tentG = (gScore[cur] ?? Infinity) + nb.weight;
      if (tentG < (gScore[nb.id] ?? Infinity)) {
        gScore[nb.id] = tentG;
        parent[nb.id] = cur;
        const f = tentG + (graph.nodes[nb.id].heuristic ?? 0);
        pq.push([f, nb.id]);
        steps.push({ visited: [...visited], current: cur, frontier: pq.map(p => p[1]), highlightedEdges: [[cur, nb.id]], path: [], distances: { ...gScore }, description: `Update ${graph.nodes[nb.id].label}: g=${tentG}, f=${f}` });
      }
    }
  }
  steps.push({ visited: [...visited], current: null, frontier: [], highlightedEdges: [], path: [], distances: { ...gScore }, description: 'Target not reachable' });
  return steps;
}

function dijkstra(graph: Graph, source: number, target: number): GraphStep[] {
  const steps: GraphStep[] = [];
  const dist: Record<number, number> = {};
  const parent: Record<number, number | null> = {};
  const visited = new Set<number>();
  for (const n of graph.nodes) { dist[n.id] = Infinity; parent[n.id] = null; }
  dist[source] = 0;
  let pq: [number, number][] = [[0, source]];

  steps.push({ visited: [], current: source, frontier: [source], highlightedEdges: [], path: [], distances: { ...dist }, description: `Start Dijkstra from ${graph.nodes[source].label}` });

  while (pq.length > 0) {
    pq.sort((a, b) => a[0] - b[0]);
    const [d, cur] = pq.shift()!;
    if (visited.has(cur)) continue;
    visited.add(cur);
    steps.push({ visited: [...visited], current: cur, frontier: pq.map(p => p[1]), highlightedEdges: [], path: [], distances: { ...dist }, description: `Visit ${graph.nodes[cur].label} (dist=${d})` });
    if (cur === target) {
      const path = buildPath(parent, target);
      steps.push({ visited: [...visited], current: target, frontier: [], highlightedEdges: [], path, distances: { ...dist }, description: `Shortest path to ${graph.nodes[target].label}: cost=${dist[target]}. ${path.map(n => graph.nodes[n].label).join('→')}` });
      return steps;
    }
    for (const nb of neighbors(graph, cur)) {
      const alt = d + nb.weight;
      if (alt < (dist[nb.id] ?? Infinity)) {
        dist[nb.id] = alt;
        parent[nb.id] = cur;
        pq.push([alt, nb.id]);
        steps.push({ visited: [...visited], current: cur, frontier: pq.map(p => p[1]), highlightedEdges: [[cur, nb.id]], path: [], distances: { ...dist }, description: `Relax ${graph.nodes[nb.id].label}: ${dist[nb.id]}` });
      }
    }
  }
  if (target >= 0) {
    const path = dist[target] < Infinity ? buildPath(parent, target) : [];
    steps.push({ visited: [...visited], current: null, frontier: [], highlightedEdges: [], path, distances: { ...dist }, description: dist[target] < Infinity ? `Done. Shortest to ${graph.nodes[target].label}=${dist[target]}` : 'Target unreachable' });
  }
  return steps;
}

function bellmanFord(graph: Graph, source: number, target: number): GraphStep[] {
  const steps: GraphStep[] = [];
  const dist: Record<number, number> = {};
  const parent: Record<number, number | null> = {};
  for (const n of graph.nodes) { dist[n.id] = Infinity; parent[n.id] = null; }
  dist[source] = 0;

  steps.push({ visited: [], current: source, frontier: [], highlightedEdges: [], path: [], distances: { ...dist }, description: `Start Bellman-Ford from ${graph.nodes[source].label}` });

  const allEdges = graph.edges.flatMap(e => graph.directed ? [e] : [e, { from: e.to, to: e.from, weight: e.weight }]);

  for (let i = 0; i < graph.nodes.length - 1; i++) {
    let updated = false;
    for (const e of allEdges) {
      if (dist[e.from] + e.weight < dist[e.to]) {
        dist[e.to] = dist[e.from] + e.weight;
        parent[e.to] = e.from;
        updated = true;
        steps.push({ visited: Object.keys(dist).filter(k => dist[+k] < Infinity).map(Number), current: e.to, frontier: [], highlightedEdges: [[e.from, e.to]], path: [], distances: { ...dist }, description: `Iteration ${i + 1}: relax ${graph.nodes[e.from].label}→${graph.nodes[e.to].label}, dist=${dist[e.to]}` });
      }
    }
    if (!updated) break;
  }

  const path = dist[target] < Infinity ? buildPath(parent, target) : [];
  steps.push({ visited: Object.keys(dist).filter(k => dist[+k] < Infinity).map(Number), current: null, frontier: [], highlightedEdges: [], path, distances: { ...dist }, description: dist[target] < Infinity ? `Done. Shortest to ${graph.nodes[target].label}=${dist[target]}. ${path.map(n => graph.nodes[n].label).join('→')}` : 'Target unreachable' });
  return steps;
}

function floydWarshall(graph: Graph, source: number, target: number): GraphStep[] {
  const steps: GraphStep[] = [];
  const n = graph.nodes.length;
  const dist: number[][] = Array.from({ length: n }, () => Array(n).fill(Infinity));
  const next: (number | null)[][] = Array.from({ length: n }, () => Array(n).fill(null));

  for (let i = 0; i < n; i++) dist[i][i] = 0;
  for (const e of graph.edges) {
    dist[e.from][e.to] = e.weight;
    next[e.from][e.to] = e.to;
    if (!graph.directed) {
      dist[e.to][e.from] = e.weight;
      next[e.to][e.from] = e.from;
    }
  }

  const distMap = () => {
    const d: Record<number, number> = {};
    for (let i = 0; i < n; i++) d[i] = dist[source][i];
    return d;
  };

  steps.push({ visited: [], current: null, frontier: [], highlightedEdges: [], path: [], distances: distMap(), description: 'Initialize distance matrix' });

  for (let k = 0; k < n; k++) {
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (dist[i][k] + dist[k][j] < dist[i][j]) {
          dist[i][j] = dist[i][k] + dist[k][j];
          next[i][j] = next[i][k];
        }
      }
    }
    steps.push({ visited: Array.from({ length: k + 1 }, (_, i) => i), current: k, frontier: [], highlightedEdges: [], path: [], distances: distMap(), description: `Intermediate vertex: ${graph.nodes[k].label}. Dist[${graph.nodes[source].label}→${graph.nodes[target].label}]=${dist[source][target] === Infinity ? '∞' : dist[source][target]}` });
  }

  // Reconstruct path
  const path: number[] = [];
  if (dist[source][target] < Infinity) {
    let cur: number | null = source;
    while (cur !== null && cur !== target) { path.push(cur); cur = next[cur][target]; }
    if (cur === target) path.push(target);
  }

  steps.push({ visited: graph.nodes.map(n => n.id), current: null, frontier: [], highlightedEdges: [], path, distances: distMap(), description: dist[source][target] < Infinity ? `All-pairs done. ${graph.nodes[source].label}→${graph.nodes[target].label}=${dist[source][target]}. ${path.map(n => graph.nodes[n].label).join('→')}` : 'No path' });
  return steps;
}

function prims(graph: Graph, source: number): GraphStep[] {
  const steps: GraphStep[] = [];
  const inMST = new Set<number>();
  const mstEdges: [number, number][] = [];
  inMST.add(source);
  let totalWeight = 0;

  steps.push({ visited: [source], current: source, frontier: [], highlightedEdges: [], path: [], mstEdges: [], description: `Start Prim's from ${graph.nodes[source].label}` });

  while (inMST.size < graph.nodes.length) {
    let best: { from: number; to: number; weight: number } | null = null;
    for (const e of graph.edges) {
      const pairs = graph.directed ? [[e.from, e.to]] : [[e.from, e.to], [e.to, e.from]];
      for (const [u, v] of pairs) {
        if (inMST.has(u) && !inMST.has(v)) {
          if (!best || e.weight < best.weight) best = { from: u, to: v, weight: e.weight };
        }
      }
    }
    if (!best) break;
    inMST.add(best.to);
    mstEdges.push([best.from, best.to]);
    totalWeight += best.weight;
    steps.push({ visited: [...inMST], current: best.to, frontier: [], highlightedEdges: [[best.from, best.to]], path: [], mstEdges: [...mstEdges], description: `Add edge ${graph.nodes[best.from].label}→${graph.nodes[best.to].label} (w=${best.weight}). Total=${totalWeight}` });
  }

  steps.push({ visited: [...inMST], current: null, frontier: [], highlightedEdges: [], path: [], mstEdges: [...mstEdges], description: `MST complete! Total weight=${totalWeight}` });
  return steps;
}

function kruskals(graph: Graph): GraphStep[] {
  const steps: GraphStep[] = [];
  const parent: number[] = graph.nodes.map(n => n.id);
  const rank: number[] = new Array(graph.nodes.length).fill(0);

  function find(x: number): number { if (parent[x] !== x) parent[x] = find(parent[x]); return parent[x]; }
  function union(a: number, b: number): boolean {
    const ra = find(a), rb = find(b);
    if (ra === rb) return false;
    if (rank[ra] < rank[rb]) parent[ra] = rb;
    else if (rank[ra] > rank[rb]) parent[rb] = ra;
    else { parent[rb] = ra; rank[ra]++; }
    return true;
  }

  const sorted = [...graph.edges].sort((a, b) => a.weight - b.weight);
  const mstEdges: [number, number][] = [];
  const inMST = new Set<number>();
  let totalWeight = 0;

  steps.push({ visited: [], current: null, frontier: [], highlightedEdges: [], path: [], mstEdges: [], description: `Start Kruskal's: ${sorted.length} edges sorted by weight` });

  for (const e of sorted) {
    if (union(e.from, e.to)) {
      mstEdges.push([e.from, e.to]);
      inMST.add(e.from); inMST.add(e.to);
      totalWeight += e.weight;
      steps.push({ visited: [...inMST], current: e.to, frontier: [], highlightedEdges: [[e.from, e.to]], path: [], mstEdges: [...mstEdges], description: `Add ${graph.nodes[e.from].label}→${graph.nodes[e.to].label} (w=${e.weight}). Total=${totalWeight}` });
    } else {
      steps.push({ visited: [...inMST], current: null, frontier: [], highlightedEdges: [[e.from, e.to]], path: [], mstEdges: [...mstEdges], description: `Skip ${graph.nodes[e.from].label}→${graph.nodes[e.to].label} (cycle)` });
    }
    if (mstEdges.length === graph.nodes.length - 1) break;
  }

  steps.push({ visited: [...inMST], current: null, frontier: [], highlightedEdges: [], path: [], mstEdges: [...mstEdges], description: `MST complete! Total weight=${totalWeight}` });
  return steps;
}
