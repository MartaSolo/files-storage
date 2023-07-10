<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    name: string;
    label?: string | boolean;
    modelValue: string | number;
  }>(),
  {
    label: "",
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
}

.input__input[type="number"] {
  width: 80%;
}
</style>
