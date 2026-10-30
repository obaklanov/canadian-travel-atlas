-- Travel Atlas: first private profile table.
-- Run once in your Supabase project's SQL Editor. No passwords or secret keys here.
-- Re-running preserves saved profiles and replaces only the named access policies.
begin;

create table if not exists public.traveller_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nickname text not null check (nickname ~ '^[A-Za-z0-9_]{3,24}$'),
  visited_countries text[] not null default '{}'::text[]
    check (cardinality(visited_countries) <= 249
      and visited_countries <@ array['AFG','ALA','ALB','DZA','ASM','AND','AGO','AIA','ATG','ARG','ARM','ABW','AUS','AUT','AZE','BHS','BHR','BGD','BRB','BLR','BEL','BLZ','BEN','BMU','BTN','BOL','BIH','BWA','BVT','BRA','IOT','VGB','BRN','BGR','BFA','BDI','KHM','CMR','CAN','CPV','BES','CYM','CAF','TCD','CHL','CHN','CXR','CCK','COL','COM','COK','CRI','HRV','CUB','CUW','CYP','CZE','DNK','DJI','DMA','DOM','COD','ECU','EGY','SLV','GNQ','ERI','EST','SWZ','ETH','FLK','FRO','FJI','FIN','FRA','GUF','PYF','ATF','GAB','GMB','GEO','DEU','GHA','GIB','GRC','GRL','GRD','GLP','GUM','GTM','GGY','GIN','GNB','GUY','HTI','HMD','HND','HKG','HUN','ISL','IND','IDN','IRN','IRQ','IRL','IMN','ISR','ITA','CIV','JAM','JPN','JEY','JOR','KAZ','KEN','KIR','UNK','KWT','KGZ','LAO','LVA','LBN','LSO','LBR','LBY','LIE','LTU','LUX','MAC','MDG','MWI','MYS','MDV','MLI','MLT','MHL','MTQ','MRT','MUS','MYT','MEX','FSM','MDA','MCO','MNG','MNE','MSR','MAR','MOZ','MMR','NAM','NRU','NPL','NLD','NCL','NZL','NIC','NER','NGA','NIU','NFK','PRK','MKD','MNP','NOR','OMN','PAK','PLW','PSE','PAN','PNG','PRY','PER','PHL','PCN','POL','PRT','PRI','QAT','COG','REU','ROU','RUS','RWA','BLM','SHN','KNA','LCA','MAF','SPM','VCT','WSM','SMR','STP','SAU','SEN','SRB','SYC','SLE','SGP','SXM','SVK','SVN','SLB','SOM','ZAF','SGS','KOR','SSD','ESP','LKA','SDN','SUR','SJM','SWE','CHE','SYR','TWN','TJK','TZA','THA','TLS','TGO','TKL','TON','TTO','TUN','TUR','TKM','TCA','TUV','UGA','UKR','ARE','GBR','USA','UMI','VIR','URY','UZB','VUT','VAT','VEN','VNM','WLF','ESH','YEM','ZMB','ZWE']::text[]),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists traveller_profiles_nickname_unique
  on public.traveller_profiles (lower(nickname));

alter table public.traveller_profiles enable row level security;
revoke all on table public.traveller_profiles from public, anon, authenticated;
grant select, insert, update on table public.traveller_profiles to authenticated;

drop policy if exists "Read my own travel profile" on public.traveller_profiles;
create policy "Read my own travel profile" on public.traveller_profiles
  for select to authenticated using ((select auth.uid()) = id);
drop policy if exists "Create my own travel profile" on public.traveller_profiles;
create policy "Create my own travel profile" on public.traveller_profiles
  for insert to authenticated with check ((select auth.uid()) = id);
drop policy if exists "Update my own travel profile" on public.traveller_profiles;
create policy "Update my own travel profile" on public.traveller_profiles
  for update to authenticated using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

create or replace function public.traveller_profile_timestamp()
returns trigger language plpgsql set search_path = '' as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
revoke all on function public.traveller_profile_timestamp() from public;
drop trigger if exists traveller_profile_updated on public.traveller_profiles;
create trigger traveller_profile_updated before update on public.traveller_profiles
  for each row execute function public.traveller_profile_timestamp();

commit;
