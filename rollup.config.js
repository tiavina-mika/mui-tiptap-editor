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

const SRC_DIR = path.resolve(process.cwd(), 'src');
const DIST_DIR = 'dist';

// Replace '@' in imports with the src directory
const aliasConfig = alias({
  entries: [{ find: '@', replacement: SRC_DIR }],
});

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
      resolve({ extensions: ['.js', '.jsx', '.ts', '.tsx'] }),
      commonjs(),
      typescript({
        clean: true,
        tsconfig: 'tsconfig.build.json',
        useTsconfigDeclarationDir: true,
      }),
      // Minify the bundle for smaller file sizes
      terser(),
      // Analyzes the bundle size and displays it in the terminal
      filesize(),
      // Show bundle size information in a visual HTML file
      visualizer({ filename: './temp/stats.html', open: false }),
    ],
    external: ['react', 'react-dom', 'react/jsx-runtime'],
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
  },
];
