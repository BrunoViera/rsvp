import type { EventRow } from "@/lib/types";

const ONE_HOUR_MS = 60 * 60 * 1000;

export interface EventWindow {
  start: Date;
  end: Date;
  rsvpClosesAt: Date;
}

export function getEventWindow(event: EventRow): EventWindow {
  const start = new Date(event.event_date ?? Date.now());
  const end = new Date(start.getTime() + event.duration_hours * ONE_HOUR_MS);
  const rsvpClosesAt = new Date(start.getTime() - ONE_HOUR_MS);
  return { start, end, rsvpClosesAt };
}

/** Las confirmaciones/edición de RSVP están abiertas hasta 1 hora antes del inicio. */
export function isRsvpOpen(event: EventRow, now: Date = new Date()): boolean {
  return now < getEventWindow(event).rsvpClosesAt;
}

/** La lista de confirmados es pública hasta la hora de finalización del evento. */
export function isConfirmedListVisible(
  event: EventRow,
  now: Date = new Date()
): boolean {
  return now < getEventWindow(event).end;
}
