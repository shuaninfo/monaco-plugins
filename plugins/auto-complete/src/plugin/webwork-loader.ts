/**
 * web woker 加载插件
 * @see https://github.com/evanw/esbuild/issues/312
 * @see https://github.com/endreymarcell/esbuild-plugin-webworker
 * @see https://github.com/webpack-contrib/worker-loader
 */
import path from 'path'
import fs from 'fs'
import { Plugin, PluginBuild, OnResolveArgs, OnLoadArgs, buildSync } from 'esbuild'
/**
 * /^web-worker\((.+)\)/
 */
const WEB_WORK_REGEXP = /^web-worker\((.+)\)/
// esbuild-plugin-webwork-loader
const plugin: Plugin = {
  name: 'webwork-loader',
  setup(plugin: PluginBuild) {
    plugin.onResolve({ filter: WEB_WORK_REGEXP },
      (args: OnResolveArgs) => {
        return {
          path: args.path,
          namespace: 'web-worker',
          pluginData: { importer: args.importer },
        }
      });
    plugin.onLoad({ filter: WEB_WORK_REGEXP, namespace: 'web-worker' },
      (args: OnLoadArgs) => {
        const { path: importPath, pluginData: { importer } } = args;
        const workerPath = WEB_WORK_REGEXP.exec(importPath)[1]
        const extname = path.extname(workerPath)
        let outfile = null

        if (extname === '.ts') {
          outfile = path.join('dist', path.basename(workerPath.replace(/\.ts$/, '.js')));
        } else if (extname === '.js') {
          outfile = path.join('dist', path.basename(workerPath))
        } else {
          throw new Error('[webwork-loader] 后缀名必须为.ts|.js')
        }
        // 全路径
        const workerFullPath = path.join(path.dirname(importer), workerPath);
        try {
          buildSync({
            entryPoints: [workerFullPath],
            outfile,
            minify: true,
            bundle: true,
            // format: 'cjs'
            // sourcemap: true
          })
          const worktext = fs.readFileSync(outfile, 'utf8')
          return {
            contents:
              `
              // TODO: 
                const blob = new Blob([
                  (function(){${worktext}}).toString().slice(11)
                ], 
                  {type: "text/javascript"});

                export default class {
                  constructor() {
                    return new Worker(URL.createObjectURL(blob));
                  }
                }
              `
          }
        } catch (error) {
          console.error('Could not build worker script:', error);
          return {
            contents: `export default {};`
          }
        }
      })
  }
}
export default plugin

