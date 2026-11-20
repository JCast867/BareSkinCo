import { Hero } from "../components/Hero.tsx";
import { Services } from "../components/Services.tsx";
import { Vision } from "../components/Vision.tsx";
import { WhyUs } from "../components/WhyUs.tsx";

export function Home() {
	return (
		<>
			<Hero />
			<Services />
			<Vision />
			<WhyUs />
		</>
	);
}
