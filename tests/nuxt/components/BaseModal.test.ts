import { mockNuxtImport, mountSuspended } from "@nuxt/test-utils/runtime";
import { DOMWrapper, enableAutoUnmount } from "@vue/test-utils";
import BaseModal from "@/components/base/BaseModal.vue";

// BaseModal uses <Teleport to="body">, so every mounted instance leaves
// DOM behind in document.body that Vue only cleans up on unmount.
// enableAutoUnmount(afterEach) makes every wrapper from mountSuspended
// call wrapper.unmount() automatically after each test, so document.body
// is clean before the next test runs. This also correctly triggers
// BaseModal's own onUnmounted hook (disableScrollOffset).
enableAutoUnmount(afterEach);

// BaseModal calls useContentScrollOffset(), an app composable with real
// side effects (touching scroll/overflow) that we don't want running or
// asserted on here, we only care that BaseModal calls it correctly.
// vi.hoisted() creates the mock functions before Vitest hoists the
// mockNuxtImport call below to the top of the file (mockNuxtImport is a
// macro compiled into a hoisted vi.mock, so anything it references must
// already exist at that point, hence vi.hoisted).
const { enableScrollOffsetMock, disableScrollOffsetMock } = vi.hoisted(() => ({
  enableScrollOffsetMock: vi.fn(),
  disableScrollOffsetMock: vi.fn(),
}));

// Replaces the real useContentScrollOffset auto-import with our fake
// version for every test in this file.
mockNuxtImport("useContentScrollOffset", () => {
  return () => ({
    enableScrollOffset: enableScrollOffsetMock,
    disableScrollOffset: disableScrollOffsetMock,
  });
});

// Because BaseModal's teleported content is plain markup (not a child
// component), wrapper.find()/wrapper.get() can't reach it, those only
// search inside the wrapper's own DOM subtree, and teleported content
// physically moves outside that subtree into document.body.
// So we query the real DOM directly with document.querySelector, then
// wrap the raw element in a DOMWrapper so we still get .trigger(),
// .text(), etc., the same API wrapper.find() would normally give us.
const findInBody = (selector: string) => {
  const el = document.querySelector(selector);
  return el ? new DOMWrapper(el) : null;
};

describe("BaseModal", () => {
  beforeEach(() => {
    // Resets call counts/history on our composable mocks between tests,
    // so e.g. a previous test's enableScrollOffset call doesn't leak
    // into the next test's assertions.
    vi.clearAllMocks();
  });

  it("does not render modal content when isOpen is false", async () => {
    await mountSuspended(BaseModal, {
      props: { isOpen: false },
    });

    expect(document.querySelector(".modal__mask")).toBeNull();
  });

  it("renders modal content and slots when isOpen is true", async () => {
    await mountSuspended(BaseModal, {
      props: { isOpen: true },
      slots: {
        header: () => "My Header",
        body: () => "My Body",
        footer: () => "My Footer",
      },
    });

    expect(document.querySelector(".modal__mask")).not.toBeNull();
    expect(document.body.textContent).toContain("My Header");
    expect(document.body.textContent).toContain("My Body");
    expect(document.body.textContent).toContain("My Footer");
  });

  it("calls enableScrollOffset on mount and disableScrollOffset on unmount", async () => {
    const wrapper = await mountSuspended(BaseModal, {
      props: { isOpen: true },
    });

    expect(enableScrollOffsetMock).toHaveBeenCalledTimes(1);

    // Manual unmount here (rather than relying on enableAutoUnmount)
    // because this test needs to assert on the unmount side effect
    // itself, we need it to happen *during* the test, not after.
    wrapper.unmount();

    expect(disableScrollOffsetMock).toHaveBeenCalledTimes(1);
  });

  it("emits closeModal when the close button is clicked", async () => {
    const wrapper = await mountSuspended(BaseModal, {
      props: { isOpen: true },
    });

    // Close button lives inside the teleported markup, so we reach it
    // via findInBody (document.querySelector) instead of wrapper.find.
    const closeButton = findInBody('[data-testid="modal-close-button"]');
    await closeButton?.trigger("click");

    // Emitted events ARE tracked on the component instance itself, not
    // the DOM location, so wrapper.emitted() still works normally here
    // even though the button we clicked lives outside wrapper's DOM tree.
    expect(wrapper.emitted("closeModal")).toBeTruthy();
  });

  it("emits closeModal on Escape keydown", async () => {
    const wrapper = await mountSuspended(BaseModal, {
      props: { isOpen: true },
    });

    const mask = findInBody(".modal__mask");
    await mask?.trigger("keydown.esc");

    expect(wrapper.emitted("closeModal")).toBeTruthy();
  });

  describe("focus trap", () => {
    it("wraps focus from the last focusable element to the first on Tab", async () => {
      await mountSuspended(BaseModal, {
        // attachTo: document.body is required specifically for focus
        // tests: document.activeElement only reflects reality for
        // elements actually attached to the live document, a detached
        // element can technically receive .focus() calls without
        // document.activeElement ever updating to match it.
        attachTo: document.body,
        props: { isOpen: true },
        // Slot value passed as a plain string (not a function returning
        // a string). A function-returned string becomes a literal text
        // node in Vue, the tags are never parsed as real HTML. Passing
        // the raw string directly gets compiled into an actual element.
        slots: {
          footer: '<button data-testid="footer-confirm">Confirm</button>',
        },
      });

      const closeButton = document.querySelector(
        '[data-testid="modal-close-button"]'
      ) as HTMLElement;
      const lastButton = document.querySelector(
        '[data-testid="footer-confirm"]'
      ) as HTMLElement;

      lastButton.focus();
      expect(document.activeElement).toBe(lastButton);

      const mask = findInBody(".modal__mask");
      await mask?.trigger("keydown.tab");

      expect(document.activeElement).toBe(closeButton);
    });

    it("wraps focus from the first focusable element to the last on Shift+Tab", async () => {
      await mountSuspended(BaseModal, {
        attachTo: document.body,
        props: { isOpen: true },
        slots: {
          footer: '<button data-testid="footer-confirm">Confirm</button>',
        },
      });

      const closeButton = document.querySelector(
        '[data-testid="modal-close-button"]'
      ) as HTMLElement;
      const lastButton = document.querySelector(
        '[data-testid="footer-confirm"]'
      ) as HTMLElement;

      closeButton.focus();
      expect(document.activeElement).toBe(closeButton);

      const mask = findInBody(".modal__mask");
      await mask?.trigger("keydown.tab", { shiftKey: true });

      expect(document.activeElement).toBe(lastButton);
    });

    it("does not change focus when tabbing from a middle element", async () => {
      await mountSuspended(BaseModal, {
        attachTo: document.body,
        props: { isOpen: true },
        slots: {
          body: '<button data-testid="body-middle">Middle</button>',
          footer: '<button data-testid="footer-confirm">Confirm</button>',
        },
      });

      const middleButton = document.querySelector(
        '[data-testid="body-middle"]'
      ) as HTMLElement;

      middleButton.focus();
      expect(document.activeElement).toBe(middleButton);

      const mask = findInBody(".modal__mask");
      await mask?.trigger("keydown.tab");

      // handleFocusTrap only reacts at the exact first/last boundary,
      // so from a middle element nothing should change: no preventDefault,
      // no manual refocus, native Tab handling (not exercised in jsdom)
      // would be what moves focus in a real browser.
      expect(document.activeElement).toBe(middleButton);
    });
  });
});
