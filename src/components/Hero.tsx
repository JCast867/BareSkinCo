import heroSmall from "../assets/hero-768.webp";
import heroMedium from "../assets/hero-1280.webp";
import heroLarge from "../assets/hero-1920.webp";
import heroExtraLarge from "../assets/hero-2560.webp";
import { bookingLink } from "../config/site.ts";
import { translations, useLanguage } from "../locales/language.ts";

export function Hero() {
	const text = translations[useLanguage()].hero;

	return (
		<section
			aria-labelledby="hero-heading"
			className="relative isolate flex min-h-116 items-center overflow-hidden bg-espresso text-primary sm:min-h-128"
		>
			<img
				src={heroMedium}
				srcSet={`${heroSmall} 768w, ${heroMedium} 1280w, ${heroLarge} 1920w, ${heroExtraLarge} 2560w`}
				sizes="100vw"
				width={1280}
				height={1024}
				alt=""
				fetchPriority="high"
				className="absolute inset-0 -z-20 size-full object-cover object-[65%_45%] sm:object-center"
			/>
			<div
				aria-hidden="true"
				className="absolute inset-0 -z-10 bg-linear-to-r from-black/85 via-black/60 to-black/60"
			/>

			<div className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-16">
				<div className="max-w-xl">
					<p className="mb-7 text-xs font-medium tracking-[0.25em] uppercase sm:text-sm">
						{text.eyebrow}
					</p>
					<h1
						id="hero-heading"
						className="font-didone text-5xl/tight tracking-tight uppercase sm:text-6xl/tight"
					>
						<span className="block">{text.headingFirst}</span>
						<span className="block">{text.headingSecond}</span>
					</h1>
					<p className="mt-5 max-w-md text-base/relaxed text-primary/90 sm:text-lg/relaxed">
						{text.description}
					</p>
					<a
						href={bookingLink}
						className="group/booking mt-7 inline-flex min-h-14 items-center justify-center gap-5 bg-primary px-9 py-4 text-sm font-semibold tracking-[0.2em] text-espresso uppercase transition-colors duration-200 ease-out hover:bg-white focus-visible:bg-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary active:bg-white motion-reduce:transition-none"
					>
						{text.book}
						<span
							aria-hidden="true"
							className="text-xl leading-none transition-[translate] duration-200 ease-out motion-safe:group-hover/booking:translate-x-1 motion-safe:group-focus-visible/booking:translate-x-1 motion-safe:group-active/booking:translate-x-1 motion-reduce:transition-none"
						>
							&rarr;
						</span>
					</a>
				</div>
			</div>
		</section>
	);
}
