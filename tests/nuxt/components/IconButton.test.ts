import { mountSuspended } from "@nuxt/test-utils/runtime";
import IconButton from "@/components/IconButton.vue";
import type { IconButtonTheme } from "@/types/IconButtonTheme";
import { h } from "vue";

const ROOT = '[data-testid="icon-button-root"]';
// BUTTON doesn't have its own data-testid cuz it is inherited from parents from other components
const BUTTON = '[data-testid="icon-button-root"] button';
const DESCRIPTION = '[data-testid="icon-button-description"]';

describe("IconButton", () => {
  const mountIconButton = (
    theme?: IconButtonTheme,
    attrs?: Record<string, unknown>
  ) =>
    mountSuspended(IconButton, {
      props: { description: "Layout type", theme },
      attrs,
    });

  it("renders aria-label equal to description, and the description text is in the DOM", async () => {
    const wrapper = await mountIconButton();

    expect(wrapper.find(BUTTON).attributes("aria-label")).toBe("Layout type");
    expect(wrapper.find(DESCRIPTION).text()).toContain("Layout type");
  });

  it("description is hidden initially", async () => {
    const wrapper = await mountIconButton();
    const description = wrapper.find(DESCRIPTION).element as HTMLElement;

    expect(description.style.display).toBe("none");
  });

  it("mouseenter shows, mouseleave hides the description", async () => {
    const wrapper = await mountIconButton();
    const button = wrapper.find(BUTTON);
    const description = wrapper.find(DESCRIPTION).element as HTMLElement;

    await button.trigger("mouseenter");

    expect(description.style.display).toBe("");

    await button.trigger("mouseleave");

    expect(description.style.display).toBe("none");
  });

  it("focus shows, blur hides the description", async () => {
    const wrapper = await mountIconButton();
    const button = wrapper.find(BUTTON);
    const description = wrapper.find(DESCRIPTION).element as HTMLElement;

    await button.trigger("focus");

    expect(description.style.display).toBe("");

    await button.trigger("blur");

    expect(description.style.display).toBe("none");
  });

  it("click hides the description after it was shown", async () => {
    const wrapper = await mountIconButton();
    const button = wrapper.find(BUTTON);
    const description = wrapper.find(DESCRIPTION).element as HTMLElement;

    await button.trigger("mouseenter");

    expect(description.style.display).toBe("");

    await button.trigger("click");

    expect(description.style.display).toBe("none");
  });

  it("has default theme if none was passed", async () => {
    const wrapper = await mountIconButton();
    const button = wrapper.find(BUTTON);

    expect(button.classes()).toContain("button__btn--grey");
  });

  it("if theme passed in props - it is applied", async () => {
    const wrapper = await mountIconButton("green");
    const button = wrapper.find(BUTTON);

    expect(button.classes()).toContain("button__btn--green");
  });

  it("inheritAttrs - attributes are assigned to button not to the root", async () => {
    const wrapper = await mountIconButton(undefined, {
      class: "some-class",
      disabled: true,
    });
    const root = wrapper.find(ROOT);
    const button = wrapper.find(BUTTON);

    expect(button.classes()).toContain("some-class");
    expect((button.element as HTMLButtonElement).disabled).toBe(true);
    expect(root.classes()).not.toContain("some-class");
  });

  it("renders the icon slot inside the button", async () => {
    const wrapper = await mountSuspended(IconButton, {
      props: { description: "Layout type" },
      slots: {
        icon: () => h("span", { "data-testid": "test-icon" }, "ICON"),
      },
    });

    const button = wrapper.find(BUTTON);

    expect(button.find('[data-testid="test-icon"]').exists()).toBe(true);
    expect(button.text()).toBe("ICON");
  });

  it("calls the parent onClick and hides the description", async () => {
    const onClick = vi.fn();
    const wrapper = await mountIconButton(undefined, { onClick });
    const button = wrapper.find(BUTTON);
    const description = wrapper.find(DESCRIPTION).element as HTMLElement;

    await button.trigger("mouseenter");

    expect(description.style.display).toBe("");

    await button.trigger("click");

    expect(onClick).toHaveBeenCalledTimes(1);
    expect(description.style.display).toBe("none");
  });
});
