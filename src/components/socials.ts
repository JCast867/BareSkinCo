import type { JSX } from "react";

import { InstagramIcon, TikTokIcon } from "./Icons.tsx";

export type Social = {
	label: string;
	href: string;
	icon: () => JSX.Element;
};

// Shared by the header and footer so both always point to the same profiles.
export const socials: readonly Social[] = [
	{
		label: "Instagram",
		href: "https://www.instagram.com/",
		icon: InstagramIcon,
	},
	{ label: "TikTok", href: "https://www.tiktok.com/", icon: TikTokIcon },
];
