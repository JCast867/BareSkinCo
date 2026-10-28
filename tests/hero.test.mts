import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router";
import { expect, test } from "vitest";

import { bookingLink } from "../src/config/site.ts";
import { Home } from "../src/pages/Home.tsx";

test.each([
	{
		path: "/",
		first: "Smooth skin.",
		second: "Good energy.",
		booking: "Book now",
	},
	{
		path: "/es",
		first: "Piel suave.",
		second: "Buena energía.",
		booking: "Reservar cita",
	},
])(
	"homepage at $path displays translated hero copy and booking destination",
	({ path, first, second, booking }) => {
		const html = renderToStaticMarkup(
			createElement(
				MemoryRouter,
				{ initialEntries: [path] },
				createElement(Home),
			),
		);
		expect(html).toContain(`>${first}</span>`);
		expect(html).toContain(`>${second}</span>`);
		const bookingAnchor = html.match(
			/<a\b[^>]*href="([^"]+)"[^>]*>(.*?)<\/a>/u,
		);
		expect(bookingAnchor?.[1]).toBe(bookingLink);
		expect(bookingAnchor?.[2]).toContain(booking);
	},
);
