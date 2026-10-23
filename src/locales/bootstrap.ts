import type { Language } from "./language.ts";

export function getBrowserLanguage(language: string): Language {
	return language.split("-")[0]?.toLowerCase() === "es" ? "es" : "en";
}

type Browser = {
	location: Pick<Location, "pathname" | "search" | "hash">;
	history: Pick<History, "state" | "replaceState">;
	navigator: Pick<Navigator, "language">;
	sessionStorage: Pick<Storage, "getItem" | "setItem">;
};

/** Check once per tab; subsequent visits honor the URL, including English. */
export function initializeLanguage(browser: Browser = window) {
	const key = "beauty-space-language-checked";
	try {
		if (browser.sessionStorage.getItem(key) !== null) {
			return;
		}
		browser.sessionStorage.setItem(key, "true");
	} catch {
		// Honor the explicit URL if browser storage is unavailable.
		return;
	}
	if (
		browser.location.pathname === "/" &&
		getBrowserLanguage(browser.navigator.language) === "es"
	) {
		const { search, hash } = browser.location;
		browser.history.replaceState(
			browser.history.state,
			"",
			`/es${search}${hash}`,
		);
	}
}
