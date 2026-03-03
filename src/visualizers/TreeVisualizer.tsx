import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import CodePanel from "./CodePanel";
import MarkCompletedButton from "./MarkCompletedButton";
import { pythonCode, getHighlightedLines } from "@/algorithms/pythonCode";
import { useAlgorithmProgress } from "@/hooks/useAlgorithmProgress";

interface TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
}

function insert(root: TreeNode | null, val: number): TreeNode {
  if (!root) return { val, left: null, right: null };
  if (val < root.val) return { ...root, left: insert(root.left, val) };
  if (val > root.val) return { ...root, right: insert(root.right, val) };
  return root;
}

function buildFromArray(vals: number[]): TreeNode | null {
  let root: TreeNode | null = null;
  for (const v of vals) root = insert(root, v);
  return root;
}

function inorder(node: TreeNode | null, result: number[] = []): number[] {
  if (!node) return result;
  inorder(node.left, result);
  result.push(node.val);
  inorder(node.right, result);
  return result;
}

function preorder(node: TreeNode | null, result: number[] = []): number[] {
  if (!node) return result;
  result.push(node.val);
  preorder(node.left, result);
  preorder(node.right, result);
  return result;
}

function postorder(node: TreeNode | null, result: number[] = []): number[] {
  if (!node) return result;
  postorder(node.left, result);
  postorder(node.right, result);
  result.push(node.val);
  return result;
}

// Layout computation
interface NodePos { val: number; x: number; y: number; id: string; }
interface Edge { x1: number; y1: number; x2: number; y2: number; }

function layout(node: TreeNode | null, x: number, y: number, gap: number, positions: NodePos[], edges: Edge[], id = "root") {
  if (!node) return;
  positions.push({ val: node.val, x, y, id });
  if (node.left) {
    edges.push({ x1: x, y1: y, x2: x - gap, y2: y + 70 });
    layout(node.left, x - gap, y + 70, gap / 2, positions, edges, id + "L");
  }
  if (node.right) {
    edges.push({ x1: x, y1: y, x2: x + gap, y2: y + 70 });
    layout(node.right, x + gap, y + 70, gap / 2, positions, edges, id + "R");
  }
}

const TRAVERSAL_TYPES = ["inorder", "preorder", "postorder"] as const;
type TraversalType = typeof TRAVERSAL_TYPES[number];

const ALGO_NAMES = ["BST Insert", "BST Search", "Inorder Traversal", "Preorder Traversal", "Postorder Traversal"];

const TreeVisualizer = () => {
  const [root, setRoot] = useState<TreeNode | null>(() => buildFromArray([50, 30, 70, 20, 40, 60, 80]));
  const [inputVal, setInputVal] = useState("45");
  const [searchVal, setSearchVal] = useState("40");
  const [highlighted, setHighlighted] = useState<Set<number>>(new Set());
  const [traversalResult, setTraversalResult] = useState<number[]>([]);
  const [traversalActive, setTraversalActive] = useState<number | null>(null);
  const [log, setLog] = useState<string[]>(["BST ready. Showing default tree."]);
  const [traversalType, setTraversalType] = useState<TraversalType>("inorder");
  const [activeCodeKey, setActiveCodeKey] = useState<string>("bst_insert");
  const [lastDescription, setLastDescription] = useState("");
  const { markCompleted, isCompleted, loading } = useAlgorithmProgress("trees", ALGO_NAMES);

  const addLog = (msg: string) => { setLog(prev => [msg, ...prev.slice(0, 6)]); setLastDescription(msg); };

  const positions: NodePos[] = [];
  const edges: Edge[] = [];
  if (root) layout(root, 200, 40, 100, positions, edges);

  const minX = Math.min(...positions.map(p => p.x), 0);
  const maxX = Math.max(...positions.map(p => p.x), 400);
  const maxY = Math.max(...positions.map(p => p.y), 40);
  const svgW = Math.max(maxX - minX + 80, 400);
  const svgH = maxY + 60;
  const offsetX = -minX + 40;

  const insertNode = () => {
    const val = parseInt(inputVal);
    if (isNaN(val)) return;
    setRoot(prev => insert(prev, val));
    setHighlighted(new Set([val]));
    setTimeout(() => setHighlighted(new Set()), 1000);
    addLog(`INSERT ${val} → placed in BST`);
    setActiveCodeKey("bst_insert");
  };

  const searchNode = () => {
    const val = parseInt(searchVal);
    if (isNaN(val) || !root) return;
    let node: TreeNode | null = root;
    const path: number[] = [];
    while (node) {
      path.push(node.val);
      if (val === node.val) break;
      node = val < node.val ? node.left : node.right;
    }
    setHighlighted(new Set(path));
    setTimeout(() => setHighlighted(new Set()), 1500);
    if (node) addLog(`SEARCH ${val}: found! Path: ${path.join(" → ")}`);
    else addLog(`SEARCH ${val}: not found`);
    setActiveCodeKey("bst_search");
  };

  const runTraversal = async (type: TraversalType) => {
    setTraversalType(type);
    setActiveCodeKey(type);
    const result = type === "inorder" ? inorder(root) : type === "preorder" ? preorder(root) : postorder(root);
    setTraversalResult(result);
    addLog(`${type.toUpperCase()}: ${result.join(", ")}`);
    for (let i = 0; i < result.length; i++) {
      setTraversalActive(result[i]);
      await new Promise(r => setTimeout(r, 400));
    }
    setTraversalActive(null);
  };

  const snippet = pythonCode[activeCodeKey];
  const getHL = (): number[] => {
    const d = lastDescription.toLowerCase();
    if (activeCodeKey === "bst_insert") {
      if (d.includes("insert")) return [6, 7, 8, 9, 10, 11];
    }
    if (activeCodeKey === "bst_search") {
      if (d.includes("found")) return [3, 4];
      if (d.includes("not found")) return [1, 2];
      if (d.includes("search")) return [5, 6, 7];
    }
    if (activeCodeKey === "inorder" || activeCodeKey === "preorder" || activeCodeKey === "postorder") {
      return [0, 1, 2, 3, 4];
    }
    return [];
  };

  const currentAlgoName = activeCodeKey === "bst_insert" ? "BST Insert" : activeCodeKey === "bst_search" ? "BST Search" : `${traversalType.charAt(0).toUpperCase() + traversalType.slice(1)} Traversal`;

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-lg p-4 space-y-1">
        <p className="text-sm text-foreground">Binary Search Tree: left child &lt; parent &lt; right child. Enables efficient O(log n) search, insert, delete on average.</p>
        <div className="flex gap-4 text-xs font-mono text-muted-foreground">
          <span>Search: <span className="text-primary">O(log n)</span></span>
          <span>Insert: <span className="text-primary">O(log n)</span></span>
          <span>Traversal: <span className="text-primary">O(n)</span></span>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Tree SVG */}
        <div className="glass rounded-lg p-4 neon-border overflow-x-auto">
          <div className="text-xs font-mono text-muted-foreground mb-2">BINARY SEARCH TREE</div>
          {root ? (
            <svg width={svgW} height={svgH} className="overflow-visible mx-auto block">
              {/* Edges */}
              {edges.map((e, i) => (
                <line key={i} x1={e.x1 + offsetX} y1={e.y1} x2={e.x2 + offsetX} y2={e.y2}
                  stroke="hsl(var(--border))" strokeWidth="1.5" />
              ))}
              {/* Nodes */}
              {positions.map(p => {
                const isHighlighted = highlighted.has(p.val);
                const isTraversing = traversalActive === p.val;
                return (
                  <g key={p.id}>
                    <motion.circle cx={p.x + offsetX} cy={p.y} r="20"
                      fill={isTraversing ? "hsl(var(--warning)/0.3)" : isHighlighted ? "hsl(var(--primary)/0.2)" : "hsl(var(--secondary))"}
                      stroke={isTraversing ? "hsl(var(--warning))" : isHighlighted ? "hsl(var(--primary))" : "hsl(var(--border))"}
                      strokeWidth={isHighlighted || isTraversing ? "2" : "1"}
                      animate={{ r: isTraversing ? 22 : 20 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    />
                    <text x={p.x + offsetX} y={p.y + 4} textAnchor="middle" fontSize="11"
                      fill={isTraversing ? "hsl(var(--warning))" : isHighlighted ? "hsl(var(--primary))" : "hsl(var(--foreground))"}
                      fontFamily="monospace" fontWeight={isHighlighted ? "bold" : "normal"}>
                      {p.val}
                    </text>
                  </g>
                );
              })}
            </svg>
          ) : (
            <div className="h-32 flex items-center justify-center text-muted-foreground font-mono text-sm">Empty tree</div>
          )}
        </div>
        {snippet && <CodePanel code={snippet.code} highlightedLines={getHL()} title={currentAlgoName} />}
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-3 items-end">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-mono text-muted-foreground">Insert</span>
          <div className="flex gap-1">
            <input type="number" value={inputVal} onChange={e => setInputVal(e.target.value)}
              className="w-16 bg-secondary border border-border rounded-md px-2 py-1.5 text-sm font-mono text-primary focus:outline-none focus:ring-1 focus:ring-primary" />
            <Button onClick={insertNode} className="neon-glow gap-1"><Plus className="h-4 w-4" />Insert</Button>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-mono text-muted-foreground">Search</span>
          <div className="flex gap-1">
            <input type="number" value={searchVal} onChange={e => setSearchVal(e.target.value)}
              className="w-16 bg-secondary border border-border rounded-md px-2 py-1.5 text-sm font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
            <Button variant="outline" onClick={searchNode} className="gap-1"><Search className="h-4 w-4" />Search</Button>
          </div>
        </div>
        <Button variant="ghost" onClick={() => { setRoot(null); setTraversalResult([]); addLog("Tree cleared."); }} className="text-muted-foreground gap-1">
          <RotateCcw className="h-3 w-3" />Clear
        </Button>
        <Button variant="ghost" onClick={() => { setRoot(buildFromArray([50, 30, 70, 20, 40, 60, 80])); addLog("Reset to default."); }} className="text-muted-foreground text-xs">Reset Default</Button>
      </div>

      {/* Traversals */}
      <div className="glass rounded-lg p-4">
        <div className="text-xs font-mono text-muted-foreground mb-3">TREE TRAVERSALS</div>
        <div className="flex gap-2 mb-3">
          {TRAVERSAL_TYPES.map(t => (
            <Button key={t} variant="outline" size="sm" onClick={() => runTraversal(t)}
              className={`text-xs font-mono ${traversalType === t ? "border-primary text-primary" : ""}`}>
              {t}
            </Button>
          ))}
        </div>
        {traversalResult.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {traversalResult.map((v, i) => (
              <motion.span key={`${v}-${i}`} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className={`px-2 py-0.5 rounded font-mono text-xs border ${traversalActive === v ? "border-warning bg-warning/20 text-warning" : "border-border bg-secondary/50 text-foreground"}`}>
                {v}
              </motion.span>
            ))}
          </div>
        )}
      </div>

      {/* Log + Mark Complete */}
      <div className="flex items-start justify-between gap-4">
        <div className="glass rounded-lg p-4 flex-1">
          <div className="text-xs font-mono text-muted-foreground mb-2">OPERATION LOG</div>
          <div className="space-y-1">
            {log.map((entry, i) => (
              <div key={`${entry}-${i}`} className={`text-xs font-mono px-2 py-1 rounded ${i === 0 ? "text-primary" : "text-muted-foreground"}`}>
                {i === 0 && "› "}{entry}
              </div>
            ))}
          </div>
        </div>
        <MarkCompletedButton algorithmName={currentAlgoName} isCompleted={isCompleted(currentAlgoName)} onMark={markCompleted} loading={loading} />
      </div>
    </div>
  );
};

export default TreeVisualizer;
