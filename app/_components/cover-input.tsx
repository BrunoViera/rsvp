"use client";

const MAX_MB = 4;

export default function CoverInput() {
  return (
    <input
      type="file"
      name="cover"
      accept="image/*"
      className="field"
      onChange={(e) => {
        const f = e.target.files?.[0];
        const tooBig = !!f && f.size > MAX_MB * 1024 * 1024;
        e.target.setCustomValidity(
          tooBig ? `La foto pesa más de ${MAX_MB} MB, elegí una más liviana.` : ""
        );
        if (tooBig) e.target.reportValidity();
      }}
    />
  );
}
