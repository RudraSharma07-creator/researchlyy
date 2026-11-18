CREATE TABLE public.courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL,
  user_id uuid NOT NULL,
  item_id text NOT NULL,
  item text NOT NULL,
  price integer NOT NULL CHECK (price >= 0),
  ordered_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.research (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL,
  user_id uuid NOT NULL,
  item_id text NOT NULL,
  item text NOT NULL,
  price integer NOT NULL CHECK (price >= 0),
  ordered_at timestamptz NOT NULL DEFAULT now()
);

-- Browsers may read and cancel; only the server (service_role) inserts, with catalogue prices.
GRANT SELECT, DELETE ON public.courses TO authenticated;
GRANT ALL ON public.courses TO service_role;
GRANT SELECT, DELETE ON public.research TO authenticated;
GRANT ALL ON public.research TO service_role;

ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.research ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users see their own course orders" ON public.courses
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users cancel their own course orders" ON public.courses
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users see their own research orders" ON public.research
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users cancel their own research orders" ON public.research
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE INDEX courses_user_id_idx ON public.courses (user_id, ordered_at DESC);
CREATE INDEX research_user_id_idx ON public.research (user_id, ordered_at DESC);