/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'mono': ['Share Tech Mono', 'JetBrains Mono', 'monospace'],
      },
      animation: {
        'blink': 'blink 1s step-end infinite',
        'fadeIn': 'fadeIn 2s ease-in-out',
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0 },
        },
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        }
      },
          'light-blue': '#00AAFF',
          'grey': '#C0C0C0',
          'light-grey': '#D3D3D3',
          'button': '#B0B0B0',
        }
      },
      fontFamily: {
        'mono': ['Share Tech Mono', 'JetBrains Mono', 'Consolas', 'Monaco', 'monospace'],
      },
      boxShadow: {
        'terminal': '0 0 10px rgba(0, 255, 217, 0.6)',
        'terminal-strong': '0 0 15px rgba(0, 255, 217, 0.8), 0 0 30px rgba(0, 255, 217, 0.4)',
        'classic': 'inset 1px 1px 0px #FFFFFF, inset -1px -1px 0px #707070',
      },
      animation: {
        'terminal-cursor': 'blink 1s step-end infinite',
        'boot-text': 'fadeIn 2s ease-in-out',
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0 },
        },
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        }
      }
    },
  },
  plugins: [],
}
