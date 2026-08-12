"use client";

import { useState } from "react";

export default function CopyLinkButton({
  path,
  label,
}: {
  path: string;
  label: string;
}) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    const url = `${window.location.origin}${path}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="rounded-full border border-ink/15 px-3 py-1 text-xs font-medium text-ink/70 transition hover:bg-ink/5"
    >
      {copied ? "¡Copiado!" : label}
    </button>
  );
}
