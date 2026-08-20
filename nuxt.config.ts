// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: true,
  modules: ["@nuxtjs/tailwindcss", "@nuxtjs/supabase", "@nuxt/image"],
  vite: {
    server: {
      watch: {
        usePolling: true,
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          api: "modern-compiler",
          additionalData: `
        @use '@/assets/scss/colors' as *;
        @use '@/assets/scss/font' as *;
        @use '@/assets/scss/breakpoints' as *;
        @use '@/assets/scss/mixin' as *;
        @use '@/assets/scss/other' as *;
      `,
        },
      },
    },
  },
  css: ["@/assets/scss/main.scss"],
  components: [{ path: "@/components/svg", pathPrefix: false }, "@/components"],
  build: {
    transpile: ["@vuepic/vue-datepicker"],
  },
  app: {
    head: {
      title: "Your files storage",
      meta: [
        {
          name: "description",
          content: "Upload your files to your online storage",
        },
      ],
      htmlAttrs: {
        lang: "en",
      },
    },
  },
});
