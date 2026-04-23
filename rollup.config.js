import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import postcss from 'rollup-plugin-postcss';
import terser from '@rollup/plugin-terser';

export default {
  input: 'src/index.tsx',
  output: [
    {
      file: 'dist/index.js',
      format: 'cjs',
      sourcemap: false,
      inlineDynamicImports: true,
      exports: 'named',
    },
    {
      file: 'dist/index.esm.js',
      format: 'esm',
      sourcemap: false,
      inlineDynamicImports: true,
      exports: 'named',
    },
  ],
  // Use regex for pdfmake to catch all sub-paths (build/pdfmake, build/vfs_fonts, etc.)
  external: ['react', 'react-dom', /^pdfmake/, 'zustand', 'zundo', 'html-to-image'],
  plugins: [
    resolve({ browser: true }),
    commonjs(),
    typescript({
      declaration: true,
      declarationDir: 'dist',
      rootDir: 'src',
    }),
    postcss({
      extract: true,
      minimize: true,
    }),
    terser({
      compress: {
        drop_console: false,   // keep console.error for error reporting
        pure_getters: true,
        passes: 2,
      },
      format: {
        comments: false,
      },
    }),
  ],
};