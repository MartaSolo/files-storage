<script setup lang="ts">
const activeTab = ref<string>('addFiles');

const handleClick = () => {
  console.log("click");
};
</script>

<template>
  <header class="header">
    <h1 class="header__title font-mono text-2xl">
      Your personal files storage
    </h1>
    <ul class="header__tabs">
      <li
        class="header__tab header__tab--active"
        tabindex="0"
        role="tab"
        @click="handleClick"
      >
        <NuxtLink to="/"> Add new files </NuxtLink>
      </li>
      <li
        class="header__tab header__tab--inactive"
        tabindex="0"
        role="tab"
        @click="handleClick"
      >
        <NuxtLink to="/allYourFiles">All your files</NuxtLink>
      </li>
    </ul>
  </header>
</template>

<style lang="scss" scoped>
.header {
  padding: 0 1rem;
}
.header__title {
  text-align: center;
  padding: 1.5rem 0 2rem 0;
}

.header__tabs {
  display: flex;
}

.header__tab {
  flex-basis: 50%;
  font-size: 1.5rem;
  font-weight: 600;
  display: flex;
  justify-content: center;
  padding: 1rem 0;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
}

.header__tab--active {
  box-shadow: 0 7px 0 $color-white, 0 -3px 8px rgba(0, 0, 0, 0.1);
  color: $color-green-dark;
}
.header__tab--inactive {
  background-color: rgb(247, 244, 244);
  background-color: $color-green-lighter;
  color: $color-grey-light;
}
</style>
