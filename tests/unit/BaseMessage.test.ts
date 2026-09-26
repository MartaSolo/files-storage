import { mount } from "@vue/test-utils";
import BaseMessage from "@/components/base/BaseMessage.vue";

describe("BaseMessage", () => {
  it("renders the title text", () => {
    const wrapper = mount(BaseMessage, {
      props: { title: "Something went wrong" },
    });

    const title = wrapper.find('[data-testid="base-message-title"]');
    expect(title.exists()).toBe(true);
    expect(title.text()).toBe("Something went wrong");
  });

  it("applies the default info type class", () => {
    const wrapper = mount(BaseMessage, {
      props: { title: "Heads up" },
    });

    const title = wrapper.find('[data-testid="base-message-title"]');
    expect(title.classes()).toContain("message__title--info");
  });

  it("applies the error type class", () => {
    const wrapper = mount(BaseMessage, {
      props: { title: "Error occurred", type: "error" },
    });

    const title = wrapper.find('[data-testid="base-message-title"]');
    expect(title.classes()).toContain("message__title--error");
  });

  it("applies the success type class", () => {
    const wrapper = mount(BaseMessage, {
      props: { title: "All good", type: "success" },
    });

    const title = wrapper.find('[data-testid="base-message-title"]');
    expect(title.classes()).toContain("message__title--success");
  });

  it("renders the description when provided", () => {
    const wrapper = mount(BaseMessage, {
      props: {
        title: "Error occurred",
        description: "Please try again later",
      },
    });

    const description = wrapper.find(
      '[data-testid="base-message-description"]'
    );
    expect(description.exists()).toBe(true);
    expect(description.text()).toBe("Please try again later");
  });

  it("does not render the description when omitted", () => {
    const wrapper = mount(BaseMessage, {
      props: { title: "Error occurred" },
    });

    expect(
      wrapper.find('[data-testid="base-message-description"]').exists()
    ).toBe(false);
  });
});
