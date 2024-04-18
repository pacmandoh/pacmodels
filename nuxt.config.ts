// https://nuxt.com/docs/api/configuration/nuxt-config
import pkg from './package.json'

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
    '@nuxt/ui',
    '@nuxt/eslint'
  ],
  colorMode: {
    preference: 'light',
    fallback: 'light'
  },
  ui: {
    icons: ['heroicons', 'simple-icons', 'ph', 'cbi', 'carbon']
  },
  runtimeConfig: {
    public: {
      version: pkg.version
    }
  },
  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never'
      }
    }
  }
})
