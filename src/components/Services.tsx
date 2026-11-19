import { translations, useLanguage } from "../locales/language.ts";
import {
	BrazilianIcon,
	UnderarmsIcon,
	BrowIcon,
	FullArmIcon,
	FullLegsIcon,
	FullBodyIcon,
} from "./Icons.tsx";

const services = [
	{ key: "brazilian", icon: BrazilianIcon },
	{ key: "underarms", icon: UnderarmsIcon },
	{ key: "brow", icon: BrowIcon },
	{ key: "fullArm", icon: FullArmIcon },
	{ key: "fullLegs", icon: FullLegsIcon },
	{ key: "fullBody", icon: FullBodyIcon },
] as const;

export function Services() {
	const text = translations[useLanguage()].services;

	return (
		<section
			id="services"
			aria-labelledby="services-heading"
			className="scroll-mt-28 bg-primary py-12 text-espresso sm:py-14"
		>
			<div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-16">
				<div className="text-center">
					<p className="text-xs font-semibold tracking-[0.3em] uppercase">
						{text.eyebrow}
					</p>
					<h2
						id="services-heading"
						className="mt-3 font-didone text-4xl/tight uppercase sm:text-5xl/tight"
					>
						{text.heading}
					</h2>
					<p className="mt-3 text-base/relaxed text-espresso/80">
						{text.description}
					</p>
				</div>

				<ul className="mt-9 grid grid-cols-2 gap-y-9 sm:grid-cols-3 lg:grid-cols-6 lg:gap-y-0">
					{services.map(({ key, icon: Icon }) => (
						<li
							key={key}
							className="flex flex-col items-center px-4 text-center lg:border-l lg:border-espresso/15 lg:first:border-l-0"
						>
							<div className="text-espresso/75">
								<Icon />
							</div>
							<h3 className="mt-4 text-xs/relaxed font-semibold tracking-[0.2em] uppercase">
								{text[key]}
							</h3>
						</li>
					))}
				</ul>
			</div>
		</section>
	);
}
