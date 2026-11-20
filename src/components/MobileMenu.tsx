import type { Ref } from "react";

import { translations, useLanguage } from "../locales/language.ts";
import type { Navigation } from "../locales/navigation.ts";
import type { Studio } from "./socials.ts";
import { platforms } from "./socials.ts";

type MenuButtonProps = {
	isOpen: boolean;
	onToggle: () => void;
	ref: Ref<HTMLButtonElement>;
};

/**
 * Two hairlines that meet, then cross into an X. Closing plays the same
 * steps in reverse, so the delays swap with the state. The lines follow
 * `aria-expanded`, so the icon always matches what screen readers announce.
 */
export function MenuButton({ isOpen, onToggle, ref }: MenuButtonProps) {
	const text = translations[useLanguage()];
	return (
		<button
			ref={ref}
			type="button"
			aria-label={
				isOpen
					? text.mobileMenu.button.menuToggleOff
					: text.mobileMenu.button.menuToggleOn
			}
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
	links: readonly Navigation[];
	studios: readonly Studio[];
	isOpen: boolean;
	onNavigate: () => void;
};

/**
 * A cream sheet that drops from under the bar, then the links rise into
 * place one after another. Closing fades the links first, then the sheet
 * eases away.
 */
export function MobileMenu({
	links,
	studios,
	isOpen,
	onNavigate,
}: MobileMenuProps) {
	const text = translations[useLanguage()];
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
			className={`fixed inset-0 overflow-y-auto bg-primary transition-[clip-path,visibility] motion-reduce:transition-none md:hidden ${
				isOpen
					? "visible duration-700 ease-glide [clip-path:inset(0_0_0_0)]"
					: "invisible duration-500 ease-in-out [clip-path:inset(0_0_100%_0)]"
			}`}
		>
			<nav
				aria-label={text.navigation.mobileLabel}
				className="flex min-h-full flex-col px-5 pt-32 pb-[max(2.5rem,env(safe-area-inset-bottom))] sm:px-8"
			>
				<ul>
					{links.map((link, index) => (
						<li key={link.label} className="overflow-hidden">
							<a
								href={link.to}
								onClick={onNavigate}
								style={{ transitionDelay: riseDelay(index) }}
								className={`block py-1.5 font-didone text-5xl/tight active:text-mocha ${rise}`}
							>
								{link.label}
							</a>
						</li>
					))}
				</ul>

				{/*
				 * The same signature pair as the about section, each name over its
				 * own profiles. There's room here, so no dropdown is needed.
				 */}
				<ul
					style={{ transitionDelay: riseDelay(links.length) }}
					className={`mt-auto flex border-t border-espresso/10 pt-6 ${rise}`}
				>
					{studios.map(({ name, font, profiles }) => (
						<li
							key={name}
							className="border-espresso/15 pr-3 not-first:border-l not-first:pl-3 sm:pr-5 sm:not-first:pl-5"
						>
							<p
								className={`text-[clamp(1.125rem,6vw,1.75rem)] leading-none whitespace-nowrap ${font}`}
							>
								{name}
							</p>
							<ul className="mt-2 -ml-2.5 flex">
								{platforms.map(({ key, label, icon: Icon }) => (
									<li key={key}>
										<a
											href={profiles[key]}
											target="_blank"
											rel="noreferrer"
											aria-label={text.social.profileLabel
												.replace("{studio}", name)
												.replace("{platform}", label)}
											className="flex size-11 items-center justify-center rounded-full text-mocha focus-visible:outline-2 focus-visible:outline-espresso active:text-espresso"
										>
											<Icon />
										</a>
									</li>
								))}
							</ul>
						</li>
					))}
				</ul>
			</nav>
		</div>
	);
}
