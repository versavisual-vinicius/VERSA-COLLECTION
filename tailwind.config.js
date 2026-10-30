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
          bg: '#F6F8F9',
          surface: '#ffffff',
          stone: '#11161B',
          accent: '#5E7F8C',
          accentHover: '#4e6d7a',
        },
      },
    },
  },
  plugins: [],
};
