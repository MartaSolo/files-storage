<template>
  <div class="app">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <BaseNotification />
  </div>
</template>

<style lang="scss" scoped>
.app {
  position: relative;
  height: 100vh;
}

.app__overlay {
  position: absolute;
  inset: 0;
  z-index: 10;
}
</style>
