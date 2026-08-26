-- ============================================================
-- Migración 007: aprobación de invitados que se agregan solos
-- Ejecutar en: Supabase Dashboard > SQL Editor
-- ============================================================
--
-- Quien se agrega desde la lista pública (/e/<slug>) queda pendiente de
-- aprobación por el organizador. Los que carga el organizador (o un
-- colaborador) entran aprobados.

alter table public.guests
  add column if not exists approved boolean not null default true;

-- Los que ya se habían agregado solos quedan pendientes de revisión; el resto
-- (cargados por el organizador) se dan por aprobados.
update public.guests set approved = false where source = 'self';

comment on column public.guests.approved is
  'false = se agregó solo y espera aprobación del organizador. Los que carga el organizador entran en true.';

create index if not exists guests_event_approved_idx
  on public.guests(event_id, approved);

-- ------------------------------------------------------------
-- Un anónimo solo puede insertarse como pendiente de aprobación.
-- Sin este check podría mandar approved = true y saltarse la moderación.
-- ------------------------------------------------------------
drop policy if exists "public_self_insert_guest" on public.guests;
create policy "public_self_insert_guest" on public.guests
  for insert with check (source = 'self' and approved = false);
