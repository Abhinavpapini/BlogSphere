export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'neon-primary': 'var(--neon-primary)',
        'neon-secondary': 'var(--neon-secondary)',
        'dark': {
          'bg': 'var(--dark-bg)',
          'surface': 'var(--dark-surface)',
        }
      },
      backgroundColor: {
        'dark-bg': 'var(--dark-bg)',
      },
      fontFamily: {
        'sans': ['Inter', 'sans-serif'],
        'display': ['Oswald', 'sans-serif'],
      },
      boxShadow: {
        'neon': '0 0 5px var(--neon-primary), 0 0 20px var(--neon-primary)',
        'neon-lg': '0 0 10px var(--neon-primary), 0 0 40px var(--neon-primary)',
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          'from': { 
            'box-shadow': '0 0 5px var(--neon-primary), 0 0 20px var(--neon-primary)' 
          },
          'to': { 
            'box-shadow': '0 0 10px var(--neon-primary), 0 0 40px var(--neon-primary)' 
          },
        }
      }
    },
  },
  plugins: [],
}