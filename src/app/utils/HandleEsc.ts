import { useEffect } from "react";

export const handleEsc = (
  e: KeyboardEvent,
  setModalState: React.Dispatch<React.SetStateAction<boolean>>
) => {
  if (e.key === "Escape") {
    setModalState(false);
  }
};

export const useEscapeListener = (
  setModalState: React.Dispatch<React.SetStateAction<boolean>>
) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => handleEsc(e, setModalState);

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [setModalState]);
};
