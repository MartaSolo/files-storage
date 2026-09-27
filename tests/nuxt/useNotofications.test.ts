import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { useNotification } from "#imports";

describe("useNotification", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    // Composable state is a module-level singleton shared across
    // this file's tests, so close it out after each one.
    const { closeNotification } = useNotification();
    closeNotification();
    vi.useRealTimers();
  });

  it("opens the notification with the given text and theme", () => {
    const { notify, isOpen, text, theme } = useNotification();

    notify("success", "Saved successfully");

    expect(isOpen.value).toBe(true);
    expect(text.value).toBe("Saved successfully");
    expect(theme.value).toBe("success");
  });

  it("auto-closes after the default timeout", () => {
    const { notify, isOpen } = useNotification();

    notify("error", "Something went wrong");
    expect(isOpen.value).toBe(true);

    vi.advanceTimersByTime(5000);

    expect(isOpen.value).toBe(false);
  });

  it("closeNotification hides it and clears the pending timeout", () => {
    const { notify, closeNotification, isOpen } = useNotification();

    notify("success", "Saved");
    closeNotification();

    expect(isOpen.value).toBe(false);

    // Advancing time afterward should be a no-op, not re-trigger anything.
    vi.advanceTimersByTime(5000);
    expect(isOpen.value).toBe(false);
  });

  it("calling notify again resets the previous timeout instead of stacking", () => {
    const { notify, isOpen, text } = useNotification();

    notify("success", "First message");
    vi.advanceTimersByTime(3000); // not yet auto-closed

    notify("error", "Second message");
    expect(text.value).toBe("Second message");

    vi.advanceTimersByTime(3000); // 6s since first notify, but timer restarted
    expect(isOpen.value).toBe(true);

    vi.advanceTimersByTime(2000); // 5s since second notify
    expect(isOpen.value).toBe(false);
  });
});
