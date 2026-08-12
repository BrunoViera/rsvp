export type RsvpStatus = "pending" | "confirmed" | "declined";
export type GuestSource = "host" | "self";

export interface EventRow {
  id: string;
  host_id: string;
  name: string;
  event_date: string | null;
  location: string | null;
  description: string | null;
  slug: string;
  duration_hours: number;
  cover_photo_url: string | null;
  gift_info: string | null;
  created_at: string;
}

export interface GuestRow {
  id: string;
  event_id: string;
  name: string;
  phone: string | null;
  description: string | null;
  rsvp_status: RsvpStatus;
  rsvp_token: string;
  source: GuestSource;
  responded_at: string | null;
  created_at: string;
}
