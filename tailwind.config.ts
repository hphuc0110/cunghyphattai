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
      },
      animation: {
        cloudMove: 'cloudMove 30s ease-in-out infinite',
      },
    },
  },
  plugins: [],
} satisfies Config
