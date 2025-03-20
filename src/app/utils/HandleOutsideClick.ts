export const handleOutsideClick = (
  e: MouseEvent,
  modalRef: React.RefObject<HTMLDivElement | null>,
  setModalState: React.Dispatch<React.SetStateAction<boolean>>
) => {
  if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
    setModalState(false);
  }
};
