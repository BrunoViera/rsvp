import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { getMetrics } from "@/lib/metrics";
import { esAdmin } from "@/lib/admin";

function formatHoras(horas: number | null): string {
  if (horas === null) return "—";
  if (horas < 1) return `${Math.round(horas * 60)} min`;
  if (horas < 48) return `${Math.round(horas)} h`;
  return `${Math.round(horas / 24)} días`;
}

function formatFecha(iso: string | null) {
  if (!iso) return "Sin fecha";
  return new Date(iso).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default async function MetricasPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  // Vista interna: no es para todas las cuentas. notFound() en vez de un
  // mensaje de "no autorizado" para no revelar que la ruta existe.
  if (!esAdmin(user.email)) notFound();

  const m = await getMetrics(user.id);

  if (!m || m.totalEventos === 0) {
    return (
      <div>
        <h1 className="font-display text-3xl font-semibold text-ink">
          Métricas
        </h1>
        <p className="mt-4 text-ink/60">
          Cuando tengas eventos con invitados vas a ver acá cuánta gente
          confirma y cuánto tarda en responder.
        </p>
        <Link href="/dashboard/eventos/nuevo" className="btn-primary mt-6 inline-flex">
          Crear un evento
        </Link>
      </div>
    );
  }

  const destacados = [
    {
      label: "Confirman",
      valor: `${m.tasaConfirmacionGlobal}%`,
      nota: `${m.totalConfirmados} de ${m.totalInvitados} invitados`,
    },
    {
      label: "Responden",
      valor: `${m.tasaRespuestaGlobal}%`,
      nota: "confirmando o avisando que no van",
    },
    {
      label: "Tardan en responder",
      valor: formatHoras(m.horasHastaResponder),
      nota: "desde que los cargás",
    },
    {
      label: "Se sumaron solos",
      valor: String(m.invitadosQueSeSumaronSolos),
      nota: "desde el link de la lista",
    },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-ink">Métricas</h1>
      <p className="mt-2 text-sm text-ink/60">
        Cómo responden tus invitados. Los datos salen de tus propios eventos.
      </p>

      <div className="card mt-6 grid grid-cols-2 gap-6 sm:grid-cols-4">
        {destacados.map((d) => (
          <div key={d.label}>
            <p className="font-display text-3xl font-semibold text-ink">
              {d.valor}
            </p>
            <p className="mt-1 text-xs font-medium text-ink/70">{d.label}</p>
            <p className="mt-0.5 text-xs text-ink/45">{d.nota}</p>
          </div>
        ))}
      </div>

      <div className="card mt-4 flex flex-wrap gap-x-8 gap-y-3 text-sm">
        <span>
          <span className="font-medium text-ink/60">Eventos: </span>
          {m.totalEventos}
        </span>
        <span>
          <span className="font-medium text-ink/60">Próximos: </span>
          {m.eventosProximos}
        </span>
        <span>
          <span className="font-medium text-ink/60">Terminados: </span>
          {m.eventosTerminados}
        </span>
        {m.eventosSinInvitados > 0 && (
          <span className="text-coral">
            <span className="font-medium">Sin invitados: </span>
            {m.eventosSinInvitados}
          </span>
        )}
      </div>

      <h2 className="mt-10 font-display text-xl font-semibold text-ink">
        Por evento
      </h2>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[40rem] text-sm">
          <thead>
            <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-ink/40">
              <th className="pb-2 pr-4 font-medium">Evento</th>
              <th className="pb-2 pr-4 font-medium">Fecha</th>
              <th className="pb-2 pr-4 text-right font-medium">Invitados</th>
              <th className="pb-2 pr-4 text-right font-medium">Confirman</th>
              <th className="pb-2 pr-4 text-right font-medium">Responden</th>
              <th className="pb-2 text-right font-medium">Tardan</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {m.porEvento.map((e) => (
              <tr key={e.evento.id}>
                <td className="py-3 pr-4">
                  <Link
                    href={`/dashboard/eventos/${e.evento.id}`}
                    className="font-medium text-ink hover:text-marigold"
                  >
                    {e.evento.name}
                  </Link>
                  {e.terminado && (
                    <span className="ml-2 whitespace-nowrap text-xs text-ink/40">
                      terminado
                    </span>
                  )}
                </td>
                <td className="py-3 pr-4 whitespace-nowrap text-ink/60">
                  {formatFecha(e.evento.event_date)}
                </td>
                <td className="py-3 pr-4 text-right text-ink/70">
                  {e.invitados}
                </td>
                <td className="py-3 pr-4 text-right">
                  <span className="font-medium text-sage">{e.confirmados}</span>
                  {e.invitados > 0 && (
                    <span className="text-ink/40">
                      {" "}
                      ({Math.round((e.confirmados / e.invitados) * 100)}%)
                    </span>
                  )}
                </td>
                <td className="py-3 pr-4 text-right text-ink/70">
                  {e.tasaRespuesta}%
                </td>
                <td className="py-3 text-right text-ink/60">
                  {formatHoras(e.horasHastaResponder)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
