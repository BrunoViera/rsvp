import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#211934",
        paper: "#FFF8EC",
        marigold: "#F2A93B",
        coral: "#E85D4C",
        sage: "#3F7C59",
        line: "#E7DFCF",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        body: ["var(--font-inter)", "sans-serif"],
      },
      borderRadius: {
        card: "1.25rem",
      },
    },
  },
  plugins: [],
};
export default config;
