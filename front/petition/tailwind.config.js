/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#09090b",
        secondary: "#18181a",
        active: "#272729",
        "text-muted": "#9e9ea5",
        text: "white",
        border: "#1c1b1e",
      },
    },
  },
  plugins: [],
};
