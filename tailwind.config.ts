import defaultTheme from 'tailwindcss/defaultTheme'
import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
  theme: {
    extend: {
      // 增加动画效果
      keyframes: {
        fadecolorB: {
          '0%, 16.667%, 100%': { opacity: '1' },
          '33.333%, 83.333%': { opacity: '0' }
        },
        fadecolorR: {
          '0%, 16.667%, 66.667%, 100%': { opacity: '0' },
          '33.333%, 50%': { opacity: '1' }
        },
        fadecolorY: {
          '0%, 50%, 100%': { opacity: '0' },
          '66.667%, 83.333%': { opacity: '1' }
        }
      },
      animation: {
        fadecolorB: 'fadecolorB 8s infinite',
        fadecolorR: 'fadecolorR 8s infinite',
        fadecolorY: 'fadecolorY 8s infinite'
      },
      colors: {
        slate: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020420'
        },
        green: {
          50: '#EFFDF5',
          100: '#D9FBE8',
          200: '#B3F5D1',
          300: '#75EDAE',
          400: '#00DC82',
          500: '#00C16A',
          600: '#00A155',
          700: '#007F45',
          800: '#016538',
          900: '#0A5331',
          950: '#052e16'
        }
      },
      fontFamily: {
        sans: ['DM Sans', 'DM Sans fallback', ...defaultTheme.fontFamily.sans]
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))'
      }
    }
  }
}
