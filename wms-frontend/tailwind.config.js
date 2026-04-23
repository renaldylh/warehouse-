/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f5f7ff',
          100: '#ebf0fe',
          200: '#dae3fd',
          300: '#bccaf9',
          400: '#94a8f4',
          500: '#6d81ee',
          600: '#4e5de4',
          700: '#3d49cd',
          800: '#363fa7',
          900: '#313985',
          950: '#1d214e',
        },
      },
    },
  },
  plugins: [],
}
