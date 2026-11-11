/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        gym: {
          50: '#f0fdf4',
          100: '#dcfce7',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          accent: '#10b981',
          gold: '#f59e0b',
          electric: '#3b82f6',
          dark: '#0f172a',
          surface: '#1e293b',
          card: '#182234'
        }
      }
    },
  },
  plugins: [],
}

