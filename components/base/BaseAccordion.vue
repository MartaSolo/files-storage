<script setup lang="ts">
defineProps<{
  title: string;
  content: string;
}>();

const ArrowIcon = resolveComponent("ArrowIcon");

const showContent = ref(false);
</script>

<template>
  <div class="accordion">
    <button
      type="button"
      class="accordion__button"
      @click="showContent = !showContent"
    >
      {{ title }}
      <div class="accordion__button--icon" :class="{ transform: showContent }">
        <ArrowIcon />
      </div>
    </button>
    <Transition name="slide">
      <p v-if="showContent" class="accordion__content">{{ content }}</p>
    </Transition>
  </div>
</template>

<style lang="scss" scoped>
.accordion {
  width: 100%;
  padding-bottom: 1.5rem;
}

.accordion__button {
  width: 100%;
  text-align: left;
  padding: 0.75rem;
  border-top: 1px solid $color-green-dark;
  border-bottom: 1px solid $color-green-dark;
  color: $color-green-dark;
  background-color: $color-green-lightest;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.accordion__button--icon.transform {
  transform: rotate(180deg);
}

.accordion__content {
  color: $color-green-dark;
  font-size: 0.9rem;
}

.slide-enter-active {
  transition-duration: 0.3s;
  transition-timing-function: ease-in;
}

.slide-leave-active {
  transition-duration: 0.3s;
  transition-timing-function: cubic-bezier(0, 1, 0.5, 1);
}

.slide-enter-to,
.slide-leave-from {
  max-height: 100px;
  overflow: hidden;
}

.slide-enter-from,
.slide-leave-to {
  overflow: hidden;
  max-height: 0;
}
</style>
