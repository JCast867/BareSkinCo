import type { JSX } from "react";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Link, useLocation } from "react-router";

import { translations, useLanguage } from "../locales/language.ts";
import { getNavigation } from "../locales/navigation.ts";
import { DesktopLinks } from "./DesktopLinks.tsx";
import { InstagramIcon, TikTokIcon } from "./Icons.tsx";
import { MenuButton, MobileMenu } from "./MobileMenu.tsx";

type Social = {
	label: string;
	href: string;
	icon: () => JSX.Element;
};

const socials: readonly Social[] = [
	{
		label: "Instagram",
		href: "https://www.instagram.com/",
		icon: InstagramIcon,
	},
	{ label: "TikTok", href: "https://www.tiktok.com/", icon: TikTokIcon },
];

const bookingLink = "https://google.com";

export function Header() {
	const language = useLanguage();
	const text = translations[language];
	const prefix = language === "es" ? "/es" : "";
	const links = getNavigation(language);
	const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
	const hasScrolled = useHasScrolled();
	const headerRef = useRef<HTMLElement>(null);
	const menuButtonRef = useRef<HTMLButtonElement>(null);

	// Back/forward navigation doesn't go through the menu's links, so any
	// location change closes the menu as well.
	const location = useLocation();
	const [prevLocation, setPrevLocation] = useState(location);
	if (location !== prevLocation) {
		setPrevLocation(location);
		setIsMenuOpen(false);
	}

	function closeMenu() {
		setIsMenuOpen(false);
	}

	// While the menu covers the screen, the page underneath stops scrolling
	// and can't take focus. Escape, or widening to desktop, closes the menu.
	useEffect(() => {
		const header = headerRef.current;
		if (!isMenuOpen || header === null) {
			return undefined;
		}

		const page = [...(header.parentElement?.children ?? [])].filter(
			(element): element is HTMLElement =>
				element instanceof HTMLElement && element !== header,
		);
		for (const element of page) {
			element.inert = true;
		}
		document.documentElement.style.overflow = "hidden";

		function closeOnEscape(event: KeyboardEvent) {
			if (event.key === "Escape") {
				setIsMenuOpen(false);
				menuButtonRef.current?.focus();
			}
		}

		const desktop = window.matchMedia("(min-width: 48rem)");
		function closeOnDesktop(event: MediaQueryListEvent) {
			if (event.matches) {
				setIsMenuOpen(false);
			}
		}

		document.addEventListener("keydown", closeOnEscape);
		desktop.addEventListener("change", closeOnDesktop);
		return () => {
			for (const element of page) {
				element.inert = false;
			}
			document.documentElement.style.overflow = "";
			document.removeEventListener("keydown", closeOnEscape);
			desktop.removeEventListener("change", closeOnDesktop);
		};
	}, [isMenuOpen]);

	return (
		<>
			<header
				ref={headerRef}
				className="fixed inset-x-0 top-0 z-50 text-espresso"
			>
				<div
					className={`relative z-10 border-b backdrop-blur-xl transition-[background-color,border-color] duration-500 ease-glide ${
						hasScrolled && !isMenuOpen
							? "border-espresso/10 bg-primary/85"
							: "border-transparent bg-primary"
					}`}
				>
					{/* condenses once the page scrolls */}
					<div
						className={`mx-auto grid max-w-7xl grid-cols-[1fr_auto_1fr] items-center px-5 transition-[height] duration-500 ease-glide motion-reduce:transition-none sm:px-8 lg:px-16 ${
							hasScrolled
								? "h-16 md:h-18 lg:h-20"
								: "h-18 md:h-24 lg:h-28"
						}`}
					>
						<div className="flex items-center">
							<MenuButton
								ref={menuButtonRef}
								isOpen={isMenuOpen}
								onToggle={() => setIsMenuOpen((open) => !open)}
							/>
							<nav
								aria-label={text.navigation.mainLabel}
								className="-ml-3 hidden md:block lg:-ml-4"
							>
								<DesktopLinks links={links} />
							</nav>
						</div>

						<Link
							to={prefix || "/"}
							onClick={closeMenu}
							className={`rounded-sm font-didone text-[clamp(1.125rem,5.6vw,1.375rem)] leading-none tracking-[0.02em] whitespace-nowrap transition-[scale] duration-500 ease-glide focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-espresso motion-reduce:transition-none md:text-3xl lg:text-4xl ${
								hasScrolled ? "md:scale-80" : ""
							}`}
						>
							Beauty Space Co
						</Link>

						<div className="flex items-center justify-end gap-2 lg:gap-4">
							<SocialLinks />
							<BookLink />
						</div>
					</div>
				</div>

				<MobileMenu
					links={links}
					socials={socials}
					isOpen={isMenuOpen}
					onNavigate={closeMenu}
				/>
			</header>

			{/* holds the header's full height, so shrinking it never moves the page */}
			<div aria-hidden="true" className="h-18 md:h-24 lg:h-28" />
		</>
	);
}

function subscribeToScroll(onScroll: () => void) {
	window.addEventListener("scroll", onScroll, { passive: true });
	return () => {
		window.removeEventListener("scroll", onScroll);
	};
}

/** Whether the page has moved away from the very top. */
function useHasScrolled() {
	return useSyncExternalStore(
		subscribeToScroll,
		() => window.scrollY > 8,
		() => false,
	);
}

/** Same rising fill as Book, but no outline at rest so the icons stay quiet. */
function SocialLinks() {
	const text = translations[useLanguage()];
	return (
		<ul className="hidden items-center gap-1 md:flex">
			{socials.map(({ label, href, icon: Icon }) => (
				<li key={label}>
					<a
						href={href}
						target="_blank"
						rel="noreferrer"
						aria-label={text.social.profileLabel.replace(
							"{platform}",
							label,
						)}
						className="group/fill relative isolate flex size-10 items-center justify-center overflow-hidden rounded-full transition-colors duration-500 ease-glide hover:text-primary focus-visible:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-espresso"
					>
						<RisingFill />
						<Icon />
					</a>
				</li>
			))}
		</ul>
	);
}

/**
 * Outlined at rest; on hover the fill rises up into it. The outline is an
 * inset ring rather than a border so the fill can cover it without a seam.
 */
function BookLink() {
	const language = useLanguage();
	const text = translations[language];
	return (
		<a
			href={bookingLink}
			className="group/fill relative isolate flex h-9 items-center overflow-hidden rounded-full px-4 font-didone text-[0.9375rem] leading-none inset-ring inset-ring-espresso transition-colors duration-500 ease-glide hover:text-primary focus-visible:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-espresso md:h-10 md:px-5 md:text-base"
		>
			<RisingFill />
			<span className="sm:hidden">{text.navigation.bookShort}</span>
			<span className="hidden sm:inline">{text.navigation.bookFull}</span>
		</a>
	);
}

/**
 * Espresso that rises up into a link on hover or keyboard focus. The link
 * needs `group/fill relative isolate overflow-hidden` and a rounded shape.
 */
function RisingFill() {
	return (
		<span
			aria-hidden="true"
			className="absolute inset-0 -z-10 translate-y-full rounded-full bg-espresso transition-[translate] duration-500 ease-glide group-hover/fill:translate-y-0 group-focus-visible/fill:translate-y-0 motion-reduce:transition-none"
		/>
	);
}
