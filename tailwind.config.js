/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backdropBlur: {
        xs: "2px",
      },
      colors: {
        glassLight: "rgba(255, 255, 255, 0.55)",
        glassDark: "rgba(0, 0, 0, 0.35)",
      },
      keyframes: {
        fadeSlide: {
          "0%": { opacity: 0, transform: "translateY(4px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
      },
      animation: {
        fadeSlide: "fadeSlide 0.25s ease-out",
      },
    },
  },
  plugins: [],
};
