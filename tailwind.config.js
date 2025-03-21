module.exports = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        white: "var(--white)",
        gray: {
          300: "var(--gray-300)",
          500: "var(--gray-500)",
          600: "var(--gray-600)",
        },
        dark: {
          100: "var(--dark-100)",
          200: "var(--dark-200)",
        },
        blue: "var(--blue)",
        orange: "var(--orange)",
        text: "var(--text)",
        background: "var(--background)",
        headline: "var(--headline)",
        border: "var(--border)",
      },
    },
  },
  plugins: [],
};
