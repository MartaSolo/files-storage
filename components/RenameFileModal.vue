<script setup lang="ts">
const props = defineProps<{
  fileName: string;
}>();

const emit = defineEmits<{
  (e: "closeRenameFileModal"): void;
}>();

const newFileName = ref(props.fileName);

const close = () => {
  emit("closeRenameFileModal");
};

const handleRename = () => {
  const renameFile = useRenameFile(props.fileName, newFileName.value);
  renameFile.rename();
  console.log("renameFile fired");
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
</style>
