<script setup lang="ts">
withDefaults(
  defineProps<{
    name: string;
    label?: string;
    modelValue: string | number;
    placeholder?: string;
  }>(),
  {
    label: "",
    placeholder: "",
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

<template>
  <div class="input">
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
  </div>
</template>

<style lang="scss" scoped>
.input {
  max-width: 100%;
  display: flex;
  align-items: center;
}

.input__label {
  padding-right: 0.5rem;
}

.input__input {
  border: 1px solid $color-grey-light;
  border-radius: 8px;
  padding: 0.5rem 0.75rem;
  flex-grow: 2;
  width: 100%;
  &.error {
    border: 1px solid $text-color-error;
  }
  &.success {
    border: 1px solid $text-color-success;
  }
  &[type="number"] {
    width: 80%;
  }
}
</style>
