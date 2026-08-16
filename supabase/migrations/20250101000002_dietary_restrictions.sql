-- ============================================================
-- Migración 003: restricciones alimentarias del invitado
-- ============================================================

alter table public.guests
  add column if not exists dietary_restrictions text;
