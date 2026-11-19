import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router";
import { expect, test } from "vitest";

import { getNavigation } from "../src/locales/navigation.ts";
import { Home } from "../src/pages/Home.tsx";

test.each([
	{
		path: "/",
		language: "en",
		first: "Two girls.",
		second: "Same vision.",
		alt: "The two estheticians behind Bare Skin Co and Cherry Glow Studio, standing back to back",
		meet: "Get to know us",
	},
	{
		path: "/es",
		language: "es",
		first: "Dos chicas.",
		second: "Una misma visión.",
		alt: "Las dos esteticistas detrás de Bare Skin Co y Cherry Glow Studio, espalda con espalda",
		meet: "Conócenos",
	},
] as const)(
	"homepage at $path has a translated about section the About link can reach",
	({ path, language, first, second, alt, meet }) => {
		const html = renderToStaticMarkup(
			createElement(
				MemoryRouter,
				{ initialEntries: [path] },
				createElement(Home),
			),
		);
		const aboutLink = getNavigation(language).find(
			({ to }) => to === "#about",
		);
		expect(aboutLink).toBeDefined();
		expect(html).toContain('id="about"');
		expect(html).toContain(`>${first}</span>`);
		expect(html).toContain(`>${second}</span>`);
		expect(html).toContain(`alt="${alt}"`);
		// The label names the list, so each name is announced as a way to meet her.
		expect(html).toMatch(
			new RegExp(`<p id="vision-meet"[^>]*>${meet}</p>`, "u"),
		);
		expect(html).toContain('aria-labelledby="vision-meet"');
		// Each link's accessible name is just the studio; the arrow is hidden.
		const names = Array.from(
			html.matchAll(/<a href="([^"]*)"[^>]*>(.*?)<\/a>/gu),
			([, href = "", inner = ""]) => ({
				href,
				name: inner.replaceAll(
					/<svg\b[^>]*aria-hidden="true".*?<\/svg>/gu,
					"",
				),
			}),
		).filter(({ name }) => /Bare Skin Co|Cherry Glow Studio/u.test(name));
		expect(names).toEqual([
			{ href: "#", name: "Bare Skin Co" },
			{ href: "#", name: "Cherry Glow Studio" },
		]);
	},
);
