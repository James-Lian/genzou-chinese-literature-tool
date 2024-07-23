/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        qnormal: ["quardratic", "sans-serif"],
        qbold: ["quardraticb", "sans-serif"],
        qitalic: ["quardratici", "sans-serif"],
        qbolditalics: ["quardraticz", "sans-serif"]
      }
    },
  },
  plugins: [],
}