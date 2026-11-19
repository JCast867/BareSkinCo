import type { Language } from "./language.ts";
import { translations } from "./language.ts";

export type Navigation = {
	label: string;
	to: string;
};

export function getNavigation(language: Language): readonly Navigation[] {
	const text = translations[language].navigation;
	return [
		{ label: text.home, to: "#" },
		{ label: text.services, to: "#services" },
		{ label: text.about, to: "#about" },
	];
}
