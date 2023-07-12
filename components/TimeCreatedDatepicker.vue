<script setup lang="ts">
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import type { ModelValue } from "@vuepic/vue-datepicker";

const props = defineProps<{
  modelValue: ModelValue;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: ModelValue): void;
}>();

const date = ref<ModelValue>(null);
const root = ref<HTMLElement | null>(null);

const isRangeValid = computed(() => {
  if (Array.isArray(date.value)) {
    return !date.value?.some((el) => el === null);
  } else {
    return true;
  }
});

const onClickOutside = () => {
  if (root.value) root.value.closeMenu();
};

const handleDate = (modelData: ModelValue) => {
  date.value = modelData;
  emit("update:modelValue", date.value);
};
</script>

<template>
  <VueDatePicker
    ref="root"
    range
    placeholder="Select date"
    :max-date="new Date()"
    prevent-min-max-navigation
    :on-click-outside="onClickOutside"
    :space-confirm="false"
    :state="isRangeValid"
    :transitions="true"
    menu-class-name="datepicker__menu"
    input-class-name="datepicker__input"
    calendar-class-name="dp-custom-calendar"
    calendar-cell-class-name="dp-custom-cell"
    :model-value="date"
    @update:model-value="handleDate"
  />
</template>

<style lang="scss">
.dp__input,
.dp__btn,
.dp__calendar_header_item,
.dp__calendar_item:not(disabled) {
  color: $text-color-primary;
}

.dp__input_valid {
  box-shadow: 0 0 4px $color-green-medium;
  border-color: $color-green-medium;
}

.dp__input_invalid {
  box-shadow: 0 0 1px $text-color-error;
}

.dp__input_focus {
  outline-style: auto;
  outline-offset: 0px;
  outline-color: rgb(0, 95, 204);
}

.datepicker__menu {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
}

.dp__range_start,
.dp__range_end,
.dp__action_select {
  background-color: $color-green-dark;
}

.dp__today {
  border: 1px solid $color-green-dark;
}

.dp-custom-cell {
  border-radius: 50%;
}

.dp__action_button {
  font-size: 0.8rem;
}

.dp__action_select:hover {
  background-color: $color-green-dark-hover;
}

.dp__action_select:disabled {
  background-color: $color-green-medium;
}
</style>
