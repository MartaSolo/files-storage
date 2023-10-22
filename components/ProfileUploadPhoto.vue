<script setup lang="ts">
</script>

<template>
  <div class="profile__photo">
    <span class="profile__info--name">Photo</span>
  </div>
</template>

<style lang="scss" scoped>
.profile__photo {
  background-color: palegreen;
  @include mediumScreen {
    flex-basis: 50%;
  }
}

.profile__info--name {
  display: inline-block;
  padding: 0 0 0.5rem 0.5rem;
  color: $text-color-secondary;
  font-size: 0.8rem;
}
</style>
