/**
 * Remember to restart VSCode after making
 * any changes here and saving this file.
 */
module.exports = {
  arrowParens: 'always',
  quoteProps: 'preserve',
  bracketSameLine: false,
  endOfLine: "lf",
  importOrder: [
    '^react$',
    '',
    '<THIRD_PARTY_MODULES>',
    '',
    '^@/components/(.*)$',
    '^@/containers/(.*)$',
    '^@/utils/(.*)$',
    '',
    '^@/types/(.*)$',
    '^@/assets/(.*)$',
    '',
    '^[./]',
    '',
  ],
  importOrderParserPlugins: ['typescript', 'jsx', 'decorators-legacy'],
  plugins: [
    '@ianvs/prettier-plugin-sort-imports',
  ],
  printWidth: 80,
  semi: true,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'all',
  useTabs: false,
  importOrderSeparation: true,
  importOrderCaseInsensitive: true,
  importOrderGroupNamespaceSpecifiers: true,
  importOrderParserPlugins: ['typescript', 'jsx', 'decorators-legacy'],
  importOrderMergeDuplicateImports: true,
  importOrderCombineTypeAndValueImports: true,
};
