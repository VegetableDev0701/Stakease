/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'gotham-black': 'Gotham-Black',
        inter: 'Inter',
      },
      backgroundImage: {
        'radial-gradient':
          'radial-gradient(50% 50% at 50% 50%, #6978DB 19.58%, #34FEFE 45.1%, #95B9FF 64.9%, #AB71F4 86.25%)',
        'button-normal': 'linear-gradient(94deg, #6978DB 0%, #AB71F4 100%)',
        'button-hover': 'linear-gradient(94deg, #697BF2 0%, #A6F 100%)',
      },
    },
  },
  plugins: [],
};
