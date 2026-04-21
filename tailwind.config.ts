import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // 母親節活動主色系
        pink: {
          50: '#fff0f5',
          100: '#ffe0ec',
          200: '#ffc0d9',
          300: '#ff91b8',
          400: '#ff5f96',
          500: '#ff3474',
          600: '#f0135a',
          700: '#cc0a4a',
          800: '#a80c40',
          900: '#8c0f39',
        },
        rose: {
          50: '#fff1f2',
          100: '#ffe4e6',
          200: '#fecdd3',
          300: '#fda4af',
          400: '#fb7185',
          500: '#f43f5e',
        },
        lavender: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
        },
        peach: {
          50: '#fff8f0',
          100: '#ffecd6',
          200: '#ffd5a8',
          300: '#ffb96b',
          400: '#ff9530',
          500: '#ff7b00',
        },
      },
      backgroundImage: {
        'gradient-pink': 'linear-gradient(135deg, #fff0f5 0%, #fce7f3 25%, #f3e8ff 50%, #fdf4ff 100%)',
        'gradient-card': 'linear-gradient(160deg, #fff0f5 0%, #fce7f3 30%, #f5f3ff 60%, #fff0f5 100%)',
        'gradient-hero': 'linear-gradient(135deg, #fce7f3 0%, #f9a8d4 20%, #f3e8ff 50%, #e9d5ff 80%, #fce7f3 100%)',
      },
      fontFamily: {
        sans: ['var(--font-noto)', 'Noto Sans TC', 'sans-serif'],
        serif: ['var(--font-playfair)', 'Playfair Display', 'Georgia', 'serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 8s ease-in-out infinite',
        'pulse-soft': 'pulseSoft 3s ease-in-out infinite',
        'pop-in': 'popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        'fade-up': 'fadeUp 0.5s ease-out',
        'sparkle': 'sparkle 2s ease-in-out infinite',
        'bounce-soft': 'bounceSoft 2s ease-in-out infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' },
        },
        popIn: {
          '0%': { opacity: '0', transform: 'scale(0.3)' },
          '60%': { opacity: '1', transform: 'scale(1.1)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        sparkle: {
          '0%, 100%': { opacity: '0.3', transform: 'scale(0.8) rotate(0deg)' },
          '50%': { opacity: '1', transform: 'scale(1.2) rotate(180deg)' },
        },
        bounceSoft: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-5deg)' },
          '50%': { transform: 'rotate(5deg)' },
        },
      },
      boxShadow: {
        'soft': '0 4px 20px rgba(255, 105, 180, 0.15)',
        'glow': '0 0 30px rgba(255, 105, 180, 0.3)',
        'card': '0 8px 40px rgba(200, 100, 150, 0.15)',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
    },
  },
  plugins: [],
};

export default config;
