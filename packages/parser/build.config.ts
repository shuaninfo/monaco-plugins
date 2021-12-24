import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  declaration: true,
  entries: [
    'src/index'
    // { input: 'src/index', builder: 'mkdist', format: 'esm', ext: 'js' }
  ]
})
