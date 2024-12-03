/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      transitionDuration: {
        'default': '300ms'
      },
      backdropBlur: {
        'xs': '2px',
      },
      colors: {
        primary: {
          DEFAULT: '#2563eb',     // Azul moderno e vibrante
          light: '#8E9BFF',
          dark: '#5163FF'
        },
        secondary: {
          DEFAULT: '#00C8B3',     // Verde-água minimalista
          light: '#33D4C4',
          dark: '#00B3A1'
        },
        accent: {
          DEFAULT: '#FFB084',     // Pêssego suave
          light: '#FFC5A3',
          dark: '#FF9B66'
        },
        background: {
          DEFAULT: '#F8FAFC',     // Ultra clean
          light: '#FFFFFF',
          dark: '#EEF2F6'
        },
        text: {
          DEFAULT: '#2D3748',     // Texto elegante
          muted: '#64748B',
          light: '#475569'
        }
      },
      backgroundImage: {
      'gradient-primary': 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 50%, #3b82f6 100%)',
      'gradient-banner': 'linear-gradient(to right, #F8FAFC 0%, #EEF2F6 100%)'
      },
      boxShadow: {
        'soft': '0 1px 3px rgba(0, 0, 0, 0.04)',
        'medium': '0 2px 4px rgba(0, 0, 0, 0.06)',
      },
      borderRadius: {
        'xl': '0.625rem',
        '2xl': '0.875rem'
      }
    },
  },
  plugins: [],
}
