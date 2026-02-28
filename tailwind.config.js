/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
      },
      screens: {
        'xs': '475px',      // Extra small devices (large phones)
        'sm': '640px',      // Small devices (tablets portrait) - default
        'md': '768px',      // Medium devices (tablets landscape) - default
        'lg': '1024px',     // Large devices (desktops) - default
        'xl': '1280px',     // Extra large devices (large desktops) - default
        '2xl': '1536px',    // 2X large devices (larger desktops) - default
        '3xl': '1920px',    // 3X large devices (full HD)
        '4xl': '2560px',    // 4X large devices (2K/QHD)
        // Custom board-specific breakpoints
        'board-xs': '400px',   // Tiny board (minimum viable)
        'board-sm': '600px',   // Small board (phones landscape)
        'board-md': '900px',   // Medium board (tablets)
        'board-lg': '1200px',  // Large board (desktops)
        'board-xl': '1600px',  // Extra large board (wide screens)
      },
      spacing: {
        'board-min': '320px',
        'board-max': '1200px',
      },
      minHeight: {
        'board': '320px',
        'board-sm': '400px',
        'board-md': '600px',
        'board-lg': '800px',
      },
      maxHeight: {
        'board': '1200px',
      },
      fontSize: {
        'xxs': '0.625rem',   // 10px - for very small text on tiny boards
      },
    },
  },
  plugins: [],
};
