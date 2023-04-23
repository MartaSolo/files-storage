import { Ref } from "vue";

export const useClickOutside = (
  elTargetRef: Ref<HTMLElement | null>,
  callbackFn: Function
) => {
  if (!elTargetRef) return;

  const listener = (e: MouseEvent) => {
    if (
      e.target === elTargetRef.value ||
      (elTargetRef.value && e.composedPath().includes(elTargetRef.value))
    ) {
      return;
    }
    if (typeof callbackFn === "function") {
      callbackFn();
    }
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
