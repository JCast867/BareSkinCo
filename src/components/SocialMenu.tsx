import { useEffect, useId, useRef, useState } from "react";

import { translations, useLanguage } from "../locales/language.ts";
import { RisingFill } from "./RisingFill.tsx";
import type { Platform } from "./socials.ts";
import { platforms, studios } from "./socials.ts";

type SocialMenuProps = {
	/**
	 * The header's icons sit on cream and their card drops down. The
	 * footer's sit on near-black at the very bottom of the page, so their
	 * card opens upward instead.
	 */
	placement: "header" | "footer";
	className?: string;
};

const looks = {
	header: {
		trigger:
			"size-10 duration-500 hover:text-primary focus-visible:text-primary focus-visible:outline-espresso aria-expanded:text-primary",
		card: "top-full right-0 mt-3",
		folded: "[clip-path:inset(0_0_100%_0)]",
	},
	footer: {
		trigger:
			"size-11 duration-300 focus-visible:outline-primary aria-expanded:bg-primary aria-expanded:text-neutral-900 not-aria-expanded:hover:bg-primary/10",
		card: "bottom-full left-1/2 mb-3 -translate-x-1/2 lg:right-0 lg:left-auto lg:translate-x-0",
		folded: "[clip-path:inset(100%_0_0_0)]",
	},
} as const;

/**
 * Each platform icon opens a small cream card naming both estheticians, so
 * a visitor picks whose profile to visit. Only one card is open at a time.
 * Escape, a click outside, or tabbing away closes it.
 */
export function SocialMenu({ placement, className = "" }: SocialMenuProps) {
	const text = translations[useLanguage()].social;
	const look = looks[placement];
	const id = useId();
	const rootRef = useRef<HTMLUListElement>(null);
	const [openPlatform, setOpenPlatform] = useState<Platform | null>(null);

	useEffect(() => {
		const found = rootRef.current;
		if (openPlatform === null || found === null) {
			return undefined;
		}
		// Hoisted functions below don't see the null check, so keep a typed copy.
		const root: HTMLUListElement = found;

		function closeOnOutsidePress(event: PointerEvent) {
			if (event.target instanceof Node && !root.contains(event.target)) {
				setOpenPlatform(null);
			}
		}

		function closeOnEscape(event: KeyboardEvent) {
			if (event.key === "Escape") {
				root.querySelector<HTMLElement>(
					'[aria-expanded="true"]',
				)?.focus();
				setOpenPlatform(null);
			}
		}

		// Tabbing past the card closes it too.
		function closeOnFocusAway(event: FocusEvent) {
			if (event.target instanceof Node && !root.contains(event.target)) {
				setOpenPlatform(null);
			}
		}

		document.addEventListener("pointerdown", closeOnOutsidePress);
		document.addEventListener("keydown", closeOnEscape);
		document.addEventListener("focusin", closeOnFocusAway);
		return () => {
			document.removeEventListener("pointerdown", closeOnOutsidePress);
			document.removeEventListener("keydown", closeOnEscape);
			document.removeEventListener("focusin", closeOnFocusAway);
		};
	}, [openPlatform]);

	function close() {
		setOpenPlatform(null);
	}

	return (
		<ul
			ref={rootRef}
			className={`relative flex items-center gap-1 ${className}`}
		>
			{platforms.map(({ key, label, icon: Icon }) => {
				const isOpen = openPlatform === key;
				const cardId = `${id}-${key}`;
				return (
					<li key={key}>
						<button
							type="button"
							aria-label={text.followLabel.replace(
								"{platform}",
								label,
							)}
							aria-expanded={isOpen}
							aria-controls={cardId}
							onClick={() => {
								setOpenPlatform(isOpen ? null : key);
							}}
							className={`group/fill relative isolate flex cursor-pointer items-center justify-center overflow-hidden rounded-full transition-colors ease-glide focus-visible:outline-2 focus-visible:outline-offset-2 motion-reduce:transition-none ${look.trigger}`}
						>
							{placement === "header" && <RisingFill />}
							<Icon />
						</button>

						{/* unfolds out of the bar like the mobile menu's sheet */}
						<div
							id={cardId}
							inert={!isOpen}
							className={`absolute z-10 w-max rounded-2xl border border-espresso/10 bg-primary px-5 py-1.5 text-espresso transition-[clip-path,opacity,visibility] motion-reduce:transition-none ${look.card} ${
								isOpen
									? "visible opacity-100 duration-500 ease-glide [clip-path:inset(0_0_0_0)]"
									: `invisible opacity-0 duration-200 ease-out ${look.folded}`
							}`}
						>
							<ul>
								{studios.map(({ name, font, profiles }) => (
									<li
										key={name}
										className="border-espresso/10 not-first:border-t"
									>
										<a
											href={profiles[key]}
											target="_blank"
											rel="noreferrer"
											onClick={close}
											aria-label={text.profileLabel
												.replace("{studio}", name)
												.replace("{platform}", label)}
											className="group/profile flex items-center justify-between gap-10 rounded-sm py-3.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-espresso"
										>
											<span
												className={`text-[1.75rem] leading-none whitespace-nowrap underline decoration-transparent decoration-1 underline-offset-8 transition-colors duration-300 ease-glide group-hover/profile:decoration-espresso motion-reduce:transition-none ${font}`}
											>
												{name}
											</span>
											<span className="text-mocha transition-colors duration-300 ease-glide group-hover/profile:text-espresso motion-reduce:transition-none [&>svg]:size-4">
												<Icon />
											</span>
										</a>
									</li>
								))}
							</ul>
						</div>
					</li>
				);
			})}
		</ul>
	);
}
