import { createClient } from "@/lib/supabase/server";
import type { EventRow, GuestRow } from "@/lib/types";
import { isEventFinished } from "@/lib/event-timing";

export interface EventMetrics {
  evento: EventRow;
  invitados: number;
  confirmados: number;
  rechazaron: number;
  sinResponder: number;
  esperandoAprobacion: number;
  seSumaronSolos: number;
  /** Porcentaje de invitados aprobados que respondieron (confirmando o no). */
  tasaRespuesta: number;
  /** Horas promedio entre la creación del invitado y su respuesta. */
  horasHastaResponder: number | null;
  terminado: boolean;
}

export interface Metrics {
  totalEventos: number;
  eventosProximos: number;
  eventosTerminados: number;
  /** Eventos creados a los que nunca se les cargó un invitado. */
  eventosSinInvitados: number;
  totalInvitados: number;
  totalConfirmados: number;
  tasaRespuestaGlobal: number;
  tasaConfirmacionGlobal: number;
  horasHastaResponder: number | null;
  invitadosQueSeSumaronSolos: number;
  porEvento: EventMetrics[];
}

function promedioHoras(guests: GuestRow[]): number | null {
  const conRespuesta = guests.filter((g) => g.responded_at);
  if (conRespuesta.length === 0) return null;
  const total = conRespuesta.reduce((acc, g) => {
    const creado = new Date(g.created_at).getTime();
    const respondio = new Date(g.responded_at!).getTime();
    return acc + Math.max(0, respondio - creado);
  }, 0);
  return total / conRespuesta.length / (1000 * 60 * 60);
}

function pct(parte: number, total: number): number {
  return total === 0 ? 0 : Math.round((parte / total) * 100);
}

/** Métricas de producto de los eventos del usuario. Sale de la base, no de una
 *  herramienta de analítica: son las preguntas que la analítica web no responde
 *  (¿cuánta gente confirma?, ¿cuántos eventos quedan sin invitados?). */
export async function getMetrics(userId: string): Promise<Metrics | null> {
  const supabase = await createClient();

  const { data: events } = await supabase
    .from("events")
    .select("*")
    .eq("host_id", userId)
    .returns<EventRow[]>();

  if (!events) return null;

  const { data: guests } = await supabase
    .from("guests")
    .select("*")
    .in("event_id", events.length ? events.map((e) => e.id) : ["-"])
    .returns<GuestRow[]>();

  const todos = guests ?? [];

  const porEvento: EventMetrics[] = events
    .map((evento) => {
      const delEvento = todos.filter((g) => g.event_id === evento.id);
      const aprobados = delEvento.filter((g) => g.approved);
      const confirmados = aprobados.filter((g) => g.rsvp_status === "confirmed");
      const rechazaron = aprobados.filter((g) => g.rsvp_status === "declined");

      return {
        evento,
        invitados: aprobados.length,
        confirmados: confirmados.length,
        rechazaron: rechazaron.length,
        sinResponder: aprobados.filter((g) => g.rsvp_status === "pending").length,
        esperandoAprobacion: delEvento.filter((g) => !g.approved).length,
        seSumaronSolos: delEvento.filter((g) => g.source === "self").length,
        tasaRespuesta: pct(
          confirmados.length + rechazaron.length,
          aprobados.length
        ),
        horasHastaResponder: promedioHoras(aprobados),
        terminado: isEventFinished(evento),
      };
    })
    .sort(
      (a, b) =>
        new Date(b.evento.event_date ?? 0).getTime() -
        new Date(a.evento.event_date ?? 0).getTime()
    );

  const aprobados = todos.filter((g) => g.approved);
  const confirmados = aprobados.filter((g) => g.rsvp_status === "confirmed");
  const respondieron = aprobados.filter((g) => g.rsvp_status !== "pending");

  return {
    totalEventos: events.length,
    eventosProximos: events.filter((e) => !isEventFinished(e)).length,
    eventosTerminados: events.filter((e) => isEventFinished(e)).length,
    eventosSinInvitados: porEvento.filter(
      (e) => e.invitados === 0 && e.esperandoAprobacion === 0
    ).length,
    totalInvitados: aprobados.length,
    totalConfirmados: confirmados.length,
    tasaRespuestaGlobal: pct(respondieron.length, aprobados.length),
    tasaConfirmacionGlobal: pct(confirmados.length, aprobados.length),
    horasHastaResponder: promedioHoras(aprobados),
    invitadosQueSeSumaronSolos: todos.filter((g) => g.source === "self").length,
    porEvento,
  };
}
