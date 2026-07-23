import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: { "2xl": "1280px" },
    },
    extend: {
      colors: {
        base: "#05070d",
        surface: {
          DEFAULT: "#0d1420",
          raised: "#121b2c",
          border: "#1e2a3d",
        },
        brand: {
          50: "#ecfdf3",
          200: "#a7f3c6",
          400: "#4ade80",
          DEFAULT: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
          glow: "#22c55e33",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-space)", "var(--font-inter)", "sans-serif"],
        mono: ["var(--font-jbmono)", "monospace"],
      },
      backgroundImage: {
        "hero-grid":
          "linear-gradient(to bottom, rgba(5,7,13,0) 0%, #05070d 90%), radial-gradient(circle at 50% -20%, #16a34a44 0%, transparent 60%)",
        "scan-line":
          "linear-gradient(180deg, transparent 0%, #22c55e22 50%, transparent 100%)",
      },
      keyframes: {
        "scan": {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        scan: "scan 3s linear infinite",
        "fade-up": "fade-up .4s ease-out both",
        "accordion-down": "accordion-down .2s ease-out",
        "accordion-up": "accordion-up .2s ease-out",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
