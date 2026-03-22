import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["SF Pro Text", "system-ui", "sans-serif"],
        sf: ["SF Pro Text", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [typography],
};

export default config;
