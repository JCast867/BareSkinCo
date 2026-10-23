import type { Language } from "./language.ts";
import { translations } from "./language.ts";

export type Navigation = {
	label: string;
	to: string;
	end: boolean;
};

export function getNavigation(language: Language): readonly Navigation[] {
	const text = translations[language].navigation;
	const prefix = language === "es" ? "/es" : "";
	return [
		{ label: text.home, to: prefix || "/", end: true },
		{ label: text.services, to: `${prefix}/services`, end: false },
		{ label: text.about, to: `${prefix}/about`, end: false },
	];
}
