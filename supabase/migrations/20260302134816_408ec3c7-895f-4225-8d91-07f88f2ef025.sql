
-- Add unique constraint on (user_id, algorithm_name) for upsert support
ALTER TABLE public.algorithm_progress
ADD CONSTRAINT algorithm_progress_user_algorithm_unique UNIQUE (user_id, algorithm_name);
