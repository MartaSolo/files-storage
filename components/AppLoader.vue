<script setup lang="ts"></script>

<template>
  <div class="loader">
    <div class="loader__header">
      <div class="loader__title"></div>
      <div class="loader__button"></div>
    </div>
    <div class="loader__input"></div>
  </div>
</template>

<style lang="scss" scoped>
.loader {
  background-color: $color-white;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;

  &__header {
    width: 100%;
    padding: 0.5rem 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 83px;
  }

  &__title {
    @include skeleton-shimmer;
    width: 140px;
    height: 40px;
    border-radius: $skeleton-border-radius;
  }

  &__button {
    @include skeleton-shimmer;
    width: 90px;
    height: 40px;
    border-radius: $skeleton-border-radius;
  }

  &__input {
    @include skeleton-shimmer;
    width: 100%;
    max-width: 700px;
    height: 440px;
    border-radius: $skeleton-border-radius;
  }
}
</style>
