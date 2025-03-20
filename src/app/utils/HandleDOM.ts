export const disableOverflow = (shouldDisable: boolean) => {
  document.body.style.overflow = shouldDisable ? "hidden" : "auto";
};
