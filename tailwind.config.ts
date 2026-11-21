import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0A0A0A",
        mist: "#F4F4F5",
        paper: "#FFFFFF",
        steel: {
          DEFAULT: "#71717A",
          soft: "#A1A1AA",
          line: "#E4E4E7",
          mute: "#52525B",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 8px 30px rgba(0,0,0,0.06), 0 2px 8px rgba(0,0,0,0.04)",
        pill: "0 2px 8px rgba(0,0,0,0.06)",
        btn: "0 4px 14px rgba(0,0,0,0.18)",
      },
      borderRadius: {
        card: "16px",
        btn: "10px",
      },
    },
  },
  plugins: [],
};

export default config;