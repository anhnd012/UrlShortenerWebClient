/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#F8FAFC",
        surface: "#FFFFFF",
        "surface-muted": "#F1F5F9",
        "text-primary": "#0F172A",
        "text-secondary": "#64748B",
        "text-muted": "#94A3B8",
        border: "#E2E8F0",
        "border-strong": "#CBD5E1",
        primary: {
          DEFAULT: "#4F46E5",
          hover: "#4338CA",
          soft: "#EEF2FF",
        },
        success: {
          DEFAULT: "#15803D",
          soft: "#DCFCE7",
        },
        warning: {
          DEFAULT: "#B45309",
          soft: "#FEF3C7",
        },
        danger: {
          DEFAULT: "#B91C1C",
          soft: "#FEE2E2",
        },
        info: {
          DEFAULT: "#0369A1",
          soft: "#E0F2FE",
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      borderRadius: {
        input: "8px",
        button: "8px",
        card: "12px",
        modal: "16px",
        badge: "9999px",
      },
      boxShadow: {
        subtle: "0 1px 2px rgb(15 23 42 / 0.04)",
      },
    },
  },
  plugins: [],
}
