/* web woker 加载插件 */
import fs from 'fs'
import path from 'path'
import { Plugin, PluginBuild, OnResolveArgs, OnLoadArgs, build } from 'esbuild'
const plugin: Plugin = {
  name: 'esbuild-plugin-webwork-loader',
  setup(plugin: PluginBuild) {
    plugin.onResolve({ filter: /^web-worker:(.+)/ },
      (args: OnResolveArgs) => {
        console.log('-----args.path: ', args.path)
        return {
          // args.path
          path: './parser.worker2',
          namespace: 'web-worker',
          // pluginData: { importer: args.importer },
        }
      })
    plugin.onLoad({ filter: /^web-worker:(.+)/, namespace: 'web-worker' },
      async (args: OnLoadArgs) => {
        let match = /^web-worker:(.+)/.exec(args.path)
        let workerPath = match[1];
        let outfile = null
        if (!workerPath.endsWith('.ts')) {
          workerPath = `${workerPath}.ts`
        }
        if (workerPath.endsWith('.ts')) {
          outfile = path.join("dist", path.basename(workerPath.replace(/\.ts$/, '.js')));
        } else if (!workerPath.endsWith('.js')) {
          outfile = path.join("dist", path.basename(workerPath + '.js'));
        }

        // TODO: 暂停
        console.log('match:xxxxxxxxxxxx', args.path, match[1], '::', workerPath, outfile)
        try {
          await build({
            entryPoints: [workerPath],
            outfile,
            minify: true,
            bundle: true,
          })
          return {
            contents: `export default ${JSON.stringify(workerPath)};`
          }
        } catch (error) {
          // console.error('Could not build worker script:', error);
        }
      })
  }
}
export default plugin

