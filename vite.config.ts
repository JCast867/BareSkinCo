import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

// https://vite.dev/config/
export default defineConfig({
	test: {
		environment: "node",
		include: ["src/tests/**/*.test.mts"],
	},
	plugins: [react({ compiler: true }), tailwindcss()],
});
