<template>
  <div
    class="input"
    :class="[
      'input',
      { 'input--error': errorMessage },
      { 'input--success': valid && !errorMessage },
    ]"
  >
    <label v-if="label" class="input__label" :for="name">{{ label }}</label>
    <input
      :id="name"
      v-bind="$attrs"
      class="input__input"
      :value="modelValue"
      :placeholder="placeholder"
      @input="onInput"
    />
    <slot />
    <span v-if="errorMessage" class="input__error-message">{{
      errorMessage
    }}</span>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    name: string;
    label?: string;
    modelValue: string | number;
    placeholder?: string;
    errorMessage?: string;
    valid?: boolean;
  }>(),
  {
    label: "",
    placeholder: "",
    errorMessage: "",
    valid: false,
  }
);

const emit = defineEmits<{
  (e: "update:modelValue", value: string | number): void;
}>();

const onInput = (e: Event) => {
  const target = e.target as HTMLInputElement;
  emit("update:modelValue", target.value);
};
</script>

<style lang="scss" scoped>
.input {
  max-width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 2rem;

  &__label {
    padding: 0 0.5rem 0.25rem 0;
  }

  &__input {
    border: 1px solid $color-grey-light;
    border-radius: 8px;
    padding: 0.5rem 0.75rem;
    flex-grow: 2;
    width: 100%;
    &[type="number"] {
      width: 80%;
    }
  }

  &__error-message {
    padding-top: 0.3rem;
    font-size: 0.7rem;
    line-height: 0.7rem;
    color: $text-color-error;
    display: block;
  }

  &--error {
    margin-bottom: 1rem;
  }

  &--error .input__input {
    border: 1px solid $text-color-error;
  }

  &--success .input__input {
    border: 1px solid $text-color-success;
  }
}
</style>
