import { mountSuspended } from "@nuxt/test-utils/runtime";
import BaseMinMaxSlider from "@/components/base/BaseMinMaxSlider.vue";

describe("BaseMinMaxSlider", () => {
  const baseProps = {
    min: 0,
    max: 100,
    minValue: 20,
    maxValue: 80,
    label: "Price range",
  };

  it("renders the label", async () => {
    const wrapper = await mountSuspended(BaseMinMaxSlider, {
      props: baseProps,
    });

    expect(wrapper.find('[data-testid="slider-label"]').text()).toBe(
      "Price range"
    );
  });

  it("renders range inputs reflecting min, max, step, and current values", async () => {
    const wrapper = await mountSuspended(BaseMinMaxSlider, {
      props: { ...baseProps, step: 5 },
    });

    const minRange = wrapper.find('[data-testid="slider-range-min"]');
    const maxRange = wrapper.find('[data-testid="slider-range-max"]');

    expect(minRange.attributes("min")).toBe("0");
    expect(minRange.attributes("max")).toBe("100");
    expect(minRange.attributes("step")).toBe("5");
    expect((minRange.element as HTMLInputElement).value).toBe("20");

    expect((maxRange.element as HTMLInputElement).value).toBe("80");
  });

  it("renders number inputs reflecting minValue and maxValue", async () => {
    const wrapper = await mountSuspended(BaseMinMaxSlider, {
      props: baseProps,
    });

    const minInput = wrapper.find('[data-testid="slider-number-min"] input');
    const maxInput = wrapper.find('[data-testid="slider-number-max"] input');

    expect((minInput.element as HTMLInputElement).value).toBe("20");
    expect((maxInput.element as HTMLInputElement).value).toBe("80");
  });

  it("renders unit spans when unit is provided", async () => {
    const wrapper = await mountSuspended(BaseMinMaxSlider, {
      props: { ...baseProps, unit: "kg" },
    });

    const minUnit = wrapper.find('[data-testid="slider-unit-min"]');
    const maxUnit = wrapper.find('[data-testid="slider-unit-max"]');

    expect(minUnit.exists()).toBe(true);
    expect(minUnit.text()).toBe("kg");
    expect(maxUnit.exists()).toBe(true);
    expect(maxUnit.text()).toBe("kg");
  });

  it("does not render unit spans when unit is omitted", async () => {
    const wrapper = await mountSuspended(BaseMinMaxSlider, {
      props: baseProps,
    });

    expect(wrapper.find('[data-testid="slider-unit-min"]').exists()).toBe(
      false
    );
    expect(wrapper.find('[data-testid="slider-unit-max"]').exists()).toBe(
      false
    );
  });

  it("emits update:minValue when the min range input changes", async () => {
    const wrapper = await mountSuspended(BaseMinMaxSlider, {
      props: baseProps,
    });

    const minRange = wrapper.find('[data-testid="slider-range-min"]');
    await minRange.setValue("30");

    expect(wrapper.emitted("update:minValue")?.[0]).toEqual([30]);
  });

  it("emits update:maxValue when the max range input changes", async () => {
    const wrapper = await mountSuspended(BaseMinMaxSlider, {
      props: baseProps,
    });

    const maxRange = wrapper.find('[data-testid="slider-range-max"]');
    await maxRange.setValue("90");

    expect(wrapper.emitted("update:maxValue")?.[0]).toEqual([90]);
  });

  it("emits update:minValue when the min number input changes", async () => {
    const wrapper = await mountSuspended(BaseMinMaxSlider, {
      props: baseProps,
    });

    const minInput = wrapper.find('[data-testid="slider-number-min"] input');
    await minInput.setValue("25");

    expect(wrapper.emitted("update:minValue")?.[0]).toEqual([25]);
  });

  it("emits update:maxValue when the max number input changes", async () => {
    const wrapper = await mountSuspended(BaseMinMaxSlider, {
      props: baseProps,
    });

    const maxInput = wrapper.find('[data-testid="slider-number-max"] input');
    await maxInput.setValue("75");

    expect(wrapper.emitted("update:maxValue")?.[0]).toEqual([75]);
  });
});
