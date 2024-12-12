/** @type {import('tailwindcss').Config} */
export default {
  // TODO
  // corePlugins: {
  //   // Using Mantine with Tailwind
  //   // https://shenyien.hashnode.dev/using-mantine-with-tailwind
  //   preflight: false,
  // },
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      screens: {
        // Updated to match mantine breakpoints
        xs: '36em',
        sm: '48em',
        md: '62em',
        lg: '75em',
        xl: '88em'
      }
    }
  },
  plugins: []
};
