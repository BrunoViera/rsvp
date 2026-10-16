-- ============================================================
-- Migración 008: aprobación automática de invitados por evento
-- Ejecutar en: Supabase Dashboard > SQL Editor
-- ============================================================
--
-- Si el evento tiene auto_approve, quien se agrega solo desde la lista
-- pública entra aprobado y el organizador no tiene que aprobarlo a mano.

alter table public.events
  add column if not exists auto_approve boolean not null default false;

comment on column public.events.auto_approve is
  'true = los invitados que se agregan solos entran aprobados.';

-- ------------------------------------------------------------
-- Un anónimo solo puede insertarse aprobado si el evento lo permite.
-- ------------------------------------------------------------
drop policy if exists "public_self_insert_guest" on public.guests;
create policy "public_self_insert_guest" on public.guests
  for insert with check (
    source = 'self'
    and approved = coalesce(
      (select e.auto_approve from public.events e where e.id = guests.event_id),
      false
    )
  );
