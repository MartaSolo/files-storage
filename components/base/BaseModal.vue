<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        ref="root"
        class="modal__mask"
        @keydown.esc="emit('closeModal')"
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
  </Teleport>
</template>

<script setup lang="ts">
const { enableScrollOffset, disableScrollOffset } = useContentScrollOffset();

const root = ref<HTMLElement | null>(null);

const emit = defineEmits<{
  (e: "closeModal"): void;
}>();

const focusableNodes = () => {
  if (root.value) {
    return root.value?.querySelectorAll<HTMLElement>(
      "a[href]:not([disabled]), button:not([disabled]), textarea:not([disabled]), input[type='text']:not([disabled]), input[type='radio']:not([disabled]), input[type='checkbox']:not([disabled]), select:not([disabled])"
    );
  }
};

const firstFocusableNode = () => {
  const focusableNodesResult = focusableNodes();
  if (focusableNodesResult) {
    return focusableNodesResult[0];
  }
};

const lastFocusableNode = () => {
  const focusableNodesResult = focusableNodes();
  if (focusableNodesResult) {
    return focusableNodesResult[focusableNodesResult.length - 1];
  }
};

const handleFocusTrap = (e: KeyboardEvent) => {
  if (focusableNodes()) {
    if (document.activeElement === firstFocusableNode() && e.shiftKey) {
      lastFocusableNode()?.focus();
      e.preventDefault();
    }
    if (document.activeElement === lastFocusableNode() && !e.shiftKey) {
      firstFocusableNode()?.focus();
      e.preventDefault();
    }
  }
};

onMounted(() => {
  enableScrollOffset();
});

onUnmounted(() => {
  disableScrollOffset();
});
</script>

<style lang="scss" scoped>
.modal {
  &__mask {
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

  &__container {
    width: 100%;
    max-width: 500px;
    margin: auto;
    padding: 20px 30px;
    background-color: $color-white;
    border-radius: 6px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
    transition: all 0.3s ease;
  }

  &__header h3 {
    margin-top: 0;
    color: $color-green-dark;
  }

  &__body {
    margin: 20px 0;
  }

  &__button {
    float: right;
    &:focus {
      outline-style: auto;
    }
    &:focus-visible {
      outline-style: auto;
    }
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
