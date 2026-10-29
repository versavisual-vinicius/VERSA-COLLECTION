-- Migração canônica para tabela de favoritos e índices de busca
CREATE TABLE IF NOT EXISTS public.favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_id text NOT NULL REFERENCES public.collections(id) ON DELETE CASCADE,
  visitor_id text,
  client_email text,
  photo_id text NOT NULL,
  selected boolean NOT NULL DEFAULT true,
  note text,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS favorites_lookup_idx ON public.favorites (collection_id, visitor_id, client_email);
CREATE INDEX IF NOT EXISTS favorites_photo_idx ON public.favorites (collection_id, photo_id);

ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.favorites FROM anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.favorites TO service_role;
