-- Agrega coordenadas precisas (elegidas vía Google Places/Maps) al evento.
-- Se guardan además del texto libre en `location`, que se sigue usando
-- como dirección legible para mostrar y para el buscador de Places.
alter table events
  add column if not exists latitude double precision,
  add column if not exists longitude double precision;
