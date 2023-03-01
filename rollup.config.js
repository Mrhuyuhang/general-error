import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import eslint from '@rollup/plugin-eslint';
import { uglify } from 'rollup-plugin-uglify';
export default {
  input: 'src/index.js',
  output: [
    {
      file: 'dist/index.cjs.js',
      format: 'cjs',
    },
    {
      file: 'dist/index.esm.js',
      format: 'esm',
    },
    {
      file: 'dist/index.js',
      format: 'umd',
      name: 'GenError',
    },
  ],
  plugins: [commonjs(), resolve(), eslint(), babel({ babelHelpers: 'bundled' }), uglify()],
};
