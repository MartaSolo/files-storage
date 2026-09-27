import { describe, it, expect, afterEach } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import BaseNotification from "@/components/base/BaseNotification.vue";
import { useNotification } from "#imports";

describe("BaseNotification", () => {
  afterEach(() => {
    // Composable state is a module-level singleton shared across
    // this file's tests, so close it out after each one.
    const { closeNotification } = useNotification();
    closeNotification();
  });

  it("does not render when isOpen is false", async () => {
    const wrapper = await mountSuspended(BaseNotification);

    expect(wrapper.find('[data-testid="notification"]').exists()).toBe(false);
  });

  it("renders the message and theme class when notify is called", async () => {
    const { notify } = useNotification();
    const wrapper = await mountSuspended(BaseNotification);

    notify("success", "Saved successfully");
    await wrapper.vm.$nextTick();

    const content = wrapper.find('[data-testid="notification-content"]');
    expect(content.exists()).toBe(true);
    expect(content.text()).toBe("Saved successfully");
    expect(content.classes()).toContain("notification__content--success");
  });

  it("closes when the close button is clicked", async () => {
    const { notify } = useNotification();
    const wrapper = await mountSuspended(BaseNotification);

    notify("error", "Something went wrong");
    await wrapper.vm.$nextTick();

    await wrapper
      .find('[data-testid="notification-close-button"]')
      .trigger("click");
    await wrapper.vm.$nextTick();

    expect(wrapper.find('[data-testid="notification"]').exists()).toBe(false);
  });
});
