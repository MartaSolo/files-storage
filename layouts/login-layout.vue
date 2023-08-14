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
  overflow-y: hidden;
  height: calc(100vh - 108px);

  @include mediumScreen {
    height: calc(100vh - 132px);
  }
}
</style>
