<script setup lang="ts">
const { theme, text, isOpen, closeNotification } = useNotification();
</script>

<template>
  <section v-if="isOpen">
    <Teleport to="body">
      <Transition name="notification">
        <div class="notification__mask" @keydown.esc="closeNotification">
          <div class="notification__container">
            <button class="notification__button" @click="closeNotification">
              <CloseIcon />
            </button>
            <div
              :class="[
                'notification__content',
                `notification__content--${theme}`,
              ]"
            >
              {{ text }}
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </section>
</template>

<style lang="scss" scoped>
.notification__mask {
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

.notification__container {
  width: 100%;
  max-width: 500px;
  margin: auto;
  padding: 20px 30px;
  background-color: $color-white;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
}

.notification__content {
  margin: 20px 0;
  font-size: 1rem;
  line-height: 1.2;
  &--error {
    color: $text-color-error;
  }
  &--success {
    color: $text-color-success;
  }
}

.notification__button {
  float: right;
  &:focus {
    outline-style: auto;
  }
  &:focus-visible {
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
