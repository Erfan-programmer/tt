import type { Config } from "tailwindcss";
import { heroui } from "@heroui/theme";

const config: Config = {
  darkMode: 'class', 
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/animations/**/*.{js,ts,jsx,tsx,mdx,json}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        clash: ['var(--font-clash)', 'sans-serif'],     
        jakarta: ['var(--font-jakarta)', 'sans-serif'],  
      },
    },
  },
  plugins: [heroui()],
};

export default config;
