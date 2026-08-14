// Turkish-aware slug generation (shared by server code).
//
// Rules (per the Okullar spec):
//   - Lowercase, URL-safe output.
//   - Turkish characters are transliterated correctly (İ→i, I→i, ş→s, ç→c, ...).
//   - The slug is generated ONCE at school creation and then never changes
//     (immutability). The unique resolver below handles collisions by appending
//     a deterministic numeric suffix (abc-koleji, abc-koleji-2, ...). It does
//     NOT implement slug history or redirect infrastructure.

const TURKISH_MAP: Record<string, string> = {
  ı: "i",
  i: "i",
  İ: "i",
  I: "i",
  ş: "s",
  Ş: "s",
  ç: "c",
  Ç: "c",
  ö: "o",
  Ö: "o",
  ü: "u",
  Ü: "u",
  ğ: "g",
  Ğ: "g",
};

export function slugify(input: string): string {
  return input
    .split("")
    .map((ch) => TURKISH_MAP[ch] ?? ch)
    .join("")
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "") // strip remaining diacritics
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-") // non-alphanumeric → single dash
    .replace(/^-+|-+$/g, "") // trim leading/trailing dashes
    .replace(/-{2,}/g, "-") // collapse repeated dashes
    .slice(0, 80);
}

export function generateSlug(input: string): string {
  return slugify(input);
}

// Build a deterministic unique slug given an existing set of slugs.
// Base collisions get a numeric suffix: "abc", "abc-2", "abc-3", ...
export function uniqueSlug(base: string, existing: Set<string>): string {
  const candidate = slugify(base);
  if (!existing.has(candidate)) return candidate;
  let n = 2;
  while (existing.has(`${candidate}-${n}`)) n += 1;
  return `${candidate}-${n}`;
}
