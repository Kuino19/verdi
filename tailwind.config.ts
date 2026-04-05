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
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "var(--primary)",
          rgb: "var(--primary-rgb)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
        },
        card: "var(--card)",
        muted: "var(--muted)",
        border: "var(--card-border)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        serif: ["var(--font-playfair)", "serif"],
      },
      backdropBlur: {
        xs: "2px",
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
        "6xl": "3rem",
      },
      boxShadow: {
        "primary-glow": "0 0 30px rgba(var(--primary-rgb), 0.3)",
        "primary-lg": "0 10px 30px rgba(var(--primary-rgb), 0.25)",
        "3xl": "0 35px 60px -15px rgba(0, 0, 0, 0.6)",
      },
      animation: {
        "bounce-slow": "bounce 3s linear infinite",
      },
      minHeight: {
        screen: "100vh",
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
  ],
};

export default config;
