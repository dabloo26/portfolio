/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["DM Sans", "system-ui", "sans-serif"],
        display: ["Instrument Serif", "Georgia", "serif"],
      },
      colors: {
        ink: {
          950: "#05060a",
          900: "#0a0c12",
          850: "#0e1119",
          800: "#121622",
        },
        mist: "#94a3b8",
        glow: {
          cyan: "#22d3ee",
          violet: "#a78bfa",
          mint: "#34d399",
        },
      },
      backgroundImage: {
        "grid-fade":
          "linear-gradient(to bottom, transparent, rgb(5 6 10)), linear-gradient(rgb(5 6 10 / 0.85), rgb(5 6 10 / 0.92)), radial-gradient(ellipse 80% 50% at 50% -20%, rgb(34 211 238 / 0.12), transparent)",
      },
      animation: {
        shimmer: "shimmer 8s ease-in-out infinite",
      },
      keyframes: {
        shimmer: {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "0.85" },
        },
      },
    },
  },
  plugins: [],
};
