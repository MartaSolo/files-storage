<script setup lang="ts">
const headerText = ref("Public files storage");
</script>

<template>
  <header class="header">
    <h1 class="header__title">{{ headerText }}</h1>
  </header>
</template>

<style lang="scss" scoped>
.header {
  padding: 0 1rem;
}
.header__title {
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: 2px;
  text-align: center;
  padding: 0.75rem 0 1rem 0;
  color: $text-color-secondary;
  @include mediumScreen {
    font-size: 1.5rem;
    font-weight: 600;
  }
}
</style>
