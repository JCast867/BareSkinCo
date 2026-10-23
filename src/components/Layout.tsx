import { useEffect } from "react";
import { Outlet } from "react-router";

import { useLanguage } from "../locales/language.ts";
import { Header } from "./Header.tsx";

export function Layout() {
	const language = useLanguage();
	useEffect(() => {
		document.documentElement.lang = language;
	}, [language]);
	return (
		<>
			<Header />

			<main className="px-5 sm:px-8 lg:px-16">
				<Outlet />
			</main>
		</>
	);
}
