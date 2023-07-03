<script setup lang="ts">
const root = ref<HTMLElement | null>(null);

const emit = defineEmits<{
  (e: "closeModal"): void;
}>();

const focusableNodes = computed(() => {
  return root.value?.querySelectorAll<HTMLInputElement>(
    "a[href]:not([disabled]), button:not([disabled]), textarea:not([disabled]), input[type='text']:not([disabled]), input[type='radio']:not([disabled]), input[type='checkbox']:not([disabled]), select:not([disabled])"
  );
});

const firstFocusableNode = () => {
  if (focusableNodes.value) return focusableNodes.value[0];
};

const lastFocusableNode = () => {
  if (focusableNodes.value) {
    return focusableNodes.value[focusableNodes.value.length - 1];
  }
};

const handleFocusTrap = (e: KeyboardEvent) => {
  if (focusableNodes.value) {
    if (e.shiftKey && document.activeElement === firstFocusableNode()) {
      lastFocusableNode()?.focus();
      e.preventDefault();
    }
    if (document.activeElement === lastFocusableNode()) {
      firstFocusableNode()?.focus();
      e.preventDefault();
    }
  }
};

const handleKeydownEscape = () => {
  emit("closeModal");
};

onMounted(() => {
  firstFocusableNode()?.focus();
});
</script>

<template>
  <Transition name="modal">
    <div
      ref="root"
      class="modal__mask"
      @keydown.esc="handleKeydownEscape"
      @keydown.tab="handleFocusTrap"
    >
      <div class="modal__container">
        <button class="modal__button" @click="emit('closeModal')">
          <CloseIcon />
        </button>
        <div class="modal__header">
          <slot name="header" />
        </div>
        <div class="modal__body">
          <slot name="body" />
        </div>
        <div class="modal__footer">
          <slot name="footer" />
        </div>
      </div>
    </div>
  </Transition>
</template>

<style lang="scss">
.modal__mask {
  position: fixed;
  z-index: 99999;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: $modal-bg-color;
  display: flex;
  transition: opacity 0.3s ease;
}

.modal__container {
  width: auto;
  margin: auto;
  padding: 20px 30px;
  background-color: $color-white;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
}

.modal__header h3 {
  margin-top: 0;
  color: $color-green-dark;
}

.modal__body {
  margin: 20px 0;
}

.modal__button {
  float: right;
  &:focus {
    outline-style: auto;
  }
  &:focus-visible {
    outline-style: auto;
  }
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.5s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
