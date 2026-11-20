import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router";
import { expect, test } from "vitest";

import { Services } from "../components/Services.tsx";

test.each([
	{
		path: "/",
		names: [
			"Brazilian",
			"Underarms",
			"Brow wax + tint",
			"Full arm",
			"Full legs",
			"Full body waxing",
		],
	},
	{
		path: "/es",
		names: [
			"Depilación brasileña",
			"Axilas",
			"Depilación y tinte de cejas",
			"Brazo completo",
			"Piernas completas",
			"Depilación de cuerpo completo",
		],
	},
])(
	"services at $path list six translated services without prices",
	({ path, names }) => {
		const html = renderToStaticMarkup(
			createElement(
				MemoryRouter,
				{ initialEntries: [path] },
				createElement(Services),
			),
		);
		const listed = Array.from(
			html.matchAll(/<h3\b[^>]*>([^<]*)<\/h3>/gu),
			([, name]) => name,
		);
		expect(listed).toEqual(names);
		// Prices and the promo note were taken off the menu.
		expect(html).not.toMatch(/\$\d/u);
		expect(html).not.toMatch(/promo/iu);
	},
);
