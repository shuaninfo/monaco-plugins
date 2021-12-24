/* web woker 加载插件 */
import fs from 'fs'
import path from 'path'
import { Plugin, PluginBuild, OnResolveArgs, OnLoadArgs } from 'esbuild'
const plugin: Plugin = {
  name: 'esbuild-plugin-webwork-loader',
  setup(plugin: PluginBuild) {
    plugin.onResolve({ filter: /^web-worker:(.+)/ }, (args: OnResolveArgs) => {
      return {
        path: args.path,
        namespace: 'webwork-loader',
        pluginData: { importer: args.importer },
      }
    })
    plugin.onLoad({ filter: /^web-worker:(.+)/, namespace: 'webwork-loader' }, async (args: OnLoadArgs) => {
      const { path } = args;
      let match = /^web-worker:(.+)/.exec(path)
      // TODO: 暂停
      console.log('match:', match[1], '::')
      // const workerWithFullPath = path.join(path.dirname(importer), importPath);
      // const workerFileName = path.basename(workerWithFullPath);

      return {

      }
    })
  }
}
export default plugin

