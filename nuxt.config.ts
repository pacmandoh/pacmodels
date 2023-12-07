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
    '@nuxtjs/tailwindcss',
  ],
})
