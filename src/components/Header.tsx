import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Link, NavLink, useLocation } from "react-router";

import { InstagramIcon, TikTokIcon } from "./Icons.tsx";

type Navigation = {
	label: string;
	to: string;
};

const links: readonly Navigation[] = [
	{ label: "Home", to: "/" },
	{ label: "Services", to: "/services" },
	{ label: "About", to: "/about" },
];

type Social = {
	label: string;
	href: string;
	icon: () => React.JSX.Element;
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
								aria-label="Main"
								className="-ml-3 hidden md:block lg:-ml-4"
							>
								<DesktopLinks />
							</nav>
						</div>

						<Link
							to="/"
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

				<MobileMenu isOpen={isMenuOpen} onNavigate={closeMenu} />
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

type MenuButtonProps = {
	isOpen: boolean;
	onToggle: () => void;
	ref: React.Ref<HTMLButtonElement>;
};

/**
 * Two hairlines that meet, then cross into an X. Closing plays the same
 * steps in reverse, so the delays swap with the state. The lines follow
 * `aria-expanded`, so the icon always matches what screen readers announce.
 */
function MenuButton({ isOpen, onToggle, ref }: MenuButtonProps) {
	return (
		<button
			ref={ref}
			type="button"
			aria-label={isOpen ? "Close menu" : "Open menu"}
			aria-expanded={isOpen}
			aria-controls="mobile-menu"
			onClick={onToggle}
			className="group/menu relative -ml-2 size-10 cursor-pointer rounded-full focus-visible:outline-2 focus-visible:outline-espresso md:hidden"
		>
			<span
				aria-hidden="true"
				className="absolute top-3.75 left-2 h-px w-6 bg-current transition-[translate,rotate,width] delay-[150ms,0ms,150ms] duration-300 ease-glide group-aria-expanded/menu:translate-y-[4.5px] group-aria-expanded/menu:rotate-45 group-aria-expanded/menu:delay-[0ms,150ms,0ms] motion-reduce:transition-none"
			/>
			<span
				aria-hidden="true"
				className="absolute top-6 left-2 h-px w-4 bg-current transition-[translate,rotate,width] delay-[150ms,0ms,150ms] duration-300 ease-glide group-aria-expanded/menu:w-6 group-aria-expanded/menu:translate-y-[-4.5px] group-aria-expanded/menu:-rotate-45 group-aria-expanded/menu:delay-[0ms,150ms,0ms] motion-reduce:transition-none"
			/>
		</button>
	);
}

type MobileMenuProps = {
	isOpen: boolean;
	onNavigate: () => void;
};

/**
 * A cream sheet that drops from under the bar, then the links rise into
 * place one after another. Closing fades the links first, then the sheet
 * eases away.
 */
function MobileMenu({ isOpen, onNavigate }: MobileMenuProps) {
	function riseDelay(index: number) {
		return isOpen ? `${String(150 + index * 70)}ms` : "0ms";
	}

	const rise = `transition-[translate,opacity] ease-glide motion-reduce:transition-none ${
		isOpen
			? "translate-y-0 opacity-100 duration-700"
			: "translate-y-full opacity-0 duration-300"
	}`;

	return (
		<div
			id="mobile-menu"
			inert={!isOpen}
			className={`fixed inset-0 bg-primary transition-[clip-path,visibility] motion-reduce:transition-none md:hidden ${
				isOpen
					? "visible duration-700 ease-glide [clip-path:inset(0_0_0_0)]"
					: "invisible duration-500 ease-in-out [clip-path:inset(0_0_100%_0)]"
			}`}
		>
			<nav
				aria-label="Mobile"
				className="flex h-full flex-col px-5 pt-32 pb-[max(2.5rem,env(safe-area-inset-bottom))] sm:px-8"
			>
				<ul>
					{links.map((link, index) => (
						<li key={link.to} className="overflow-hidden">
							<NavLink
								to={link.to}
								onClick={onNavigate}
								style={{ transitionDelay: riseDelay(index) }}
								className={`block py-1.5 font-didone text-5xl leading-tight active:text-mocha aria-[current=page]:underline aria-[current=page]:decoration-1 aria-[current=page]:underline-offset-[0.2em] ${rise}`}
							>
								{link.label}
							</NavLink>
						</li>
					))}
				</ul>

				<ul
					style={{ transitionDelay: riseDelay(links.length) }}
					className={`mt-auto flex gap-8 border-t border-espresso/10 pt-6 ${rise}`}
				>
					{socials.map(({ label, href }) => (
						<li key={label}>
							<a
								href={href}
								target="_blank"
								rel="noreferrer"
								className="font-didone text-lg text-mocha active:text-espresso"
							>
								{label}
							</a>
						</li>
					))}
				</ul>
			</nav>
		</div>
	);
}

type Indicator = {
	left: number;
	width: number;
	isVisible: boolean;
};

/** Returns a state updater that moves the underline beneath `label`, or fades it out. */
function indicatorUnder(label: HTMLElement | null) {
	return (prev: Indicator | null): Indicator | null => {
		if (label === null) {
			return prev === null ? null : { ...prev, isVisible: false };
		}
		return {
			left: label.offsetLeft,
			width: label.offsetWidth,
			isVisible: true,
		};
	};
}

function activeLabel(list: HTMLElement | null): HTMLElement | null {
	return (
		list?.querySelector<HTMLElement>(
			'[aria-current="page"] [data-label]',
		) ?? null
	);
}

/**
 * Desktop links with a single underline that slides to whichever link is
 * hovered/focused, and settles back under the current page's link.
 */
function DesktopLinks() {
	const listRef = useRef<HTMLUListElement>(null);
	const [indicator, setIndicator] = useState<Indicator | null>(null);

	function moveToLink(link: HTMLElement) {
		setIndicator(
			indicatorUnder(link.querySelector<HTMLElement>("[data-label]")),
		);
	}

	function moveToActive() {
		setIndicator(indicatorUnder(activeLabel(listRef.current)));
	}

	useEffect(() => {
		const list = listRef.current;
		const update = () => {
			setIndicator(indicatorUnder(activeLabel(list)));
		};
		const resizeObserver = new ResizeObserver(update);
		const mutationObserver = new MutationObserver(update);
		if (list !== null) {
			resizeObserver.observe(list);
			mutationObserver.observe(list, {
				subtree: true,
				attributeFilter: ["aria-current"],
			});
		}
		return () => {
			resizeObserver.disconnect();
			mutationObserver.disconnect();
		};
	}, []);

	return (
		<ul ref={listRef} className="group/links relative flex items-center">
			{links.map((link) => (
				<li key={link.to}>
					<NavLink
						to={link.to}
						onMouseEnter={(event) =>
							moveToLink(event.currentTarget)
						}
						onFocus={(event) => moveToLink(event.currentTarget)}
						onMouseLeave={moveToActive}
						onBlur={moveToActive}
						className="block rounded-sm px-3 py-2 font-didone text-[1.0625rem] transition-colors duration-300 group-hover/links:text-mocha hover:text-espresso focus-visible:outline-2 focus-visible:outline-espresso lg:px-4"
					>
						<span data-label>{link.label}</span>
					</NavLink>
				</li>
			))}

			{indicator !== null && (
				<span
					aria-hidden="true"
					className={`pointer-events-none absolute bottom-1 left-0 h-px bg-espresso transition-[translate,width,opacity] duration-500 ease-glide motion-reduce:transition-none ${
						indicator.isVisible ? "opacity-100" : "opacity-0"
					}`}
					style={{
						translate: `${String(indicator.left)}px 0`,
						width: indicator.width,
					}}
				/>
			)}
		</ul>
	);
}

/** Same rising fill as Book, but no outline at rest so the icons stay quiet. */
function SocialLinks() {
	return (
		<ul className="hidden items-center gap-1 md:flex">
			{socials.map(({ label, href, icon: Icon }) => (
				<li key={label}>
					<a
						href={href}
						target="_blank"
						rel="noreferrer"
						aria-label={`Bare Skin Co on ${label}`}
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
	return (
		<a
			href={bookingLink}
			className="group/fill relative isolate flex h-9 items-center overflow-hidden rounded-full px-4 font-didone text-[0.9375rem] leading-none inset-ring inset-ring-espresso transition-colors duration-500 ease-glide hover:text-primary focus-visible:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-espresso md:h-10 md:px-5 md:text-base"
		>
			<RisingFill />
			Book<span className="hidden sm:inline">&nbsp;now</span>
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
