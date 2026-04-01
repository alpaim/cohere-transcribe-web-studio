import type { Language } from "@/types";

export const LANGUAGES: Language[] = [
    { code: "en", label: "English", native: "English" },
    { code: "fr", label: "French", native: "Fran\u00E7ais" },
    { code: "de", label: "German", native: "Deutsch" },
    { code: "es", label: "Spanish", native: "Espa\u00F1ol" },
    { code: "it", label: "Italian", native: "Italiano" },
    { code: "pt", label: "Portuguese", native: "Portugu\u00EAs" },
    { code: "nl", label: "Dutch", native: "Nederlands" },
    { code: "pl", label: "Polish", native: "Polski" },
    { code: "el", label: "Greek", native: "\u0395\u03BB\u03BB\u03B7\u03BD\u03B9\u03BA\u03AC" },
    { code: "ar", label: "Arabic", native: "\u0627\u0644\u0639\u0631\u0628\u064A\u0629" },
    { code: "ja", label: "Japanese", native: "\u65E5\u672C\u8A9E" },
    { code: "zh", label: "Chinese", native: "\u4E2D\u6587" },
    { code: "vi", label: "Vietnamese", native: "Ti\u1EBFng Vi\u1EC7t" },
    { code: "ko", label: "Korean", native: "\uD55C\uAD6D\uC5B4" },
];

const FLAG_EMOJI: Record<string, string> = {
    en: "\uD83C\uDDFA\uD83C\uDDF8",
    fr: "\uD83C\uDDEB\uD83C\uDDF7",
    de: "\uD83C\uDDE9\uD83C\uDDEA",
    es: "\uD83C\uDDEA\uD83C\uDDF8",
    it: "\uD83C\uDDEE\uD83C\uDDF9",
    pt: "\uD83C\uDDF5\uD83C\uDDF9",
    nl: "\uD83C\uDDF3\uD83C\uDDF1",
    pl: "\uD83C\uDDF5\uD83C\uDDF1",
    el: "\uD83C\uDDEC\uD83C\uDDF7",
    ar: "\uD83C\uDDF8\uD83C\uDDE6",
    ja: "\uD83C\uDDEF\uD83C\uDDF5",
    zh: "\uD83C\uDDE8\uD83C\uDDF3",
    vi: "\uD83C\uDDFB\uD83C\uDDF3",
    ko: "\uD83C\uDDF0\uD83C\uDDF7",
};

export function getFlagEmoji(langCode: string): string {
    return FLAG_EMOJI[langCode] ?? langCode;
}
