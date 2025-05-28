export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [// Módulo para Tailwind CSS
  '@nuxtjs/tailwindcss', // Módulo para Pinia
  '@pinia/nuxt', '@nuxtjs/i18n', '@nuxt/scripts'],
  css: [
    '@/assets/css/tailwind.css' // Archivo CSS de Tailwind
  ],
  i18n: {
    locales: [
      { code: 'en', iso: 'en-US', name: 'English', file: 'en.json' },
      { code: 'es', iso: 'es-ES', name: 'Español', file: 'es.json' }
    ],
    lazy: true,
    langDir: 'locales/',
    defaultLocale: 'es',
    strategy: 'no_prefix'
  },
  runtimeConfig: {

    public: {
    }
  },
  devServer: {
    port: 3000, // Puerto del servidor de desarrollo
    host: '0.0.0.0'
  },
});