<template>
  <nav class="tabs" aria-label="Main navigation" data-testid="tabs-nav">
    <ul class="tabs__list">
      <li v-for="tab in tabs" :key="tab.path" class="tabs__tab">
        <NuxtLink
          class="tabs__link"
          active-class="tabs__link--active"
          :to="tab.path"
          data-testid="tabs-link"
        >
          {{ tab.label }}
        </NuxtLink>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
defineProps<{
  tabs: { label: string; path: string }[];
}>();
</script>

<style lang="scss" scoped>
.tabs {
  &__list {
    display: flex;
  }

  &__tab {
    flex-basis: 50%;
    font-size: 1rem;
    font-weight: 600;
    display: flex;
    border-top-left-radius: $secondary-border-radius;
    border-top-right-radius: $secondary-border-radius;
    margin: 0 1px;
    @include mediumScreen {
      font-size: 1.5rem;
    }
  }

  &__link {
    flex-basis: 100%;
    text-align: center;
    padding: 1rem 0;
    border-top-left-radius: inherit;
    border-top-right-radius: inherit;
    background-color: $color-green-light;
    color: $text-color-active;
    transition:
      background-color 0.2s ease,
      color 0.2s ease;
    &:hover {
      background-color: $color-green-medium;
      color: rgba(0, 51, 51, 1);
    }

    &--active {
      box-shadow:
        0 7px 0 $color-white,
        0 -3px 8px rgba(0, 0, 0, 0.1);
      color: $color-green-dark;
      background-color: $color-white;
    }
  }
}
</style>
