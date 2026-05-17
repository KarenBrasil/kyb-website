/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg:       '#0a0a0f',
        surface:  '#111118',
        surface2: '#1a1a24',
        surface3: '#22222f',
        border:   '#2a2a3a',
        accent:   '#c8f135',
        accent2:  '#8b5cf6',
        accent3:  '#f135a0',
        kyb:      '#c8f135',
      },
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body:    ['DM Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
