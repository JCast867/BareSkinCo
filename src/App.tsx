import { createBrowserRouter, RouterProvider } from "react-router";

import { Layout } from "./components/Layout.tsx";

const router = createBrowserRouter([
	{
		path: "/",
		Component: Layout,
		children: [
			{},
			{
				path: "services",
			},
			{
				path: "about",
			},
			{
				path: "book",
			},
		],
	},
]);

export function App() {
	return <RouterProvider router={router} />;
}
