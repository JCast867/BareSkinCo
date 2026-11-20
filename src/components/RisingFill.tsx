/**
 * Espresso that rises up into a control on hover or keyboard focus, and
 * stays up while a control it belongs to is expanded. The control needs
 * `group/fill relative isolate overflow-hidden` and a rounded shape.
 */
export function RisingFill() {
	return (
		<span
			aria-hidden="true"
			className="absolute inset-0 -z-10 translate-y-full rounded-full bg-espresso transition-[translate] duration-500 ease-glide group-hover/fill:translate-y-0 group-focus-visible/fill:translate-y-0 group-aria-expanded/fill:translate-y-0 motion-reduce:transition-none"
		/>
	);
}
