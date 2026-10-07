-- Janmitha portfolio: initial schema, security rules and storage
-- Run in the Supabase SQL editor (or via the Supabase CLI) before seed.sql.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------
-- Admin allow-list. Add Janmitha's auth user id after she signs up:
--   insert into public.admin_users (user_id) values ('<her auth.users id>');
-- ---------------------------------------------------------------
create table if not exists public.admin_users (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admin_users where user_id = auth.uid());
$$;

-- ---------------------------------------------------------------
-- Content tables
-- ---------------------------------------------------------------
create table if not exists public.profile (
  id smallint primary key default 1 check (id = 1),   -- single-row table
  display_name text not null,
  hero_eyebrow text,
  hero_intro text,
  tagline text,
  bio text,
  beyond_frame text,
  city text,
  email text,
  instagram_url text,
  linkedin_url text,
  showreel_url text,
  story_video_url text,
  media_kit_url text,
  hero_image_url text,
  about_image_url text,
  philosophy_image_url text,
  philosophy_headline text,
  philosophy_sub text,
  philosophy_quote text,
  updated_at timestamptz not null default now()
);

create table if not exists public.stats (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  value text not null,
  sort_order int not null default 0,
  is_visible boolean not null default true
);

create table if not exists public.brands (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  logo_url text,
  sort_order int not null default 0,
  is_visible boolean not null default true
);

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  sort_order int not null default 0,
  is_visible boolean not null default true
);

create table if not exists public.portfolio_categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  cover_url text,
  sort_order int not null default 0,
  is_visible boolean not null default true
);

create table if not exists public.portfolio_items (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.portfolio_categories (id) on delete cascade,
  brand_id uuid references public.brands (id) on delete set null,
  image_url text not null,
  alt_text text not null default '',
  caption text,
  year smallint,
  is_featured boolean not null default false,
  is_visible boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists portfolio_items_category_idx on public.portfolio_items (category_id, sort_order);

-- ---------------------------------------------------------------
-- Brand enquiries (public can insert only; admin reads)
-- ---------------------------------------------------------------
create table if not exists public.enquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 100),
  brand text check (brand is null or char_length(brand) <= 120),
  email text not null check (char_length(email) between 5 and 200 and email like '%_@_%.__%'),
  message text not null check (char_length(message) between 10 and 2000),
  status text not null default 'new' check (status in ('new', 'replied', 'booked', 'archived')),
  created_at timestamptz not null default now()
);

create index if not exists enquiries_created_idx on public.enquiries (created_at desc);

-- ---------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------
alter table public.admin_users enable row level security;
alter table public.profile enable row level security;
alter table public.stats enable row level security;
alter table public.brands enable row level security;
alter table public.services enable row level security;
alter table public.portfolio_categories enable row level security;
alter table public.portfolio_items enable row level security;
alter table public.enquiries enable row level security;

-- admin_users: admins can see the list; nobody can edit it from the client
create policy "admins read admin_users" on public.admin_users
  for select to authenticated using (public.is_admin());

-- Public read, admin write: content tables
create policy "public read profile" on public.profile
  for select to anon, authenticated using (true);
create policy "admin write profile" on public.profile
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "public read stats" on public.stats
  for select to anon, authenticated using (is_visible or public.is_admin());
create policy "admin write stats" on public.stats
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "public read brands" on public.brands
  for select to anon, authenticated using (is_visible or public.is_admin());
create policy "admin write brands" on public.brands
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "public read services" on public.services
  for select to anon, authenticated using (is_visible or public.is_admin());
create policy "admin write services" on public.services
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "public read categories" on public.portfolio_categories
  for select to anon, authenticated using (is_visible or public.is_admin());
create policy "admin write categories" on public.portfolio_categories
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "public read items" on public.portfolio_items
  for select to anon, authenticated using (is_visible or public.is_admin());
create policy "admin write items" on public.portfolio_items
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Enquiries: anyone can submit (status forced to 'new'); only admin can read or manage
create policy "public insert enquiries" on public.enquiries
  for insert to anon, authenticated with check (status = 'new');
create policy "admin read enquiries" on public.enquiries
  for select to authenticated using (public.is_admin());
create policy "admin update enquiries" on public.enquiries
  for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admin delete enquiries" on public.enquiries
  for delete to authenticated using (public.is_admin());

-- ---------------------------------------------------------------
-- Storage: public-read bucket for portfolio photos, admin upload
-- ---------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('portfolio', 'portfolio', true)
on conflict (id) do nothing;

create policy "public read portfolio files" on storage.objects
  for select to anon, authenticated using (bucket_id = 'portfolio');
create policy "admin upload portfolio files" on storage.objects
  for insert to authenticated with check (bucket_id = 'portfolio' and public.is_admin());
create policy "admin update portfolio files" on storage.objects
  for update to authenticated using (bucket_id = 'portfolio' and public.is_admin());
create policy "admin delete portfolio files" on storage.objects
  for delete to authenticated using (bucket_id = 'portfolio' and public.is_admin());
