import type { EventRow } from "@/lib/types";

function toUtcStamp(date: Date): string {
  return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

function getEventRange(event: EventRow): { start: Date; end: Date } {
  const start = new Date(event.event_date ?? Date.now());
  const end = new Date(start.getTime() + event.duration_hours * 60 * 60 * 1000);
  return { start, end };
}

export function buildGoogleCalendarUrl(event: EventRow): string {
  const { start, end } = getEventRange(event);

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.name,
    dates: `${toUtcStamp(start)}/${toUtcStamp(end)}`,
  });
  if (event.location) params.set("location", event.location);
  if (event.description) params.set("details", event.description);

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function escapeIcsText(text: string): string {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
}

export function buildIcsDataUri(event: EventRow): string {
  const { start, end } = getEventRange(event);
  const uid = `${event.id}@elcumplede.com`;

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//El cumple de//ES",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${toUtcStamp(new Date())}`,
    `DTSTART:${toUtcStamp(start)}`,
    `DTEND:${toUtcStamp(end)}`,
    `SUMMARY:${escapeIcsText(event.name)}`,
    event.location ? `LOCATION:${escapeIcsText(event.location)}` : null,
    event.description ? `DESCRIPTION:${escapeIcsText(event.description)}` : null,
    "END:VEVENT",
    "END:VCALENDAR",
  ].filter((line): line is string => Boolean(line));

  const ics = lines.join("\r\n");
  return `data:text/calendar;charset=utf-8,${encodeURIComponent(ics)}`;
}

export function buildDirectionsUrl(
  location: string,
  coords?: { lat: number; lng: number } | null
): string {
  const destination = coords
    ? `${coords.lat},${coords.lng}`
    : encodeURIComponent(location);
  return `https://www.google.com/maps/dir/?api=1&destination=${destination}`;
}
