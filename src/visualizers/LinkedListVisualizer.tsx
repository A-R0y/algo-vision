import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, ArrowRight, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import CodePanel from "./CodePanel";
import MarkCompletedButton from "./MarkCompletedButton";
import { pythonCode } from "@/algorithms/pythonCode";
import { useAlgorithmProgress } from "@/hooks/useAlgorithmProgress";

interface LLNode { id: number; value: number; }
let nodeId = 1;

const ALGO_NAMES = ["Linked List"];

const LinkedListVisualizer = () => {
  const [nodes, setNodes] = useState<LLNode[]>([]);
  const [inputVal, setInputVal] = useState("42");
  const [posInput, setPosInput] = useState("0");
  const [log, setLog] = useState<string[]>(["Ready. Insert nodes to begin."]);
  const [highlighted, setHighlighted] = useState<Set<number>>(new Set());
  const [traversing, setTraversing] = useState<number | null>(null);
  const [lastOp, setLastOp] = useState("");
  const { markCompleted, isCompleted, loading } = useAlgorithmProgress("linked-list", ALGO_NAMES);

  const addLog = (msg: string) => { setLog(prev => [msg, ...prev.slice(0, 7)]); setLastOp(msg); };
  const highlight = (ids: number[], duration = 600) => { setHighlighted(new Set(ids)); setTimeout(() => setHighlighted(new Set()), duration); };

  const insertHead = () => {
    const val = parseInt(inputVal); if (isNaN(val)) return;
    const node = { id: nodeId++, value: val };
    setNodes(prev => [node, ...prev]); highlight([node.id]); addLog(`INSERT HEAD: ${val} → new head of list`);
  };
  const insertTail = () => {
    const val = parseInt(inputVal); if (isNaN(val)) return;
    const node = { id: nodeId++, value: val };
    setNodes(prev => [...prev, node]); highlight([node.id]); addLog(`INSERT TAIL: ${val} → appended to end`);
  };
  const insertAt = () => {
    const val = parseInt(inputVal); const pos = parseInt(posInput); if (isNaN(val) || isNaN(pos)) return;
    const node = { id: nodeId++, value: val };
    setNodes(prev => { const arr = [...prev]; const idx = Math.max(0, Math.min(pos, arr.length)); arr.splice(idx, 0, node); return arr; });
    highlight([node.id]); addLog(`INSERT AT ${pos}: ${val} → inserted at position ${pos}`);
  };
  const deleteHead = () => {
    if (nodes.length === 0) { addLog("⚠ List is empty!"); return; }
    const head = nodes[0]; highlight([head.id]); setTimeout(() => setNodes(prev => prev.slice(1)), 400); addLog(`DELETE HEAD: removed ${head.value}`);
  };
  const deleteTail = () => {
    if (nodes.length === 0) { addLog("⚠ List is empty!"); return; }
    const tail = nodes[nodes.length - 1]; highlight([tail.id]); setTimeout(() => setNodes(prev => prev.slice(0, -1)), 400); addLog(`DELETE TAIL: removed ${tail.value}`);
  };
  const reverseList = () => { setNodes(prev => [...prev].reverse()); addLog("REVERSE: list reversed in O(n)"); };
  const traverse = async () => {
    if (nodes.length === 0) { addLog("⚠ List is empty!"); return; }
    addLog("TRAVERSE: visiting all nodes...");
    for (let i = 0; i < nodes.length; i++) { setTraversing(i); await new Promise(r => setTimeout(r, 400)); }
    setTraversing(null); addLog(`TRAVERSE: visited ${nodes.length} nodes ✓`);
  };

  const snippet = pythonCode["linked_list"];
  const getHL = (): number[] => {
    const d = lastOp.toLowerCase();
    if (d.includes("insert head")) return [9, 10, 11, 12];
    if (d.includes("insert tail")) return [14, 15, 16, 17, 18, 19, 20, 21];
    if (d.includes("delete head")) return [23, 24];
    if (d.includes("traverse")) return [26, 27, 28, 29, 30];
    if (d.includes("reverse")) return [];
    return [];
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-lg p-4 space-y-1">
        <p className="text-sm text-foreground">A sequence of nodes where each node holds data and a pointer to the next node. Dynamic size, O(1) insert/delete at known positions.</p>
        <div className="flex gap-4 text-xs font-mono text-muted-foreground">
          <span>Insert Head: <span className="text-primary">O(1)</span></span>
          <span>Insert Tail: <span className="text-primary">O(n)</span></span>
          <span>Search: <span className="text-primary">O(n)</span></span>
          <span>Access: <span className="text-primary">O(n)</span></span>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Linked list display */}
        <div className="glass rounded-lg p-6 neon-border min-h-[140px]">
          {nodes.length === 0 ? (
            <div className="flex items-center justify-center h-20 text-muted-foreground font-mono text-sm">[ NULL ] — empty list</div>
          ) : (
            <div className="flex flex-wrap items-center gap-0">
              <AnimatePresence>
                {nodes.map((node, i) => (
                  <motion.div key={node.id} className="flex items-center"
                    initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}>
                    <div className={`flex border rounded-md overflow-hidden font-mono text-sm transition-all ${
                      traversing === i ? "border-warning shadow-[0_0_15px_hsl(var(--warning)/0.5)]"
                      : highlighted.has(node.id) ? "border-success shadow-[0_0_15px_hsl(var(--success)/0.5)]"
                      : i === 0 ? "border-primary shadow-[0_0_8px_hsl(var(--primary)/0.3)]" : "border-border"
                    }`}>
                      <div className={`px-3 py-2 ${traversing === i ? "bg-warning/20 text-warning" : highlighted.has(node.id) ? "bg-success/20 text-success" : i === 0 ? "bg-primary/10 text-primary" : "bg-secondary/50 text-foreground"}`}>{node.value}</div>
                      <div className={`px-2 py-2 border-l text-[10px] flex items-center ${traversing === i ? "border-warning/40 text-warning/60" : i === 0 ? "border-primary/30 text-primary/50" : "border-border text-muted-foreground"}`}>→</div>
                    </div>
                    {i < nodes.length - 1 && <ArrowRight className={`h-4 w-4 mx-0.5 ${traversing === i ? "text-warning" : "text-muted-foreground"}`} />}
                    {i === nodes.length - 1 && (
                      <div className="flex items-center gap-0.5 ml-1">
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        <span className="text-xs font-mono text-muted-foreground px-2 py-1 border border-dashed border-border rounded">NULL</span>
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
          <div className="mt-3 flex gap-3 text-xs font-mono text-muted-foreground">
            <span>Length: <span className="text-primary">{nodes.length}</span></span>
            {nodes.length > 0 && <span>Head: <span className="text-primary">{nodes[0].value}</span></span>}
            {nodes.length > 1 && <span>Tail: <span className="text-primary">{nodes[nodes.length - 1].value}</span></span>}
          </div>
        </div>
        {snippet && <CodePanel code={snippet.code} highlightedLines={getHL()} title="Linked List" />}
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-2 items-center">
        <input type="number" value={inputVal} onChange={e => setInputVal(e.target.value)} placeholder="Value"
          className="w-16 bg-secondary border border-border rounded-md px-2 py-1.5 text-sm font-mono text-primary focus:outline-none focus:ring-1 focus:ring-primary" />
        <input type="number" value={posInput} onChange={e => setPosInput(e.target.value)} placeholder="Pos"
          className="w-14 bg-secondary border border-border rounded-md px-2 py-1.5 text-sm font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
        <Button onClick={insertHead} className="neon-glow gap-1 text-xs"><Plus className="h-3 w-3" />Head</Button>
        <Button variant="outline" onClick={insertTail} className="gap-1 text-xs"><Plus className="h-3 w-3" />Tail</Button>
        <Button variant="outline" onClick={insertAt} className="gap-1 text-xs"><Plus className="h-3 w-3" />At Pos</Button>
        <Button variant="outline" onClick={deleteHead} className="gap-1 text-xs"><Minus className="h-3 w-3" />Head</Button>
        <Button variant="outline" onClick={deleteTail} className="gap-1 text-xs"><Minus className="h-3 w-3" />Tail</Button>
        <Button variant="outline" onClick={reverseList} className="gap-1 text-xs"><RotateCcw className="h-3 w-3" />Reverse</Button>
        <Button variant="outline" onClick={traverse} className="gap-1 text-xs">Traverse</Button>
        <Button variant="ghost" onClick={() => { setNodes([]); setLog(["Cleared."]); setLastOp(""); }} className="text-xs text-muted-foreground">Clear</Button>
      </div>

      {/* Log + Mark Complete */}
      <div className="flex items-start justify-between gap-4">
        <div className="glass rounded-lg p-4 flex-1">
          <div className="text-xs font-mono text-muted-foreground mb-2">OPERATION LOG</div>
          <div className="space-y-1">
            {log.map((entry, i) => (
              <motion.div key={`${entry}-${i}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className={`text-xs font-mono px-2 py-1 rounded ${i === 0 ? "text-primary" : "text-muted-foreground"}`}>
                {i === 0 && "› "}{entry}
              </motion.div>
            ))}
          </div>
        </div>
        <MarkCompletedButton algorithmName="Linked List" isCompleted={isCompleted("Linked List")} onMark={markCompleted} loading={loading} />
      </div>
    </div>
  );
};

export default LinkedListVisualizer;
