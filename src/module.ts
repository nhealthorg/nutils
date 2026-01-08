import { defineNuxtModule, addComponentsDir, addImportsDir, createResolver } from '@nuxt/kit'
import { fileURLToPath } from 'node:url'

export interface ModuleOptions {
  /**
   * Enable or disable the module
   * @default true
   */
  enabled?: boolean
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: '@nhealthorg/nutils',
    configKey: 'nutils',
    compatibility: {
      nuxt: '>=3.0.0'
    }
  },
  defaults: {
    enabled: true
  },
  async setup(options, nuxt) {
    if (!options.enabled) {
      return
    }

    const { resolve } = createResolver(fileURLToPath(import.meta.url))

    // Auto-register components from the runtime/components directory
    addComponentsDir({
      path: resolve('./runtime/components'),
      pathPrefix: false,
      prefix: '',
      global: true
    })

    // Auto-import composables from the runtime/composables directory
    addImportsDir(resolve('./runtime/composables'))

    // Auto-import utilities from the runtime/utils directory
    addImportsDir(resolve('./runtime/utils'))

    nuxt.options.build = nuxt.options.build || {}
    nuxt.options.build.transpile = nuxt.options.build.transpile || []
    nuxt.options.build.transpile.push('@nhealthorg/nutils')
  }
})


