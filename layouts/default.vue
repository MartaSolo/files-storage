<script setup lang="ts"></script>

<template>
  <div>
    <Header />
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
