import { useMatch } from "react-router";

import en from "./en.json";
import es from "./es.json";

export type Language = "en" | "es";

export function useLanguage(): Language {
	return useMatch("/es/*") ? "es" : "en";
}

export const translations = {
	en,
	es,
} satisfies Record<Language, typeof en>;
