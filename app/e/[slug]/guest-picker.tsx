"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type GuestOption = { id: string; name: string };

export default function GuestPicker({
  guests,
  addSelfAction,
}: {
  guests: GuestOption[];
  addSelfAction: (formData: FormData) => void;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [showAddSelf, setShowAddSelf] = useState(false);

  const filtered = useMemo(() => {
    if (!query.trim()) return guests;
    const q = query.toLowerCase();
    return guests.filter((g) => g.name.toLowerCase().includes(q));
  }, [guests, query]);

  return (
    <div className="card mt-6">
      <label className="mb-1 block text-sm font-medium text-ink/80">
        Buscá tu nombre en la lista
      </label>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Escribí tu nombre..."
        className="field"
      />

      <div className="mt-3 flex max-h-64 flex-col divide-y divide-line overflow-y-auto">
        {filtered.map((g) => (
          <button
            key={g.id}
            type="button"
            onClick={() => router.push(`?guest=${g.id}`)}
            className="py-2 text-left text-sm text-ink hover:text-marigold"
          >
            {g.name}
          </button>
        ))}
        {filtered.length === 0 && (
          <p className="py-2 text-sm text-ink/50">No encontramos ese nombre.</p>
        )}
      </div>

      {!showAddSelf ? (
        <button
          type="button"
          onClick={() => setShowAddSelf(true)}
          className="mt-4 text-sm text-ink/60 underline underline-offset-2 hover:text-ink"
        >
          No encuentro mi nombre
        </button>
      ) : (
        <form action={addSelfAction} className="mt-4 flex flex-col gap-3">
          <label className="text-sm font-medium text-ink/80">
            Escribí tu nombre para agregarte a la lista
          </label>
          <input type="text" name="name" required className="field" />
          <button type="submit" className="btn-secondary self-start">
            Agregarme
          </button>
        </form>
      )}
    </div>
  );
}
