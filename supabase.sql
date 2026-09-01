-- MJ Bakery Delights database setup
create extension if not exists pgcrypto;

create table if not exists public.admins (
  email text primary key
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admins a
    where lower(a.email) = lower(coalesce(auth.jwt()->>'email',''))
  );
$$;

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  sort_order integer default 0,
  created_at timestamptz default now()
);

create table if not exists public.gallery (
  id uuid primary key default gen_random_uuid(),
  title text,
  category text not null,
  image_url text not null,
  created_at timestamptz default now()
);

create table if not exists public.specials (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  price numeric(10,2) not null default 0,
  flavour text,
  image_url text not null,
  ends_at date,
  created_at timestamptz default now()
);

alter table public.admins enable row level security;
alter table public.categories enable row level security;
alter table public.gallery enable row level security;
alter table public.specials enable row level security;

create policy "Public can read categories" on public.categories for select using (true);
create policy "Admins manage categories" on public.categories for all using (public.is_admin()) with check (public.is_admin());
create policy "Public can read gallery" on public.gallery for select using (true);
create policy "Admins manage gallery" on public.gallery for all using (public.is_admin()) with check (public.is_admin());
create policy "Public can read specials" on public.specials for select using (true);
create policy "Admins manage specials" on public.specials for all using (public.is_admin()) with check (public.is_admin());
create policy "Admin can see own admin row" on public.admins for select using (public.is_admin());

insert into public.categories (name,sort_order) values
('Wedding Cakes',1),('Party Cakes',2),('Character Cakes',3),('Celebration Cakes',4),('Bento Cakes',5),('Cupcakes',6),('Cupcake Bouquets',7),('Bento + Cupcake Boxes',8)
on conflict (name) do nothing;

-- IMPORTANT: replace this before running, or run your own insert after creating your Auth user.
-- insert into public.admins(email) values ('owner@example.com') on conflict do nothing;

-- STORAGE
insert into storage.buckets (id,name,public,file_size_limit,allowed_mime_types)
values ('bakery-images','bakery-images',true,10485760,array['image/jpeg','image/png','image/webp'])
on conflict (id) do update set public=true;

create policy "Public bakery image read" on storage.objects for select using (bucket_id='bakery-images');
create policy "Admins upload bakery images" on storage.objects for insert with check (bucket_id='bakery-images' and public.is_admin());
create policy "Admins update bakery images" on storage.objects for update using (bucket_id='bakery-images' and public.is_admin());
create policy "Admins delete bakery images" on storage.objects for delete using (bucket_id='bakery-images' and public.is_admin());
