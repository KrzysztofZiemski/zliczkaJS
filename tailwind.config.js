module.exports = {
  purge: {
    mode: 'all',
    preserveHtmlElements: false,
    content: [
      './src/**/*.js',
      './src/**/*.ts',
      './node_modules/flatpickr/**/*.js',
    ],
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
    minHeight: {
      '0': '0',
      '1/4': '25%',
      '1/2': '50%',
      '3/4': '75%',
      'full': '100%',
    },
    borderWidth: {
      DEFAULT: '1px',
      '0': '0',
      '2': '2px',
      '3': '3px',
      '4': '4px',
      '6': '6px',
      '8': '8px',
      '16': '16px'
    }
  },
  variants: {
    extend: {},
  },
  plugins: [],

}
