-- ============================================================
-- Migración 006: arreglar el alta pública de invitados (auto-agregarse)
-- Ejecutar en: Supabase Dashboard > SQL Editor
-- ============================================================
--
-- Problema: al agregarse solo a la lista pública (/e/<slug>), un visitante
-- anónimo recibía "permission denied for table event_collaborators".
--
-- Causa: las policies de colaborador sobre `guests` se crearon sin rol, con
-- lo que aplican a `public` (anon incluido). Postgres las evalúa en cada
-- insert y, al hacer el `select` sobre event_collaborators, corta con
-- permission denied antes de llegar a `public_self_insert_guest`, que es la
-- policy que sí habilita el alta.
--
-- Solución: acotar las policies de colaborador al rol `authenticated`. Un
-- visitante anónimo nunca puede ser colaborador, así que no se pierde ningún
-- permiso. Se evita a propósito dar SELECT sobre event_collaborators a anon,
-- que expondría los emails de los co-organizadores.

-- guests: insert / update / delete de colaboradores
drop policy if exists "collaborator_insert_guests" on public.guests;
create policy "collaborator_insert_guests" on public.guests
  for insert to authenticated with check (
    exists (
      select 1 from public.event_collaborators c
      where c.event_id = guests.event_id and c.user_id = auth.uid() and c.status = 'accepted'
    )
  );

drop policy if exists "collaborator_update_guests" on public.guests;
create policy "collaborator_update_guests" on public.guests
  for update to authenticated using (
    exists (
      select 1 from public.event_collaborators c
      where c.event_id = guests.event_id and c.user_id = auth.uid() and c.status = 'accepted'
    )
  );

drop policy if exists "collaborator_delete_guests" on public.guests;
create policy "collaborator_delete_guests" on public.guests
  for delete to authenticated using (
    exists (
      select 1 from public.event_collaborators c
      where c.event_id = guests.event_id and c.user_id = auth.uid() and c.status = 'accepted'
    )
  );

-- events: update de colaboradores (mismo problema al leer un evento público)
drop policy if exists "collaborator_update_events" on public.events;
create policy "collaborator_update_events" on public.events
  for update to authenticated using (
    exists (
      select 1 from public.event_collaborators c
      where c.event_id = events.id and c.user_id = auth.uid() and c.status = 'accepted'
    )
  );
