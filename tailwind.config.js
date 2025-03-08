module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "background-dark": "var(--background-dark)",
        "primary-gold": "var(--primary-gold)",
        "secondary-red": "var(--secondary-red)",
        "text-light": "var(--text-light)",
        "text-muted": "var(--text-muted)",
        "button-blue": "var(--button-blue)",
        "border-light": "var(--border-light)",
      },
    },
  },
  plugins: [],
};
