export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: [
    '@pinia/nuxt',
  ],

  css: ['~/assets/css/main.css'],

  typescript: {
    strict: true,
    typeCheck: false 
  },

  app: {
    head: {
      title: 'Telegram Mini App',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1, interactive-widget=resizes-content' },
      ],
      script: [
        { src: 'https://telegram.org/js/telegram-web-app.js', defer: true }
      ]
    }
  },

  compatibilityDate: '2025-04-20',
  
  ssr: false,
  nitro: {
    preset: 'netlify'
  },
  
  generate: {
    routes: ['/']
  }
})