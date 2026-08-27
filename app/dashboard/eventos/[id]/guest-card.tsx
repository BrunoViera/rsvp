"use client";

import { useState } from "react";
import type { GuestRow } from "@/lib/types";
import CopyLinkButton from "./copy-link-button";
import WhatsappButton from "./whatsapp-button";
import EditGuestForm from "./edit-guest-form";
import SubmitButton from "@/app/_components/submit-button";
import { StatusIcon, NoteIcon, TrashIcon, PencilIcon } from "./guest-icons";
import { STATUS_LABEL, STATUS_CLASS, formatRespondedAt } from "./guest-meta";

/** Card de un invitado. Es cliente porque alterna entre ver y editar. */
export default function GuestCard({
  guest,
  eventName,
  updateAction,
  deleteAction,
  readOnly,
}: {
  guest: GuestRow;
  eventName: string;
  updateAction: (formData: FormData) => void;
  deleteAction: () => void;
  readOnly?: boolean;
}) {
  const [editing, setEditing] = useState(false);

  if (editing && !readOnly) {
    return (
      <div className="rounded-xl border border-marigold/40 bg-marigold/5 p-4">
        <EditGuestForm
          guest={guest}
          action={async (formData) => {
            await updateAction(formData);
            setEditing(false);
          }}
          onCancel={() => setEditing(false)}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col rounded-xl border border-line/70 p-4 transition hover:border-line">

        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <p className="break-words font-medium text-ink">{guest.name}</p>
          {guest.source === "self" && (
            <span className="whitespace-nowrap rounded-full bg-marigold/15 px-2 py-0.5 text-[10px] font-medium text-marigold">
              Se agregó desde el link
            </span>
          )}
        </div>

        {guest.phone && (
          <p className="mt-1 text-xs text-ink/55">{guest.phone}</p>
        )}

        {(guest.description || guest.dietary_restrictions) && (
          <div className="mt-2 flex flex-col gap-1 text-xs text-ink/55">
            {guest.description && (
              <span className="flex items-start gap-1.5">
                <NoteIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ink/35" />
                <span className="break-words">{guest.description}</span>
              </span>
            )}
            {guest.dietary_restrictions && (
              <span className="flex items-start gap-1.5 text-coral/80">
                <span aria-hidden="true">🍽️</span>
                <span className="break-words">
                  {guest.dietary_restrictions}
                </span>
              </span>
            )}
          </div>
        )}

        <div className="mt-3 flex flex-col gap-2 border-t border-line/60 pt-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-3">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span
              className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium ${STATUS_CLASS[guest.rsvp_status]}`}
            >
              <StatusIcon status={guest.rsvp_status} className="h-3 w-3" />
              {STATUS_LABEL[guest.rsvp_status]}
            </span>

            {guest.responded_at && (
              <span className="whitespace-nowrap text-[11px] text-ink/40">
                {guest.rsvp_status === "confirmed"
                  ? "Confirmó"
                  : "Respondió"}{" "}
                el {formatRespondedAt(guest.responded_at)}
              </span>
            )}
          </div>

          {!readOnly && (
        <div className="flex flex-wrap items-center gap-2 sm:ml-auto">
            {guest.phone && (
              <WhatsappButton
                guestName={guest.name}
                eventName={eventName}
                rsvpPath={`/rsvp/${guest.rsvp_token}`}
                phone={guest.phone}
              />
            )}
            <CopyLinkButton
              path={`/rsvp/${guest.rsvp_token}`}
              label="Copiar link"
            />
            <button
          type="button"
          onClick={() => setEditing(true)}
          aria-label={`Editar a ${guest.name}`}
          className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-ink/15 px-3 py-1 text-xs font-medium text-ink/70 transition hover:bg-ink/5"
        >
          <PencilIcon className="h-3.5 w-3.5" />
          Editar
        </button>
        <form action={deleteAction}>
              <SubmitButton
                ariaLabel={`Eliminar a ${guest.name}`}
                className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-coral/30 px-3 py-1 text-xs font-medium text-coral/80 transition hover:bg-coral/10 hover:text-coral"
                pendingText="Eliminando…"
              >
                <TrashIcon className="h-3.5 w-3.5" />
                Eliminar
              </SubmitButton>
            </form>
          </div>
        )}
        </div>
    </div>
  );
}
