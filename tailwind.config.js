/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["DM Sans", "system-ui", "sans-serif"],
        display: ["Instrument Serif", "Georgia", "serif"],
        condensed: ["Barlow Condensed", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
      },
      colors: {
        base: "#0A0A0F",
        ink: {
          950: "#05060a",
          900: "#0a0c12",
          850: "#0e1119",
          800: "#121622",
        },
        accent: {
          violet: "#7C3AFF",
          acid: "#39FF14",
        },
        meta: "#888888",
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
        "gradient-scroll":
          "linear-gradient(90deg, #7C3AFF 0%, #39FF14 50%, #7C3AFF 100%)",
        "card-border":
          "linear-gradient(180deg, #7C3AFF 0%, #39FF14 50%, #7C3AFF 100%)",
      },
      keyframes: {
        shimmer: {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "0.85" },
        },
        "gradient-shift": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        "cursor-blink": {
          "0%, 49%": { opacity: 1 },
          "50%, 100%": { opacity: 0.15 },
        },
        "nav-flash": {
          "0%": { color: "#ffffff", textDecorationLine: "none" },
          "50%": { color: "#39FF14" },
          "100%": { color: "#ffffff", textDecorationLine: "underline" },
        },
        glitch: {
          "0%": { transform: "translate(0)", textShadow: "none" },
          "20%": {
            transform: "translate(-2px, 1px)",
            textShadow: "2px 0 #7C3AFF, -2px 0 #39FF14",
          },
          "40%": {
            transform: "translate(2px, -1px)",
            textShadow: "-2px 0 #7C3AFF, 2px 0 #39FF14",
          },
          "60%": { transform: "translate(0)", textShadow: "none" },
          "100%": { transform: "translate(0)", textShadow: "none" },
        },
        ticker: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        shimmer: "shimmer 8s ease-in-out infinite",
        "gradient-shift": "gradient-shift 3s ease infinite",
        "cursor-blink": "cursor-blink 1s ease infinite",
        "nav-flash": "nav-flash 0.15s ease forwards",
        glitch: "glitch 0.45s ease forwards",
        ticker: "ticker 45s linear infinite",
      },
      backgroundSize: {
        "200": "200% 200%",
      },
    },
  },
  plugins: [],
};
