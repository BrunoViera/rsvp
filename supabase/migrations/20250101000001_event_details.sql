-- ============================================================
-- Migración 002: detalles de evento (duración, portada, regalo)
-- ============================================================

alter table public.events
  add column if not exists duration_hours numeric not null default 3,
  add column if not exists cover_photo_url text,
  add column if not exists gift_info text;

insert into storage.buckets (id, name, public)
values ('event-covers', 'event-covers', true)
on conflict (id) do nothing;

create policy "public_read_event_covers" on storage.objects
  for select using (bucket_id = 'event-covers');

create policy "auth_upload_own_event_covers" on storage.objects
  for insert with check (
    bucket_id = 'event-covers'
    and auth.role() = 'authenticated'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "auth_update_own_event_covers" on storage.objects
  for update using (
    bucket_id = 'event-covers'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "auth_delete_own_event_covers" on storage.objects
  for delete using (
    bucket_id = 'event-covers'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
