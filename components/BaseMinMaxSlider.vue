<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    min: number;
    max: number;
    step: number;
    minValue: number;
    maxValue: number;
    label: string;
    unit?: string;
  }>(),
  {
    step: 1,
    unit: "",
  }
);

const emit = defineEmits<{
  (e: "update:minValue", sliderMinValue: number): void;
  (e: "update:maxValue", sliderMaxValue: number): void;
}>();

const slider = ref<HTMLElement | null>(null);
const inputMin = ref<HTMLElement | null>(null);
const inputMax = ref<HTMLElement | null>(null);
const sliderMinValue = ref(props.minValue);
const sliderMaxValue = ref(props.maxValue);

const getPercent = (value: number, min: number, max: number) => {
  return ((value - min) / (max - min)) * 100;
};

const sliderDifference = computed(() => {
  return Math.abs(sliderMaxValue.value - sliderMinValue.value);
});

// function to set the css variables for width, left and right
const setCSSProps = (width: number, left: number, right: number) => {
  slider.value?.style.setProperty("--width", `${width}%`);
  slider.value?.style.setProperty("--progressLeft", `${left}%`);
  slider.value?.style.setProperty("--progressRight", `${right}%`);
};

watchEffect(() => {
  if (slider.value) {
    emit("update:minValue", Number(sliderMinValue.value));
    emit("update:maxValue", Number(sliderMaxValue.value));

    const differencePercent = getPercent(
      sliderDifference.value,
      props.min,
      props.max
    );

    const leftPercent = getPercent(sliderMinValue.value, props.min, props.max);

    const rightPercent =
      100 - getPercent(sliderMaxValue.value, props.min, props.max);

    setCSSProps(differencePercent, leftPercent, rightPercent);
  }
});

const onInput = (e: Event) => {
  const target = e.target as HTMLInputElement;

  if (target.name === "min") {
    target.value > sliderMaxValue.value.toString()
      ? (target.value = sliderMaxValue.value.toString())
      : (sliderMinValue.value = parseFloat(target.value));
  }

  if (target.name === "max") {
    target.value < sliderMinValue.value.toString()
      ? (target.value = sliderMinValue.value.toString())
      : (sliderMaxValue.value = parseFloat(target.value));
  }
};
</script>

<template>
  <div class="slider">
    <p class="slider__label">{{ label }}</p>
    <div ref="slider" class="slider__range minmax">
      <input
        id="min"
        ref="inputMin"
        type="range"
        name="min"
        :min="min"
        :max="max"
        :value="minValue"
        :step="step"
        @input="onInput"
      />
      <input
        id="max"
        ref="inputMax"
        type="range"
        name="max"
        :min="min"
        :max="max"
        :value="maxValue"
        :step="step"
        @input="onInput"
      />
    </div>
    <div class="slider__inputs">
      <div class="slider__input">
        <BaseInput
          v-model="sliderMinValue"
          name="min-size"
          type="number"
          :step="step"
          :min="min"
          :max="max"
        >
          <span v-if="unit" class="slider__input--unit">MB</span>
        </BaseInput>
      </div>
      <div class="minmax__dash"></div>
      <div class="slider__input">
        <BaseInput
          v-model="sliderMaxValue"
          name="max-size"
          type="number"
          :step="step"
          :min="min"
          :max="max"
        >
          <span v-if="unit" class="slider__input--unit">MB</span>
        </BaseInput>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.slider__label {
  padding-bottom: 0.75rem;
}
.slider__range {
  --trackHeight: 0.5rem;
  --thumbRadius: 1rem;
}

/* style for the input element with type "range" */
.slider__range input[type="range"] {
  position: relative;
  appearance: none;
  background: none;
  pointer-events: none;
  border-radius: 999px;
  z-index: 0;
}

/* ::before element to replace the slider track */
.slider__range input[type="range"]::before,
.slider__range.minmax::before {
  content: "";
  position: absolute;
  width: var(--ProgressPercent, 100%);
  height: 100%;
  background: $color-green-dark;
  pointer-events: none;
  border-radius: 999px;
}

.slider__range input[type="range"]::-webkit-slider-thumb {
  position: relative;
  width: var(--thumbRadius);
  height: var(--thumbRadius);
  margin-top: calc((var(--trackHeight) - var(--thumbRadius)) / 2);
  background: $color-green-dark;
  border-radius: 999px;
  pointer-events: all;
  appearance: none;
  z-index: 1;
}

.slider__range.minmax {
  position: relative;
  height: var(--trackHeight);
  background: $color-green-medium;
  border-radius: 999px;
  margin: 0.5rem 0;
  --progressLeft: 0%;
  --progressRight: 0%;
}

.slider__range.minmax input[type="range"] {
  position: absolute;
  pointer-events: none;
  width: 100%;
}

.slider__range.minmax input[type="range"]::-webkit-slider-runnable-track {
  background: none;
}

.slider__range.minmax::before {
  left: var(--progressLeft);
  right: var(--progressRight);
  width: unset;
}

.slider__range.minmax input[type="range"]::before {
  display: none;
}

.slider__inputs {
  padding-top: 0.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.minmax__dash {
  width: 15px;
  height: 2px;
  border-radius: 8px;
  background-color: $text-color-secondary;
  @include smallScreen {
    width: 30px;
  }
}

.slider__input--unit {
  padding: 0.5rem 0 0.5rem 0.5rem;
}

.slider__input {
  width: 100px;
  @include smallScreen {
    width: 150px;
  }
}
</style>
