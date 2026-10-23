import { Outlet } from "react-router";

import { Header } from "./Header.tsx";

export function Layout() {
	return (
		<>
			<Header />

			<main className="px-5 sm:px-8 lg:px-16">
				<Outlet />
			</main>
		</>
	);
}
