create extension if not exists pgcrypto;

create table if not exists public.companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  trade_name text default '',
  cnpj text default '',
  phone text default '',
  email text not null,
  address text default '',
  city text default '',
  state text default '',
  status text not null default 'active' check (status in ('active', 'inactive')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.units (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  name text not null,
  city text default '',
  address text default '',
  manager text default '',
  phone text default '',
  status text not null default 'active' check (status in ('active', 'inactive')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.sectors (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  unit_id uuid not null references public.units(id) on delete cascade,
  name text not null,
  description text default '',
  status text not null default 'active' check (status in ('active', 'inactive')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  company_id uuid not null references public.companies(id) on delete restrict,
  unit_id uuid not null references public.units(id) on delete restrict,
  sector_id uuid not null references public.sectors(id) on delete restrict,
  name text not null,
  email text not null unique,
  phone text default '',
  role text not null default 'operator' check (role in ('administrator', 'admin', 'manager', 'supervisor', 'operator')),
  position text default '',
  hire_date date,
  status text not null default 'active' check (status in ('active', 'inactive')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_units_company_id on public.units(company_id);
create index if not exists idx_sectors_company_id on public.sectors(company_id);
create index if not exists idx_sectors_unit_id on public.sectors(unit_id);
create index if not exists idx_users_company_id on public.users(company_id);
create index if not exists idx_users_unit_id on public.users(unit_id);
create index if not exists idx_users_sector_id on public.users(sector_id);
