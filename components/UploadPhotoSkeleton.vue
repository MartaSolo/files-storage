<script setup lang="ts"></script>

<template>
  <section class="skeleton">
    <div class="skeleton__image"></div>
    <div class="skeleton__buttons">
      <div class="skeleton__buttons--button"></div>
      <div class="skeleton__buttons--button"></div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.skeleton {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
  @include mediumScreen {
    flex-basis: 50%;
  }
}

.skeleton__image {
  width: 100%;
  max-width: 300px;
  height: auto;
  aspect-ratio: 1 / 1;
  border-radius: 50%;
  margin-bottom: 1rem;
  background-color: $color-grey-lighter;
  @include mediumScreen {
    max-width: 400px;
  }
}

.skeleton__buttons {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 1rem;
  @include mediumScreen {
    width: 100%;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr;
  }
  @include largeScreenPlus {
    gap: 4rem;
  }
}

.skeleton__buttons--button {
  width: 230px;
  border-radius: 16px;
  background-color: $color-grey-lighter;
  height: 44px;
  flex-basis: 50%;
}

.skeleton__image,
.skeleton__buttons--button {
  animation: skeleton-loading 1s linear infinite alternate;
}

@keyframes skeleton-loading {
  0% {
    background-color: $color-grey-lightest;
  }
  100% {
    background-color: $color-grey-lighter;
  }
}
</style>
