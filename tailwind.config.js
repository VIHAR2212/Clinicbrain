/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        obsidian: '#0F1923',
        'deep-teal': '#0D5C63',
        teal: '#1A8A8F',
        mint: '#5EC8C2',
        sage: '#A8C5B5',
        ivory: '#F5F0E8',
        'warm-white': '#FAFAF7',
        amber: '#E8A04A',
        coral: '#E8614A',
        lavender: '#8B7EC8',
        slate: '#4A5568',
        mist: '#E2EBE9',
      },
      fontFamily: {
        serif: ['"DM Serif Display"', 'serif'],
        sans: ['"DM Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'card': '0 4px 24px rgba(15,25,35,0.08)',
        'card-hover': '0 12px 40px rgba(15,25,35,0.14)',
        'teal': '0 8px 24px rgba(26,138,143,0.3)',
      },
      animation: {
        'pulse-dot': 'pulseDot 1.5s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        pulseDot: {
          '0%, 100%': { opacity: 1, transform: 'scale(1)' },
          '50%': { opacity: 0.5, transform: 'scale(1.4)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        }
      }
    },
  },
  plugins: [],
}
