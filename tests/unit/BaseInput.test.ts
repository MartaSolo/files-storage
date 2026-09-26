import { mount } from "@vue/test-utils";
import BaseInput from "@/components/base/BaseInput.vue";

describe("BaseInput", () => {
  it("renders the label when the label prop is provided", () => {
    const wrapper = mount(BaseInput, {
      props: { name: "email", label: "Email", modelValue: "" },
    });

    const label = wrapper.find('[data-testid="base-input-label"]');
    expect(label.exists()).toBe(true);
    expect(label.text()).toBe("Email");
    expect(label.attributes("for")).toBe("email");
  });

  it("does not render the label when the label prop is omitted", () => {
    const wrapper = mount(BaseInput, {
      props: { name: "email", modelValue: "" },
    });

    expect(wrapper.find('[data-testid="base-input-label"]').exists()).toBe(
      false
    );
  });

  it("renders with placeholder and initial value from modelValue", () => {
    const wrapper = mount(BaseInput, {
      props: {
        name: "email",
        modelValue: "test@example.com",
        placeholder: "Enter email",
      },
    });

    const input = wrapper.find('[data-testid="base-input-field"]');
    expect(input.attributes("placeholder")).toBe("Enter email");
    expect((input.element as HTMLInputElement).value).toBe("test@example.com");
  });

  it("emits update:modelValue on input", async () => {
    const wrapper = mount(BaseInput, {
      props: { name: "email", modelValue: "" },
    });

    const input = wrapper.find('[data-testid="base-input-field"]');
    await input.setValue("new value");

    expect(wrapper.emitted("update:modelValue")).toBeTruthy();
    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual(["new value"]);
  });

  it("shows error state when errorMessage is set", () => {
    const wrapper = mount(BaseInput, {
      props: {
        name: "email",
        modelValue: "",
        errorMessage: "This field is required",
      },
    });

    const root = wrapper.find('[data-testid="base-input"]');
    expect(root.classes()).toContain("input--error");
    expect(root.classes()).not.toContain("input--success");

    const error = wrapper.find('[data-testid="base-input-error"]');
    expect(error.exists()).toBe(true);
    expect(error.text()).toBe("This field is required");
  });

  it("shows success state when valid is true and there is no error", () => {
    const wrapper = mount(BaseInput, {
      props: { name: "email", modelValue: "", valid: true },
    });

    const root = wrapper.find('[data-testid="base-input"]');
    expect(root.classes()).toContain("input--success");
    expect(root.classes()).not.toContain("input--error");
  });

  it("has neither error nor success class by default", () => {
    const wrapper = mount(BaseInput, {
      props: { name: "email", modelValue: "" },
    });

    const root = wrapper.find('[data-testid="base-input"]');
    expect(root.classes()).not.toContain("input--error");
    expect(root.classes()).not.toContain("input--success");
  });

  it("passes through extra attributes via $attrs", () => {
    const wrapper = mount(BaseInput, {
      props: { name: "email", modelValue: "" },
      attrs: { type: "email", maxlength: "50" },
    });

    const input = wrapper.find('[data-testid="base-input-field"]');
    expect(input.attributes("type")).toBe("email");
    expect(input.attributes("maxlength")).toBe("50");
  });
});
