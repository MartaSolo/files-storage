<script setup lang="ts">
const UserIcon = resolveComponent("UserIcon");
</script>

<template>
  <button class="user">
    <UserIcon />
  </button>
</template>

<style lang="scss" scoped>
.user {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 2px solid $color-green-dark;
}
</style>
