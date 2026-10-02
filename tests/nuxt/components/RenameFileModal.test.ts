import { beforeEach, describe, expect, it, vi } from "vitest";
import { flushPromises } from "@vue/test-utils";
import {
  mockComponent,
  mockNuxtImport,
  mountSuspended,
} from "@nuxt/test-utils/runtime";
import RenameFileModal from "@/components/RenameFileModal.vue";

const { renameMock } = vi.hoisted(() => ({ renameMock: vi.fn() }));

mockNuxtImport("useRenameFile", () => () => ({ rename: renameMock }));

// BaseModal has its own tests, so a minimal stand-in is enough here.
mockComponent("BaseModal", async () => {
  const { defineComponent, h } = await import("vue");

  return defineComponent({
    props: { isOpen: Boolean },
    emits: ["closeModal"],
    setup(props, { slots, emit }) {
      return () =>
        props.isOpen
          ? h("div", { "data-testid": "base-modal" }, [
              h("button", {
                "data-testid": "modal-close-button",
                onClick: () => emit("closeModal"),
              }),
              slots.header?.(),
              slots.body?.(),
              slots.footer?.(),
            ])
          : null;
    },
  });
});

const mountModal = (props: { fileName?: string; isOpen?: boolean } = {}) =>
  mountSuspended(RenameFileModal, {
    props: { fileName: "photo.png", isOpen: true, ...props },
  });

type Wrapper = Awaited<ReturnType<typeof mountModal>>;

const getInput = (wrapper: Wrapper) =>
  wrapper.get<HTMLInputElement>('[data-testid="base-input-field"]');
const getConfirm = (wrapper: Wrapper) =>
  wrapper.get<HTMLButtonElement>('[data-testid="rename-confirm"]');
const getCancel = (wrapper: Wrapper) =>
  wrapper.get<HTMLButtonElement>('[data-testid="rename-cancel"]');
const findError = (wrapper: Wrapper) =>
  wrapper.find('[data-testid="rename-error"]');

describe("RenameFileModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    renameMock.mockResolvedValue(undefined);
  });

  describe("initial state", () => {
    it.each([
      { fileName: "photo.png", name: "photo", extension: ".png" },
      { fileName: "archive.tar.gz", name: "archive.tar", extension: ".gz" },
      { fileName: "README", name: "README", extension: "" },
    ])(
      "shows $name in the input and '$extension' as the extension for $fileName",
      async ({ fileName, name, extension }) => {
        const wrapper = await mountModal({ fileName });

        expect(getInput(wrapper).element.value).toBe(name);
        expect(wrapper.get('[data-testid="rename-extension"]').text()).toBe(
          extension
        );
      }
    );

    it("disables Confirm while the name is unchanged", async () => {
      const wrapper = await mountModal();

      expect(getConfirm(wrapper).element.disabled).toBe(true);
    });

    it("does not show an error", async () => {
      const wrapper = await mountModal();

      expect(findError(wrapper).exists()).toBe(false);
    });
  });

  describe("Confirm button state", () => {
    it("enables Confirm when the name is changed", async () => {
      const wrapper = await mountModal();

      await getInput(wrapper).setValue("holiday");

      expect(getConfirm(wrapper).element.disabled).toBe(false);
    });

    it.each([
      { label: "empty", value: "" },
      { label: "whitespace-only", value: "   " },
    ])("disables Confirm when the name is $label", async ({ value }) => {
      const wrapper = await mountModal();

      await getInput(wrapper).setValue(value);

      expect(getConfirm(wrapper).element.disabled).toBe(true);
    });

    it("disables Confirm when only whitespace is added around the same name", async () => {
      const wrapper = await mountModal();

      await getInput(wrapper).setValue("  photo  ");

      expect(getConfirm(wrapper).element.disabled).toBe(true);
    });
  });

  describe("renaming", () => {
    it("calls rename with the old name and the new name plus extension", async () => {
      const wrapper = await mountModal();

      await getInput(wrapper).setValue("holiday");
      await getConfirm(wrapper).trigger("click");
      await flushPromises();

      expect(renameMock).toHaveBeenCalledTimes(1);
      expect(renameMock).toHaveBeenCalledWith("photo.png", "holiday.png");
    });

    it("trims the new name before renaming", async () => {
      const wrapper = await mountModal();

      await getInput(wrapper).setValue("  holiday  ");
      await getConfirm(wrapper).trigger("click");
      await flushPromises();

      expect(renameMock).toHaveBeenCalledWith("photo.png", "holiday.png");
    });

    it("emits fileNameUpdated and closeRenameFileModal on success", async () => {
      const wrapper = await mountModal();

      await getInput(wrapper).setValue("holiday");
      await getConfirm(wrapper).trigger("click");
      await flushPromises();

      expect(wrapper.emitted("fileNameUpdated")).toHaveLength(1);
      expect(wrapper.emitted("closeRenameFileModal")).toHaveLength(1);
    });

    it("shows a loader and disables both buttons while renaming", async () => {
      let resolveRename!: () => void;
      renameMock.mockReturnValue(
        new Promise<void>((resolve) => {
          resolveRename = resolve;
        })
      );
      const wrapper = await mountModal();

      await getInput(wrapper).setValue("holiday");
      await getConfirm(wrapper).trigger("click");

      expect(wrapper.find('[data-testid="button-loader"]').exists()).toBe(true);
      expect(getConfirm(wrapper).element.disabled).toBe(true);
      expect(getCancel(wrapper).element.disabled).toBe(true);

      resolveRename();
      await flushPromises();

      expect(wrapper.find('[data-testid="button-loader"]').exists()).toBe(
        false
      );
      expect(getCancel(wrapper).element.disabled).toBe(false);
    });
  });

  describe("errors", () => {
    it("shows the error message and does not emit when rename fails", async () => {
      renameMock.mockRejectedValue(new Error("The resource already exists"));
      const wrapper = await mountModal();

      await getInput(wrapper).setValue("holiday");
      await getConfirm(wrapper).trigger("click");
      await flushPromises();

      expect(findError(wrapper).text()).toBe("The resource already exists");
      expect(wrapper.emitted("fileNameUpdated")).toBeUndefined();
      expect(wrapper.emitted("closeRenameFileModal")).toBeUndefined();
    });

    it("re-enables the buttons after a failed rename", async () => {
      renameMock.mockRejectedValue(new Error("Something went wrong"));
      const wrapper = await mountModal();

      await getInput(wrapper).setValue("holiday");
      await getConfirm(wrapper).trigger("click");
      await flushPromises();

      expect(getConfirm(wrapper).element.disabled).toBe(false);
      expect(getCancel(wrapper).element.disabled).toBe(false);
    });

    it("shows a fallback message when a non-Error value is thrown", async () => {
      renameMock.mockRejectedValue("boom");
      const wrapper = await mountModal();

      await getInput(wrapper).setValue("holiday");
      await getConfirm(wrapper).trigger("click");
      await flushPromises();

      expect(findError(wrapper).text()).toBe("Unknown error occurred.");
    });

    it("clears the error when the user edits the name", async () => {
      renameMock.mockRejectedValue(new Error("The resource already exists"));
      const wrapper = await mountModal();

      await getInput(wrapper).setValue("holiday");
      await getConfirm(wrapper).trigger("click");
      await flushPromises();
      expect(findError(wrapper).exists()).toBe(true);

      await getInput(wrapper).setValue("holiday2");

      expect(findError(wrapper).exists()).toBe(false);
    });
  });

  describe("closing", () => {
    it("emits closeRenameFileModal without renaming when Cancel is clicked", async () => {
      const wrapper = await mountModal();

      await getCancel(wrapper).trigger("click");

      expect(wrapper.emitted("closeRenameFileModal")).toHaveLength(1);
      expect(renameMock).not.toHaveBeenCalled();
    });

    it("emits closeRenameFileModal when the modal asks to close", async () => {
      const wrapper = await mountModal();

      await wrapper.get('[data-testid="modal-close-button"]').trigger("click");

      expect(wrapper.emitted("closeRenameFileModal")).toHaveLength(1);
    });
  });

  describe("reopening", () => {
    it("resets the edited name when the modal is reopened", async () => {
      const wrapper = await mountModal();

      await getInput(wrapper).setValue("edited");
      await wrapper.setProps({ isOpen: false });
      await wrapper.setProps({ isOpen: true });

      expect(getInput(wrapper).element.value).toBe("photo");
    });

    it("clears a previous error when the modal is reopened", async () => {
      renameMock.mockRejectedValue(new Error("The resource already exists"));
      const wrapper = await mountModal();

      await getInput(wrapper).setValue("holiday");
      await getConfirm(wrapper).trigger("click");
      await flushPromises();
      expect(findError(wrapper).exists()).toBe(true);

      await wrapper.setProps({ isOpen: false });
      await wrapper.setProps({ isOpen: true });

      expect(findError(wrapper).exists()).toBe(false);
    });

    it("uses the new file name and extension when it changed while closed", async () => {
      const wrapper = await mountModal();

      await wrapper.setProps({ isOpen: false });
      await wrapper.setProps({ fileName: "report.pdf" });
      await wrapper.setProps({ isOpen: true });

      expect(getInput(wrapper).element.value).toBe("report");
      expect(wrapper.get('[data-testid="rename-extension"]').text()).toBe(
        ".pdf"
      );
    });
  });
});
