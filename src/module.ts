import { defineNuxtModule, addComponentsDir, addImportsDir, createResolver, addServerImports, addImports } from '@nuxt/kit'

const resolver = createResolver(import.meta.url)

export interface ModuleOptions {
  /**
   * Enable or disable the module
   * @default true
   */
  enabled?: boolean
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: '@nhealth/nutils',
    configKey: 'nutils',
    compatibility: {
      nuxt: '>=4.0.0',
    },
  },
  defaults: {
    enabled: true,
  },
  async setup(options, nuxt) {
    if (!options.enabled) {
      return
    }

    // Auto-register components from the runtime/components directory
    addComponentsDir({
      path: resolver.resolve('./runtime/app/components'),
      pathPrefix: false,
      prefix: 'NUtils',
      global: true,
    })

    // Auto-import composables from the runtime/composables directory
    addImportsDir(resolver.resolve('./runtime/app/composables'))

    // Auto-import server/client side utilities from the runtime/utils directory
    const formatters = [
      'formatDate',
      'formatNumber',
      'truncate',
    ]
    formatters.forEach((name) => {
      addServerImports({ name, as: name, from: resolver.resolve('./runtime/shared/formatters') })
      addImports({ name, as: name, from: resolver.resolve('./runtime/shared/formatters') })
    })

    nuxt.options.build.transpile = nuxt.options.build.transpile || []
    nuxt.options.build.transpile.push('@nhealthorg/nutils')
  },
})
