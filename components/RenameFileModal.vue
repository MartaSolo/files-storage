<script setup lang="ts">
const props = defineProps<{
  fileName: string;
}>();

const emit = defineEmits<{
  (e: "closeRenameFileModal"): void;
  (e: "fileNameUpdated"): void;
}>();

const renameFile = useRenameFile();
const file = useFileName(props.fileName);

const newFileName = ref(file.name);
const errorMessage = ref("");
const inputTouched = ref(false);

const newFullFileName = computed(() => {
  return `${newFileName.value}${file.extension}`;
});

const isDisabled = computed(() => {
  return props.fileName === newFullFileName.value;
});

const close = () => {
  emit("closeRenameFileModal");
};

const handleInputFocus = () => {
  if (newFileName && inputTouched) {
    errorMessage.value = "";
  }
};

const handleRename = async () => {
  try {
    await renameFile.rename(props.fileName, newFullFileName.value);
  } catch (error: any) {
    errorMessage.value = error.message;
  }
  if (!errorMessage.value) {
    emit("fileNameUpdated");
    close();
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
        <div
          class="rename__input"
          :class="{ 'rename__input--error': errorMessage }"
        >
          <input
            id="rename-file"
            v-model="newFileName"
            type="text"
            class="rename__input--input"
            @blur="inputTouched = true"
            @focus="handleInputFocus"
          />
          <span class="rename__input--extension">{{ file.extension }}</span>
        </div>
        <p class="rename__error">{{ errorMessage }}</p>
      </template>
      <template #footer>
        <div class="rename__buttons">
          <BaseButton label="Cancel" theme="white" @click="close" />
          <BaseButton
            label="Confirm"
            theme="green"
            :disabled="isDisabled"
            @click="handleRename"
          />
        </div>
      </template>
    </BaseModal>
  </Teleport>
</template>

<style lang="scss" scoped>
.rename__input {
  margin-bottom: 3rem;
}
.rename__input--error {
  margin-bottom: 0.25rem;
}

.rename__input--input {
  border: 1px solid $color-grey-light;
  border-radius: 8px;
  padding: 0.5rem 0.75rem;
  width: 420px;
}

.rename__error {
  font-size: 0.9rem;
  color: $text-color-error;
  text-align: center;
}

.rename__buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
}
</style>
