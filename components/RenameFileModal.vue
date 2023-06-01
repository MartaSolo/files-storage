<script setup lang="ts">
const props = defineProps<{
  fileName: string;
}>();

const emit = defineEmits<{
  (e: "closeRenameFileModal"): void;
}>();

const newFileName = ref(props.fileName);

const errorMessage = ref("");

const close = () => {
  emit("closeRenameFileModal");
};

const handleRename = async () => {
  const renameFile = useRenameFile(props.fileName, newFileName.value);
  await renameFile.rename();
  console.log("component composable error", renameFile.renameError.value);
  if (renameFile.renameError.value) {
    errorMessage.value = renameFile.renameError.value;
  }
};
</script>

<template>
  <Teleport to="body">
    <BaseModal @close-modal="close">
      <template #header>
        <h3 class="rename__header">Rename file</h3>
      </template>
      <template #body>
        <label for="rename-file"></label>
        <input id="rename-file" v-model="newFileName" class="rename__input" />
        <p class="rename__error">{{ errorMessage }}</p>
      </template>
      <template #footer>
        <div class="rename__buttons">
          <BaseButton label="Cancel" theme="white" @click="close" />
          <BaseButton label="Confirm" theme="green" @click="handleRename" />
        </div>
      </template>
    </BaseModal>
  </Teleport>
</template>

<style lang="scss" scoped>
.rename__input {
  border: 1px solid $text-color-secondary;
  border-radius: 8px;
  padding: 0.5rem 0.75rem;
  width: 400px;
}
.rename__buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.rename__error {
  font-size: 1rem;
  color: $text-color-error;
  text-align: center;
  padding: 0.5rem 0;
}
</style>
