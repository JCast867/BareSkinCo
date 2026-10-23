import type { Ref } from "react";
import { NavLink } from "react-router";

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
	links: ReadonlyArray<{ label: string; to: string }>;
	socials: ReadonlyArray<{ label: string; href: string }>;
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
	socials,
	isOpen,
	onNavigate,
}: MobileMenuProps) {
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
				aria-label="Mobile"
				className="flex min-h-full flex-col px-5 pt-32 pb-[max(2.5rem,env(safe-area-inset-bottom))] sm:px-8"
			>
				<ul>
					{links.map((link, index) => (
						<li key={link.to} className="overflow-hidden">
							<NavLink
								to={link.to}
								onClick={onNavigate}
								style={{ transitionDelay: riseDelay(index) }}
								className={`block py-1.5 font-didone text-5xl/tight active:text-mocha aria-[current=page]:underline aria-[current=page]:decoration-1 aria-[current=page]:underline-offset-[0.2em] ${rise}`}
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
