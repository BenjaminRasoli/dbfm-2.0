import { RemoveModalProps } from "@/app/Types/RemoveModalTypes";
import { disableOverflow } from "@/app/utils/HandleDOM";
import { handleOutsideClick } from "@/app/utils/HandleOutsideClick";
import { useEffect, useRef } from "react";
import { FaWindowClose } from "react-icons/fa";
import { createPortal } from "react-dom";
import { useEscapeListener } from "@/app/utils/HandleEsc";

function RemoveModal({
  isConfirmModalOpen,
  setIsConfirmModalOpen,
  itemToRemove,
  handleRemoveFavorite,
}: RemoveModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    disableOverflow(isConfirmModalOpen);
    return () => disableOverflow(false);
  }, [isConfirmModalOpen]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      handleOutsideClick(e, modalRef, setIsConfirmModalOpen);
    };

    document.addEventListener("mousedown", handleClick);
    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, [setIsConfirmModalOpen]);
    useEscapeListener(setIsConfirmModalOpen);


  const handleRemoveConfirmation = async () => {
    if (itemToRemove) {
      try {
        handleRemoveFavorite();
        setIsConfirmModalOpen(false);
      } catch (error) {
        console.error("Error removing item:", error);
      }
    }
  };

  const handleCancel = () => {
    setIsConfirmModalOpen(false);
  };

  if (!isConfirmModalOpen || !itemToRemove) return null;

  return createPortal(
    <div className="fixed inset-0 flex justify-center items-center z-[9999]">
      <div className="absolute inset-0 bg-black opacity-50 z-[9998]"></div>

      <div
        ref={modalRef}
        className="bg-white dark:bg-dark max-w-[350px] min-h-[250px] flex flex-col rounded-lg shadow-lg p-6 relative z-[9999]"
      >
        <button
          onClick={() => setIsConfirmModalOpen(false)}
          className="absolute top-2 right-2 cursor-pointer hover:text-red-hover"
        >
          <FaWindowClose size={24} />
        </button>

        <p className="text-lg font-semibold text-center my-auto">
          Are you sure you want to remove &quot;
          <span className="font-bold text-blue break-words">
            {itemToRemove.title || itemToRemove.name || "Unknown name"}
          </span>
          &quot;
        </p>

        <div className="flex justify-between px-5 gap-4 mt-6">
          <button
            onClick={handleRemoveConfirmation}
            className="cursor-pointer bg-red hover:bg-red-hover w-1/2 rounded-lg p-2 text-white"
          >
            Yes, Remove
          </button>
          <button
            onClick={handleCancel}
            className="cursor-pointer bg-gray-300 hover:bg-gray-400 w-1/2 rounded-lg p-2 text-black"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>,
    document.getElementById("modal-root")!
  );
}

export default RemoveModal;
