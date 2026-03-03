import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Play, Pause, SkipForward, RotateCcw, Shuffle, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import BarVisualizer from "./BarVisualizer";
import CodePanel from "./CodePanel";
import MarkCompletedButton from "./MarkCompletedButton";
import { generateSteps, algorithmInfo, type SortAlgorithm, type SortStep } from "@/algorithms/sorting";
import { pythonCode, getHighlightedLines } from "@/algorithms/pythonCode";
import { useAlgorithmProgress } from "@/hooks/useAlgorithmProgress";

const ALGORITHMS: SortAlgorithm[] = ["bubble", "selection", "insertion", "quick", "merge", "heap"];
const ALGO_NAMES = ALGORITHMS.map(a => algorithmInfo[a].name);

function generateRandomArray(size: number): number[] {
  return Array.from({ length: size }, () => Math.floor(Math.random() * 95) + 5);
}

const SortingVisualizer = () => {
  const [algorithm, setAlgorithm] = useState<SortAlgorithm>("bubble");
  const [arraySize, setArraySize] = useState(15);
  const [speed, setSpeed] = useState(200);
  const [array, setArray] = useState<number[]>(() => generateRandomArray(15));
  const [steps, setSteps] = useState<SortStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [customInput, setCustomInput] = useState("");
  const { markCompleted, isCompleted, loading } = useAlgorithmProgress("sorting", ALGO_NAMES);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const maxVal = Math.max(...array, 1);
  const currentData = steps[currentStep] || { array, comparing: null, swapping: null, sorted: [], description: "Press play to start" };
  const info = algorithmInfo[algorithm];
  const isComplete = currentStep === steps.length - 1 && steps.length > 0;

  const reset = useCallback(() => {
    setIsPlaying(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    setSteps([]);
    setCurrentStep(0);
  }, []);

  const handleNewArray = () => { reset(); setArray(generateRandomArray(arraySize)); };

  const handleCustomInput = () => {
    const nums = customInput.split(",").map(s => parseInt(s.trim())).filter(n => !isNaN(n) && n > 0 && n <= 100);
    if (nums.length >= 2) { reset(); setArray(nums); setArraySize(nums.length); }
  };

  const handleStart = () => { const s = generateSteps(array, algorithm); setSteps(s); setCurrentStep(0); setIsPlaying(true); };

  const handleStep = () => {
    if (steps.length === 0) { const s = generateSteps(array, algorithm); setSteps(s); setCurrentStep(0); return; }
    if (currentStep < steps.length - 1) setCurrentStep(prev => prev + 1);
  };

  useEffect(() => {
    if (isPlaying && steps.length > 0) {
      intervalRef.current = setInterval(() => {
        setCurrentStep(prev => {
          if (prev >= steps.length - 1) { setIsPlaying(false); if (intervalRef.current) clearInterval(intervalRef.current); return prev; }
          return prev + 1;
        });
      }, speed);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isPlaying, steps.length, speed]);

  const snippet = pythonCode[algorithm];
  const highlightedLines = getHighlightedLines(algorithm, currentData.description);

  return (
    <div className="space-y-6">
      {/* Algorithm Selector */}
      <div className="flex flex-wrap gap-2">
        {ALGORITHMS.map(algo => (
          <button key={algo} onClick={() => { setAlgorithm(algo); reset(); }}
            className={`px-4 py-2 rounded-md font-mono text-sm transition-all border ${algorithm === algo ? "border-primary bg-primary/10 text-primary neon-border" : "border-border bg-secondary/50 text-muted-foreground hover:text-foreground hover:border-primary/50"}`}>
            {algorithmInfo[algo].name}
            {isCompleted(algorithmInfo[algo].name) && <span className="ml-2 text-success">✓</span>}
          </button>
        ))}
      </div>

      {/* Info Card */}
      <motion.div key={algorithm} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-lg p-4 space-y-1">
        <p className="text-sm text-foreground">{info.description}</p>
        <div className="flex gap-4 text-xs font-mono text-muted-foreground">
          <span>Time: <span className="text-primary">{info.time}</span></span>
          <span>Space: <span className="text-primary">{info.space}</span></span>
        </div>
      </motion.div>

      {/* Visualizer + Code side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="glass rounded-lg p-6 neon-border">
          <BarVisualizer array={currentData.array} comparing={currentData.comparing} swapping={currentData.swapping} sorted={currentData.sorted} maxVal={maxVal} />
          <div className="mt-4 text-center font-mono text-sm text-muted-foreground min-h-[20px]">{currentData.description}</div>
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
        <Button variant="outline" size="icon" onClick={handleNewArray} title="Random array"><Shuffle className="h-4 w-4" /></Button>
        <Button variant="outline" size="icon" onClick={reset} title="Reset"><RotateCcw className="h-4 w-4" /></Button>
        <Button size="icon" onClick={() => { if (steps.length === 0) handleStart(); else setIsPlaying(!isPlaying); }} className="neon-glow" title={isPlaying ? "Pause" : "Play"}>
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>
        <Button variant="outline" size="icon" onClick={handleStep} title="Step forward"><SkipForward className="h-4 w-4" /></Button>
        <div className="flex items-center gap-2 ml-auto">
          <Zap className="h-3 w-3 text-warning" />
          <input type="range" min={50} max={800} step={50} value={800 - speed + 50} onChange={(e) => setSpeed(800 - parseInt(e.target.value) + 50)} className="w-20 accent-primary" />
          <span className="text-xs font-mono text-muted-foreground">Speed</span>
        </div>
      </div>

      {/* Custom Input */}
      <div className="flex gap-2">
        <input type="text" value={customInput} onChange={(e) => setCustomInput(e.target.value)} placeholder="Enter numbers: 5,3,8,1,9..."
          className="flex-1 bg-secondary border border-border rounded-md px-3 py-2 text-sm font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
        <Button variant="outline" onClick={handleCustomInput}>Load</Button>
      </div>

      {/* Array Size */}
      <div className="flex items-center gap-3">
        <span className="text-xs font-mono text-muted-foreground">Size: {arraySize}</span>
        <input type="range" min={5} max={50} value={arraySize} onChange={(e) => { const s = parseInt(e.target.value); setArraySize(s); reset(); setArray(generateRandomArray(s)); }} className="flex-1 accent-primary" />
      </div>

      {/* Mark Completed */}
      <div className="flex justify-end">
        <MarkCompletedButton algorithmName={info.name} isCompleted={isCompleted(info.name)} onMark={markCompleted} loading={loading} />
      </div>
    </div>
  );
};

export default SortingVisualizer;
