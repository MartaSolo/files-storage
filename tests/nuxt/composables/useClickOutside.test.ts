import { mountSuspended } from "@nuxt/test-utils/runtime";
import { defineComponent, h, ref, type Ref } from "vue";
import { useClickOutside } from "@/composables/useClickOutside";

// Explicit shape of what the host component exposes via setup(), so
// wrapper.vm is properly typed.
interface HostExposed {
  targetRef: Ref<HTMLElement | null>;
  listener: (e: MouseEvent) => void;
}

const createHost = (onOutsideClick: () => void) =>
  defineComponent({
    setup(): HostExposed {
      const targetRef = ref<HTMLElement | null>(null);
      const { listener } = useClickOutside(targetRef, onOutsideClick) ?? {};
      return { targetRef, listener: listener as (e: MouseEvent) => void };
    },
    render() {
      return h("div", [
        h("div", { ref: "targetRef", "data-testid": "target" }, [
          h("span", { "data-testid": "target-child" }, "inside"),
        ]),
        h("div", { "data-testid": "outside" }, "outside"),
      ]);
    },
  });

const dispatchClick = (el: HTMLElement) => {
  el.dispatchEvent(
    new MouseEvent("click", { bubbles: true, cancelable: true })
  );
};

describe("useClickOutside", () => {
  it("does not call the callback when clicking inside the target", async () => {
    const callback = vi.fn();
    await mountSuspended(createHost(callback), { attachTo: document.body });

    const target = document.querySelector(
      '[data-testid="target"]'
    ) as HTMLElement;
    dispatchClick(target);

    expect(callback).not.toHaveBeenCalled();
  });

  it("does not call the callback when clicking a descendant of the target", async () => {
    const callback = vi.fn();
    const wrapper = await mountSuspended(createHost(callback), {
      attachTo: document.body,
    });

    const vm = wrapper.vm as unknown as HostExposed;
    const targetEl = vm.targetRef as unknown as HTMLElement;
    const childEl = document.querySelector(
      '[data-testid="target-child"]'
    ) as HTMLElement;

    const fakeEvent = {
      target: childEl,
      composedPath: () => [childEl, targetEl, document.body],
    } as unknown as MouseEvent;

    vm.listener(fakeEvent);

    expect(callback).not.toHaveBeenCalled();
  });

  it("calls the callback when clicking outside the target", async () => {
    const callback = vi.fn();
    await mountSuspended(createHost(callback), { attachTo: document.body });

    const outside = document.querySelector(
      '[data-testid="outside"]'
    ) as HTMLElement;
    dispatchClick(outside);

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("removes its click listener on unmount", async () => {
    const callback = vi.fn();
    const wrapper = await mountSuspended(createHost(callback), {
      attachTo: document.body,
    });

    const outside = document.querySelector(
      '[data-testid="outside"]'
    ) as HTMLElement;

    wrapper.unmount();
    dispatchClick(outside);

    expect(callback).not.toHaveBeenCalled();
  });

  it("does not attach a listener if the target ref is null on mount", async () => {
    const callback = vi.fn();
    const addSpy = vi.spyOn(window, "addEventListener");

    const nullTargetHost = defineComponent({
      setup() {
        const targetRef = ref<HTMLElement | null>(null);
        useClickOutside(targetRef, callback);
        return () => h("div", [h("div", { "data-testid": "outside" })]);
      },
    });

    await mountSuspended(nullTargetHost, { attachTo: document.body });

    expect(addSpy).not.toHaveBeenCalledWith("click", expect.any(Function));

    addSpy.mockRestore();
  });
});
