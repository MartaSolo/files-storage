export const usePreventBodyScroll = () => {
  const hideScrollY = (isOpen: boolean) => {
    const bodyElement = document.querySelector("body");

    if (isOpen) {
      bodyElement?.classList.add("no-scroll");
    } else {
      bodyElement?.classList.remove("no-scroll");
    }
  };

  return { hideScrollY };
};
