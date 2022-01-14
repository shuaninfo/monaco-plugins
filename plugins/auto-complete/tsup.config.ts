import { defineConfig, Options } from 'tsup'
import WebWorkPlugin from './src/plugin/webwork-loader'
export default defineConfig((options: Options) => {
  return {
    esbuildPlugins: [WebWorkPlugin],
    entry: ['src/index.ts'],
    // splitting: true,
    sourcemap: true,
    bundle: true,
    clean: true,
    minify: !options.watch,
    dts: true,
    format: ['esm']
  }
})