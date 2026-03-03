import { motion } from "framer-motion";
import { Cpu, ArrowRight, BarChart3, GitBranch, Hash, Layers, Network, Search, ArrowUpDown, Link } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const features = [
  { icon: ArrowUpDown, label: "Sorting Algorithms", desc: "Bubble, Selection, Insertion, Merge, Quick, Heap" },
  { icon: Search, label: "Searching Algorithms", desc: "Linear, Binary search with step-by-step" },
  { icon: Layers, label: "Stacks & Queues", desc: "LIFO/FIFO operations visualized" },
  { icon: GitBranch, label: "Binary Search Trees", desc: "Insert, delete, traversals animated" },
  { icon: BarChart3, label: "Heaps", desc: "Min/Max heap with tree & array views" },
  { icon: Hash, label: "Hash Tables", desc: "Hashing, collision handling, chaining" },
  { icon: Link, label: "Linked Lists", desc: "Insert, delete, reverse with pointers" },
  { icon: Network, label: "Graph Algorithms", desc: "BFS, DFS, Dijkstra, A*, Prim's, Kruskal's" },
];

const Landing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background grid-bg scanline">
      {/* Header */}
      <header className="border-b border-border/50 glass sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between py-3 px-4">
          <div className="flex items-center gap-3">
            <Cpu className="h-5 w-5 text-primary animate-pulse-neon" />
            <h1 className="font-display text-lg tracking-widest text-foreground">
              ALGO<span className="text-primary">·VISION</span>
            </h1>
          </div>
          <button
            onClick={() => navigate(user ? "/dashboard" : "/auth")}
            className="bg-primary text-primary-foreground font-display text-xs tracking-wider px-4 py-2 rounded-md hover:bg-primary/90 transition-colors flex items-center gap-2"
          >
            {user ? "DASHBOARD" : "SIGN IN"}
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="container mx-auto px-4 py-20 text-center max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-display text-4xl md:text-5xl tracking-wider text-foreground mb-4 neon-text">
            MASTER DSA
          </h2>
          <p className="text-muted-foreground font-mono text-sm md:text-base mb-8 max-w-xl mx-auto">
            Interactive visualizations for every data structure and algorithm. 
            Learn step-by-step with real-time animations and track your progress.
          </p>
          <button
            onClick={() => navigate(user ? "/dashboard" : "/auth")}
            className="bg-primary text-primary-foreground font-display tracking-wider px-8 py-3 rounded-md hover:bg-primary/90 transition-colors neon-glow flex items-center gap-2 mx-auto"
          >
            START LEARNING
            <ArrowRight className="h-4 w-4" />
          </button>
        </motion.div>
      </section>

      {/* Features grid */}
      <section className="container mx-auto px-4 pb-20 max-w-4xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f, i) => (
            <motion.div
              key={f.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="glass rounded-lg p-4 hover:neon-border transition-all"
            >
              <f.icon className="h-5 w-5 text-primary mb-2" />
              <h3 className="font-display text-xs tracking-wider text-foreground mb-1">{f.label}</h3>
              <p className="text-xs font-mono text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/30 py-5 text-center">
        <p className="text-xs font-mono text-muted-foreground">
          ALGO·VISION — Master Every Algorithm, One Step at a Time
        </p>
      </footer>
    </div>
  );
};

export default Landing;
