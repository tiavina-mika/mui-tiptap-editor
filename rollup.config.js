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
import { readFileSync } from 'fs';

const SRC_DIR = path.resolve(process.cwd(), 'src');
const DIST_DIR = 'dist';

const extensions = ['.js', '.jsx', '.ts', '.tsx'];

// Replace '@' in imports with the src directory
const aliasConfig = alias({
  entries: [{ find: '@', replacement: SRC_DIR }],
});

const pkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url)));

// Determine external dependencies
// This will avoid node_modules being bundled into the output files
const getExternalDeps = (id) => {
  const peerDeps = pkg.peerDependencies || {};
  const deps = pkg.dependencies || {};
  const allDeps = { ...peerDeps, ...deps };
  const depNames = Object.keys(allDeps);

  // 1. Check if it a npm package (e.g., 'react', 'lodash/someModule')
  if (depNames.some(dep => id.startsWith(dep))) return true;

  // 2. If path contains node_modules (safer for preserveModules) (e.g: 'node_modules/react/index.js')
  if (id.includes('node_modules')) return true;

  // 3. Regex for scoped/unscoped packages (e.g., 'react', '@mui/material')
  if (/^(@?[^./]+\/?[^./]*)$/.test(id)) return true;
  
  return false;
};

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
      sourcemap: false,
    },
    plugins: [
      clear({ targets: [DIST_DIR], watch: true }),
      aliasConfig,
      css({ minify: true }),
      peerDepsExternal(),
      resolve({ extensions }),
      commonjs(),
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
        exclude: ['node_modules/**'],
        limit: 8192, // inline files < 8kb
        emitFiles: true,
        // Note: not using extname to keep original extensions since it's a .mjs extension
        fileName: '[dirname][name]',
      }),
      typescript({
        clean: true,
        tsconfig: 'tsconfig.build.json',
        useTsconfigDeclarationDir: true,
      }),
      // preserve 'use client' directive for React 18 SSR support
      preserveUseClientDirective(),
      // Babel for React and Emotion
      babel({
        extensions,
        babelHelpers: "bundled",
        exclude: "node_modules/**",
        presets: [
          [
            "@babel/preset-react",
            {
              runtime: "automatic",
              importSource: "@emotion/react" // for css prop support
            }
          ],
          "@babel/preset-typescript"
        ],
        plugins: [
          "@emotion/babel-plugin" // adds labels, minifies and optimizes
        ]
      }),
      // Minify the bundle for smaller file sizes
      terser(),
      // Analyzes the bundle size and displays it in the terminal
      filesize(),
      // Show bundle size information in a visual HTML file
      visualizer({ filename: './temp/stats.html', open: false }),
    ],
    external: getExternalDeps,
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
    plugins: [aliasConfig, dts()],
    // external: [...getExternalDeps()],
    external: getExternalDeps,
  },
];
