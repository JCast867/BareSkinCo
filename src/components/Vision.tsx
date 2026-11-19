import visionSmall from "../assets/vision-640.webp";
import visionMedium from "../assets/vision-960.webp";
import visionLarge from "../assets/vision-1280.webp";
import visionExtraLarge from "../assets/vision-1920.webp";
import { meetLinks } from "../config/site.ts";
import { translations, useLanguage } from "../locales/language.ts";

export function Vision() {
	const text = translations[useLanguage()].vision;

	return (
		<section
			id="about"
			aria-labelledby="vision-heading"
			className="scroll-mt-28 bg-espresso py-12 text-primary sm:py-16"
		>
			<div className="mx-auto grid max-w-7xl items-center gap-10 px-5 sm:px-8 lg:grid-cols-2 lg:gap-16 lg:px-16">
				{/* steps slightly past the page margin, like the mockup */}
				<div className="relative lg:-ml-8 lg:w-[calc(100%+2rem)]">
					<img
						src={visionMedium}
						srcSet={`${visionSmall} 640w, ${visionMedium} 960w, ${visionLarge} 1280w, ${visionExtraLarge} 1920w`}
						sizes="(min-width: 80rem) 40rem, (min-width: 64rem) 50vw, 100vw"
						width={1280}
						height={960}
						alt={text.imageAlt}
						loading="lazy"
						decoding="async"
						className="aspect-4/3 w-full object-cover"
					/>
					{/* warms the photo's grey studio backdrop toward the cream palette */}
					<div
						aria-hidden="true"
						className="absolute inset-0 bg-[#f6ecdf] mix-blend-multiply"
					/>
				</div>

				<div>
					<p className="text-xs font-semibold tracking-[0.3em] uppercase">
						{text.eyebrow}
					</p>
					<h2
						id="vision-heading"
						className="mt-3 font-didone text-4xl/tight uppercase sm:text-5xl/tight"
					>
						<span className="block">{text.headingFirst}</span>
						<span className="block">{text.headingSecond}</span>
					</h2>
					<p className="mt-5 max-w-md text-base/relaxed text-primary/80">
						{text.description}
					</p>
					<p
						id="vision-meet"
						className="mt-8 font-didone text-base text-primary/75"
					>
						{text.meet}
					</p>
					{/*
					 * Each name opens that esthetician's part of the Meet us page.
					 * Both stay on one line, shrinking on narrow phones. The links'
					 * negative margin keeps the divider short while their padding
					 * keeps the tap target tall.
					 */}
					<ul
						aria-labelledby="vision-meet"
						className="mt-2 flex items-center text-[clamp(1.125rem,6vw,1.75rem)] leading-none whitespace-nowrap sm:text-4xl/none"
					>
						<li className="pr-3 font-birthstone sm:pr-5">
							<a
								href={meetLinks.bareSkinCo}
								className="group/name -my-1.5 inline-flex items-baseline gap-1.5 rounded-sm py-2.5 underline decoration-transparent decoration-1 underline-offset-10 transition-colors duration-300 ease-glide hover:decoration-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary motion-reduce:transition-none sm:gap-2"
							>
								Bare Skin Co
								<LinkArrow />
							</a>
						</li>
						<li className="border-l border-primary/30 pl-3 font-doulaise sm:pl-5">
							<a
								href={meetLinks.cherryGlowStudio}
								className="group/name -my-1.5 inline-flex items-baseline gap-1.5 rounded-sm py-2.5 underline decoration-transparent decoration-1 underline-offset-10 transition-colors duration-300 ease-glide hover:decoration-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary motion-reduce:transition-none sm:gap-2"
							>
								Cherry Glow Studio
								<LinkArrow />
							</a>
						</li>
					</ul>
				</div>
			</div>
		</section>
	);
}

/** Thin arrow after each name; it nudges forward like the hero's Book now. */
function LinkArrow() {
	return (
		<svg
			viewBox="0 0 16 16"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.25"
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
			className="size-3 shrink-0 transition-[translate] duration-300 ease-glide motion-safe:group-hover/name:translate-x-1 motion-safe:group-focus-visible/name:translate-x-1 motion-reduce:transition-none sm:size-4"
		>
			<path d="M1.5 8h12M10 4.5 13.5 8 10 11.5" />
		</svg>
	);
}
