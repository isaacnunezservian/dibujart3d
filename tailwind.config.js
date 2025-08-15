/** @type {import('tailwindcss').Config} */
const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'off-red': {
          DEFAULT: '#f30f0f',
          100: '#310303',
          200: '#630505',
          300: '#940808',
          400: '#c60a0a',
          500: '#f30f0f',
          600: '#f54141',
          700: '#f87171',
          800: '#faa0a0',
          900: '#fdd0d0'
        },
        'night': {
          DEFAULT: '#181516',
          100: '#050404',
          200: '#0a0909',
          300: '#0f0d0d',
          400: '#141112',
          500: '#181516',
          600: '#4a4144',
          700: '#7c6c71',
          800: '#a99ca0',
          900: '#d4cdd0'
        },
        'hunyadi-yellow': {
          DEFAULT: '#f3c373',
          100: '#422b06',
          200: '#83550b',
          300: '#c58011',
          400: '#eda531',
          500: '#f3c373',
          600: '#f5ce8e',
          700: '#f8daab',
          800: '#fae6c7',
          900: '#fdf3e3'
        },
        'poppy': {
          DEFAULT: '#da4243',
          100: '#300909',
          200: '#5f1313',
          300: '#8f1c1c',
          400: '#bf2626',
          500: '#da4243',
          600: '#e16969',
          700: '#e98f8f',
          800: '#f0b4b4',
          900: '#f8dada'
        }
      }
    },
  },
  plugins: [],
});

