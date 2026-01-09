import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    'src/module',
  ],
  externals: [
    '@nuxt/kit',
    '@nuxt/schema',
    'nuxt',
  ],
  declaration: 'compatible',
  rollup: {
    emitCJS: true,
  },
  failOnWarn: false,
})
