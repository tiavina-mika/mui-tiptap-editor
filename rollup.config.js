import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import alias from '@rollup/plugin-alias';
import path from 'path';
import css from 'rollup-plugin-import-css';
import { dts } from 'rollup-plugin-dts';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import clear from 'rollup-plugin-clear';
import url from '@rollup/plugin-url';
import { terser } from 'rollup-plugin-terser';
import { visualizer } from 'rollup-plugin-visualizer';
import filesize from 'rollup-plugin-filesize'; // Ajout du plugin filesize
import babel from '@rollup/plugin-babel';
import preserveUseClientDirective from 'rollup-plugin-preserve-use-client';

const SRC_DIR = path.resolve(process.cwd(), 'src');
const DIST_DIR = 'dist';

const extensions = ['.js', '.jsx', '.ts', '.tsx'];

// Replace '@' in imports with the src directory
const aliasConfig = alias({
  entries: [{ find: '@', replacement: SRC_DIR }],
});

const pkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url)));

// Fonction pour extraire et formater les deps
const getExternalDeps = () => {
  const peerDeps = pkg.peerDependencies || {};

  // Combine et formate en array (ex. : ['react', 'react-dom', '@emotion/react'])
  return [
    ...Object.keys(peerDeps),
  ];
}

export default [
  // JS/TS Build
  {
    input: 'src/index.ts',
    output: {
      dir: DIST_DIR,
      format: 'esm',
      entryFileNames: '[name].mjs',
      preserveModules: true,
      preserveModulesRoot: 'src',
      sourcemap: true,
    },
    plugins: [
      clear({ targets: [DIST_DIR], watch: true }),
      aliasConfig,
      // Handle asset files
      url({
        include: [
          '**/*.svg',
          '**/*.png',
          '**/*.jpg',
          '**/*.gif',
          '**/*.woff2',
          '**/*.woff',
          '**/*.ttf',
        ],
        limit: 8192, // inline files < 8kb
        emitFiles: true,
        // Note: not using extname to keep original extensions since it's a .mjs extension
        fileName: '[dirname][name]',
      }),
      css({ minify: true }),
      peerDepsExternal(),
      resolve({ extensions }),
      commonjs(),
      typescript({
        clean: true,
        tsconfig: 'tsconfig.build.json',
        useTsconfigDeclarationDir: true,
      }),
      preserveUseClientDirective(),
      // Adds 'use client' to every file if no option is provided
      // Transformations Babel pour Emotion
      babel({
        extensions,
        babelHelpers: "bundled",
        exclude: "node_modules/**",
        presets: [
          [
            "@babel/preset-react",
            {
              runtime: "automatic",
              importSource: "@emotion/react" // 👈 important pour css prop
            }
          ],
          "@babel/preset-typescript"
        ],
        plugins: [
          "@emotion/babel-plugin" // 👈 ajoute les labels, minifie et optimise
        ]
      }),
      // Minify the bundle for smaller file sizes
      terser(),
      // Analyzes the bundle size and displays it in the terminal
      filesize(),
      // Show bundle size information in a visual HTML file
      visualizer({ filename: './temp/stats.html', open: false }),
    ],
    external: [
      ...getExternalDeps(),
      'react/jsx-runtime',
    ],
    treeshake: {
      moduleSideEffects: false,
      propertyReadSideEffects: false,
    },
  },
  // Type Declarations
  {
    input: 'src/types/index.d.ts',
    output: {
      dir: DIST_DIR,
      format: 'esm',
      preserveModules: true,
      preserveModulesRoot: 'src',
      entryFileNames: '[name].ts',
    },
    plugins: [aliasConfig, preserveUseClientDirective(), dts()],
  },
];
