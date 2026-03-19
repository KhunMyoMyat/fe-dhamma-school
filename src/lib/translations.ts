export type TeachingTranslation = {
  locale: string;
  title: string;
  content?: string | null;
};

const DEFAULT_LOCALE_ORDER = ["mm", "en", "th"];

export function pickTranslation(
  translations: TeachingTranslation[] | undefined,
  preferredLocales: string[] = DEFAULT_LOCALE_ORDER,
) {
  if (!translations || translations.length === 0) return null;

  for (const locale of preferredLocales) {
    const match = translations.find((t) => t.locale === locale);
    if (match) return match;
  }

  return translations[0];
}

export function collectSearchText(translations: TeachingTranslation[] | undefined) {
  if (!translations) return "";
  return translations
    .map((t) => `${t.title || ""} ${t.content || ""}`)
    .join(" ")
    .toLowerCase();
}
