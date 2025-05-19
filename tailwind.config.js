/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#5272F2',
          50: '#EEF2FF',
          100: '#DCE3FE',
          200: '#BCC8FD',
          300: '#9BAAFC',
          400: '#7B8CFA',
          500: '#5272F2',
          600: '#3F5BD8',
          700: '#3447B3',
          800: '#29378A',
          900: '#1F2965',
          light: '#8EA7FF',
          dark: '#3447B3'
        },
        secondary: {
          DEFAULT: '#42A5F5',
          50: '#EBF5FE',
          100: '#D6EBFD',
          200: '#AED6FB',
          300: '#86C1F9',
          400: '#5EADF7',
          500: '#42A5F5',
          600: '#2A8DD8',
          700: '#1F6FB0',
          800: '#175388',
          900: '#104060',
          light: '#86C1F9',
          dark: '#1F6FB0'
        },
        accent: {
          DEFAULT: '#FF6B6B',
          light: '#FF9B9B',
          dark: '#E54D4D'
        },
        success: '#10B981',
        warning: '#FBBF24',
        error: '#EF4444',
        surface: {
          50: '#f8fafc',   // Lightest
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',  // Added
          500: '#64748b',  // Added
          600: '#475569',  // Added
          700: '#334155',  // Added
          800: '#1e293b',  // Added
          900: '#0f172a',   // Darkest
          950: '#0A101E'
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        heading: ['Inter', 'ui-sans-serif', 'system-ui'],
        mono: ['Roboto Mono', 'ui-monospace', 'monospace']
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #5272F2 0%, #42A5F5 100%)',
        'gradient-secondary': 'linear-gradient(135deg, #42A5F5 0%, #64B6FF 100%)',
        'gradient-accent': 'linear-gradient(135deg, #FF6B6B 0%, #FFA1A1 100%)',
        'gradient-success': 'linear-gradient(135deg, #10B981 0%, #34D399 100%)',
        'gradient-warning': 'linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%)',
        'gradient-error': 'linear-gradient(135deg, #EF4444 0%, #F87171 100%)',
        'gradient-dark': 'linear-gradient(135deg, #1E293B 0%, #334155 100%)',
        'gradient-light': 'linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%)',
        'gradient-glass': 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.06) 100%)'
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
        'neu-light': '5px 5px 15px #d1d9e6, -5px -5px 15px #ffffff',
        'neu-dark': '5px 5px 15px rgba(0, 0, 0, 0.3), -5px -5px 15px rgba(255, 255, 255, 0.05)'
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem'
      }
    }
  },
  plugins: [],
  darkMode: 'class',
}