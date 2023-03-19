// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["@nuxtjs/tailwindcss", "@nuxtjs/supabase"],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: "@import '@/assets/scss/_colors.scss';",
        },
      },
    },
  },
  css: ["@/assets/scss/main.scss"],
});
