<template>
  <ul class="tabs" role="tablist">
    <li
      v-for="tab in tabs"
      :key="tab.path"
      class="tabs__tab"
      role="tab"
      :aria-selected="route.path === tab.path"
    >
      <NuxtLink
        :class="[
          'tabs__link',
          route.path === tab.path
            ? 'tabs__link--active'
            : 'tabs__link--inactive',
        ]"
        :to="tab.path"
      >
        {{ tab.label }}
      </NuxtLink>
    </li>
  </ul>
</template>

<script setup lang="ts">
defineProps<{
  tabs: { label: string; path: string }[];
}>();

const route = useRoute();
</script>

<style lang="scss" scoped>
.tabs {
  display: flex;

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

    &--active {
      box-shadow: 0 7px 0 $color-white, 0 -3px 8px rgba(0, 0, 0, 0.1);
      color: $color-green-dark;
    }

    &--inactive {
      background-color: $color-green-light;
      color: $text-color-primary;
      opacity: 0.6;
      &:hover {
        opacity: 1;
      }
    }
  }
}
</style>
