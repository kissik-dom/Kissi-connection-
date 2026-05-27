/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        gold: { 50:'#FFF9E6',100:'#FFF0B3',200:'#FFE680',300:'#FFDB4D',400:'#FFD11A',500:'#C8A415',600:'#A38312',700:'#7A630D',800:'#524209',900:'#292104' },
        royal: { 50:'#F5F0E8',100:'#E8DCC8',200:'#D4C4A0',300:'#C0AC78',400:'#AC9450',500:'#8B7640',600:'#6A5A30',700:'#493E21',800:'#282211',900:'#1A1508' },
        kingdom: { dark:'#0D0A04', cream:'#FFF9E6', bronze:'#CD7F32', emerald:'#046A38' },
      },
    },
  },
  plugins: [],
}
