import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Play, Pause, SkipForward, RotateCcw, Shuffle } from "lucide-react";
import { Button } from "@/components/ui/button";
import CodePanel from "./CodePanel";
import MarkCompletedButton from "./MarkCompletedButton";
import {
  type GraphAlgorithm, type AlgoCategory, type Graph, type GraphStep,
  graphAlgoInfo, algoCategory, generateSampleGraph, runGraphAlgorithm,
} from "@/algorithms/graphAlgorithms";
import { pythonCode, getHighlightedLines } from "@/algorithms/pythonCode";
import { useAlgorithmProgress } from "@/hooks/useAlgorithmProgress";

const CATEGORIES: { id: AlgoCategory; label: string }[] = [
  { id: "traversal", label: "Traversal" },
  { id: "shortest-path", label: "Shortest Path" },
  { id: "mst", label: "MST" },
];

const ALL_ALGOS: GraphAlgorithm[] = [
  "bfs", "dfs", "bidirectional-bfs", "best-first", "a-star",
  "dijkstra", "bellman-ford", "floyd-warshall",
  "prims", "kruskals",
];

const ALGO_NAMES = ALL_ALGOS.map(a => graphAlgoInfo[a].name);

function randomGraph(): Graph {
  const g = generateSampleGraph();
  g.edges = g.edges.map(e => ({ ...e, weight: Math.floor(Math.random() * 9) + 1 }));
  g.nodes = g.nodes.map(n => ({ ...n, heuristic: Math.floor(Math.random() * 12) }));
  g.nodes[g.nodes.length - 1].heuristic = 0;
  return g;
}

const GraphVisualizer = () => {
  const [category, setCategory] = useState<AlgoCategory>("traversal");
  const [algorithm, setAlgorithm] = useState<GraphAlgorithm>("bfs");
  const [graph, setGraph] = useState<Graph>(generateSampleGraph);
  const [source, setSource] = useState(0);
  const [target, setTarget] = useState(7);
  const [steps, setSteps] = useState<GraphStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(500);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const { markCompleted, isCompleted, loading } = useAlgorithmProgress("graphs", ALGO_NAMES);

  const filteredAlgos = ALL_ALGOS.filter(a => algoCategory[a] === category);
  const info = graphAlgoInfo[algorithm];
  const step = steps[currentStep] || { visited: [], current: null, frontier: [], highlightedEdges: [], path: [], description: "Press play to start", mstEdges: [] };

  const reset = useCallback(() => { setIsPlaying(false); if (intervalRef.current) clearInterval(intervalRef.current); setSteps([]); setCurrentStep(0); }, []);

  useEffect(() => {
    if (isPlaying && steps.length > 0) {
      intervalRef.current = setInterval(() => {
        setCurrentStep(prev => { if (prev >= steps.length - 1) { setIsPlaying(false); return prev; } return prev + 1; });
      }, speed);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isPlaying, steps.length, speed]);

  const handleStart = () => { const s = runGraphAlgorithm(graph, algorithm, source, target); setSteps(s); setCurrentStep(0); setIsPlaying(true); };
  const handleStep = () => {
    if (steps.length === 0) { const s = runGraphAlgorithm(graph, algorithm, source, target); setSteps(s); setCurrentStep(0); return; }
    if (currentStep < steps.length - 1) setCurrentStep(p => p + 1);
  };

  const nodeColor = (id: number) => {
    if (step.current === id) return "hsl(var(--warning))";
    if (step.path.includes(id)) return "hsl(var(--success))";
    if (step.frontier.includes(id)) return "hsl(var(--accent))";
    if (step.visited.includes(id)) return "hsl(var(--primary))";
    return "hsl(var(--muted))";
  };

  const edgeHighlighted = (from: number, to: number) => step.highlightedEdges.some(([a, b]) => (a === from && b === to) || (a === to && b === from));
  const edgeInPath = (from: number, to: number) => { for (let i = 0; i < step.path.length - 1; i++) { if ((step.path[i] === from && step.path[i + 1] === to) || (step.path[i] === to && step.path[i + 1] === from)) return true; } return false; };
  const edgeInMST = (from: number, to: number) => step.mstEdges?.some(([a, b]) => (a === from && b === to) || (a === to && b === from));

  const SVG_W = 620, SVG_H = 200;
  const snippet = pythonCode[algorithm];
  const highlightedLines = getHighlightedLines(algorithm, step.description);

  return (
    <div className="space-y-6">
      {/* Category tabs */}
      <div className="flex gap-2 mb-2">
        {CATEGORIES.map(cat => (
          <button key={cat.id} onClick={() => { setCategory(cat.id); const first = ALL_ALGOS.find(a => algoCategory[a] === cat.id)!; setAlgorithm(first); reset(); }}
            className={`px-3 py-1.5 rounded-md font-mono text-xs transition-all border ${category === cat.id ? "border-primary bg-primary/10 text-primary" : "border-border bg-secondary/50 text-muted-foreground hover:text-foreground"}`}>{cat.label}</button>
        ))}
      </div>

      {/* Algorithm selection */}
      <div className="flex flex-wrap gap-2">
        {filteredAlgos.map(algo => (
          <button key={algo} onClick={() => { setAlgorithm(algo); reset(); }}
            className={`px-3 py-1.5 rounded-md font-mono text-xs transition-all border ${algorithm === algo ? "border-primary bg-primary/10 text-primary neon-border" : "border-border bg-secondary/50 text-muted-foreground hover:text-foreground hover:border-primary/50"}`}>
            {graphAlgoInfo[algo].name}
            {isCompleted(graphAlgoInfo[algo].name) && <span className="ml-2 text-success">✓</span>}
          </button>
        ))}
      </div>

      <motion.div key={algorithm} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-lg p-4 space-y-1">
        <p className="text-sm text-foreground">{info.description}</p>
        <div className="flex gap-4 text-xs font-mono text-muted-foreground">
          <span>Time: <span className="text-primary">{info.time}</span></span>
          <span>Space: <span className="text-primary">{info.space}</span></span>
        </div>
      </motion.div>

      {/* Graph + Code */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="glass rounded-lg p-4 neon-border overflow-x-auto">
          <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} className="w-full" style={{ minHeight: 220 }}>
            {graph.edges.map((e, i) => {
              const n1 = graph.nodes[e.from], n2 = graph.nodes[e.to];
              const inPath = edgeInPath(e.from, e.to);
              const inMst = edgeInMST(e.from, e.to);
              const hl = edgeHighlighted(e.from, e.to);
              const stroke = inPath ? "hsl(var(--success))" : inMst ? "hsl(var(--success))" : hl ? "hsl(var(--warning))" : "hsl(var(--border))";
              const width = inPath || inMst ? 3 : hl ? 2.5 : 1.5;
              const mx = (n1.x + n2.x) / 2, my = (n1.y + n2.y) / 2;
              return (
                <g key={i}>
                  <line x1={n1.x} y1={n1.y} x2={n2.x} y2={n2.y} stroke={stroke} strokeWidth={width} opacity={inPath || inMst || hl ? 1 : 0.4} />
                  <rect x={mx - 8} y={my - 7} width={16} height={14} rx={3} fill="hsl(var(--background))" opacity={0.85} />
                  <text x={mx} y={my + 4} textAnchor="middle" fontSize={9} fill="hsl(var(--muted-foreground))" fontFamily="monospace">{e.weight}</text>
                </g>
              );
            })}
            {graph.nodes.map(node => {
              const fill = nodeColor(node.id);
              const isSource = node.id === source;
              const isTarget = node.id === target;
              return (
                <g key={node.id}>
                  {(isSource || isTarget) && <circle cx={node.x} cy={node.y} r={20} fill="none" stroke={isSource ? "hsl(var(--primary))" : "hsl(var(--success))"} strokeWidth={1.5} strokeDasharray="4 2" opacity={0.6} />}
                  <circle cx={node.x} cy={node.y} r={16} fill={fill} stroke="hsl(var(--background))" strokeWidth={2} />
                  <text x={node.x} y={node.y + 4} textAnchor="middle" fontSize={11} fontWeight="bold" fill="hsl(var(--background))" fontFamily="monospace">{node.label}</text>
                  {(algorithm === "best-first" || algorithm === "a-star") && node.heuristic !== undefined && (
                    <text x={node.x} y={node.y - 22} textAnchor="middle" fontSize={8} fill="hsl(var(--accent))" fontFamily="monospace">h={node.heuristic}</text>
                  )}
                  {step.distances && step.distances[node.id] !== undefined && (
                    <text x={node.x + 20} y={node.y - 8} textAnchor="start" fontSize={8} fill="hsl(var(--primary))" fontFamily="monospace">
                      {step.distances[node.id] === Infinity ? "∞" : step.distances[node.id]}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
          <div className="mt-3 text-center font-mono text-sm text-muted-foreground min-h-[20px]">{step.description}</div>
          {steps.length > 0 && (
            <div className="mt-2 w-full bg-secondary rounded-full h-1">
              <div className="bg-primary h-1 rounded-full transition-all duration-200" style={{ width: `${(currentStep / Math.max(steps.length - 1, 1)) * 100}%` }} />
            </div>
          )}
        </div>
        {snippet && <CodePanel code={snippet.code} highlightedLines={highlightedLines} title={info.name} />}
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-muted-foreground">Source:</span>
          <select value={source} onChange={e => { setSource(+e.target.value); reset(); }}
            className="bg-secondary border border-border rounded-md px-2 py-1.5 text-sm font-mono text-primary focus:outline-none focus:ring-1 focus:ring-primary">
            {graph.nodes.map(n => <option key={n.id} value={n.id}>{n.label}</option>)}
          </select>
        </div>
        {category !== "mst" && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-muted-foreground">Target:</span>
            <select value={target} onChange={e => { setTarget(+e.target.value); reset(); }}
              className="bg-secondary border border-border rounded-md px-2 py-1.5 text-sm font-mono text-primary focus:outline-none focus:ring-1 focus:ring-primary">
              {graph.nodes.map(n => <option key={n.id} value={n.id}>{n.label}</option>)}
            </select>
          </div>
        )}
        <Button variant="outline" size="icon" onClick={() => { reset(); setGraph(randomGraph()); }} title="New graph"><Shuffle className="h-4 w-4" /></Button>
        <Button variant="outline" size="icon" onClick={reset} title="Reset"><RotateCcw className="h-4 w-4" /></Button>
        <Button size="icon" onClick={() => { if (steps.length === 0) handleStart(); else setIsPlaying(!isPlaying); }} className="neon-glow">
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>
        <Button variant="outline" size="icon" onClick={handleStep}><SkipForward className="h-4 w-4" /></Button>
        <div className="flex items-center gap-2 ml-auto">
          <input type="range" min={100} max={1000} step={100} value={1000 - speed + 100} onChange={e => setSpeed(1000 - parseInt(e.target.value) + 100)} className="w-20 accent-primary" />
          <span className="text-xs font-mono text-muted-foreground">Speed</span>
        </div>
      </div>

      {/* Legend + Mark Complete */}
      <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-warning" /><span className="text-muted-foreground">Current</span></div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-primary" /><span className="text-muted-foreground">Visited</span></div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-accent" /><span className="text-muted-foreground">Frontier</span></div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-success" /><span className="text-muted-foreground">Path/MST</span></div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-muted" /><span className="text-muted-foreground">Unvisited</span></div>
        <div className="ml-auto">
          <MarkCompletedButton algorithmName={info.name} isCompleted={isCompleted(info.name)} onMark={markCompleted} loading={loading} />
        </div>
      </div>
    </div>
  );
};

export default GraphVisualizer;
