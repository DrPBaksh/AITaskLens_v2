/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'corndel-blue': '#0077cc',
        'corndel-beige': '#f5f2e8',
        'corndel-orange': '#ff6600',
      },
    },
  },
  plugins: [],
};
