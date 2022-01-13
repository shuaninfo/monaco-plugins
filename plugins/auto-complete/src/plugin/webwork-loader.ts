/**
 * web woker 加载插件
 * @see https://github.com/evanw/esbuild/issues/312
 * @see https://github.com/endreymarcell/esbuild-plugin-webworker
 * @see https://github.com/webpack-contrib/worker-loader
 */
import path from 'path'
import fs from 'fs'
import { Plugin, PluginBuild, OnResolveArgs, OnLoadArgs, build } from 'esbuild'
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
      async (args: OnLoadArgs) => {
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
          await build({
            entryPoints: [workerFullPath],
            outfile,
            minify: true, // 必填
            bundle: true,
            sourcemap: true
          })
          const worktext = fs.readFileSync(outfile, 'utf8')
          const miniworktext = worktext.split('\n')[0]
          return {
            contents:
              `
                export default class {
                  constructor() {
                    return new Worker(URL.createObjectURL(
                      new Blob([
                        '${miniworktext}'
                      ], {type: "text/javascript"})
                    ));
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

