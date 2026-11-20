import { translations, useLanguage } from "../locales/language.ts";
import { HeartIcon, LeafIcon, SparkleIcon, TwoPeopleIcon } from "./Icons.tsx";

const points = [
	{ key: "clean", icon: LeafIcon },
	{ key: "comfort", icon: HeartIcon },
	{ key: "results", icon: SparkleIcon },
	{ key: "team", icon: TwoPeopleIcon },
] as const;

export function WhyUs() {
	const text = translations[useLanguage()].whyUs;

	return (
		<section
			aria-labelledby="why-heading"
			className="bg-linen py-10 text-espresso sm:py-12"
		>
			<div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-16">
				{/* the eyebrow is the only heading here, like the mockup */}
				<h2
					id="why-heading"
					className="text-center text-xs font-semibold tracking-[0.3em] uppercase"
				>
					{text.eyebrow}
				</h2>

				{/*
				 * Two by two on phones, one row from desktop. The hairlines only
				 * divide items that sit side by side.
				 */}
				<ul className="mt-8 grid grid-cols-2 gap-y-10 lg:grid-cols-4">
					{points.map(({ key, icon: Icon }) => (
						<li
							key={key}
							className="flex flex-col items-center gap-4 border-espresso/15 px-2 text-center odd:border-r sm:px-4 lg:not-last:border-r"
						>
							<Icon />
							{/* the mockup's line breaks on desktop; phones wrap naturally */}
							<p className="text-[0.6875rem]/loose font-medium tracking-[0.2em] text-balance uppercase sm:text-xs/loose sm:tracking-[0.25em]">
								<span className="lg:block">
									{text[key].first}
								</span>{" "}
								<span className="lg:block">
									{text[key].second}
								</span>
							</p>
						</li>
					))}
				</ul>
			</div>
		</section>
	);
}
