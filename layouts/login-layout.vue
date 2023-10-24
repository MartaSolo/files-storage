<script setup lang="ts"></script>

<template>
  <div>
    <TheHeader />
    <main class="content">
      <slot />
    </main>
  </div>
</template>

<style lang="scss" scoped>
.content {
  padding: 1rem;
  max-width: 1700px;
  margin: 0 auto;
  height: calc(100vh - 52px);

  @include mediumScreen {
    height: calc(100vh - 64px);
  }
}
</style>
