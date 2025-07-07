/** @type {import('prettier').Config} */
module.exports = {
  semi: true,
  singleQuote: true,
  trailingComma: 'all',
  tabWidth: 2,
  useTabs: false,
  printWidth: 80,
  endOfLine: 'lf',
  bracketSpacing: true,
  arrowParens: 'avoid',
  jsxSingleQuote: true,
  plugins: ['prettier-plugin-tailwindcss'],
}; 