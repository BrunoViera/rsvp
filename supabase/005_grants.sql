-- ============================================================
-- Migración 005: permisos (GRANT) sobre las tablas para los roles
-- anon / authenticated de Supabase Auth.
-- Ejecutar en: Supabase Dashboard > SQL Editor
-- (normalmente no hace falta en Supabase cloud porque ya viene
-- configurado por defecto, pero no está de más dejarlo explícito)
-- ============================================================

grant usage on schema public to anon, authenticated;

grant select, insert, update, delete on public.events to authenticated;
grant select on public.events to anon;

grant select, insert, update, delete on public.guests to authenticated;
grant select, insert, update on public.guests to anon;

grant select, insert, update, delete on public.event_collaborators to authenticated;
