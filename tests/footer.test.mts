import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router";
import { expect, test } from "vitest";

import { Footer } from "../src/components/Footer.tsx";
import { bookingLink } from "../src/config/site.ts";

test.each([
	{
		path: "/",
		booking: "Book now",
		details: [
			"Serving East &amp; West Dundee",
			"Waxing + brows",
			"Se habla español",
		],
		instagram: "Beauty Space Co on Instagram",
	},
	{
		path: "/es",
		booking: "Reservar cita",
		details: [
			"Atendemos East y West Dundee",
			"Depilación + cejas",
			"Se habla español",
		],
		instagram: "Beauty Space Co en Instagram",
	},
])(
	"footer at $path translates its booking link, details and social labels",
	({ path, booking, details, instagram }) => {
		const html = renderToStaticMarkup(
			createElement(
				MemoryRouter,
				{ initialEntries: [path] },
				createElement(Footer),
			),
		);
		expect(html).toMatch(/^<footer\b/u);
		expect(html).toContain(">Bare Skin Co</span>");
		expect(html).toContain(">Cherry Glow Studio</span>");

		const bookingAnchor = html.match(
			/<a href="([^"]+)"[^>]*>([^<]*)<span/u,
		);
		expect(bookingAnchor?.[1]).toBe(bookingLink);
		expect(bookingAnchor?.[2]).toBe(booking);

		// Separators are hidden from screen readers, so each detail reads alone.
		const text = Array.from(
			html.matchAll(
				/<li\b[^>]*>(?:<span aria-hidden="true"[^>]*>\/<\/span>)?([^<]*)<\/li>/gu,
			),
			([, detail]) => detail,
		);
		expect(text).toEqual(details);
		expect(html).toContain('<li lang="es">');
		expect(html).toContain(`aria-label="${instagram}"`);
	},
);
