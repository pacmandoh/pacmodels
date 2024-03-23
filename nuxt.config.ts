// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      htmlAttrs: {
        lang: 'zh'
      }
    }
  },
  devtools: { enabled: false },
  modules: [
    '@vueuse/nuxt',
    '@nuxt/ui'
  ],
  colorMode: {
    preference: 'light',
    fallback: 'light'
  },
  ui: {
    icons: ['heroicons', 'simple-icons', 'ph']
  }
})
