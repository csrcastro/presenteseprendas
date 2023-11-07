import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      screens: {
        xs: "479px",
      },
      zIndex: {
        1000: "1000",
      },
    },
    colors: {
      transparent: "transparent",
      background: "#fcf7f4",
      "background-darker": "#EAEAEA",
      text: "#212121",
      "text-light": "#757575",
      "text-lighter": "#BDBDBD",
      black: "#222222",
      white: "#FFFFFF",
      cold: "#0094fe",
      colder: "#005089",
      warm: "#ff4314",
      warmer: "#e60023",
      contrast: "#7c4dff",
      "contrast-cold": "#BDB0D9",
      "contrast-warm": "#BF0F30",
      highlight: "#3A1AF0",
      "highlight-cold": "#1A02A3",
    },
    fontFamily: {
      sans: [
        "-apple-system",
        "BlinkMacSystemFont",
        "avenir next",
        "avenir",
        "segoe ui",
        "helvetica neue",
        "helvetica",
        "Cantarell",
        "Ubuntu",
        "roboto",
        "noto",
        "arial",
        "sans-serif",
      ],
      serif: ["Montserrat", "sans-serif"],
    },
  },
  plugins: [
    require("@tailwindcss/aspect-ratio"),
    require("@tailwindcss/forms"),
  ],
  future: {
    hoverOnlyWhenSupported: true,
  },
} satisfies Config;
