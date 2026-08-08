-- ChargeShare Supabase schema + seed (60+ member database)
-- HOW TO USE: Supabase Dashboard -> SQL Editor -> New query -> paste this -> Run.

-- 1) members table (the shared 60+ person database + live signups)
create table if not exists public.members (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  full_name text not null,
  phone text,
  email text,
  vehicle text,
  battery int default 50,
  is_seed boolean default false,
  created_at timestamptz default now()
);

-- 2) reservations table
create table if not exists public.reservations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  station_name text,
  charger_name text,
  power int,
  time_slot text,
  fee int,
  ref_code text,
  status text default 'confirmed',
  created_at timestamptz default now()
);

-- 3) Row Level Security
alter table public.members enable row level security;
alter table public.reservations enable row level security;

create policy "Members: public read" on public.members for select using (true);
create policy "Members: own insert" on public.members for insert with check (auth.uid() = user_id or user_id is null);
create policy "Members: own update" on public.members for update using (auth.uid() = user_id);

create policy "Reservations: owner read" on public.reservations for select using (auth.uid() = user_id);
create policy "Reservations: owner insert" on public.reservations for insert with check (auth.uid() = user_id);
create policy "Reservations: owner update" on public.reservations for update using (auth.uid() = user_id);
create policy "Reservations: owner delete" on public.reservations for delete using (auth.uid() = user_id);

-- 4) Seed the 60+ member database (demo data)
insert into public.members (full_name, phone, email, vehicle, battery, is_seed, created_at) values
('Abel', '09 10 10 10', 'abel.0@demo.chargeshare.et', 'BYD Dolphin', 12, true, now() - interval '1 days'),
('Sara', '09 17 23 39', 'sara.1@demo.chargeshare.et', 'BYD Atto 3', 29, true, now() - interval '2 days'),
('Mekdes', '09 24 36 68', 'mekdes.2@demo.chargeshare.et', 'Tesla Model 3', 46, true, now() - interval '3 days'),
('Yonas', '09 31 49 97', 'yonas.3@demo.chargeshare.et', 'Hyundai Kona Electric', 63, true, now() - interval '4 days'),
('Hanna', '09 38 62 37', 'hanna.4@demo.chargeshare.et', 'Geely Geometry C', 80, true, now() - interval '5 days'),
('Dawit', '09 45 75 66', 'dawit.5@demo.chargeshare.et', 'BYD Seal', 12, true, now() - interval '6 days'),
('Bethel', '09 52 88 95', 'bethel.6@demo.chargeshare.et', 'Nissan Leaf', 29, true, now() - interval '7 days'),
('Natnael', '09 59 12 35', 'natnael.7@demo.chargeshare.et', 'Tesla Model Y', 46, true, now() - interval '8 days'),
('Liya', '09 66 25 64', 'liya.8@demo.chargeshare.et', 'BYD Dolphin', 63, true, now() - interval '9 days'),
('Tigist', '09 73 38 93', 'tigist.9@demo.chargeshare.et', 'BYD Atto 3', 80, true, now() - interval '10 days'),
('Ermias', '09 80 51 33', 'ermias.10@demo.chargeshare.et', 'Tesla Model 3', 12, true, now() - interval '11 days'),
('Selam', '09 87 64 62', 'selam.11@demo.chargeshare.et', 'Hyundai Kona Electric', 29, true, now() - interval '12 days'),
('Kalkidan', '09 94 77 91', 'kalkidan.12@demo.chargeshare.et', 'Geely Geometry C', 46, true, now() - interval '13 days'),
('Michael', '09 12 90 31', 'michael.13@demo.chargeshare.et', 'BYD Seal', 63, true, now() - interval '14 days'),
('Ruth', '09 19 14 60', 'ruth.14@demo.chargeshare.et', 'Nissan Leaf', 80, true, now() - interval '15 days'),
('Samuel', '09 26 27 89', 'samuel.15@demo.chargeshare.et', 'Tesla Model Y', 12, true, now() - interval '16 days'),
('Tsion', '09 33 40 29', 'tsion.16@demo.chargeshare.et', 'BYD Dolphin', 29, true, now() - interval '17 days'),
('Bereket', '09 40 53 58', 'bereket.17@demo.chargeshare.et', 'BYD Atto 3', 46, true, now() - interval '18 days'),
('Mahlet', '09 47 66 87', 'mahlet.18@demo.chargeshare.et', 'Tesla Model 3', 63, true, now() - interval '19 days'),
('Girmay', '09 54 79 27', 'girmay.19@demo.chargeshare.et', 'Hyundai Kona Electric', 80, true, now() - interval '20 days'),
('Hiwot', '09 61 92 56', 'hiwot.20@demo.chargeshare.et', 'Geely Geometry C', 12, true, now() - interval '21 days'),
('Daniel', '09 68 16 85', 'daniel.21@demo.chargeshare.et', 'BYD Seal', 29, true, now() - interval '22 days'),
('Bethlehem', '09 75 29 25', 'bethlehem.22@demo.chargeshare.et', 'Nissan Leaf', 46, true, now() - interval '23 days'),
('Solomon', '09 82 42 54', 'solomon.23@demo.chargeshare.et', 'Tesla Model Y', 63, true, now() - interval '24 days'),
('Meron', '09 89 55 83', 'meron.24@demo.chargeshare.et', 'BYD Dolphin', 80, true, now() - interval '25 days'),
('Fikru', '09 96 68 23', 'fikru.25@demo.chargeshare.et', 'BYD Atto 3', 12, true, now() - interval '26 days'),
('Rahel', '09 14 81 52', 'rahel.26@demo.chargeshare.et', 'Tesla Model 3', 29, true, now() - interval '27 days'),
('Amanuel', '09 21 94 81', 'amanuel.27@demo.chargeshare.et', 'Hyundai Kona Electric', 46, true, now() - interval '28 days'),
('Helen', '09 28 18 21', 'helen.28@demo.chargeshare.et', 'Geely Geometry C', 63, true, now() - interval '29 days'),
('Yosef', '09 35 31 50', 'yosef.29@demo.chargeshare.et', 'BYD Seal', 80, true, now() - interval '30 days'),
('Kidist', '09 42 44 79', 'kidist.30@demo.chargeshare.et', 'Nissan Leaf', 12, true, now() - interval '31 days'),
('Tewodros', '09 49 57 19', 'tewodros.31@demo.chargeshare.et', 'Tesla Model Y', 29, true, now() - interval '32 days'),
('Emebet', '09 56 70 48', 'emebet.32@demo.chargeshare.et', 'BYD Dolphin', 46, true, now() - interval '33 days'),
('Zerihun', '09 63 83 77', 'zerihun.33@demo.chargeshare.et', 'BYD Atto 3', 63, true, now() - interval '34 days'),
('Selamawit', '09 70 96 17', 'selamawit.34@demo.chargeshare.et', 'Tesla Model 3', 80, true, now() - interval '35 days'),
('Alemayehu', '09 77 20 46', 'alemayehu.35@demo.chargeshare.et', 'Hyundai Kona Electric', 12, true, now() - interval '36 days'),
('Blossom', '09 84 33 75', 'blossom.36@demo.chargeshare.et', 'Geely Geometry C', 29, true, now() - interval '37 days'),
('Getachew', '09 91 46 15', 'getachew.37@demo.chargeshare.et', 'BYD Seal', 46, true, now() - interval '38 days'),
('Winta', '09 98 59 44', 'winta.38@demo.chargeshare.et', 'Nissan Leaf', 63, true, now() - interval '39 days'),
('Binyam', '09 16 72 73', 'binyam.39@demo.chargeshare.et', 'Tesla Model Y', 80, true, now() - interval '40 days'),
('Lidia', '09 23 85 13', 'lidia.40@demo.chargeshare.et', 'BYD Dolphin', 12, true, now() - interval '41 days'),
('Tekle', '09 30 98 42', 'tekle.41@demo.chargeshare.et', 'BYD Atto 3', 29, true, now() - interval '42 days'),
('Abebech', '09 37 22 71', 'abebech.42@demo.chargeshare.et', 'Tesla Model 3', 46, true, now() - interval '43 days'),
('Mulugeta', '09 44 35 11', 'mulugeta.43@demo.chargeshare.et', 'Hyundai Kona Electric', 63, true, now() - interval '44 days'),
('Azeb', '09 51 48 40', 'azeb.44@demo.chargeshare.et', 'Geely Geometry C', 80, true, now() - interval '45 days'),
('Haile', '09 58 61 69', 'haile.45@demo.chargeshare.et', 'BYD Seal', 12, true, now() - interval '46 days'),
('Saba', '09 65 74 98', 'saba.46@demo.chargeshare.et', 'Nissan Leaf', 29, true, now() - interval '47 days'),
('Mohammed', '09 72 87 38', 'mohammed.47@demo.chargeshare.et', 'Tesla Model Y', 46, true, now() - interval '48 days'),
('Zewdie', '09 79 11 67', 'zewdie.48@demo.chargeshare.et', 'BYD Dolphin', 63, true, now() - interval '49 days'),
('Frehiwot', '09 86 24 96', 'frehiwot.49@demo.chargeshare.et', 'BYD Atto 3', 80, true, now() - interval '50 days'),
('Ashenafi', '09 93 37 36', 'ashenafi.50@demo.chargeshare.et', 'Tesla Model 3', 12, true, now() - interval '51 days'),
('Muluken', '09 11 50 65', 'muluken.51@demo.chargeshare.et', 'Hyundai Kona Electric', 29, true, now() - interval '52 days'),
('Biruk', '09 18 63 94', 'biruk.52@demo.chargeshare.et', 'Geely Geometry C', 46, true, now() - interval '53 days'),
('Fitsum', '09 25 76 34', 'fitsum.53@demo.chargeshare.et', 'BYD Seal', 63, true, now() - interval '54 days'),
('Gadise', '09 32 89 63', 'gadise.54@demo.chargeshare.et', 'Nissan Leaf', 80, true, now() - interval '55 days'),
('Abate', '09 39 13 92', 'abate.55@demo.chargeshare.et', 'Tesla Model Y', 12, true, now() - interval '56 days'),
('Kiya', '09 46 26 32', 'kiya.56@demo.chargeshare.et', 'BYD Dolphin', 29, true, now() - interval '57 days'),
('Leul', '09 53 39 61', 'leul.57@demo.chargeshare.et', 'BYD Atto 3', 46, true, now() - interval '58 days'),
('Robi', '09 60 52 90', 'robi.58@demo.chargeshare.et', 'Tesla Model 3', 63, true, now() - interval '59 days'),
('Hana', '09 74 78 59', 'hana.x0@demo.chargeshare.et', 'BYD Seal', 38, true, now() - interval '61 days'),
('Tesfa', '09 81 91 88', 'tesfa.x1@demo.chargeshare.et', 'Tesla Model Y', 72, true, now() - interval '62 days'),
('Biti', '09 88 15 28', 'biti.x2@demo.chargeshare.et', 'Nissan Leaf', 19, true, now() - interval '63 days'),
('Eyoel', '09 95 28 57', 'eyoel.x3@demo.chargeshare.et', 'BYD Atto 3', 51, true, now() - interval '64 days'),
('Samrawit', '09 13 41 86', 'samrawit.x4@demo.chargeshare.et', 'Geely Geometry C', 64, true, now() - interval '65 days'),
('Natnael2', '09 20 54 26', 'natnael2.x5@demo.chargeshare.et', 'Hyundai Kona Electric', 27, true, now() - interval '66 days');


-- 5) Auto-create a members row for new auth signups
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as \$\$
begin
  insert into public.members (user_id, full_name, email, is_seed)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', new.email), new.email, false)
  on conflict do nothing;
  return new;
end;
\$\$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
for each row execute function public.handle_new_user();
