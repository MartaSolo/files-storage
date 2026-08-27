import type { Ref } from "vue";

export const useClickOutside = (
  elTargetRef: Ref<HTMLElement | null>,
  callbackFn: () => void
) => {
  if (!elTargetRef) return;

  const listener = (e: MouseEvent) => {
    if (
      e.target === elTargetRef.value ||
      (elTargetRef.value && e.composedPath().includes(elTargetRef.value))
    ) {
      return;
    }
    callbackFn();
  };

  onMounted(() => {
    if (!elTargetRef.value) return;
    window.addEventListener("click", listener);
  });
  onBeforeUnmount(() => {
    window.removeEventListener("click", listener);
  });

  return {
    listener,
  };
};
