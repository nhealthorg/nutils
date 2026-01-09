export default defineNuxtConfig({
  modules: [
    '@nuxt/ui',
    '../src/module',
  ],
  imports: {
    autoImport: false,
  },
  devtools: {
    enabled: true,
  },
  css: ['~/assets/tailwind.css'],
  colorMode: {
    preference: 'light',
  },
})
