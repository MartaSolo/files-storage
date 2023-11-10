export const getScrollbarWidth = () => {
  // Create container with visible scrollbar
  const outer = document.createElement("div");
  outer.style.visibility = "hidden";
  outer.style.overflow = "scroll";

  document.body.appendChild(outer);

  // Fill it with empty child
  const inner = document.createElement("div");
  outer.appendChild(inner);

  // Measure width difference
  const width = outer.offsetWidth - inner.offsetWidth;

  outer.parentNode?.removeChild(outer);

  return width;
};
