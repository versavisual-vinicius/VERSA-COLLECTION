create extension if not exists pgcrypto with schema extensions;

create table public.collections (
  id text primary key,
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  title text not null,
  business_name text not null default 'Versa Visual',
  business_url text,
  cover jsonb not null,
  cover_focal_point jsonb not null default '{"x": 50, "y": 50}'::jsonb,
  visibility text not null default 'hidden'
    check (visibility in ('public', 'password', 'client-only', 'hidden')),
  password_required boolean not null default false,
  access_password_hash text,
  access_email_required boolean not null default false,
  client_emails text[] not null default '{}',
  favorites_enabled boolean not null default true,
  downloads jsonb not null default '{"enabled": false}'::jsonb,
  download_pin_hash text,
  sharing_enabled boolean not null default true,
  slideshow_enabled boolean not null default true,
  total_items integer not null default 0 check (total_items >= 0),
  locale text not null default 'pt-BR',
  theme jsonb not null,
  client_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (not password_required or access_password_hash is not null),
  check ((downloads->>'requiresPin')::boolean is not true or download_pin_hash is not null)
);

create table public.gallery_sets (
  id text primary key,
  collection_id text not null references public.collections(id) on delete cascade,
  slug text not null,
  title text not null,
  data jsonb not null default '{}'::jsonb,
  position integer not null default 0,
  unique (collection_id, slug)
);

create table public.photos (
  id text primary key,
  collection_id text not null references public.collections(id) on delete cascade,
  set_id text references public.gallery_sets(id) on delete set null,
  position integer not null check (position > 0),
  data jsonb not null,
  unique (collection_id, position)
);

create table public.gallery_sessions (
  id uuid primary key default gen_random_uuid(),
  collection_id text not null references public.collections(id) on delete cascade,
  token_hash text not null unique,
  client_email text,
  expires_at timestamptz not null,
  revoked_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.export_requests (
  id uuid primary key default gen_random_uuid(),
  collection_id text not null references public.collections(id) on delete cascade,
  request_type text not null check (request_type in ('single', 'collection', 'favorites')),
  photo_id text references public.photos(id) on delete set null,
  photo_file_name text,
  client_email text,
  pin_verified boolean not null default false,
  requested_size text not null,
  status text not null default 'pending'
    check (status in ('pending', 'processing', 'ready', 'completed', 'failed')),
  download_url text,
  requested_at timestamptz not null default now(),
  completed_at timestamptz
);

create table public.login_attempts (
  id bigint generated always as identity primary key,
  collection_id text not null references public.collections(id) on delete cascade,
  ip_hash text not null,
  succeeded boolean not null default false,
  attempted_at timestamptz not null default now()
);

create table public.migration_imports (
  id uuid primary key default gen_random_uuid(),
  source_key text not null unique,
  imported_by uuid not null references auth.users(id) on delete restrict,
  summary jsonb not null,
  imported_at timestamptz not null default now()
);

create index photos_collection_position_idx on public.photos (collection_id, position);
create index gallery_sessions_lookup_idx
  on public.gallery_sessions (collection_id, token_hash, expires_at)
  where revoked_at is null;
create index export_requests_collection_requested_idx
  on public.export_requests (collection_id, requested_at desc);
create index login_attempts_rate_limit_idx
  on public.login_attempts (collection_id, ip_hash, attempted_at desc);

alter table public.collections enable row level security;
alter table public.gallery_sets enable row level security;
alter table public.photos enable row level security;
alter table public.gallery_sessions enable row level security;
alter table public.export_requests enable row level security;
alter table public.login_attempts enable row level security;
alter table public.migration_imports enable row level security;

revoke all on table public.collections from anon, authenticated;
revoke all on table public.gallery_sets from anon, authenticated;
revoke all on table public.photos from anon, authenticated;
revoke all on table public.gallery_sessions from anon, authenticated;
revoke all on table public.export_requests from anon, authenticated;
revoke all on table public.login_attempts from anon, authenticated;
revoke all on table public.migration_imports from anon, authenticated;
revoke all on sequence public.login_attempts_id_seq from anon, authenticated;

grant select, insert, update, delete on table public.collections to service_role;
grant select, insert, update, delete on table public.gallery_sets to service_role;
grant select, insert, update, delete on table public.photos to service_role;
grant select, insert, update, delete on table public.gallery_sessions to service_role;
grant select, insert, update, delete on table public.export_requests to service_role;
grant select, insert, update, delete on table public.login_attempts to service_role;
grant select, insert, update, delete on table public.migration_imports to service_role;
grant usage, select on sequence public.login_attempts_id_seq to service_role;

comment on schema public is
  'Application tables are private to Vercel Functions. Data API grants for anon/authenticated are revoked; RLS is defense in depth.';
