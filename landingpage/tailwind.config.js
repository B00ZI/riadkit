/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./js/*.js"],
  theme: {
    extend: {
      colors: {
        // Brand palette (source of truth)
        ivory: "#FAF8F5",
        primary: {
          DEFAULT: "#A63D40",
          dark: "#8A3134",
          deeper: "#6E272A",
          soft: "#C4696B",
          50: "#FBF1F1",
          100: "#F6E3E4",
        },
        sand: {
          DEFAULT: "#E9D8C5",
          light: "#F3E9DC",
          dark: "#D8C2A8",
        },
        ink: "#2B2B2B",
        muted: "#666666",
        line: "#EEE6DD",
        night: {
          DEFAULT: "#211B1A",
          soft: "#2C2422",
          card: "#332A28",
        },
      },
      fontFamily: {
        sans: ["Manrope", "ui-sans-serif", "system-ui", "Segoe UI", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(43,43,43,.04), 0 8px 24px -12px rgba(43,43,43,.12)",
        lift: "0 2px 4px rgba(43,43,43,.05), 0 24px 48px -24px rgba(43,43,43,.25)",
        phone: "0 8px 16px -8px rgba(33,27,26,.35), 0 40px 80px -32px rgba(33,27,26,.45)",
      },
      maxWidth: {
        shell: "72rem",
      },
      keyframes: {
        floaty: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        floatySlow: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-16px)" },
        },
      },
      animation: {
        floaty: "floaty 6s ease-in-out infinite",
        floatySlow: "floatySlow 9s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
