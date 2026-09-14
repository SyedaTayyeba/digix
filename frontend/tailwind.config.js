/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // The site's single accent color, per client spec. Referenced as
        // bg-brand, text-brand, border-brand, ring-brand, etc. — and all
        // of those support opacity modifiers (bg-brand/20, border-brand/40)
        // since it's defined as a plain hex string.
        brand: '#2fbcba',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['Inter', 'system-ui', 'sans-serif'],
      },
      screens: {
        // svh-aware min height handled via CSS utility, see index.css
      },
    },
  },
  plugins: [],
};
