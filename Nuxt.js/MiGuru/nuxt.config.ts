export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss', // Módulo para Tailwind CSS
    '@pinia/nuxt',          // Módulo para Pinia
    '@nuxtjs/i18n',
  ],
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
});