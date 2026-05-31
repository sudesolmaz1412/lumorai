import type { Config } from "tailwindcss";

const config: Config = {
  // Tailwind'in hangi klasörlerdeki CSS sınıflarını okuyacağını belirliyoruz
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Senin özel renk paletin
        lumoraGold: "#C9A14A",
        lumoraNavy: "#060B16",
        lumoraDark: "#0E1728",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
export default config;