/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        soft: '0 18px 45px rgba(0, 0, 0, 0.45)',
      },
      fontFamily: {
        sans: ['"DM Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        heading: ['Outfit', 'sans-serif'],
      },
      colors: {
        gallery: {
          bg: '#050A0D',
          surface: '#0c1015',
          stone: '#f5f5f4',
          accent: '#5E7F8C',
          accentHover: '#6e919f',
        },
      },
    },
  },
  plugins: [],
};
