/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Aurora color palette
        background: "#03080f",
        surface: "rgba(8, 20, 35, 0.7)",
        glass: "rgba(255, 255, 255, 0.06)",
        glassBorder: "rgba(255, 255, 255, 0.12)",
        auroraGreen: "#4dffc3",
        auroraTeal: "#38bdf8",
        auroraPurple: "#c084fc",
        auroraViolet: "#818cf8",
        textMain: "#f0f4ff",
        textMuted: "rgba(200, 220, 255, 0.5)",
      },
      fontFamily: {
        sans: ['"Inter"', '"IBM Plex Sans"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      backdropBlur: {
        heavy: '40px',
        xl: '24px',
      },
      animation: {
        'float': 'float 8s ease-in-out infinite',
        'float-slow': 'float 12s ease-in-out infinite reverse',
        'float-delayed': 'float 10s ease-in-out 3s infinite',
        'pulse-soft': 'pulse-soft 3s ease-in-out infinite',
        'aurora-shift': 'aurora-shift 12s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) translateX(0px)' },
          '33%': { transform: 'translateY(-20px) translateX(10px)' },
          '66%': { transform: 'translateY(10px) translateX(-8px)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.9' },
        },
        'aurora-shift': {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '100% 50%' },
        },
      },
    },
  },
  plugins: [],
}
