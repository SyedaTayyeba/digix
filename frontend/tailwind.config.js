/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Brand: #2fbcba stays the DEFAULT, so bg-brand / text-brand /
        // border-brand/40 etc. keep working everywhere. The scale adds
        // lighter tints for text on dark and deeper shades for depth.
        brand: {
          DEFAULT: '#2fbcba',
          50: '#effefd',
          100: '#d3faf8',
          200: '#a9f0ed',
          300: '#75e0dd',
          400: '#47cdcb',
          500: '#2fbcba',
          600: '#1f9797',
          700: '#1d7878',
          800: '#1d5f61',
          900: '#1c4f51',
        },
        // Supporting accents. Used sparingly, and always rotated across
        // cards / stats / steps so the page has colour without noise.
        iris: { DEFAULT: '#8f7dff', 200: '#d0c8ff', 300: '#b3a6ff' },
        coral: { DEFAULT: '#ff8a6b', 200: '#ffd0c3', 300: '#ffb09a' },
        sun: { DEFAULT: '#ffc65c', 200: '#ffe6ad', 300: '#ffd785' },
        azure: { DEFAULT: '#4cc3ff', 200: '#b8e7ff', 300: '#87d6ff' },
        // Text tones tuned for readability on the dark canvas.
        soft: '#ffffff',
        muted: '#ffffff',
        // Deep teal-tinted darks (replaces flat #0a0a0a / black overlays).
        ink: {
          950: '#04141a',
          900: '#071e26',
          800: '#0b2a33',
          700: '#12383f',
          600: '#1b4a52',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 0 0 rgba(255,255,255,0.06) inset, 0 18px 40px -18px rgba(0,0,0,0.55)',
        glow: '0 10px 30px -8px rgba(47,188,186,0.55)',
      },
    },
  },
  plugins: [],
};
