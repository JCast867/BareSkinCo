import { createBrowserRouter } from "react-router";

import { Layout } from "../components/Layout.tsx";
import { initializeLanguage } from "../locales/bootstrap.ts";

// Set the initial URL before the router reads it.
initializeLanguage();

const children = [
	{ index: true },
	{ path: "services" },
	{ path: "about" },
	{ path: "book" },
];

export const router = createBrowserRouter([
	{
		path: "/",
		Component: Layout,
		children,
	},
	{
		path: "/es",
		Component: Layout,
		children,
	},
]);
