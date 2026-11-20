import type { JSX } from "react";

import { socialLinks } from "../config/site.ts";
import { InstagramIcon, TikTokIcon } from "./Icons.tsx";

export type Platform = keyof typeof socialLinks.bareSkinCo;

export type Studio = {
	name: string;
	/** Each studio's name is always set in its own signature script. */
	font: string;
	profiles: Record<Platform, string>;
};

export const platforms: ReadonlyArray<{
	key: Platform;
	label: string;
	icon: () => JSX.Element;
}> = [
	{ key: "instagram", label: "Instagram", icon: InstagramIcon },
	{ key: "tiktok", label: "TikTok", icon: TikTokIcon },
];

// Shared by the header, mobile menu and footer so all point to the same profiles.
export const studios: readonly Studio[] = [
	{
		name: "Bare Skin Co",
		font: "font-birthstone",
		profiles: socialLinks.bareSkinCo,
	},
	{
		name: "Cherry Glow Studio",
		font: "font-doulaise",
		profiles: socialLinks.cherryGlowStudio,
	},
];
