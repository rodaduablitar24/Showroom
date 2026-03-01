/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-display)'],
        body: ['var(--font-body)'],
      },
      colors: {
        brand: {
          50: '#fdfaf0',
          100: '#fbf5e1',
          200: '#f7ebb3',
          300: '#f3e185',
          400: '#efd757',
          500: '#d4af37',
          600: '#b8972f',
          700: '#9c8028',
          800: '#806921',
          900: '#64521a',
        },
        gold: {
          50: '#fdfaf0',
          100: '#fbf5e1',
          200: '#f7ebb3',
          300: '#f3e185',
          400: '#efd757',
          500: '#d4af37',
          600: '#b8972f',
          700: '#9c8028',
          800: '#806921',
          900: '#64521a',
        },
        navy: {
          950: '#020617',
          900: '#0a1930',
          850: '#0f2444',
          800: '#1e293b',
          700: '#334155',
        },
        dark: {
          950: '#010409',
          900: '#0a1931',
          850: '#0f2444',
          800: '#122b54',
          700: '#1a365d',
          600: '#2a4365',
          500: '#2d3748',
          400: '#4a5568',
          300: '#718096',
        }
      },
      boxShadow: {
        'glow-brand': '0 0 25px -5px rgba(212, 175, 55, 0.4)',
        'glow-green': '0 0 20px -5px rgba(34, 197, 94, 0.3)',
        'glow-yellow': '0 0 20px -5px rgba(212, 175, 55, 0.3)',
        'glow-gold': '0 0 25px -5px rgba(212, 175, 55, 0.5)',
        'soft-xl': '0 20px 25px -5px rgb(0 0 0 / 0.5), 0 8px 10px -6px rgb(0 0 0 / 0.5)',
      }
    },
  },
  plugins: [],
}
