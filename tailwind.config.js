/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          900: '#1F2937',
          800: '#283448',
          700: '#374151',
          600: '#4B5563',
          500: '#6B7280',
          400: '#9CA3AF',
          300: '#D1D5DB',
          200: '#E5E7EB',
          100: '#F3F4F6',
        },
        accent: {
          900: '#7C2D12',
          800: '#9A3412',
          700: '#C2410C',
          600: '#DD6B20',
          500: '#F97316',
          400: '#FB923C',
          300: '#FDBA74',
          200: '#FED7AA',
          100: '#FFEDD5',
        },
        cream: {
          50: '#FFFBF7',
          100: '#FFF7ED',
          200: '#FEF3E2',
          300: '#FDE8D0',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
