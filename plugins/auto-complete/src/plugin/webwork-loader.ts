/* web woker 加载插件 */
// import fs from 'fs'
import path from 'path'
import { Plugin, PluginBuild, OnResolveArgs, OnLoadArgs, build } from 'esbuild'
/**
 * /^web-worker\((.+)\)/
 */
const REGX = /^web-worker\((.+)\)/
/**
 * /^web-worker\:(.+)/
 */
// const REGX = /^web-worker\:(.+)/
const plugin: Plugin = {
  name: 'esbuild-plugin-webwork-loader',
  setup(plugin: PluginBuild) {
    plugin.onResolve({ filter: REGX },
      (args: OnResolveArgs) => {
        // ./parser.worker2.ts
        let match = REGX.exec(args.path)
        let workerPath = match[1];
        console.debug(`The web worker plugin matched an import to ${args.path} from ${args.importer}, resolve path ${workerPath}`);
        return {
          // path: workerPath,
          path: args.path,
          namespace: 'web-worker',
          pluginData: { importer: args.importer },
        }
      });
    plugin.onLoad({ filter: REGX, namespace: 'web-worker' },
      async (args: OnLoadArgs) => {
        const { path: importPath, pluginData: { importer } } = args;
        let match = REGX.exec(importPath)
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

        // 全路径
        const workerFullPath = path.join(path.dirname(importer), workerPath);
        try {
          await build({
            entryPoints: [workerFullPath],
            outfile,
            minify: true,
            bundle: true,
          })
          return {
            contents: `export default ${JSON.stringify(workerPath)};`
          }
        } catch (error) {
          return {
            contents: `export default {};`
          }
          // console.error('Could not build worker script:', error);
        }
      })
  }
}
export default plugin

