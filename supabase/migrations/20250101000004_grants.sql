-- ============================================================
-- Migración 005: permisos (GRANT) sobre las tablas para los roles
-- anon / authenticated de Supabase Auth.
--
-- Esto es necesario además de las políticas de RLS: un GRANT habilita
-- la operación a nivel de tabla, y recién ahí entran a jugar las
-- políticas de RLS para filtrar filas. Sin el GRANT, Postgres devuelve
-- "permission denied for table X" antes de siquiera evaluar RLS.
-- ============================================================

grant usage on schema public to anon, authenticated;

-- events: el host administra los suyos (RLS filtra por host_id),
-- y el público (anon) necesita poder leerlos para /e/[slug].
grant select, insert, update, delete on public.events to authenticated;
grant select on public.events to anon;

-- guests: el host administra sus invitados, y el público (anon) necesita
-- leer/insertar/actualizar para el flujo de RSVP sin login.
grant select, insert, update, delete on public.guests to authenticated;
grant select, insert, update on public.guests to anon;

-- event_collaborators: solo lo usan usuarios logueados (host e invitados).
grant select, insert, update, delete on public.event_collaborators to authenticated;
