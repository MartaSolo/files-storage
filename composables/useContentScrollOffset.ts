import { getScrollbarWidth } from "@/utils/helpers/getScrollbarWidth";

export const useContentScrollOffset = () => {
  const enableScrollOffset = () => {
    const isScrollVisible = !!(window.innerWidth - document.body.offsetWidth);

    if (isScrollVisible) {
      const scrollbarWidth = getScrollbarWidth();

      document.body.style.overflowY = "hidden";
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
  };

  const disableScrollOffset = () => {
    document.body.style.removeProperty("padding-right");
    document.body.style.overflowY = "auto";
  };

  return { enableScrollOffset, disableScrollOffset };
};
