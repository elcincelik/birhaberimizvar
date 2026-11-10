-- LCV (katılım durumu) tablosu — Supabase panelinde SQL Editor'da bir kez çalıştırın.

create table if not exists public.rsvp_responses (
  id          bigint generated always as identity primary key,
  name        text        not null check (char_length(name) between 1 and 80),
  attending   boolean     not null,                       -- true: Orada olacağım! · false: Gelemiyorum
  guest_count smallint    not null default 1 check (guest_count between 0 and 10),
  note        text        check (note is null or char_length(note) <= 300),
  created_at  timestamptz not null default now()
);

alter table public.rsvp_responses enable row level security;

-- Davetliler yalnızca yanıt EKLEYEBİLİR; kimse başkalarının yanıtını okuyamaz.
-- (Yanıtları Supabase panelindeki Table Editor'dan görebilirsiniz.)
drop policy if exists "Davetliler LCV ekleyebilir" on public.rsvp_responses;
create policy "Davetliler LCV ekleyebilir"
  on public.rsvp_responses
  for insert
  to anon, authenticated
  with check (true);

-- Özet görmek için örnek sorgu:
-- select attending, count(*) as yanit, sum(guest_count) as kisi
-- from public.rsvp_responses group by attending;
