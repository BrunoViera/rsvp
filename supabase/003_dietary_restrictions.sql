-- ============================================================
-- Migración 003: restricciones alimentarias del invitado
-- Ejecutar en: Supabase Dashboard > SQL Editor
-- ============================================================

alter table public.guests
  add column if not exists dietary_restrictions text;
