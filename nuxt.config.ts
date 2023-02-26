// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["@nuxtjs/tailwindcss"],
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

// export default defineNuxtConfig({
//   modules: ["@nuxtjs/tailwindcss"],
//   // buildModules: ["@nuxtjs/style-resources"],
//   // styleResources: {
//   //   scss: [
//   //     "./assets/scss/main.scss",
//   //     "./assets/scss/_colors.scss",
//   //     "./assets/scss/_font.scss",
//   //   ],
//   //   hoistUseStatements: true,
//   // },
// });
