import Link from "next/link";
import Image from "next/image";
import CtaLink from "./_components/cta-link";

const PASOS = [
  {
    numero: "1",
    titulo: "Creá el evento en un minuto",
    texto:
      "Nombre, fecha y lugar. Elegís la dirección en el mapa y queda el punto exacto, no una calle aproximada.",
  },
  {
    numero: "2",
    titulo: "Compartís el link por WhatsApp",
    texto:
      "Cargás la lista del salón y le mandás a cada familia su link personal. O pasás un solo link al grupo y que cada uno busque su nombre.",
  },
  {
    numero: "3",
    titulo: "Ves quién viene, en vivo",
    texto:
      "Confirmados, pendientes y los que no pueden. Con las alergias de cada chico anotadas, sin tener que releer el grupo.",
  },
];

const BENEFICIOS = [
  {
    titulo: "El invitado no se baja nada",
    texto:
      "Toca el link, ve la invitación y confirma. Sin crear cuenta, sin contraseña, sin instalar una app.",
  },
  {
    titulo: "Alergias y restricciones, anotadas",
    texto:
      "Cada familia deja lo que su hijo no puede comer cuando confirma. Llegás al salón con la lista hecha.",
  },
  {
    titulo: "Cómo llegar sin explicaciones",
    texto:
      "La invitación trae el mapa y un botón que abre Google Maps en el punto exacto del salón.",
  },
  {
    titulo: "Lo agendan de una",
    texto:
      "Botón para agregar el cumple a Google Calendar o al calendario del teléfono. Menos olvidos.",
  },
  {
    titulo: "Organizá de a dos",
    texto:
      "Sumá a la otra madre o padre como co-organizador: ven y editan lo mismo que vos.",
  },
  {
    titulo: "Lista para pasarle al salón",
    texto:
      "Un link aparte con solo los confirmados y sus restricciones, para mandarle a quien cocina.",
  },
];

const FAQS = [
  {
    p: "¿Es gratis de verdad?",
    r: "Sí. Podés crear los eventos que quieras, invitar a toda la clase y usar todas las funciones sin pagar nada. No pedimos tarjeta.",
  },
  {
    p: "¿Los invitados tienen que registrarse?",
    r: "No. Tocan el link, ven la invitación y confirman. Es la diferencia entre que te respondan 25 familias o 6.",
  },
  {
    p: "¿Y si no tengo el teléfono de todos?",
    r: "Compartís un único link con la lista. Cada uno busca su nombre y confirma. Si alguien no está, puede pedir sumarse y vos aprobás o rechazás.",
  },
  {
    p: "¿Sirve para algo que no sea un cumpleaños infantil?",
    r: "Sí. Está pensado para cumples, pero funciona igual para un asado, una despedida o cualquier junta donde necesites saber cuántos son.",
  },
  {
    p: "¿Qué pasa con los datos de los chicos?",
    r: "Solo se guarda lo que cargás vos o lo que la familia escribe al confirmar. La lista de confirmados es visible únicamente para quien tenga el link, y deja de estar disponible cuando el evento termina.",
  },
];

function Capture({
  src,
  alt,
  caption,
  width,
  height,
}: {
  src: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
}) {
  return (
    <figure className="flex flex-col gap-3">
      <div className="overflow-hidden rounded-card border border-line bg-white shadow-sm">
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className="h-auto w-full"
        />
      </div>
      <figcaption className="text-center text-xs text-ink/50">
        {caption}
      </figcaption>
    </figure>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
        <span className="font-display text-lg font-semibold text-ink">
          Cumple RSVP
        </span>
        <CtaLink href="/login" ubicacion="header" className="btn-secondary">
          Ingresar
        </CtaLink>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-5xl px-6 pb-16 pt-10 sm:pt-16">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-sage/10 px-3 py-1 text-xs font-medium text-sage">
              Gratis, sin tarjeta
            </span>

            <h1 className="mt-4 font-display text-4xl font-semibold leading-tight text-ink sm:text-5xl">
              El cumple de tu hijo, sin perseguir a nadie por WhatsApp
            </h1>

            <p className="mt-5 max-w-lg font-body text-lg text-ink/70">
              Invitás a los compañeros del colegio con un link, cada familia
              confirma en dos toques y vos ves en todo momento cuántos son y qué
              no pueden comer.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <CtaLink
                href="/login"
                ubicacion="hero"
                className="btn-primary"
              >
                Crear mi primer evento
              </CtaLink>
              <span className="text-sm text-ink/50">
                Se entra con tu correo, sin contraseña.
              </span>
            </div>
          </div>

          <div className="mx-auto w-full max-w-xs">
            <Capture
              src="/capturas/invitacion.png"
              alt="Invitación con la fecha, el mapa del lugar y los botones para confirmar"
              caption="Esto es lo que recibe cada familia."
              width={1040}
              height={2040}
            />
          </div>
        </div>
      </section>

      {/* El problema */}
      <section className="border-y border-line bg-white/40">
        <div className="mx-auto max-w-3xl px-6 py-14 text-center">
          <h2 className="font-display text-2xl font-semibold text-ink">
            Organizar un cumple no debería ser esto
          </h2>
          <p className="mt-4 text-ink/70">
            Treinta mensajes en el grupo del salón. Tres que dicen “ahí
            confirmo” y nunca confirman. La dirección perdida entre audios. Y a
            último momento, la pregunta de siempre: <em>¿al final cuántos son?</em>
          </p>
        </div>
      </section>

      {/* Cómo funciona */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="text-center font-display text-3xl font-semibold text-ink">
          Cómo funciona
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-ink/60">
          Tres pasos. El más largo te lleva un minuto.
        </p>

        <ol className="mt-10 grid gap-8 sm:grid-cols-3">
          {PASOS.map((paso) => (
            <li key={paso.numero} className="flex flex-col gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-marigold/20 font-display text-sm font-semibold text-ink">
                {paso.numero}
              </span>
              <h3 className="font-display text-lg font-semibold text-ink">
                {paso.titulo}
              </h3>
              <p className="text-sm text-ink/65">{paso.texto}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Beneficios */}
      <section className="border-t border-line bg-white/40">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <h2 className="text-center font-display text-3xl font-semibold text-ink">
            Lo que te ahorra
          </h2>

          <div className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            {BENEFICIOS.map((b) => (
              <div key={b.titulo}>
                <h3 className="font-display text-base font-semibold text-ink">
                  {b.titulo}
                </h3>
                <p className="mt-2 text-sm text-ink/65">{b.texto}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Precio */}
      <section className="mx-auto max-w-3xl px-6 py-16 text-center">
        <h2 className="font-display text-3xl font-semibold text-ink">
          Es gratis
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-ink/70">
          Todas las funciones, todos los eventos, todos los invitados que
          necesites. No pedimos tarjeta ni hay una versión “pro” esperándote a
          mitad de camino.
        </p>
        <CtaLink
          href="/login"
          ubicacion="precio"
          className="btn-primary mt-8 inline-flex"
        >
          Crear mi primer evento
        </CtaLink>
      </section>

      {/* Preguntas */}
      <section className="border-t border-line bg-white/40">
        <div className="mx-auto max-w-3xl px-6 py-16">
          <h2 className="text-center font-display text-3xl font-semibold text-ink">
            Preguntas
          </h2>

          <div className="mt-10 flex flex-col divide-y divide-line">
            {FAQS.map((faq) => (
              <details key={faq.p} className="group py-4">
                <summary className="flex cursor-pointer items-center justify-between gap-4 font-medium text-ink marker:content-['']">
                  {faq.p}
                  <span
                    aria-hidden="true"
                    className="shrink-0 text-ink/30 transition group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm text-ink/65">{faq.r}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-3 px-6 py-10 text-center">
          <p className="font-display text-lg font-semibold text-ink">
            Cumple RSVP
          </p>
          <p className="max-w-md text-sm text-ink/55">
            Invitaciones y confirmaciones para cumpleaños, sin planillas ni
            grupos interminables.
          </p>
          <CtaLink
            href="/login"
            ubicacion="footer"
            className="btn-secondary mt-2"
          >
            Empezar
          </CtaLink>
        </div>
      </footer>
    </main>
  );
}
