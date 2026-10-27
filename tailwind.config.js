/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        soft: '0 18px 45px rgba(15, 23, 42, 0.18)',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        gallery: {
          ink: '#111827',
          stone: '#f5f5f4',
          accent: '#d97706',
        },
      },
    },
  },
  plugins: [],
};
