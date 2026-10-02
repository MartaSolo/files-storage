<template>
  <div class="rename">
    <BaseModal :is-open="isOpen" @close-modal="close">
      <template #header>
        <h3 class="rename__header">Rename file</h3>
      </template>
      <template #body>
        <div
          class="rename__input-wrapper"
          :class="{ 'rename__input-wrapper--error': errorMessage }"
        >
          <BaseInput
            v-model="newFileName"
            name="rename"
            type="text"
            class="rename__input"
          >
            <span class="rename__extension" data-testid="rename-extension">{{
              extension
            }}</span>
          </BaseInput>
        </div>
        <p
          v-if="errorMessage"
          role="alert"
          class="rename__error"
          data-testid="rename-error"
        >
          {{ errorMessage }}
        </p>
      </template>
      <template #footer>
        <div class="rename__buttons">
          <BaseButton
            theme="white"
            :disabled="isRenaming"
            data-testid="rename-cancel"
            @click="close"
          >
            Cancel
          </BaseButton>
          <BaseButton
            :disabled="isDisabled"
            :loading="isRenaming"
            data-testid="rename-confirm"
            @click="handleRename"
          >
            Confirm
          </BaseButton>
        </div>
      </template>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { splitFileName } from "@/utils/helpers/splitFileName";

const props = defineProps<{
  fileName: string;
  isOpen: boolean;
}>();

const emit = defineEmits<{
  (e: "closeRenameFileModal" | "fileNameUpdated"): void;
}>();

const { rename } = useRenameFile();

const fileParts = computed(() => splitFileName(props.fileName));
const extension = computed(() => fileParts.value.extension);

const newFileName = ref(fileParts.value.name);
const errorMessage = ref("");
const isRenaming = ref(false);

const trimmedName = computed(() => newFileName.value.trim());

const newFullFileName = computed(
  () => `${trimmedName.value}${extension.value}`
);

const isDisabled = computed(
  () =>
    isRenaming.value ||
    !trimmedName.value ||
    newFullFileName.value === props.fileName
);
watch(
  () => props.isOpen,
  (isOpen) => {
    if (!isOpen) return;
    newFileName.value = fileParts.value.name;
    errorMessage.value = "";
  }
);

watch(newFileName, () => {
  errorMessage.value = "";
});

const close = () => {
  emit("closeRenameFileModal");
};

const handleRename = async () => {
  isRenaming.value = true;

  try {
    await rename(props.fileName, newFullFileName.value);
    emit("fileNameUpdated");
    close();
  } catch (error) {
    errorMessage.value =
      error instanceof Error ? error.message : "Unknown error occurred.";
  } finally {
    isRenaming.value = false;
  }
};
</script>

<style lang="scss" scoped>
.rename {
  &__input-wrapper {
    margin-bottom: 3rem;
    width: 100%;
    max-width: 420px;
    &--error {
      margin-bottom: 0.25rem;
    }
    :deep(.input) {
      margin-bottom: 0;
    }

    &--error {
      margin-bottom: 0.25rem;
    }
  }

  &__input {
    flex-direction: row;
    align-items: center;
  }

  &__error {
    font-size: 0.9rem;
    color: $text-color-error;
  }

  &__buttons {
    display: flex;
    gap: 1rem;
    justify-content: center;
  }
}
</style>
