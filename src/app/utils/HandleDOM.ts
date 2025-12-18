export const disableOverflow = (shouldDisable: boolean) => {
  const body = document.body;

  if (shouldDisable) {
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;

    body.style.overflow = "hidden";
    body.style.paddingRight = `${scrollbarWidth}px`;
  } else {
    body.style.overflow = "";
    body.style.paddingRight = "";
  }
};
