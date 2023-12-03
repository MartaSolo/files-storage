<script setup lang="ts">
const props = defineProps<{
  tab: { label: string; path: string };
}>();

const route = useRoute();

const computedClass = computed(() => {
  return route.path === props.tab.path
    ? "tab__link--active"
    : "tab__link--inactive";
});
</script>

<template>
  <li class="tab" role="tab">
    <NuxtLink class="tab__link" :class="computedClass" :to="tab.path">
      {{ tab.label }}
    </NuxtLink>
  </li>
</template>

<style lang="scss" scoped>
.tab {
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

.tab__link {
  flex-basis: 100%;
  text-align: center;
  padding: 1rem 0;
  border-top-left-radius: inherit;
  border-top-right-radius: inherit;
}

.tab__link--active {
  box-shadow: 0 7px 0 $color-white, 0 -3px 8px rgba(0, 0, 0, 0.1);
  color: $color-green-dark;
}

.tab__link--inactive {
  background-color: $color-green-dark;
  color: $color-white;
  opacity: 0.6;
  &:hover {
    opacity: 1;
  }
}
</style>
