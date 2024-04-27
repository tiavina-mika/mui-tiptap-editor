/**
 * Remember to restart VSCode after making
 * any changes here and saving this file.
 */
module.exports = {
  arrowParens: 'always',
  quoteProps: 'preserve',
  bracketSameLine: false,
  endOfLine: "lf",
  importOrderParserPlugins: ['typescript', 'jsx', 'decorators-legacy'],
  plugins: [
    '"plugins": ["prettier-plugin-organize-imports"]',
  ],
  printWidth: 80,
  semi: true,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'all',
  useTabs: false,
};
