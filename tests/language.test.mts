import type { ComponentProps, ComponentType, ReactNode } from "react";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router";
import { expect, test } from "vitest";

import { DesktopLinks } from "../src/components/DesktopLinks.tsx";
import { Header } from "../src/components/Header.tsx";
import { MenuButton, MobileMenu } from "../src/components/MobileMenu.tsx";
import { initializeLanguage } from "../src/locales/bootstrap.ts";
import { useLanguage } from "../src/locales/language.ts";
import { getNavigation } from "../src/locales/navigation.ts";

type Redirect = {
	state: unknown;
	title: string;
	url: string | URL | null | undefined;
};

type TestBrowser = NonNullable<Parameters<typeof initializeLanguage>[0]> & {
	redirects: Redirect[];
};

function browser(
	pathname: string,
	language: string,
	blocked = false,
): TestBrowser {
	const storage = new Map<string, string>();
	const redirects: Redirect[] = [];
	return {
		location: { pathname, search: "?ref=test", hash: "#content" },
		navigator: { language },
		sessionStorage: {
			getItem(key) {
				if (blocked) {
					throw new Error("Storage blocked");
				}
				return storage.get(key) ?? null;
			},
			setItem: (key, value) => {
				storage.set(key, value);
			},
		},
		history: {
			state: { existing: true },
			replaceState: (state, title, url) => {
				redirects.push({
					state: state as unknown,
					title,
					url,
				});
			},
		},
		redirects,
	};
}

function render(path: string, element: ReactNode) {
	return renderToStaticMarkup(
		createElement(MemoryRouter, { initialEntries: [path] }, element),
	);
}

function LanguageProbe() {
	return createElement("span", null, useLanguage());
}

test("Spanish browser redirect runs once and preserves URL details and history state", () => {
	const environment = browser("/", "es-MX");
	initializeLanguage(environment);
	expect(environment.redirects).toEqual([
		{
			state: { existing: true },
			title: "",
			url: "/es?ref=test#content",
		},
	]);
	// Removing /es and reloading in the same tab must leave English available.
	initializeLanguage(environment);
	expect(environment.redirects).toHaveLength(1);
});

for (const [path, language, blocked] of [
	["/es", "en-US", false],
	["/es/services", "es", false],
	["/services", "es", false],
	["/", "en-US", false],
	["/", "es", true],
] as const) {
	test(`honors explicit URL ${path}, browser ${language}, blocked storage ${blocked}`, () => {
		const environment = browser(path, language, blocked);
		initializeLanguage(environment);
		expect(environment.redirects).toEqual([]);
	});
}

test("direct Spanish entry also prevents a later automatic English override", () => {
	const environment = browser("/es", "es");
	initializeLanguage(environment);
	environment.location.pathname = "/";
	initializeLanguage(environment);
	expect(environment.redirects).toEqual([]);
});

for (const [path, expected] of [
	["/es", "es"],
	["/es/", "es"],
	["/ES/services", "es"],
	["/es/about", "es"],
	["/", "en"],
	["/essential", "en"],
] as const) {
	test(`language follows router matching for ${path}`, () => {
		expect(render(path, createElement(LanguageProbe))).toBe(
			`<span>${expected}</span>`,
		);
	});
}

for (const [language, prefix] of [
	["en", ""],
	["es", "/es"],
] as const) {
	const components: ReadonlyArray<
		ComponentType<ComponentProps<typeof MobileMenu>>
	> = [DesktopLinks, MobileMenu];
	for (const Component of components) {
		for (const [suffix, label] of [
			["", language === "es" ? "Inicio" : "Home"],
			["/services", language === "es" ? "Servicios" : "Services"],
		] as const) {
			const path = `${prefix}${suffix}` || "/";
			test(`${Component.name}: only ${label} is current at ${path}`, () => {
				const html = render(
					path,
					createElement(Component, {
						links: getNavigation(language),
						socials: [],
						isOpen: true,
						onNavigate() {},
					}),
				);
				expect([
					...html.matchAll(/aria-current="page"/gu),
				]).toHaveLength(1);
				const active = html.match(
					/<a\b[^>]*aria-current="page"[^>]*>(.*?)<\/a>/u,
				)?.[1];
				expect(active?.replaceAll(/<[^>]*>/gu, "")).toBe(label);
			});
		}
	}
}

test("Spanish menu accessibility labels are translated and controls reference the real ID", () => {
	const button = render(
		"/es",
		createElement(MenuButton, { ref: null, isOpen: false, onToggle() {} }),
	);
	expect(button).toMatch(/aria-label="Abrir Menú"/u);
	expect(button).toMatch(/aria-controls="mobile-menu"/u);
	const menu = render(
		"/es",
		createElement(MobileMenu, {
			links: getNavigation("es"),
			socials: [],
			isOpen: true,
			onNavigate() {},
		}),
	);
	expect(menu).toMatch(/id="mobile-menu"/u);
	expect(menu).toMatch(/aria-label="Navegación móvil"/u);
});

test("Spanish header translates navigation, social accessibility labels, and complete booking text", () => {
	const html = render("/es", createElement(Header));
	expect(html).toMatch(/aria-label="Navegación principal"/u);
	expect(html).toMatch(/aria-label="Beauty Space Co en Instagram"/u);
	expect(html).toMatch(/>Reservar cita</u);
	expect(html).not.toMatch(/&nbsp;now/u);
});
