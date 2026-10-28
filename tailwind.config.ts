import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#111111",
        cream: "#ffffff",
        sand: "#f5f5f3",
        accent: {
          DEFAULT: "#b99a55",
          dark: "#92763b",
        },
        gold: {
          DEFAULT: "#b99a55",
          light: "#d8c28b",
          dark: "#92763b",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        serif: ["var(--font-playfair)", "Georgia", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;
