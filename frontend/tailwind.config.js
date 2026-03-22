/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#e8f5f0",
          100: "#c3e6d8",
          200: "#9dd6be",
          300: "#77c7a4",
          400: "#51b78a",
          500: "#2fa86f",
          600: "#259059",
          700: "#1b7844",
          800: "#11602f",
          900: "#07481a",
        },
        dark: {
          100: "#2a2f3b",
          200: "#222731",
          300: "#1a1e27",
          400: "#13161e",
          500: "#0d0f15",
        },
      },
      fontFamily: {
        sans: ["'DM Sans'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      animation: {
        "fade-in": "fadeIn 0.2s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
        pulse2: "pulse2 1.5s infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulse2: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.4" },
        },
      },
    },
  },
  plugins: [],
};
