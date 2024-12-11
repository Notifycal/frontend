/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      screens: {
        // Updated to match mantine breakpoints
        'xs': '36em',
        'sm': '48em',
        'md': '62em',
        'lg': '75em',
        'xl': '88em',
      }
    }
  },
  plugins: []
};
