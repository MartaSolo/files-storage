<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean;
}>();

const computedStyle = computed(() => {
  const padding = props.modelValue ? "5px" : "28px";
  return { paddingLeft: padding };
});

const label = computed(() => {
  return props.modelValue ? "Public" : "Private";
});

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
}>();

const handleChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  emit("update:modelValue", target.checked);
};
</script>

<template>
  <div class="switch">
    <label class="switch__label" for="switch">
      <input
        id="switch"
        name="switch"
        type="checkbox"
        class="switch__input"
        :checked="modelValue"
        @change="handleChange"
      />
      <span class="switch__toggle" :style="computedStyle">{{ label }}</span>
    </label>
  </div>
</template>

<style lang="scss" scoped>
.switch__label {
  --switch-width: 90px;
  --switch-height: 30px;
  cursor: pointer;
  display: flex;
  align-items: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: var(--switch-width);
  height: var(--switch-height);
  border-radius: var(--switch-height);
}

.switch__input {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.switch__toggle {
  border: 2px solid $color-green-medium-hover;
  display: flex;
  align-items: center;
  position: relative;
  height: 100%;
  width: 100%;
  border-radius: var(--switch-height);
  background-color: $color-white;
  transition: background-color 0.25s ease-in-out;
  color: $color-green-dark;
}

.switch__toggle::before {
  content: "";
  position: absolute;
  left: 0px;
  height: calc(var(--switch-height) - 4px);
  width: calc(var(--switch-height) - 4px);
  border-radius: 9999px;
  background-color: $color-green-medium;
  border: 2px solid $color-green-medium-hover;
  transition: transform 0.375s ease-in-out;
}

.switch__input:checked + .switch__toggle::before {
  transform: translateX(calc(var(--switch-width) - var(--switch-height)));
}

.switch__input:focus + .switch__toggle::before,
.switch__input:focus:checked + .switch__toggle::before {
  outline: 5px auto Highlight;
  outline: 5px auto -webkit-focus-ring-color;
}
</style>
