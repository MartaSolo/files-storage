// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["@nuxtjs/tailwindcss", "@nuxtjs/supabase"],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData:
            "@import '@/assets/scss/_colors.scss'; @import '@/assets/scss/_font.scss'; @import '@/assets/scss/_breakpoints.scss'; @import '@/assets/scss/_mixin.scss';",
        },
      },
    },
  },
  css: ["@/assets/scss/main.scss"],
  components: [{ path: "@/components/svg", pathPrefix: false }, "@/components"],
});
