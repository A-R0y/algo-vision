import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Play, Pause, SkipForward, RotateCcw, Shuffle } from "lucide-react";
import { Button } from "@/components/ui/button";
import CodePanel from "./CodePanel";
import MarkCompletedButton from "./MarkCompletedButton";
import { generateSearchSteps, searchInfo, type SearchAlgorithm } from "@/algorithms/searching";
import { pythonCode, getHighlightedLines } from "@/algorithms/pythonCode";
import { useAlgorithmProgress } from "@/hooks/useAlgorithmProgress";

const ALGORITHMS: SearchAlgorithm[] = ["linear", "binary"];
const ALGO_NAMES = ALGORITHMS.map(a => searchInfo[a].name);

function generateArray(size: number) {
  return Array.from({ length: size }, () => Math.floor(Math.random() * 95) + 5);
}

const SearchVisualizer = () => {
  const [algorithm, setAlgorithm] = useState<SearchAlgorithm>("linear");
  const [array, setArray] = useState<number[]>(() => generateArray(12));
  const [target, setTarget] = useState<number>(42);
  const [targetInput, setTargetInput] = useState("42");
  const [steps, setSteps] = useState<ReturnType<typeof generateSearchSteps>>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(500);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const { markCompleted, isCompleted, loading } = useAlgorithmProgress("searching", ALGO_NAMES);

  const currentData = steps[currentStep] || { array, current: null, found: null, eliminated: [], description: "Press play to start", target };
  const info = searchInfo[algorithm];
  const isComplete = steps.length > 0 && currentStep === steps.length - 1;

  const reset = useCallback(() => {
    setIsPlaying(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    setSteps([]);
    setCurrentStep(0);
  }, []);

  useEffect(() => {
    if (isPlaying && steps.length > 0) {
      intervalRef.current = setInterval(() => {
        setCurrentStep(prev => {
          if (prev >= steps.length - 1) { setIsPlaying(false); return prev; }
          return prev + 1;
        });
      }, speed);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isPlaying, steps.length, speed]);

  const handleStart = () => { const s = generateSearchSteps(array, target, algorithm); setSteps(s); setCurrentStep(0); setIsPlaying(true); };
  const handleStep = () => {
    if (steps.length === 0) { const s = generateSearchSteps(array, target, algorithm); setSteps(s); setCurrentStep(0); return; }
    if (currentStep < steps.length - 1) setCurrentStep(p => p + 1);
  };

  const getBarClass = (index: number) => {
    if (currentData.found === index) return "bg-success shadow-[0_0_15px_hsl(var(--success)/0.6)]";
    if (currentData.current === index) return "bg-warning shadow-[0_0_15px_hsl(var(--warning)/0.5)]";
    if (currentData.low !== undefined && currentData.high !== undefined) {
      if (index < currentData.low || index > currentData.high) return "bg-muted opacity-30";
    }
    if (currentData.eliminated?.includes(index)) return "bg-muted opacity-30";
    return "bg-primary shadow-[0_0_8px_hsl(var(--primary)/0.3)]";
  };

  const displayArray = steps.length > 0 ? currentData.array : array;
  const maxVal = Math.max(...displayArray, 1);
  const snippet = pythonCode[algorithm];
  const highlightedLines = getHighlightedLines(algorithm, currentData.description);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {ALGORITHMS.map(algo => (
          <button key={algo} onClick={() => { setAlgorithm(algo); reset(); }}
            className={`px-4 py-2 rounded-md font-mono text-sm transition-all border ${algorithm === algo ? "border-primary bg-primary/10 text-primary neon-border" : "border-border bg-secondary/50 text-muted-foreground hover:text-foreground hover:border-primary/50"}`}>
            {searchInfo[algo].name}
            {isCompleted(searchInfo[algo].name) && <span className="ml-2 text-success">✓</span>}
          </button>
        ))}
      </div>

      <motion.div key={algorithm} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-lg p-4 space-y-1">
        <p className="text-sm text-foreground">{info.description}</p>
        <div className="flex gap-4 text-xs font-mono text-muted-foreground">
          <span>Time: <span className="text-primary">{info.time}</span></span>
          <span>Space: <span className="text-primary">{info.space}</span></span>
          {info.requiresSorted && <span className="text-warning">⚠ Requires sorted array</span>}
        </div>
      </motion.div>

      {/* Visualizer + Code */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="glass rounded-lg p-6 neon-border">
          <div className="flex items-end justify-center gap-[3px] h-48 px-2 mb-4">
            {displayArray.map((val, i) => (
              <motion.div key={i} layout transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className={`relative rounded-t-sm ${getBarClass(i)} min-w-[8px] flex flex-col items-center`}
                style={{ height: `${(val / maxVal) * 100}%`, width: `${Math.max(100 / displayArray.length - 1, 4)}%` }}>
                {displayArray.length <= 16 && <span className="absolute -top-5 text-[10px] font-mono text-muted-foreground">{val}</span>}
              </motion.div>
            ))}
          </div>
          <div className="flex justify-center gap-[3px]">
            {displayArray.map((_, i) => (
              <div key={i} className={`text-[9px] font-mono text-center ${currentData.current === i ? "text-warning" : currentData.found === i ? "text-success" : "text-muted-foreground"}`}
                style={{ width: `${Math.max(100 / displayArray.length - 1, 4)}%`, minWidth: 8 }}>{i}</div>
            ))}
          </div>
          <div className="mt-4 text-center font-mono text-sm text-muted-foreground min-h-[20px]">{currentData.description}</div>
          {steps.length > 0 && (
            <div className="mt-2 w-full bg-secondary rounded-full h-1">
              <div className="bg-primary h-1 rounded-full transition-all duration-200" style={{ width: `${(currentStep / Math.max(steps.length - 1, 1)) * 100}%` }} />
            </div>
          )}
        </div>
        {snippet && <CodePanel code={snippet.code} highlightedLines={highlightedLines} title={info.name} />}
      </div>

      {/* Target + Controls */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-muted-foreground">Target:</span>
          <input type="number" value={targetInput}
            onChange={e => { setTargetInput(e.target.value); const n = parseInt(e.target.value); if (!isNaN(n)) { setTarget(n); reset(); } }}
            className="w-16 bg-secondary border border-border rounded-md px-2 py-1.5 text-sm font-mono text-primary focus:outline-none focus:ring-1 focus:ring-primary" />
        </div>
        <Button variant="outline" size="icon" onClick={() => { reset(); setArray(generateArray(12)); }} title="New array"><Shuffle className="h-4 w-4" /></Button>
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

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-xs font-mono">
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-warning" /><span className="text-muted-foreground">Current</span></div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-success" /><span className="text-muted-foreground">Found</span></div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-primary" /><span className="text-muted-foreground">Active</span></div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-muted opacity-50" /><span className="text-muted-foreground">Eliminated</span></div>
      </div>

      {/* Mark Completed */}
      <div className="flex justify-end">
        <MarkCompletedButton algorithmName={info.name} isCompleted={isCompleted(info.name)} onMark={markCompleted} loading={loading} />
      </div>
    </div>
  );
};

export default SearchVisualizer;
