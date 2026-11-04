import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#07140d',
        panel: '#0d2217',
        line: '#1f4d34',
        accent: '#7dff9b',
        'accent-2': '#4fd17a',
        dim: '#8fcfa5',
        hi: '#d8ffe3',
      },
      fontFamily: {
        display: ['"Jacquard 12"', 'serif'],
        mono: ['"DotGothic16"', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.6875rem', { lineHeight: '1rem' }],
      },
      boxShadow: {
        window: '6px 6px 0 0 #1f4d34',
        glow: '0 0 24px rgba(125, 255, 155, 0.18)',
      },
      keyframes: {
        blink: { '0%, 49%': { opacity: '1' }, '50%, 100%': { opacity: '0' } },
        'window-in': {
          from: { opacity: '0', transform: 'translateY(8px) scale(0.985)' },
          to: { opacity: '1', transform: 'none' },
        },
        reveal: {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to: { opacity: '1', transform: 'none' },
        },
        // Barrido de pantalla: revela de arriba hacia abajo.
        'wipe-in': {
          from: { clipPath: 'inset(0 0 100% 0)' },
          to: { clipPath: 'inset(0 0 0 0)' },
        },
        // Barrido de salida: borra de arriba hacia abajo.
        'wipe-out': {
          from: { clipPath: 'inset(0 0 0 0)' },
          to: { clipPath: 'inset(100% 0 0 0)' },
        },
        'scan-line': {
          from: { top: '0%', opacity: '1' },
          '92%': { opacity: '1' },
          to: { top: '100%', opacity: '0' },
        },
        'scan-band': {
          from: { transform: 'translateY(-30vh)' },
          to: { transform: 'translateY(130vh)' },
        },
        'chip-in': {
          from: { opacity: '0', transform: 'translateX(-6px)' },
          to: { opacity: '1', transform: 'none' },
        },
        pulse: { '0%, 100%': { opacity: '1' }, '50%': { opacity: '0.35' } },
      },
      animation: {
        blink: 'blink 1s steps(1) infinite',
        'window-in': 'window-in 180ms ease-out',
        reveal: 'reveal 600ms cubic-bezier(.2,.7,.2,1) both',
        'wipe-in': 'wipe-in 650ms cubic-bezier(.7,0,.3,1) both',
        'wipe-out': 'wipe-out 700ms cubic-bezier(.7,0,.3,1) both',
        'scan-line': 'scan-line 700ms cubic-bezier(.7,0,.3,1) both',
        'scan-band': 'scan-band 9s linear infinite',
        'chip-in': 'chip-in 220ms ease-out both',
        pulse: 'pulse 1.6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
} satisfies Config;
