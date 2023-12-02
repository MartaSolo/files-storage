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
  padding: 0 1rem;
  max-width: 1700px;
  margin: 0 auto;
}
</style>
