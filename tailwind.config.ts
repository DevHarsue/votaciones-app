import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      animation: {
        'fade-in': 'fade-in 0.5s ease-in forwards',
        'fade-out': 'fade-out 0.5s ease-out forwards',
        'slide-down': 'slide-down 0.5s ease-in forwards',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-out': {
          '0': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        'slide-down': {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        'custom-beige': '#FEE5C5',
        'custom-blue' : '#2020e2',
        'custom-turquoise':
        {
          400:  '#03a3ff',
          500:  '#53c0ff',
          600:  '#60c2ff',
        },
        'custom-green':
        {
          400: '#009846',
          500: '#48c26c',
        },

        'custom-orange':
        {
          400: '#ff8500',
          500: '#ffa92f'
        },

        'custom-red':
        {
          400: '#F92900',
          500: '#ff4c28'
        }
      },
    },
  },
  plugins: [],
} satisfies Config;
