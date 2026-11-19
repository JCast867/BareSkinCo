import { translations, useLanguage } from "../locales/language.ts";
import {
	BrazilianIcon,
	UnderarmsIcon,
	BrowIcon,
	FullArmIcon,
	HalfArmIcon,
} from "./Icons.tsx";

const services = [
	{ key: "brazilian", price: "$55+", icon: BrazilianIcon },
	{ key: "underarms", price: "$20", icon: UnderarmsIcon },
	{ key: "brow", price: "$45", icon: BrowIcon },
	{ key: "fullArm", price: "$55", icon: FullArmIcon },
	{ key: "halfArm", price: "$35", icon: HalfArmIcon },
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

				<ul className="mt-9 grid grid-cols-2 gap-y-9 lg:grid-cols-5 lg:gap-y-0">
					{services.map(({ key, price, icon: Icon }) => (
						<li
							key={key}
							className="flex flex-col items-center px-4 text-center last:col-span-2 lg:border-l lg:border-espresso/15 lg:first:border-l-0 lg:last:col-span-1"
						>
							<div className="text-espresso/75">
								<Icon />
							</div>
							<h3 className="mt-4 text-xs/relaxed font-semibold tracking-[0.2em] uppercase">
								{text[key]}
							</h3>
							<p className="mt-2 text-sm font-semibold">
								{price}
							</p>
							{key === "brazilian" && (
								<p className="mt-2 text-sm/relaxed text-espresso/80">
									{text.promotion}
								</p>
							)}
						</li>
					))}
				</ul>
			</div>
		</section>
	);
}
