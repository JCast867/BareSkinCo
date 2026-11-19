import { useState } from "react";

import type { Navigation } from "../locales/navigation.ts";

type DesktopLinksProps = {
	links: readonly Navigation[];
};

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

/**
 * Desktop links with a single underline that slides to whichever link is
 * hovered/focused, and fades out when the interaction ends.
 */
export function DesktopLinks({ links }: DesktopLinksProps) {
	const [indicator, setIndicator] = useState<Indicator | null>(null);

	function moveToLink(link: HTMLElement) {
		setIndicator(
			indicatorUnder(link.querySelector<HTMLElement>("[data-label]")),
		);
	}

	function hideIndicator() {
		setIndicator(indicatorUnder(null));
	}

	return (
		<ul className="group/links relative flex items-center">
			{links.map((link) => (
				<li key={link.label}>
					<a
						href={link.to}
						onMouseEnter={(event) =>
							moveToLink(event.currentTarget)
						}
						onFocus={(event) => moveToLink(event.currentTarget)}
						onMouseLeave={hideIndicator}
						onBlur={hideIndicator}
						className="block rounded-sm px-3 py-2 font-didone text-[1.0625rem] transition-colors duration-300 group-hover/links:text-mocha hover:text-espresso focus-visible:outline-2 focus-visible:outline-espresso lg:px-4"
					>
						<span data-label>{link.label}</span>
					</a>
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
