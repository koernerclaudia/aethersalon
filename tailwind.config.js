/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}', './app/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Dark Mode Colors
        dark: {
          bg: '#20222A',
          text: '#d8d1c3',
          accent: '#cdab67',
        },
        // Light Mode Colors
        light: {
          bg: '#f6e9bd',
          text: '#20222A',
          accent: '#cdab67',
        },
        // Shared Accent
        brass: '#cdab67',
      },
      fontFamily: {
        heading: ['EFCO Brookshire', 'serif'],
        body: ['Inter', 'sans-serif'],
      },
      animation: {
        'spin-slow': 'spin 20s linear infinite',
        'spin-slower': 'spin 30s linear infinite',
      },
    },
  },
  plugins: [],
}

