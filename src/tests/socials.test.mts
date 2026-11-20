import type { ReactNode } from "react";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router";
import { expect, test } from "vitest";

import { Footer } from "../components/Footer.tsx";
import { Header } from "../components/Header.tsx";
import { socialLinks } from "../config/site.ts";

function render(path: string, component: () => ReactNode) {
	return renderToStaticMarkup(
		createElement(
			MemoryRouter,
			{ initialEntries: [path] },
			createElement(component),
		),
	);
}

/** Each profile link's href, keyed by its accessible name. */
function profiles(html: string): Record<string, string> {
	const links: Record<string, string> = {};
	for (const [, href = "", label = ""] of html.matchAll(
		/<a href="([^"]+)" target="_blank" rel="noreferrer"[^>]*aria-label="([^"]+)"/gu,
	)) {
		links[label] = href;
	}
	return links;
}

const english = {
	"Bare Skin Co on Instagram": socialLinks.bareSkinCo.instagram,
	"Cherry Glow Studio on Instagram": socialLinks.cherryGlowStudio.instagram,
	"Bare Skin Co on TikTok": socialLinks.bareSkinCo.tiktok,
	"Cherry Glow Studio on TikTok": socialLinks.cherryGlowStudio.tiktok,
};

test.each([
	{ name: "Header", component: Header },
	{ name: "Footer", component: Footer },
])(
	"$name links every studio's own profile on every platform",
	({ component }) => {
		const html = render("/", component);
		expect(profiles(html)).toMatchObject(english);
	},
);

test.each([
	{ name: "Header", component: Header },
	{ name: "Footer", component: Footer },
])(
	"$name social buttons start closed and each controls its own folded card",
	({ component }) => {
		const html = render("/", component);
		const buttons = Array.from(
			html.matchAll(
				/<button type="button" aria-label="Follow us on (\w+)" aria-expanded="false" aria-controls="([^"]+)"/gu,
			),
			([, platform, controls]) => ({ platform, controls }),
		);
		expect(buttons.map(({ platform }) => platform)).toEqual([
			"Instagram",
			"TikTok",
		]);
		for (const { controls } of buttons) {
			expect(html).toMatch(
				new RegExp(`<div id="${controls}" inert=""`, "u"),
			);
		}
	},
);
