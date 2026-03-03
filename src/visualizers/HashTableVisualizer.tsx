import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import CodePanel from "./CodePanel";
import MarkCompletedButton from "./MarkCompletedButton";
import { pythonCode } from "@/algorithms/pythonCode";
import { useAlgorithmProgress } from "@/hooks/useAlgorithmProgress";

const TABLE_SIZE = 8;
interface HTEntry { key: string; value: number; }
type Bucket = HTEntry[];

function hashFn(key: string, size: number): number {
  let hash = 0;
  for (let i = 0; i < key.length; i++) hash = (hash + key.charCodeAt(i)) % size;
  return hash;
}

const ALGO_NAMES = ["Hash Table"];

const HashTableVisualizer = () => {
  const [table, setTable] = useState<Bucket[]>(Array.from({ length: TABLE_SIZE }, () => []));
  const [keyInput, setKeyInput] = useState("name");
  const [valInput, setValInput] = useState("42");
  const [searchKey, setSearchKey] = useState("");
  const [highlighted, setHighlighted] = useState<{ bucket: number; key?: string } | null>(null);
  const [log, setLog] = useState<string[]>(["Ready. Insert key-value pairs."]);
  const [lastOp, setLastOp] = useState("");
  const { markCompleted, isCompleted, loading } = useAlgorithmProgress("hash", ALGO_NAMES);

  const addLog = (msg: string) => { setLog(prev => [msg, ...prev.slice(0, 7)]); setLastOp(msg); };

  const insert = () => {
    const val = parseInt(valInput);
    if (!keyInput || isNaN(val)) return;
    const bucket = hashFn(keyInput, TABLE_SIZE);
    setHighlighted({ bucket, key: keyInput });
    setTimeout(() => setHighlighted(null), 800);
    setTable(prev => {
      const next = prev.map(b => [...b]);
      const existing = next[bucket].findIndex(e => e.key === keyInput);
      if (existing >= 0) { next[bucket][existing] = { key: keyInput, value: val }; addLog(`UPDATE [${bucket}] "${keyInput}" → ${val} (hash collision handled)`); }
      else { next[bucket] = [...next[bucket], { key: keyInput, value: val }]; addLog(`INSERT hash("${keyInput}") = ${bucket} → stored ${val}`); }
      return next;
    });
  };

  const search = () => {
    if (!searchKey) return;
    const bucket = hashFn(searchKey, TABLE_SIZE);
    const entry = table[bucket].find(e => e.key === searchKey);
    setHighlighted({ bucket, key: searchKey });
    setTimeout(() => setHighlighted(null), 1200);
    if (entry) addLog(`SEARCH "${searchKey}": hash=${bucket} → found value ${entry.value} ✓`);
    else addLog(`SEARCH "${searchKey}": hash=${bucket} → not found ✗`);
  };

  const remove = () => {
    if (!keyInput) return;
    const bucket = hashFn(keyInput, TABLE_SIZE);
    setHighlighted({ bucket });
    setTimeout(() => setHighlighted(null), 600);
    setTable(prev => {
      const next = prev.map(b => [...b]);
      const before = next[bucket].length;
      next[bucket] = next[bucket].filter(e => e.key !== keyInput);
      if (next[bucket].length < before) addLog(`DELETE "${keyInput}" from bucket ${bucket}`);
      else addLog(`"${keyInput}" not found in bucket ${bucket}`);
      return next;
    });
  };

  const loadFactor = table.flat().length / TABLE_SIZE;
  const snippet = pythonCode["hash_table"];
  const getHL = (): number[] => {
    const d = lastOp.toLowerCase();
    if (d.includes("insert") || d.includes("update")) return [9, 10, 11, 12, 13, 14];
    if (d.includes("search")) return [16, 17, 18, 19, 20];
    if (d.includes("delete")) return [22, 23, 24];
    return [];
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-lg p-4 space-y-1">
        <p className="text-sm text-foreground">Maps keys to values using a hash function. Collisions handled via chaining (separate lists per bucket).</p>
        <div className="flex gap-4 text-xs font-mono text-muted-foreground">
          <span>Insert: <span className="text-primary">O(1) avg</span></span>
          <span>Search: <span className="text-primary">O(1) avg</span></span>
          <span>Delete: <span className="text-primary">O(1) avg</span></span>
          <span>Load: <span className={loadFactor > 0.7 ? "text-warning" : "text-primary"}>{(loadFactor * 100).toFixed(0)}%</span></span>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Hash table grid */}
        <div className="glass rounded-lg p-4 neon-border">
          <div className="text-xs font-mono text-muted-foreground mb-3">HASH TABLE — SIZE {TABLE_SIZE} (chaining)</div>
          <div className="space-y-1.5">
            {table.map((bucket, i) => {
              const isHighlighted = highlighted?.bucket === i;
              return (
                <motion.div key={i} className="flex items-start gap-2" animate={{ scale: isHighlighted ? 1.01 : 1 }}>
                  <div className={`w-8 h-8 flex items-center justify-center rounded font-mono text-xs border flex-shrink-0 transition-all ${isHighlighted ? "border-primary bg-primary/20 text-primary shadow-[0_0_10px_hsl(var(--primary)/0.4)]" : "border-border bg-secondary/50 text-muted-foreground"}`}>{i}</div>
                  <div className="text-muted-foreground text-xs mt-2 flex-shrink-0">→</div>
                  <div className="flex flex-wrap gap-1 flex-1 min-h-[32px] items-center">
                    <AnimatePresence>
                      {bucket.map(entry => (
                        <motion.div key={entry.key} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                          className={`flex gap-1 items-center px-2 py-1 rounded border font-mono text-xs transition-all ${
                            isHighlighted && highlighted?.key === entry.key ? "border-warning bg-warning/20 text-warning shadow-[0_0_8px_hsl(var(--warning)/0.4)]"
                            : isHighlighted ? "border-primary/60 bg-primary/10 text-primary"
                            : "border-border bg-secondary/30 text-foreground"}`}>
                          <span className="text-muted-foreground">"</span><span>{entry.key}</span><span className="text-muted-foreground">"</span>
                          <span className="text-muted-foreground mx-0.5">:</span><span className="text-primary">{entry.value}</span>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    {bucket.length === 0 && <span className="text-muted-foreground/40 font-mono text-xs">∅</span>}
                    {bucket.length > 1 && <span className="text-warning text-[10px] font-mono">⚡ collision</span>}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
        {snippet && <CodePanel code={snippet.code} highlightedLines={getHL()} title="Hash Table" />}
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-3 items-end">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-mono text-muted-foreground">Key</span>
          <input type="text" value={keyInput} onChange={e => setKeyInput(e.target.value)}
            className="w-20 bg-secondary border border-border rounded-md px-2 py-1.5 text-sm font-mono text-primary focus:outline-none focus:ring-1 focus:ring-primary" />
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-mono text-muted-foreground">Value</span>
          <input type="number" value={valInput} onChange={e => setValInput(e.target.value)}
            className="w-16 bg-secondary border border-border rounded-md px-2 py-1.5 text-sm font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
        </div>
        <Button onClick={insert} className="neon-glow gap-1"><Plus className="h-4 w-4" />Insert</Button>
        <Button variant="outline" onClick={remove} className="gap-1"><Minus className="h-4 w-4" />Delete</Button>
        <div className="h-px w-px bg-border" />
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-mono text-muted-foreground">Search Key</span>
          <input type="text" value={searchKey} onChange={e => setSearchKey(e.target.value)} onKeyDown={e => e.key === "Enter" && search()}
            className="w-20 bg-secondary border border-border rounded-md px-2 py-1.5 text-sm font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
        </div>
        <Button variant="outline" onClick={search} className="gap-1"><Search className="h-4 w-4" />Search</Button>
        <Button variant="ghost" onClick={() => { setTable(Array.from({ length: TABLE_SIZE }, () => [])); setLog(["Cleared."]); setLastOp(""); }} className="text-muted-foreground text-xs">Clear</Button>
      </div>

      {keyInput && (
        <div className="glass rounded-lg px-4 py-2 text-xs font-mono text-muted-foreground">
          hash(<span className="text-warning">"{keyInput}"</span>) = <span className="text-primary">{hashFn(keyInput, TABLE_SIZE)}</span>
          <span className="ml-2 text-muted-foreground/60">// sum of char codes mod {TABLE_SIZE}</span>
        </div>
      )}

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
        <MarkCompletedButton algorithmName="Hash Table" isCompleted={isCompleted("Hash Table")} onMark={markCompleted} loading={loading} />
      </div>
    </div>
  );
};

export default HashTableVisualizer;
