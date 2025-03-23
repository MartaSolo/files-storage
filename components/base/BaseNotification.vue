<template>
  <section v-if="isOpen" class="notification">
    <Transition name="notification">
      <div class="notification__container">
        <div
          :class="['notification__content', `notification__content--${theme}`]"
        >
          {{ text }}
        </div>
        <button class="notification__button" @click="closeNotification">
          <CloseIcon />
        </button>
      </div>
    </Transition>
  </section>
</template>

<script setup lang="ts">
const { theme, text, isOpen, closeNotification } = useNotification();
</script>

<style lang="scss" scoped>
.notification {
  transition: all 0.3s ease;
  transform: translate(50%, 50%);
  position: absolute;
  top: 10px;
  right: 50%;
  width: 90%;
  max-width: 500px;

  &__container {
    padding: 20px;
    background-color: $color-white;
    border-radius: 6px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
    display: flex;
    gap: 20px;
    justify-content: space-between;
    align-items: center;
  }

  &__content {
    font-size: 1rem;
    line-height: 1.4;
    &--error {
      color: $text-color-error;
    }
    &--success {
      color: $text-color-success;
    }
  }

  &__button:focus-visible {
    outline-style: auto;
  }
}

.notification-enter-active,
.notification-leave-active {
  transition: opacity 0.5s ease;
}

.notification-enter-from,
.notification-leave-to {
  opacity: 0;
}
</style>
