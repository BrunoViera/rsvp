"use client";

function WhatsappIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 2a10 10 0 0 0-8.6 15l-1.3 4.7 4.8-1.3A10 10 0 1 0 12 2Zm0 1.8a8.2 8.2 0 1 1-4.2 15.2l-.3-.2-2.8.8.8-2.8-.2-.3A8.2 8.2 0 0 1 12 3.8Zm-3 3.9c-.2 0-.5 0-.7.4-.2.4-.9.9-.9 2.2s.9 2.5 1 2.7c.2.2 1.8 2.9 4.5 3.9 2.2.9 2.7.7 3.2.7.5 0 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2l-.6-.3-1.5-.7c-.2-.1-.4-.1-.5.1l-.7 1c-.2.1-.3.2-.5 0a7.4 7.4 0 0 1-2.2-1.3 8 8 0 0 1-1.5-1.9c-.1-.2 0-.4.1-.5l.5-.5.3-.5v-.5l-.7-1.7c-.2-.4-.4-.4-.5-.4h-.6Z" />
    </svg>
  );
}

/** Arma el mensaje y abre WhatsApp. El origin se lee en el cliente para que
 *  el link sirva igual en local y en producción, como en CopyLinkButton. */
export default function WhatsappButton({
  guestName,
  eventName,
  rsvpPath,
  phone,
}: {
  guestName: string;
  eventName: string;
  rsvpPath: string;
  phone: string;
}) {
  function handleClick() {
    const url = `${window.location.origin}${rsvpPath}`;
    const message = `¡Hola ${guestName}! Te invito a ${eventName} 🎉\n\nAcá podés ver la invitación y confirmar si venís:\n${url}`;
    // El teléfono se guarda ya normalizado a internacional desde PhoneInput.
    // wa.me lo quiere sin "+" ni separadores. Sin número válido, WhatsApp abre
    // el selector de contacto.
    const number = phone.replace(/\D/g, "");
    const target = number
      ? `https://wa.me/${number}?text=${encodeURIComponent(message)}`
      : `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(target, "_blank", "noopener,noreferrer");
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={`Enviar invitación a ${guestName} por WhatsApp`}
      className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-sage/40 px-3 py-1 text-xs font-medium text-sage transition hover:bg-sage/10"
    >
      <WhatsappIcon className="h-3.5 w-3.5" />
      WhatsApp
    </button>
  );
}
