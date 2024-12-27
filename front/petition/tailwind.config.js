/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "var(--primary)",
        secondary: "var(--secondary)",
        active: "var(--active)",
        "text-muted": "var(--text-muted)",
        text: "var(--text)",
        border: "var(--border)",
      },
    },
  },
  plugins: [],
};
