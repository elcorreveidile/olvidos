import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        coral: {
          50: "#fff1f1",
          100: "#ffe3e3",
          200: "#ffc7c7",
          300: "#ff9b9b",
          400: "#ff6f6f",
          DEFAULT: "#ff6261",
          600: "#ff4f4e",
          700: "#e85555",
          800: "#c94646",
          900: "#a43c3c",
          light: "#fc9292",
          dark: "#e85555",
        },
        azul: {
          DEFAULT: "#013559",
          light: "#1a4d6e",
          dark: "#012844",
        },
        acero: {
          DEFAULT: "#617685",
          light: "#a1b6c4",
          dark: "#4a5c68",
        },
      },
      fontFamily: {
        sans: ["var(--font-libre-franklin)", "sans-serif"],
        editorial: ["var(--font-crimson-text)", "serif"],
      },
      fontSize: {
        "h1-article": [
          "90px",
          { lineHeight: "73px", letterSpacing: "-1px" },
        ],
        "h2-article": [
          "41px",
          { lineHeight: "1.2", letterSpacing: "-1px" },
        ],
      },
      maxWidth: {
        article: "695px",
        content: "1200px",
      },
      boxShadow: {
        card: "0px 0px 0px 1px rgba(161, 182, 196, 0.5)",
        "card-hover": "0px 4px 12px rgba(0, 0, 0, 0.15)",
      },
      spacing: {
        header: "80px",
      },
    },
  },
  plugins: [],
};

export default config;
