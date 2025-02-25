import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        'custom-beige': '#FEE5C5',
        'custom-turquoise': 
        {
          400:  '#03a3ff',
          500:  '#53c0ff',
          600:  '#60c2ff',
        }
      },
    },
  },
  plugins: [],
} satisfies Config;
