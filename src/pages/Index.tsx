import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Cpu, BarChart3, Layers, GitBranch, Hash, Link, ArrowUpDown, Search, Network, LogOut, Trophy } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import SortingVisualizer from "@/visualizers/SortingVisualizer";
import SearchVisualizer from "@/visualizers/SearchVisualizer";
import StackQueueVisualizer from "@/visualizers/StackQueueVisualizer";
import TreeVisualizer from "@/visualizers/TreeVisualizer";
import HeapVisualizer from "@/visualizers/HeapVisualizer";
import HashTableVisualizer from "@/visualizers/HashTableVisualizer";
import LinkedListVisualizer from "@/visualizers/LinkedListVisualizer";
import GraphVisualizer from "@/visualizers/GraphVisualizer";

type Tab = "sorting" | "searching" | "stack-queue" | "trees" | "heap" | "hash" | "linked-list" | "graphs";

interface TabDef {
  id: Tab;
  label: string;
  icon: React.ReactNode;
  component: React.ReactNode;
  color: string;
}

// Total unique algorithm names across all categories
const TOTAL_ALGORITHMS = 26; // 6 sorting + 2 searching + 2 stack/queue + 5 tree + 2 heap + 1 hash + 1 linked list + 10 graphs - some overlap

const Index = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [completedCount, setCompletedCount] = useState(0);

  useEffect(() => {
    if (!user) return;
    const fetchProgress = () => {
      supabase
        .from("algorithm_progress")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("completed", true)
        .then(({ count }) => setCompletedCount(count ?? 0));
    };
    fetchProgress();

    // Listen for changes
    const channel = supabase
      .channel("progress-updates")
      .on("postgres_changes", { event: "*", schema: "public", table: "algorithm_progress", filter: `user_id=eq.${user.id}` }, () => {
        fetchProgress();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const [activeTab, setActiveTab] = useState<Tab>("sorting");

  const tabs: TabDef[] = [
    { id: "sorting", label: "Sorting", icon: <ArrowUpDown className="h-3.5 w-3.5" />, component: <SortingVisualizer />, color: "text-primary" },
    { id: "searching", label: "Searching", icon: <Search className="h-3.5 w-3.5" />, component: <SearchVisualizer />, color: "text-accent" },
    { id: "stack-queue", label: "Stack & Queue", icon: <Layers className="h-3.5 w-3.5" />, component: <StackQueueVisualizer />, color: "text-warning" },
    { id: "trees", label: "BST", icon: <GitBranch className="h-3.5 w-3.5" />, component: <TreeVisualizer />, color: "text-success" },
    { id: "heap", label: "Heap", icon: <BarChart3 className="h-3.5 w-3.5" />, component: <HeapVisualizer />, color: "text-primary" },
    { id: "hash", label: "Hash Table", icon: <Hash className="h-3.5 w-3.5" />, component: <HashTableVisualizer />, color: "text-accent" },
    { id: "linked-list", label: "Linked List", icon: <Link className="h-3.5 w-3.5" />, component: <LinkedListVisualizer />, color: "text-warning" },
    { id: "graphs", label: "Graphs", icon: <Network className="h-3.5 w-3.5" />, component: <GraphVisualizer />, color: "text-success" },
  ];

  const active = tabs.find(t => t.id === activeTab)!;
  const progressPercent = Math.round((completedCount / TOTAL_ALGORITHMS) * 100);

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
          <div className="flex items-center gap-4">
            {/* Progress bar */}
            <div className="hidden sm:flex items-center gap-3">
              <Trophy className="h-3.5 w-3.5 text-primary" />
              <div className="flex items-center gap-2">
                <Progress value={progressPercent} className="w-24 h-2 bg-secondary" />
                <span className="text-xs font-mono text-muted-foreground whitespace-nowrap">
                  {completedCount}/{TOTAL_ALGORITHMS}
                </span>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground hover:text-destructive transition-colors"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>

        {/* Tab bar */}
        <div className="border-t border-border/30">
          <div className="container mx-auto px-4">
            <div className="flex overflow-x-auto gap-0 scrollbar-hide">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-2.5 font-mono text-xs whitespace-nowrap border-b-2 transition-all ${
                    activeTab === tab.id
                      ? `border-primary ${tab.color} bg-primary/5`
                      : "border-transparent text-muted-foreground hover:text-foreground hover:bg-secondary/30"
                  }`}
                >
                  <span className={activeTab === tab.id ? tab.color : ""}>{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Section header */}
          <div className="flex items-center gap-3 mb-6">
            <span className={`${active.color}`}>{active.icon}</span>
            <h2 className="font-display text-xl tracking-wider text-foreground">
              {active.label.toUpperCase()}
            </h2>
            <div className="h-px flex-1 bg-border/50" />
          </div>

          {active.component}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/30 py-5 text-center">
        <p className="text-xs font-mono text-muted-foreground">
          VISUALIZE.AI — Master Every Algorithm, One Step at a Time
        </p>
      </footer>
    </div>
  );
};

export default Index;
