-- ============================================================
-- Migración 004: co-organizadores (colaboradores) por evento
-- Ejecutar en: Supabase Dashboard > SQL Editor
-- ============================================================

create table if not exists public.event_collaborators (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  invited_email text not null,
  user_id uuid references auth.users(id) on delete set null,
  status text not null default 'pending' check (status in ('pending', 'accepted')),
  created_at timestamptz not null default now(),
  unique (event_id, invited_email)
);

create index if not exists event_collaborators_event_id_idx
  on public.event_collaborators(event_id);

alter table public.event_collaborators enable row level security;

-- ------------------------------------------------------------
-- El dueño del evento administra sus colaboradores
-- ------------------------------------------------------------
create policy "host_select_collaborators" on public.event_collaborators
  for select using (
    exists (select 1 from public.events e where e.id = event_collaborators.event_id and e.host_id = auth.uid())
  );

create policy "host_insert_collaborators" on public.event_collaborators
  for insert with check (
    exists (select 1 from public.events e where e.id = event_collaborators.event_id and e.host_id = auth.uid())
  );

create policy "host_delete_collaborators" on public.event_collaborators
  for delete using (
    exists (select 1 from public.events e where e.id = event_collaborators.event_id and e.host_id = auth.uid())
  );

-- ------------------------------------------------------------
-- El invitado puede ver y aceptar su propia invitación (por email del JWT)
-- ------------------------------------------------------------
create policy "invitee_select_own_invitation" on public.event_collaborators
  for select using (
    lower(invited_email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );

create policy "invitee_accept_own_invitation" on public.event_collaborators
  for update using (
    lower(invited_email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  )
  with check (
    lower(invited_email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );

-- ------------------------------------------------------------
-- Extiende events/guests: un colaborador aceptado tiene los mismos
-- permisos que el dueño (editar evento, agregar/quitar invitados)
-- ------------------------------------------------------------
create policy "collaborator_update_events" on public.events
  for update using (
    exists (
      select 1 from public.event_collaborators c
      where c.event_id = events.id and c.user_id = auth.uid() and c.status = 'accepted'
    )
  );

create policy "collaborator_insert_guests" on public.guests
  for insert with check (
    exists (
      select 1 from public.event_collaborators c
      where c.event_id = guests.event_id and c.user_id = auth.uid() and c.status = 'accepted'
    )
  );

create policy "collaborator_update_guests" on public.guests
  for update using (
    exists (
      select 1 from public.event_collaborators c
      where c.event_id = guests.event_id and c.user_id = auth.uid() and c.status = 'accepted'
    )
  );

create policy "collaborator_delete_guests" on public.guests
  for delete using (
    exists (
      select 1 from public.event_collaborators c
      where c.event_id = guests.event_id and c.user_id = auth.uid() and c.status = 'accepted'
    )
  );
