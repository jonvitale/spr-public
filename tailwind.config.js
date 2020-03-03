/*
 ** TailwindCSS Configuration File
 **
 ** Docs: https://next.tailwindcss.com/docs/configuration
 ** Default: https://github.com/tailwindcss/tailwindcss/blob/next/stubs/defaultConfig.stub.js
 */

module.exports = {
  theme: {
    extend: {
      colors: {
        "spr-intervene": '#c0504d',
        "spr-watch": "#f79646",
        "spr-reinforce": "#00b050",
        "spr-model": "#0070c0",
        "selected": "#009845",
        "excluded": "#a9a9a9",
        "dark-blue": "#2a4365",
      }, 
    },
    fontSize: {
      xs: '.75rem',
      sm: '.875rem',
      tiny: '.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
      '6xl': '4rem',
      '7xl': '5rem',
    },
    // height: {
      // 'schoolbox-mobile': '20rem',
      // 'schoolbox-tall': '97rem',
    // }
  },
  variants: {},
  plugins: [require("@tailwindcss/custom-forms")]
}
