/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy:     '#141e35',
        'navy-mid':  '#1a2744',
        teal:     '#3d8b75',
        'teal-dark': '#0f4a3a',
        'teal-light':'#a8d8c8',
        'teal-pale': '#e1f5ee',
        cream:    '#faf7f2',
      },
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}