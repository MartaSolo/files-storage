<script setup lang="ts"></script>

<template>
  <div>
    <header class="flex justify-center shadow-sm">
      <h1 class="font-mono text-2xl my-4">Nuxt 3 Playground</h1>
    </header>

    <main class="content">
      <slot />
    </main>
  </div>
</template>

<style lang="scss" scoped>
.content {
  padding: 1rem;
}
</style>
