import { RouterProvider } from "react-router";

import { router } from "./routes/routes.ts";

export function App() {
	return <RouterProvider router={router} />;
}
