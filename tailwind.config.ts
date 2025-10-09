import type { Config } from 'tailwindcss'

export default {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      keyframes: {
        cloudMove: {
          '0%': { transform: 'translateX(0)' },
          '50%': { transform: 'translateX(40px)' },
          '100%': { transform: 'translateX(0)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(255,77,77,0.4)' },
          '50%': { boxShadow: '0 0 40px rgba(255,77,77,0.8)' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        swingSlow: {
          '0%, 100%': { transform: 'rotate(2deg)' },
          '50%': { transform: 'rotate(-2deg)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
      },
      animation: {
        'cloudMove': 'cloudMove 30s ease-in-out infinite',
        'glowPulse': 'glowPulse 1.5s ease-in-out infinite',
        'float-slow': 'floatSlow 6s ease-in-out infinite',
        'float-slow-delayed': 'floatSlow 7s ease-in-out infinite 1.5s',
        'swing-slow': 'swingSlow 5s ease-in-out infinite',
        'slow-shimmer': 'shimmer 10s linear infinite',
      },
    },
  },
  plugins: [],
} satisfies Config

