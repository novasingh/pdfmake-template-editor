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
      inlineDynamicImports: true
    },
    {
      file: 'dist/index.esm.js',
      format: 'esm',
      sourcemap: true,
      inlineDynamicImports: true
    }
  ],
  external: [
    'react',
    'react-dom',
    'pdfmake',
    'pdfmake/build/pdfmake',
    'pdfmake/build/vfs_fonts',
    'zustand',
    '@dnd-kit/core',
    '@dnd-kit/sortable',
    '@dnd-kit/utilities',
    '@dnd-kit/modifiers'
  ],
  plugins: [
    resolve(),
    commonjs(),
    typescript({ declaration: true, declarationDir: 'dist' }),
    postcss({
      extensions: ['.css'],
      inject: true,
    })
  ]
};