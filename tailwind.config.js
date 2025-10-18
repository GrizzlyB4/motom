/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./App.tsx",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./services/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'media',
  theme: {
    extend: {
      colors: {
        primary: '#E63946',
        'background-light': '#F8F9FA',
        'background-dark': '#1E1E1E',
        'card-light': '#FFFFFF',
        'card-dark': '#2C2C2C',
        'border-light': '#D9D9D9',
        'border-dark': '#3D3D3D',
        'foreground-light': '#1E1E1E',
        'foreground-dark': '#F8F9FA',
        'foreground-muted-light': '#6c757d',
        'foreground-muted-dark': '#A0A0A0',
      }
    },
  },
  plugins: [],
}