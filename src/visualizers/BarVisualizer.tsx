import { motion } from "framer-motion";

interface BarVisualizerProps {
  array: number[];
  comparing: [number, number] | null;
  swapping: [number, number] | null;
  sorted: number[];
  maxVal: number;
}

const BarVisualizer = ({ array, comparing, swapping, sorted, maxVal }: BarVisualizerProps) => {
  const getBarColor = (index: number) => {
    if (swapping && (index === swapping[0] || index === swapping[1])) return "bg-accent shadow-[0_0_15px_hsl(var(--neon-purple)/0.6)]";
    if (comparing && (index === comparing[0] || index === comparing[1])) return "bg-warning shadow-[0_0_15px_hsl(var(--warning)/0.4)]";
    if (sorted.includes(index)) return "bg-success shadow-[0_0_10px_hsl(var(--success)/0.4)]";
    return "bg-primary shadow-[0_0_8px_hsl(var(--primary)/0.3)]";
  };

  return (
    <div className="flex items-end justify-center gap-[2px] h-64 sm:h-80 px-4">
      {array.map((value, index) => (
        <motion.div
          key={index}
          layout
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className={`relative rounded-t-sm ${getBarColor(index)} min-w-[8px]`}
          style={{
            height: `${(value / maxVal) * 100}%`,
            width: `${Math.max(100 / array.length - 1, 4)}%`,
          }}
        >
          {array.length <= 20 && (
            <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] font-mono text-muted-foreground">
              {value}
            </span>
          )}
        </motion.div>
      ))}
    </div>
  );
};

export default BarVisualizer;
