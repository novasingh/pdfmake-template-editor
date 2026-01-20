import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import postcss from 'rollup-plugin-postcss';

export default {
  input: 'src/index.tsx',
  output: [
    {
      file: 'dist/index.js',
      format: 'cjs',
      sourcemap: true,
      inlineDynamicImports: true,
      exports: 'named'
    },
    {
      file: 'dist/index.esm.js',
      format: 'esm',
      sourcemap: true,
      inlineDynamicImports: true,
      exports: 'named'
    }
  ],
  external: ['react', 'react-dom', 'pdfmake', 'zustand', 'html-to-image', '@dnd-kit/core', '@dnd-kit/sortable', '@dnd-kit/utilities', '@dnd-kit/modifiers'],
  plugins: [
    resolve(),
    commonjs(),
    typescript({ declaration: true, declarationDir: 'dist' }),
    postcss({
      extract: true,
      minimize: true,
    })
  ]
};