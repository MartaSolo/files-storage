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
    emit("fileNameUpdated");
    close();
  } catch (error: any) {
    errorMessage.value = error.message;
  }
};
</script>

<template>
  <BaseModal @close-modal="close">
    <template #header>
      <h3 class="rename__header">Rename file</h3>
    </template>
    <template #body>
      <div
        class="rename__input"
        :class="{ 'rename__input--error': errorMessage }"
      >
        <BaseInput
          v-model="newFileName"
          name="rename"
          type="text"
          @blur="inputTouched = true"
          @focus="handleInputFocus"
        >
          <span class="rename__input--extension">{{ file.extension }}</span>
        </BaseInput>
      </div>
      <p class="rename__error">{{ errorMessage }}</p>
    </template>
    <template #footer>
      <div class="rename__buttons">
        <BaseButton theme="white" @click="close"> Cancel </BaseButton>
        <BaseButton :disabled="isDisabled" @click="handleRename">
          Confirm
        </BaseButton>
      </div>
    </template>
  </BaseModal>
</template>

<style lang="scss" scoped>
.rename__input {
  margin-bottom: 3rem;
  width: 100%;
  max-width: 420px;
  &--error {
    margin-bottom: 0.25rem;
  }
}

.rename__input--error {
  margin-bottom: 0.25rem;
}

.rename__error {
  font-size: 0.9rem;
  color: $text-color-error;
}

.rename__buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
}
</style>
