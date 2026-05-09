/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        canvas: "#000000",
        "surface-soft": "#0d0d0d",
        "surface-card": "#1a1a1a",
        "surface-elevated": "#262626",
        "carbon-gray": "#2b2b2b",
        "m-blue-light": "#0066b1",
        "m-blue-dark": "#1c69d4",
        "m-red": "#e22718",
        "on-dark": "#ffffff",
        body: "#bbbbbb",
        "body-strong": "#e6e6e6",
        muted: "#7e7e7e",
        hairline: "#3c3c3c",
        "hairline-strong": "#262626",
      },
      fontFamily: {
        display: ["Inter", "system-ui", "sans-serif"],
        body: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
