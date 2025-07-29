/** @type {import('tailwindcss').Config} */
module.exports = {
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: "#00542F",

          secondary: "#FFB000",

          accent: "#00c3ec",

          neutral: "#051c1d",

          "base-100": "#f5f5f4",

          info: "#00f3ff",

          success: "#00a56f",

          warning: "#ffba00",

          error: "#ff4d61",
        },
      },
    ],
  },
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
};
