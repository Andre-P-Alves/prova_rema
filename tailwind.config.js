/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        rema: {
          cream: '#FAF0DC',
          tan: '#D4A07A',
          dark: '#1A1008',
          'dark-mid': '#2D1A0A',
          orange: '#C96010',
          rust: '#8B3808',
        },
      },
    },
  },
  plugins: [],
};
