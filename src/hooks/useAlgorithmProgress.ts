import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface ProgressRecord {
  algorithm_name: string;
  category: string;
  completed: boolean;
  times_practiced: number;
}

export function useAlgorithmProgress(category: string, algorithmNames: string[]) {
  const { user } = useAuth();
  const [progress, setProgress] = useState<Map<string, ProgressRecord>>(new Map());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("algorithm_progress")
      .select("*")
      .eq("user_id", user.id)
      .eq("category", category)
      .in("algorithm_name", algorithmNames)
      .then(({ data, error }) => {
        if (error) {
          console.error("Failed to fetch progress:", error);
          setLoading(false);
          return;
        }
        const map = new Map<string, ProgressRecord>();
        data?.forEach((r) => map.set(r.algorithm_name, r));
        setProgress(map);
        setLoading(false);
      });
  }, [user, category, algorithmNames.join(",")]);

  const markCompleted = useCallback(
    async (algorithmName: string) => {
      if (!user) {
        toast.error("You must be signed in to track progress");
        return;
      }

      const existing = progress.get(algorithmName);

      if (existing?.completed) {
        toast.info("Already marked as completed!");
        return;
      }

      const { error } = await supabase.from("algorithm_progress").upsert(
        {
          user_id: user.id,
          algorithm_name: algorithmName,
          category,
          completed: true,
          completed_at: new Date().toISOString(),
          times_practiced: (existing?.times_practiced ?? 0) + 1,
        },
        { onConflict: "user_id,algorithm_name" }
      );

      if (error) {
        // If upsert fails due to no unique constraint, try insert then update
        const { data: existingRow } = await supabase
          .from("algorithm_progress")
          .select("id, times_practiced")
          .eq("user_id", user.id)
          .eq("algorithm_name", algorithmName)
          .maybeSingle();

        if (existingRow) {
          const { error: updateError } = await supabase
            .from("algorithm_progress")
            .update({
              completed: true,
              completed_at: new Date().toISOString(),
              times_practiced: existingRow.times_practiced + 1,
            })
            .eq("id", existingRow.id);

          if (updateError) {
            toast.error("Failed to save progress");
            return;
          }
        } else {
          const { error: insertError } = await supabase
            .from("algorithm_progress")
            .insert({
              user_id: user.id,
              algorithm_name: algorithmName,
              category,
              completed: true,
              completed_at: new Date().toISOString(),
              times_practiced: 1,
            });

          if (insertError) {
            toast.error("Failed to save progress");
            return;
          }
        }
      }

      setProgress((prev) => {
        const next = new Map(prev);
        next.set(algorithmName, {
          algorithm_name: algorithmName,
          category,
          completed: true,
          times_practiced: (existing?.times_practiced ?? 0) + 1,
        });
        return next;
      });

      toast.success(`${algorithmName} marked as completed!`);
    },
    [user, category, progress]
  );

  const isCompleted = useCallback(
    (algorithmName: string) => progress.get(algorithmName)?.completed ?? false,
    [progress]
  );

  const completedCount = [...progress.values()].filter((p) => p.completed).length;

  return { markCompleted, isCompleted, completedCount, totalCount: algorithmNames.length, loading };
}
