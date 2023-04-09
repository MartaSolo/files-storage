export const useClickOutside = (
  elTargetRef: any,
  // elTargetRef: HTMLElement | null,
  callbackFn: Function
) => {
  if (!elTargetRef) return;

  const listener = (e: Event) => {
    if (
      e.target === elTargetRef.value ||
      e.composedPath().includes(elTargetRef.value)
    ) {
      return;
    }
    if (typeof callbackFn === "function") {
      callbackFn();
    }
  };

  onMounted(() => {
    window.addEventListener("click", listener);
  });
  onBeforeUnmount(() => {
    window.removeEventListener("click", listener);
  });

  return {
    listener,
  };
};
