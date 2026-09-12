/** @type {import('tailwindcss').Config} */
const tailwindConfig = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Navy — primary brand (matches magazine #1c1c2e)
        primary: {
          50:  '#eeeef3',
          100: '#d0d0de',
          200: '#a9a9c1',
          300: '#7b7b9d',
          400: '#585880',
          500: '#3d3d62',
          600: '#2d2d44', // navy-mid
          700: '#1c1c2e', // navy
          800: '#13131f',
          900: '#0a0a12',
        },
        // Gold — accent (matches magazine #c9903e)
        gold: {
          50:  '#fdf6ea',
          100: '#f8e8c8',
          200: '#f0ce8e',
          300: '#e8b460',
          400: '#e0b06a', // gold-light
          500: '#c9903e', // gold
          600: '#b07830',
          700: '#8c5e22',
          800: '#6a4518',
          900: '#4a2e0e',
        },
        secondary: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
        title: 'rgb(28 28 46 / var(--tw-text-opacity, 1))',
        body: 'rgb(17 24 39 / var(--tw-text-opacity, 1))',
      },
      fontFamily: {
        sans: ['Quicksand', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
        display: ['Playfair Display', 'serif'],
      },
    },
  },
  plugins: [],
}

export default tailwindConfig
