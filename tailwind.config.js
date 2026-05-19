/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: '#FACC15',
        'primary-light': '#FEF08A',
        'primary-dark': '#CA8A04',
        surface: '#FFFFFF',
        'surface-2': '#FAFAFA',
        'surface-3': '#F5F5F5',
        muted: '#E5E7EB',
        text: '#111827',
        'text-2': '#6B7280',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
    },
  },
  plugins: [],
}
