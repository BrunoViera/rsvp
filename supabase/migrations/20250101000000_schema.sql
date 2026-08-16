-- ============================================================
-- Esquema para el sistema de RSVP de cumpleaños
-- Migración base (equivalente a supabase/schema.sql)
-- ============================================================

create extension if not exists "pgcrypto";

-- ------------------------------------------------------------
-- Tabla: events
-- ------------------------------------------------------------
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  host_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  event_date timestamptz,
  location text,
  description text,
  slug text not null unique,
  created_at timestamptz not null default now()
);

create index if not exists events_host_id_idx on public.events(host_id);

-- ------------------------------------------------------------
-- Tabla: guests
-- ------------------------------------------------------------
create table if not exists public.guests (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  name text not null,
  phone text,
  description text,
  rsvp_status text not null default 'pending' check (rsvp_status in ('pending', 'confirmed', 'declined')),
  rsvp_token uuid not null default gen_random_uuid() unique,
  source text not null default 'host' check (source in ('host', 'self')),
  responded_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists guests_event_id_idx on public.guests(event_id);
create unique index if not exists guests_rsvp_token_idx on public.guests(rsvp_token);

-- ------------------------------------------------------------
-- RLS
-- ------------------------------------------------------------
alter table public.events enable row level security;
alter table public.guests enable row level security;

-- EVENTS: el organizador ve y administra solo sus propios eventos
create policy "host_select_own_events" on public.events
  for select using (auth.uid() = host_id);

create policy "host_insert_own_events" on public.events
  for insert with check (auth.uid() = host_id);

create policy "host_update_own_events" on public.events
  for update using (auth.uid() = host_id);

create policy "host_delete_own_events" on public.events
  for delete using (auth.uid() = host_id);

-- EVENTS: cualquiera (anon) puede leer un evento puntual por slug
-- (necesario para renderizar la página pública /e/[slug])
create policy "public_select_event_by_slug" on public.events
  for select using (true);

-- GUESTS: el organizador administra los invitados de sus eventos
create policy "host_select_own_guests" on public.guests
  for select using (
    exists (select 1 from public.events e where e.id = guests.event_id and e.host_id = auth.uid())
  );

create policy "host_insert_own_guests" on public.guests
  for insert with check (
    exists (select 1 from public.events e where e.id = guests.event_id and e.host_id = auth.uid())
  );

create policy "host_update_own_guests" on public.guests
  for update using (
    exists (select 1 from public.events e where e.id = guests.event_id and e.host_id = auth.uid())
  );

create policy "host_delete_own_guests" on public.guests
  for delete using (
    exists (select 1 from public.events e where e.id = guests.event_id and e.host_id = auth.uid())
  );

-- GUESTS: acceso público (anon) para el flujo de RSVP.
create policy "public_select_guests" on public.guests
  for select using (true);

-- GUESTS: un invitado anónimo puede agregarse a sí mismo
create policy "public_self_insert_guest" on public.guests
  for insert with check (source = 'self');

-- GUESTS: un invitado anónimo puede actualizar SOLO su propia fila
create policy "public_update_guest_rsvp" on public.guests
  for update using (true);
