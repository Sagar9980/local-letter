// Locale codes are a small BCP-47 subset: a 2-3 letter language, optionally
// followed by a region ("en-US"), script ("zh-Hant"), or variant subtag.
export const LOCALE_PATTERN = /^[a-z]{2,3}(-[a-z0-9]{2,8})?$/i;

// Normalises casing so "EN-us" and "en-US" can't become two separate locales
// on the same template (the [templateId, locale] unique index is exact-match).
export function normalizeLocale(value: string): string {
  const [language, subtag] = value.trim().split("-");
  const lang = language.toLowerCase();
  if (!subtag) return lang;

  // 2 letters is a region (US), 4 is a script (Hant); anything else stays lowercase.
  const suffix =
    subtag.length === 2
      ? subtag.toUpperCase()
      : subtag.length === 4
        ? subtag[0].toUpperCase() + subtag.slice(1).toLowerCase()
        : subtag.toLowerCase();

  return `${lang}-${suffix}`;
}
