import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import CodePanel from "./CodePanel";
import MarkCompletedButton from "./MarkCompletedButton";
import { pythonCode } from "@/algorithms/pythonCode";
import { useAlgorithmProgress } from "@/hooks/useAlgorithmProgress";

type HeapType = "min" | "max";

function heapifyUp(arr: number[], i: number, type: HeapType): number[] {
  const h = [...arr];
  while (i > 0) {
    const parent = Math.floor((i - 1) / 2);
    const shouldSwap = type === "min" ? h[i] < h[parent] : h[i] > h[parent];
    if (shouldSwap) { [h[i], h[parent]] = [h[parent], h[i]]; i = parent; }
    else break;
  }
  return h;
}

function heapifyDown(arr: number[], i: number, size: number, type: HeapType): number[] {
  const h = [...arr];
  while (true) {
    let target = i;
    const l = 2 * i + 1, r = 2 * i + 2;
    if (l < size) { const cond = type === "min" ? h[l] < h[target] : h[l] > h[target]; if (cond) target = l; }
    if (r < size) { const cond = type === "min" ? h[r] < h[target] : h[r] > h[target]; if (cond) target = r; }
    if (target !== i) { [h[i], h[target]] = [h[target], h[i]]; i = target; }
    else break;
  }
  return h;
}

function getNodePos(i: number, total: number): { x: number; y: number } {
  const level = Math.floor(Math.log2(i + 1));
  const levelWidth = Math.pow(2, level);
  const posInLevel = i - (Math.pow(2, level) - 1);
  const totalWidth = 400;
  const gap = totalWidth / levelWidth;
  return { x: gap * posInLevel + gap / 2, y: level * 70 + 30 };
}

const ALGO_NAMES = ["Min-Heap", "Max-Heap"];

const HeapVisualizer = () => {
  const [type, setType] = useState<HeapType>("min");
  const [heap, setHeap] = useState<number[]>([10, 20, 15, 40, 25, 35]);
  const [inputVal, setInputVal] = useState("8");
  const [highlighted, setHighlighted] = useState<Set<number>>(new Set());
  const [log, setLog] = useState<string[]>(["Min-Heap ready. Root is always minimum."]);
  const [lastOp, setLastOp] = useState("");
  const { markCompleted, isCompleted, loading } = useAlgorithmProgress("heap", ALGO_NAMES);

  const addLog = (msg: string) => { setLog(prev => [msg, ...prev.slice(0, 6)]); setLastOp(msg); };

  const switchType = (t: HeapType) => {
    setType(t);
    const sorted = [...heap].sort((a, b) => t === "min" ? a - b : b - a);
    let h: number[] = [];
    for (const v of sorted) h = heapifyUp([...h, v], h.length, t);
    setHeap(h);
    addLog(`Switched to ${t === "min" ? "Min" : "Max"}-Heap. Root: ${h[0]}`);
  };

  const insertVal = () => {
    const val = parseInt(inputVal);
    if (isNaN(val)) return;
    const newHeap = heapifyUp([...heap, val], heap.length, type);
    setHighlighted(new Set([newHeap.indexOf(val)]));
    setTimeout(() => setHighlighted(new Set()), 800);
    setHeap(newHeap);
    addLog(`INSERT ${val} → heapify up → root: ${newHeap[0]}`);
  };

  const extractRoot = () => {
    if (heap.length === 0) { addLog("⚠ Heap is empty!"); return; }
    const root = heap[0];
    setHighlighted(new Set([0]));
    setTimeout(() => {
      const newArr = [...heap]; newArr[0] = newArr[newArr.length - 1]; newArr.pop();
      const newHeap = heapifyDown(newArr, 0, newArr.length, type);
      setHeap(newHeap); setHighlighted(new Set());
    }, 500);
    addLog(`EXTRACT ${type === "min" ? "MIN" : "MAX"}: removed ${root}`);
  };

  const maxLevel = heap.length > 0 ? Math.floor(Math.log2(heap.length)) : 0;
  const svgH = (maxLevel + 1) * 70 + 30;
  const edges: { x1: number; y1: number; x2: number; y2: number }[] = [];
  heap.forEach((_, i) => {
    if (i > 0) { const parent = Math.floor((i - 1) / 2); const p = getNodePos(parent, heap.length); const c = getNodePos(i, heap.length); edges.push({ x1: p.x, y1: p.y, x2: c.x, y2: c.y }); }
  });

  const codeKey = type === "min" ? "min_heap" : "max_heap";
  const snippet = pythonCode[codeKey];
  const getHL = (): number[] => {
    const d = lastOp.toLowerCase();
    if (d.includes("insert")) return [7, 8];
    if (d.includes("extract")) return [10, 11];
    if (d.includes("peek") || d.includes("root")) return [13, 14];
    return [];
  };
  const algoName = type === "min" ? "Min-Heap" : "Max-Heap";

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        {(["min", "max"] as HeapType[]).map(t => (
          <button key={t} onClick={() => switchType(t)}
            className={`px-4 py-2 rounded-md font-mono text-sm transition-all border ${type === t ? "border-primary bg-primary/10 text-primary neon-border" : "border-border bg-secondary/50 text-muted-foreground hover:border-primary/50"}`}>
            {t === "min" ? "🔽 Min-Heap" : "🔼 Max-Heap"}
            {isCompleted(t === "min" ? "Min-Heap" : "Max-Heap") && <span className="ml-2 text-success">✓</span>}
          </button>
        ))}
      </div>

      <motion.div key={type} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-lg p-4 space-y-1">
        <p className="text-sm text-foreground">
          {type === "min" ? "Min-Heap: parent ≤ children. Root is always the minimum element. Used in priority queues, Dijkstra's algorithm." : "Max-Heap: parent ≥ children. Root is always the maximum element. Used in heap sort, priority queues."}
        </p>
        <div className="flex gap-4 text-xs font-mono text-muted-foreground">
          <span>Insert: <span className="text-primary">O(log n)</span></span>
          <span>Extract: <span className="text-primary">O(log n)</span></span>
          <span>Peek: <span className="text-primary">O(1)</span></span>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Tree visualization */}
        <div className="glass rounded-lg p-4 neon-border overflow-x-auto">
          <div className="text-xs font-mono text-muted-foreground mb-2">{type.toUpperCase()}-HEAP TREE VIEW</div>
          {heap.length > 0 ? (
            <svg width={400} height={Math.max(svgH, 80)} className="block mx-auto overflow-visible">
              {edges.map((e, i) => (<line key={i} x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2} stroke="hsl(var(--border))" strokeWidth="1.5" />))}
              {heap.map((val, i) => {
                const { x, y } = getNodePos(i, heap.length);
                const isRoot = i === 0;
                const isHL = highlighted.has(i);
                return (
                  <g key={i}>
                    <motion.circle cx={x} cy={y} r="20"
                      fill={isHL ? "hsl(var(--warning)/0.3)" : isRoot ? "hsl(var(--primary)/0.2)" : "hsl(var(--secondary))"}
                      stroke={isHL ? "hsl(var(--warning))" : isRoot ? "hsl(var(--primary))" : "hsl(var(--border))"}
                      strokeWidth={isRoot || isHL ? "2" : "1"} animate={{ r: isHL ? 23 : 20 }} />
                    <text x={x} y={y + 4} textAnchor="middle" fontSize="11" fontFamily="monospace"
                      fill={isHL ? "hsl(var(--warning))" : isRoot ? "hsl(var(--primary))" : "hsl(var(--foreground))"}>{val}</text>
                  </g>
                );
              })}
            </svg>
          ) : (<div className="h-20 flex items-center justify-center text-muted-foreground font-mono text-sm">Empty heap</div>)}
        </div>
        {snippet && <CodePanel code={snippet.code} highlightedLines={getHL()} title={algoName} />}
      </div>

      {/* Array view */}
      <div className="glass rounded-lg p-4">
        <div className="text-xs font-mono text-muted-foreground mb-2">ARRAY REPRESENTATION</div>
        <div className="flex flex-wrap gap-1">
          {heap.map((val, i) => (
            <motion.div key={i} layout className={`flex flex-col items-center border rounded font-mono text-xs overflow-hidden ${i === 0 ? "border-primary" : "border-border"}`}>
              <div className={`px-3 py-1.5 ${i === 0 ? "bg-primary/15 text-primary" : "bg-secondary/50 text-foreground"}`}>{val}</div>
              <div className="px-3 py-0.5 text-muted-foreground/60 border-t border-border/50">{i}</div>
            </motion.div>
          ))}
        </div>
        {heap.length > 0 && (
          <div className="mt-2 text-xs font-mono text-muted-foreground">
            Root (<span className="text-primary">{type === "min" ? "min" : "max"}</span>): <span className="text-warning">{heap[0]}</span>
            {heap.length > 1 && <> · Left child: {heap[1]}</>}
            {heap.length > 2 && <> · Right child: {heap[2]}</>}
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-3 items-center">
        <input type="number" value={inputVal} onChange={e => setInputVal(e.target.value)}
          className="w-16 bg-secondary border border-border rounded-md px-2 py-1.5 text-sm font-mono text-primary focus:outline-none focus:ring-1 focus:ring-primary" />
        <Button onClick={insertVal} className="neon-glow gap-1"><Plus className="h-4 w-4" />Insert</Button>
        <Button variant="outline" onClick={extractRoot} className="gap-1"><ArrowDown className="h-4 w-4" />Extract {type === "min" ? "Min" : "Max"}</Button>
        <Button variant="ghost" onClick={() => { setHeap([]); addLog("Heap cleared."); }} className="text-muted-foreground text-xs">Clear</Button>
        <div className="ml-auto">
          <MarkCompletedButton algorithmName={algoName} isCompleted={isCompleted(algoName)} onMark={markCompleted} loading={loading} />
        </div>
      </div>

      {/* Log */}
      <div className="glass rounded-lg p-4">
        <div className="text-xs font-mono text-muted-foreground mb-2">OPERATION LOG</div>
        <div className="space-y-1">
          {log.map((entry, i) => (
            <div key={`${entry}-${i}`} className={`text-xs font-mono px-2 py-1 rounded ${i === 0 ? "text-primary" : "text-muted-foreground"}`}>
              {i === 0 && "› "}{entry}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeapVisualizer;
