import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontSize: {
        /*
            https://type-scale.com/
            21px base size, 1.414 ratio
        */
        h1: [
          "5.653rem",
          {
            lineHeight: "122px",
          },
        ],

        h2: ["3.998rem", "83.95px"],
        h3: ["2.827rem", "59.37px"],
        h4: ["1.999rem", "41.99px"],
        h5: ["1.414rem", "29.69px"],
        h6: ["1rem", "21px"],
        h7: ["0.707rem", "14.85px"],
        p: ["1rem", "25px"],
      },
    },
  },
  plugins: [],
};
export default config;
