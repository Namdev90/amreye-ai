/** Resolve a one-based URL slide value to a valid zero-based index. */
export function resolvePitchSlideIndex(value, slideCount) {
  const slide = Number(value);
  return Number.isInteger(slide) && slide >= 1 && slide <= slideCount ? slide - 1 : 0;
}
