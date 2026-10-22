/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        rtk: { red: '#A82227', dark: '#8B1C20', beige: '#A5968A', light: '#FCE8E9', bg: '#F5F1ED' }
      },
      keyframes: {
        'slide-up': { from: { transform: 'translateY(100%)', opacity: 0 }, to: { transform: 'translateY(0)', opacity: 1 } },
        'fade-in': { from: { opacity: 0 }, to: { opacity: 1 } },
        'pulse-path': { '0%,100%': { strokeOpacity: 1 }, '50%': { strokeOpacity: 0.5 } },
      },
      animation: {
        'slide-up': 'slide-up 0.3s ease-out',
        'fade-in': 'fade-in 0.2s ease-out',
        'pulse-path': 'pulse-path 1.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
