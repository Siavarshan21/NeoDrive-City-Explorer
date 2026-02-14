import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/game/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'neo-cyan': '#00f0ff',
        'neo-magenta': '#ff00e5',
        'neo-yellow': '#ffe600',
        'neo-dark': '#0a0a1a',
        'neo-panel': 'rgba(10, 10, 26, 0.85)',
      },
      fontFamily: {
        mono: ['Courier New', 'monospace'],
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 5px rgba(0,240,255,0.3)' },
          '50%': { boxShadow: '0 0 20px rgba(0,240,255,0.8)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
