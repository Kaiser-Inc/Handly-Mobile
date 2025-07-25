// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {},
    colors: {
      white: '#fff',

      'purple-100': '#CEBDF2',
      'purple-300': '#CD8EFA',
      'purple-500': '#B87EF2',
      'purple-700': '#A36BF2',
      'purple-900': '#9356FC',

      'danger-100': '#FEF1F1',
      'danger-300': '#F05D6C',
      'green-500': '#14AE5C',

      'steam-100': '#F6F8FA',

      'gray-100': '#DAE4F2',
      'gray-200': '#C8D0DA',
      'gray-300': '#95A1B1',
      'gray-400': '#6F7D90',
      'gray-500': '#2A313C',
      'gray-600': '#21252C',
      'gray-700': '#191D24',
      'gray-800': '#13161B',
      'gray-900': '#0F1216',
    },
  },
  plugins: [],
}
