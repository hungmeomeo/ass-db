/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        fish: "url('/src/assets/img/fish.webp')",
      },
    },
  },
  plugins: [],
};
