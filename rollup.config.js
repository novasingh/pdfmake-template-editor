import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';

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
  external: ['react', 'react-dnd', 'react-dnd-html5-backend', 'pdfmake'],
  plugins: [resolve(), typescript({ declaration: true, declarationDir: 'dist' }), commonjs()]
};