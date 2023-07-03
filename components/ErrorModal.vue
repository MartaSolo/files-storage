<script setup lang="ts">
const props = defineProps<{
  errors: string[];
}>();

const emit = defineEmits<{
  (e: "closeRenameFileModal"): void;
}>();

const close = () => {
  emit("closeRenameFileModal");
};
</script>

<template>
  <Teleport to="body">
    <BaseModal @close-modal="close">
      <template #header>
        <h3 class="actions__error--header">
          The error occurred while performing the action:
        </h3>
      </template>
      <template #body>
        <p
          v-for="(error, index) in errors"
          :key="index"
          class="actions__error--error"
        >
          {{ error }}
        </p>
      </template>
    </BaseModal>
  </Teleport>
</template>

<style lang="scss" scoped>
.actions__error--error {
  font-size: 0.9rem;
  color: $text-color-error;
}
</style>
