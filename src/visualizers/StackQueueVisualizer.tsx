import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import CodePanel from "./CodePanel";
import MarkCompletedButton from "./MarkCompletedButton";
import { pythonCode } from "@/algorithms/pythonCode";
import { useAlgorithmProgress } from "@/hooks/useAlgorithmProgress";

type Mode = "stack" | "queue";
interface Item { id: number; value: number; }
let idCounter = 1;

const ALGO_NAMES = ["Stack", "Queue"];

const StackQueueVisualizer = () => {
  const [mode, setMode] = useState<Mode>("stack");
  const [items, setItems] = useState<Item[]>([]);
  const [inputVal, setInputVal] = useState("42");
  const [log, setLog] = useState<string[]>(["Ready. Add elements to begin."]);
  const [highlighted, setHighlighted] = useState<number | null>(null);
  const [lastOp, setLastOp] = useState<string>("");
  const { markCompleted, isCompleted, loading } = useAlgorithmProgress("stack-queue", ALGO_NAMES);

  const addLog = (msg: string) => { setLog(prev => [msg, ...prev.slice(0, 6)]); setLastOp(msg); };

  const push = () => {
    const val = parseInt(inputVal);
    if (isNaN(val)) return;
    const item = { id: idCounter++, value: val };
    setItems(prev => [...prev, item]);
    addLog(mode === "stack" ? `PUSH ${val} → top of stack` : `ENQUEUE ${val} → back of queue`);
  };

  const pop = () => {
    if (items.length === 0) { addLog("⚠ Structure is empty!"); return; }
    if (mode === "stack") {
      const top = items[items.length - 1];
      setHighlighted(top.id);
      setTimeout(() => { setItems(prev => prev.slice(0, -1)); setHighlighted(null); }, 400);
      addLog(`POP ${top.value} ← removed from top`);
    } else {
      const front = items[0];
      setHighlighted(front.id);
      setTimeout(() => { setItems(prev => prev.slice(1)); setHighlighted(null); }, 400);
      addLog(`DEQUEUE ${front.value} ← removed from front`);
    }
  };

  const peek = () => {
    if (items.length === 0) { addLog("⚠ Structure is empty!"); return; }
    const item = mode === "stack" ? items[items.length - 1] : items[0];
    setHighlighted(item.id);
    setTimeout(() => setHighlighted(null), 800);
    addLog(mode === "stack" ? `PEEK → top is ${item.value}` : `FRONT → front is ${item.value}`);
  };

  const displayItems = mode === "stack" ? [...items].reverse() : items;
  const snippet = pythonCode[mode];
  const getHighlightedLines = () => {
    const d = lastOp.toLowerCase();
    if (mode === "stack") {
      if (d.includes("push")) return [4, 5];
      if (d.includes("pop")) return [7, 8];
      if (d.includes("peek")) return [10, 11];
    } else {
      if (d.includes("enqueue")) return [6, 7];
      if (d.includes("dequeue")) return [9, 10];
      if (d.includes("front")) return [12, 13];
    }
    return [];
  };
  const algoName = mode === "stack" ? "Stack" : "Queue";

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        {(["stack", "queue"] as Mode[]).map(m => (
          <button key={m} onClick={() => { setMode(m); setItems([]); setLog(["Ready. Add elements to begin."]); setLastOp(""); }}
            className={`px-4 py-2 rounded-md font-mono text-sm transition-all border ${mode === m ? "border-primary bg-primary/10 text-primary neon-border" : "border-border bg-secondary/50 text-muted-foreground hover:border-primary/50"}`}>
            {m === "stack" ? "📚 Stack" : "🚶 Queue"}
            {isCompleted(m === "stack" ? "Stack" : "Queue") && <span className="ml-2 text-success">✓</span>}
          </button>
        ))}
      </div>

      <motion.div key={mode} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-lg p-4 space-y-1">
        {mode === "stack" ? (
          <>
            <p className="text-sm text-foreground">LIFO — Last In, First Out. Like a stack of plates. Push adds to top, Pop removes from top.</p>
            <div className="flex gap-4 text-xs font-mono text-muted-foreground">
              <span>Push: <span className="text-primary">O(1)</span></span>
              <span>Pop: <span className="text-primary">O(1)</span></span>
              <span>Peek: <span className="text-primary">O(1)</span></span>
            </div>
          </>
        ) : (
          <>
            <p className="text-sm text-foreground">FIFO — First In, First Out. Like a queue at a store. Enqueue adds to back, Dequeue removes from front.</p>
            <div className="flex gap-4 text-xs font-mono text-muted-foreground">
              <span>Enqueue: <span className="text-primary">O(1)</span></span>
              <span>Dequeue: <span className="text-primary">O(1)</span></span>
              <span>Front: <span className="text-primary">O(1)</span></span>
            </div>
          </>
        )}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-4">
          {/* Visual */}
          <div className="glass rounded-lg p-4 neon-border min-h-[280px] flex flex-col">
            <div className="text-xs font-mono text-muted-foreground mb-3 flex justify-between">
              <span>{mode === "stack" ? "▲ TOP" : "← FRONT"}</span>
              <span className="text-primary">{items.length} items</span>
              <span>{mode === "stack" ? "▼ BOTTOM" : "BACK →"}</span>
            </div>

            {mode === "stack" ? (
              <div className="flex flex-col gap-1.5 flex-1 justify-end">
                <AnimatePresence>
                  {displayItems.map((item, idx) => (
                    <motion.div key={item.id}
                      initial={{ opacity: 0, x: -30, scaleX: 0.8 }} animate={{ opacity: 1, x: 0, scaleX: 1 }} exit={{ opacity: 0, x: 30, scaleX: 0.8 }}
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                      className={`rounded-md px-4 py-2.5 font-mono text-sm flex items-center justify-between border transition-all ${
                        highlighted === item.id ? "border-warning bg-warning/20 text-warning shadow-[0_0_12px_hsl(var(--warning)/0.4)]"
                        : idx === 0 ? "border-primary bg-primary/15 text-primary shadow-[0_0_8px_hsl(var(--primary)/0.3)]"
                        : "border-border bg-secondary/50 text-foreground"
                      }`}>
                      <span>{item.value}</span>
                      {idx === 0 && <span className="text-[10px] text-primary opacity-70">← TOP</span>}
                    </motion.div>
                  ))}
                </AnimatePresence>
                {items.length === 0 && <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm font-mono">[ empty ]</div>}
              </div>
            ) : (
              <div className="flex items-center gap-1.5 flex-1 overflow-x-auto py-4">
                <AnimatePresence>
                  {displayItems.map((item, idx) => (
                    <motion.div key={item.id}
                      initial={{ opacity: 0, y: -20, scaleY: 0.8 }} animate={{ opacity: 1, y: 0, scaleY: 1 }} exit={{ opacity: 0, y: 20, scaleY: 0.8 }}
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                      className={`rounded-md px-3 py-2.5 font-mono text-sm flex flex-col items-center gap-1 border flex-shrink-0 transition-all ${
                        highlighted === item.id ? "border-warning bg-warning/20 text-warning shadow-[0_0_12px_hsl(var(--warning)/0.4)]"
                        : idx === 0 ? "border-success bg-success/15 text-success shadow-[0_0_8px_hsl(var(--success)/0.3)]"
                        : idx === items.length - 1 ? "border-accent bg-accent/15 text-accent"
                        : "border-border bg-secondary/50 text-foreground"
                      }`}>
                      <span>{item.value}</span>
                      {idx === 0 && <span className="text-[9px] opacity-70">FRONT</span>}
                      {idx === items.length - 1 && items.length > 1 && <span className="text-[9px] opacity-70">BACK</span>}
                    </motion.div>
                  ))}
                </AnimatePresence>
                {items.length === 0 && <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm font-mono">[ empty ]</div>}
              </div>
            )}
          </div>

          {/* Log */}
          <div className="glass rounded-lg p-4">
            <div className="text-xs font-mono text-muted-foreground mb-3">OPERATION LOG</div>
            <div className="flex flex-col gap-1.5 max-h-[120px] overflow-y-auto">
              <AnimatePresence>
                {log.map((entry, i) => (
                  <motion.div key={`${entry}-${i}`} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                    className={`text-xs font-mono px-2 py-1 rounded border ${i === 0 ? "border-primary/40 bg-primary/5 text-primary" : "border-transparent text-muted-foreground"}`}>
                    {i === 0 && "› "}{entry}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
        {snippet && <CodePanel code={snippet.code} highlightedLines={getHighlightedLines()} title={algoName} />}
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        <input type="number" value={inputVal} onChange={e => setInputVal(e.target.value)} onKeyDown={e => e.key === "Enter" && push()}
          className="w-20 bg-secondary border border-border rounded-md px-2 py-1.5 text-sm font-mono text-primary focus:outline-none focus:ring-1 focus:ring-primary" />
        <Button onClick={push} className="neon-glow gap-2"><Plus className="h-4 w-4" />{mode === "stack" ? "Push" : "Enqueue"}</Button>
        <Button variant="outline" onClick={pop} className="gap-2"><Minus className="h-4 w-4" />{mode === "stack" ? "Pop" : "Dequeue"}</Button>
        <Button variant="outline" onClick={peek} className="gap-2"><Eye className="h-4 w-4" />{mode === "stack" ? "Peek" : "Front"}</Button>
        <Button variant="ghost" onClick={() => { setItems([]); setLog(["Cleared."]); setLastOp(""); }} className="text-muted-foreground">Clear</Button>
        <div className="ml-auto">
          <MarkCompletedButton algorithmName={algoName} isCompleted={isCompleted(algoName)} onMark={markCompleted} loading={loading} />
        </div>
      </div>
    </div>
  );
};

export default StackQueueVisualizer;
