import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router";
import { expect, test } from "vitest";

import { Home } from "../src/pages/Home.tsx";

test.each([
	{
		path: "/",
		heading: "Why choose us",
		points: [
			"Clean &amp; safe practices",
			"Comfortable &amp; welcoming space",
			"Quality results that last",
			"Two professionals, more flexibility",
		],
	},
	{
		path: "/es",
		heading: "Por qué elegirnos",
		points: [
			"Prácticas limpias y seguras",
			"Un espacio cómodo y acogedor",
			"Resultados de calidad que duran",
			"Dos profesionales, más flexibilidad",
		],
	},
])(
	"homepage at $path names its four reasons to choose the studio",
	({ path, heading, points }) => {
		const html = renderToStaticMarkup(
			createElement(
				MemoryRouter,
				{ initialEntries: [path] },
				createElement(Home),
			),
		);
		expect(html).toContain('aria-labelledby="why-heading"');
		expect(html).toMatch(
			new RegExp(`<h2 id="why-heading"[^>]*>${heading}</h2>`, "u"),
		);
		// Each point reads as one phrase, even though desktop splits it in two.
		const section = html.slice(
			html.indexOf('aria-labelledby="why-heading"'),
		);
		const read = Array.from(
			section.matchAll(/<p\b[^>]*>(.*?)<\/p>/gu),
			([, inner = ""]) => inner.replaceAll(/<[^>]*>/gu, ""),
		);
		expect(read).toEqual(points);
	},
);
