-- Davetiyeler (taslak → ödeme → yayın) ve misafir hesap temizliği
-- Supabase → SQL Editor'da bir kez çalıştırın.
--
-- Önce Supabase panelinde:
--   Authentication → Sign In / Providers → "Allow anonymous sign-ins" AÇIK
--   Authentication → Sign In / Providers → Email AÇIK (magic link)
--   (Google için) Providers → Google + Authentication → "Allow manual linking" AÇIK
--   Authentication → URL Configuration → Redirect URLs: https://birhaberimizvar.com/panel/

create table if not exists public.davetiyeler (
  id          uuid primary key default gen_random_uuid(),
  owner       uuid not null default auth.uid() references auth.users (id) on delete cascade,
  slug        text unique check (slug ~ '^[a-z0-9-]{3,60}$'),
  title       text check (char_length(title) <= 120),
  template    text not null default 'kapi',
  data        jsonb not null default '{}'::jsonb,           -- event-config içeriği (isimler, tarihler…)
  status      text not null default 'taslak'
              check (status in ('taslak', 'odeme_bekliyor', 'yayinda')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists davetiyeler_owner_idx on public.davetiyeler (owner);

-- updated_at otomatik
create or replace function public.touch_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end $$;

drop trigger if exists davetiyeler_touch on public.davetiyeler;
create trigger davetiyeler_touch before update on public.davetiyeler
  for each row execute function public.touch_updated_at();

alter table public.davetiyeler enable row level security;

-- Sahibi (misafir ya da gerçek hesap) kendi davetiyelerini görür
drop policy if exists "Sahibi okur" on public.davetiyeler;
create policy "Sahibi okur" on public.davetiyeler
  for select to authenticated
  using (owner = auth.uid());

-- Yayındaki davetiyeyi herkes görür (davetiye sayfası için)
drop policy if exists "Yayindakini herkes okur" on public.davetiyeler;
create policy "Yayindakini herkes okur" on public.davetiyeler
  for select to anon, authenticated
  using (status = 'yayinda');

-- Taslak oluşturma: yalnızca kendi adına ve yalnızca 'taslak' olarak
drop policy if exists "Sahibi taslak ekler" on public.davetiyeler;
create policy "Sahibi taslak ekler" on public.davetiyeler
  for insert to authenticated
  with check (owner = auth.uid() and status = 'taslak');

-- Düzenleme: kendi davetiyesi; durumu istemci 'yayinda' yapamaz.
-- (Yayına alma, ödeme onayından sonra sunucu tarafında service_role ile yapılmalı.)
drop policy if exists "Sahibi duzenler" on public.davetiyeler;
create policy "Sahibi duzenler" on public.davetiyeler
  for update to authenticated
  using (owner = auth.uid())
  with check (owner = auth.uid() and status in ('taslak', 'odeme_bekliyor'));

-- Silme: yalnızca yayında olmayanlar
drop policy if exists "Sahibi taslagi siler" on public.davetiyeler;
create policy "Sahibi taslagi siler" on public.davetiyeler
  for delete to authenticated
  using (owner = auth.uid() and status <> 'yayinda');

-- Ödemeye geçiş yalnızca e-postası doğrulanmış (anonim olmayan) hesaplarda.
-- RLS'e ek olarak kısıtlayıcı politika:
drop policy if exists "Odeme icin dogrulanmis hesap" on public.davetiyeler;
create policy "Odeme icin dogrulanmis hesap" on public.davetiyeler
  as restrictive for update to authenticated
  using (true)
  with check (
    status = 'taslak'
    or coalesce((auth.jwt() ->> 'is_anonymous')::boolean, false) = false
  );


-- ─────────────────────────────────────────────────────────────
-- Misafir hesap temizliği: 30 günden eski, e-posta bağlanmamış anonim
-- kullanıcıları (ve cascade ile taslaklarını) siler.
-- Database → Extensions → pg_cron'u açtıktan sonra çalıştırın.
-- ─────────────────────────────────────────────────────────────
-- select cron.schedule(
--   'misafir-temizligi',
--   '0 4 * * 0',   -- her pazar 04:00
--   $$ delete from auth.users
--      where is_anonymous is true
--        and created_at < now() - interval '30 days' $$
-- );
