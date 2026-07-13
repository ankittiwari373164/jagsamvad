-- ============================================================
-- JAGSAMVAD — Supabase schema
-- Run this whole file once in Supabase SQL Editor
-- (Project → SQL Editor → New query → paste → Run)
-- ============================================================

create extension if not exists "pgcrypto";

-- ---------- CATEGORIES ----------
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  created_at timestamptz not null default now()
);

-- ---------- AUTHORS ----------
create table if not exists public.authors (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  name text not null,
  slug text not null unique,
  bio text,
  avatar_url text,
  twitter_url text,
  created_at timestamptz not null default now()
);

-- ---------- ARTICLES ----------
create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text,
  content text not null default '',
  cover_image_url text,
  category_id uuid references public.categories(id) on delete set null,
  author_id uuid references public.authors(id) on delete set null,
  status text not null default 'draft' check (status in ('draft', 'published')),
  is_featured boolean not null default false,
  meta_title text,
  meta_description text,
  tags text[] not null default '{}',
  views integer not null default 0,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists articles_status_published_idx on public.articles (status, published_at desc);
create index if not exists articles_category_idx on public.articles (category_id);
create index if not exists articles_author_idx on public.articles (author_id);

-- ---------- ADMINS (allow-list of who can write content) ----------
create table if not exists public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  created_at timestamptz not null default now()
);

-- ---------- updated_at trigger ----------
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_articles_updated_at on public.articles;
create trigger trg_articles_updated_at
  before update on public.articles
  for each row execute function public.set_updated_at();

-- ---------- is_admin() helper (security definer avoids RLS recursion) ----------
create or replace function public.is_admin()
returns boolean as $$
  select exists (
    select 1 from public.admins where user_id = auth.uid()
  );
$$ language sql security definer stable;

-- ---------- CONTACT MESSAGES ----------
create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz not null default now()
);

-- ---------- NEWSLETTER SUBSCRIBERS ----------
create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  created_at timestamptz not null default now()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table public.categories enable row level security;
alter table public.authors enable row level security;
alter table public.articles enable row level security;
alter table public.admins enable row level security;

-- Categories: anyone can read, only admins can write
create policy "categories_public_read" on public.categories for select using (true);
create policy "categories_admin_write" on public.categories for insert with check (public.is_admin());
create policy "categories_admin_update" on public.categories for update using (public.is_admin());
create policy "categories_admin_delete" on public.categories for delete using (public.is_admin());

-- Authors: anyone can read, only admins can write
create policy "authors_public_read" on public.authors for select using (true);
create policy "authors_admin_write" on public.authors for insert with check (public.is_admin());
create policy "authors_admin_update" on public.authors for update using (public.is_admin());
create policy "authors_admin_delete" on public.authors for delete using (public.is_admin());

-- Articles: public can read published articles, admins can read/write everything
create policy "articles_public_read_published" on public.articles
  for select using (status = 'published' or public.is_admin());
create policy "articles_admin_write" on public.articles for insert with check (public.is_admin());
create policy "articles_admin_update" on public.articles for update using (public.is_admin());
create policy "articles_admin_delete" on public.articles for delete using (public.is_admin());

-- Admins table: an admin can see the list; nobody can self-promote via the API
create policy "admins_admin_read" on public.admins for select using (public.is_admin());

-- Contact messages: anyone can submit, only admins can read
alter table public.contact_messages enable row level security;
create policy "contact_public_insert" on public.contact_messages for insert with check (true);
create policy "contact_admin_read" on public.contact_messages for select using (public.is_admin());

-- Newsletter subscribers: anyone can subscribe, only admins can read the list
alter table public.newsletter_subscribers enable row level security;
create policy "newsletter_public_insert" on public.newsletter_subscribers for insert with check (true);
create policy "newsletter_admin_read" on public.newsletter_subscribers for select using (public.is_admin());

-- ---------- view counter (callable by anyone reading an article) ----------
create or replace function public.increment_article_views(article_id uuid)
returns void as $$
  update public.articles set views = views + 1 where id = article_id;
$$ language sql security definer;

grant execute on function public.increment_article_views(uuid) to anon, authenticated;

-- ============================================================
-- STORAGE — bucket for cover images / in-article images
-- ============================================================
insert into storage.buckets (id, name, public)
values ('article-images', 'article-images', true)
on conflict (id) do nothing;

create policy "article_images_public_read"
  on storage.objects for select
  using (bucket_id = 'article-images');

create policy "article_images_authenticated_write"
  on storage.objects for insert
  with check (bucket_id = 'article-images' and auth.role() = 'authenticated');

create policy "article_images_authenticated_update"
  on storage.objects for update
  using (bucket_id = 'article-images' and auth.role() = 'authenticated');

create policy "article_images_authenticated_delete"
  on storage.objects for delete
  using (bucket_id = 'article-images' and auth.role() = 'authenticated');

-- ============================================================
-- SEED DATA — starter categories (order here drives the nav bar,
-- since categories are listed by creation order)
-- ============================================================
insert into public.categories (name, slug, description) values
  ('Bollywood', 'bollywood', 'Hindi cinema news, gossip and reviews'),
  ('Hollywood', 'hollywood', 'Hollywood movie news and updates'),
  ('Korean Movies', 'korean-movies', 'K-movies and K-drama news and reviews'),
  ('Movies', 'movies', 'Latest movie news, reviews and updates'),
  ('OTT Release', 'ott-release', 'What''s new on Netflix, Prime Video, Hotstar and more')
on conflict (slug) do nothing;

-- ============================================================
-- MAKE YOURSELF AN ADMIN
-- 1. Sign up a user first (Authentication → Users → Add user,
--    or use the app once Supabase Auth is wired up).
-- 2. Then run, replacing the email:
--
-- insert into public.admins (user_id, email)
-- select id, email from auth.users where email = 'you@example.com';
-- ============================================================
