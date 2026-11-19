import { bookingLink } from "../config/site.ts";
import { translations, useLanguage } from "../locales/language.ts";
import { socials } from "./socials.ts";

export function Footer() {
	const text = translations[useLanguage()];
	const details = [
		{ key: "area", label: text.footer.area },
		{ key: "services", label: text.footer.services },
		// Always Spanish, so screen readers pronounce it as Spanish
		{ key: "language", label: text.footer.language, lang: "es" },
	];

	return (
		<footer className="bg-neutral-900 text-primary">
			<div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-16 lg:py-10">
				<div className="flex flex-col items-center gap-8 lg:grid lg:grid-cols-[1fr_auto_1fr] lg:gap-10">
					{/* the same signature pair as the about section, without links */}
					<p className="flex items-center text-[clamp(1.25rem,7vw,1.75rem)] leading-none whitespace-nowrap sm:text-3xl/none lg:justify-self-start">
						<span className="pr-4 font-birthstone sm:pr-5">
							Bare Skin Co
						</span>
						<span className="border-l border-primary/30 py-1 pl-4 font-doulaise sm:pl-5">
							Cherry Glow Studio
						</span>
					</p>

					<a
						href={bookingLink}
						className="group/booking inline-flex min-h-12 items-center gap-4 px-8 text-xs font-semibold tracking-[0.25em] uppercase inset-ring inset-ring-primary/60 transition-colors duration-200 ease-out hover:bg-primary hover:text-roast focus-visible:bg-primary focus-visible:text-roast focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary active:bg-primary active:text-roast motion-reduce:transition-none"
					>
						{text.navigation.bookFull}
						<span
							aria-hidden="true"
							className="text-base leading-none transition-[translate] duration-200 ease-out motion-safe:group-hover/booking:translate-x-1 motion-safe:group-focus-visible/booking:translate-x-1 motion-reduce:transition-none"
						>
							&rarr;
						</span>
					</a>

					<ul className="flex items-center gap-1 lg:justify-self-end">
						{socials.map(({ label, href, icon: Icon }) => (
							<li key={label}>
								<a
									href={href}
									target="_blank"
									rel="noreferrer"
									aria-label={text.social.profileLabel.replace(
										"{platform}",
										label,
									)}
									className="flex size-11 items-center justify-center rounded-full transition-colors duration-300 ease-glide hover:bg-primary/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary motion-reduce:transition-none"
								>
									<Icon />
								</a>
							</li>
						))}
					</ul>
				</div>

				<ul className="mt-8 flex flex-col items-center gap-2 text-center text-xs font-medium tracking-[0.25em] text-primary/75 uppercase lg:mt-6 lg:flex-row lg:justify-center lg:gap-0">
					{details.map(({ key, label, lang }, index) => (
						<li key={key} lang={lang}>
							{index > 0 && (
								<span
									aria-hidden="true"
									className="hidden px-4 lg:inline"
								>
									/
								</span>
							)}
							{label}
						</li>
					))}
				</ul>
			</div>
		</footer>
	);
}
