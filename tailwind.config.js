/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        glow: '0 0 0 1px rgba(59,130,246,0.2), 0 24px 80px rgba(15,23,42,0.5)',
      },
      colors: {
        accent: {
          500: '#22c55e',
          600: '#16a34a',
        },
      },
    },
  },
  plugins: [],
};
