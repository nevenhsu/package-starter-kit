import { defineConfig } from 'rollup'
import nodeResolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import babel from '@rollup/plugin-babel'
import json from '@rollup/plugin-json'
import image from '@rollup/plugin-image'
import strip from '@rollup/plugin-strip'
import typescript from 'rollup-plugin-typescript2'
import { terser } from 'rollup-plugin-terser'

import pkg from './package.json'

const name = 'bundle'
const input = 'src/index.ts'
const extensions = ['.js', '.jsx', '.ts', '.tsx']
const noDeclarationFiles = { compilerOptions: { declaration: false } }

const babelRuntimeVersion = pkg.dependencies['@babel/runtime'].replace(/^[^0-9]*/, '')

const peerDependencies = Object.keys(pkg.peerDependencies || {})
const external = [...Object.keys(pkg.devDependencies || {}), ...peerDependencies].map((name) => RegExp(`^${name}($|/)`))

const resolveOptions = {
  extensions,
  mainFields: ['browser', 'module', 'main'],
  dedupe: peerDependencies,
}

const commonPlugins = [image(), json(), strip()]

export default defineConfig([
  // ES
  {
    input,
    output: { dir: 'dist/esm', preserveModules: true, format: 'es', indent: false },
    external,
    plugins: [
      nodeResolve(resolveOptions),
      commonjs({
        ignoreGlobal: true,
      }),
      typescript({ tsconfigOverride: noDeclarationFiles }),
      ...commonPlugins,
      babel({
        extensions,
        plugins: [['@babel/plugin-transform-runtime', { version: babelRuntimeVersion, useESModules: true }]],
        babelHelpers: 'runtime',
        exclude: /node_modules/,
      }),
    ],
  },

  // CommonJS
  {
    input,
    output: { dir: 'dist/cjs', preserveModules: true, format: 'cjs', indent: false },
    external,
    plugins: [
      nodeResolve(resolveOptions),
      commonjs({
        ignoreGlobal: true,
      }),
      typescript({ useTsconfigDeclarationDir: true }),
      ...commonPlugins,
      babel({
        extensions,
        plugins: [['@babel/plugin-transform-runtime', { version: babelRuntimeVersion }]],
        babelHelpers: 'runtime',
        exclude: /node_modules/,
      }),
    ],
  },

  // UMD Development
  {
    input,
    output: { name, file: pkg.unpkg, format: 'umd', indent: false },
    plugins: [
      nodeResolve({
        ...resolveOptions,
        browser: true,
        preferBuiltins: true,
      }),
      commonjs({
        ignoreGlobal: true,
      }),
      typescript({ tsconfigOverride: noDeclarationFiles }),
      ...commonPlugins,
      babel({
        extensions,
        babelHelpers: 'bundled',
        exclude: /node_modules/,
      }),
      terser(),
    ],
  },
])
