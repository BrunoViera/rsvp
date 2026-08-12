import { customAlphabet } from "nanoid";

const nanoid = customAlphabet(
  "0123456789abcdefghijklmnopqrstuvwxyz",
  6
);

export function generateSlug(name: string): string {
  const base = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // saca tildes
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 40);

  return `${base || "evento"}-${nanoid()}`;
}
