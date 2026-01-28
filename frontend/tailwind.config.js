/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        nashtech: {
          'primary': '#0066cc',
          'primary-soft': '#e6f0ff',
          'secondary': '#ff6600',
          'accent': '#00a86b',
          'surface': '#ffffff',
          'text': '#1a202c',
          'text-light': '#4a5568',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
      },
      boxShadow: {
        'soft': '0 10px 30px -10px rgba(0,0,0,0.08)',
        'glass': '0 20px 40px -10px rgba(0,0,0,0.15)',
      }
    },
  },
  plugins: [],
}
