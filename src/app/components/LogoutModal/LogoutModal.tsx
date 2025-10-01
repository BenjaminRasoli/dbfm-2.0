"use client";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { FaWindowClose } from "react-icons/fa";
import { disableOverflow } from "@/app/utils/HandleDOM";
import { handleOutsideClick } from "@/app/utils/HandleOutsideClick";
import { LogoutModalProps } from "@/app/Types/LogoutModalTypes";

export default function LogoutModal({
  isOpen,
  onCancel,
  onConfirm,
}: LogoutModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      disableOverflow(true);
    }
    return () => disableOverflow(false);
  }, [isOpen]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      handleOutsideClick(e, modalRef, onCancel);
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [onCancel]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 flex justify-center items-center z-[9999]">
      <div className="absolute inset-0 bg-black opacity-50 z-[9998]"></div>

      <div
        ref={modalRef}
        className="bg-white dark:bg-dark w-[320px] h-[200px] flex flex-col rounded-lg shadow-lg p-6 relative z-[9999]"
      >
        <button
          onClick={onCancel}
          className="absolute top-2 right-2 cursor-pointer hover:text-red-hover"
        >
          <FaWindowClose size={24} />
        </button>

        <p className="text-lg font-semibold text-center my-auto">
          Are you sure you want to log out?
        </p>

        <div className="flex justify-between px-5 gap-2">
          <button
            onClick={onConfirm}
            className="cursor-pointer bg-red hover:bg-red-hover rounded-lg p-2 text-white"
          >
            Yes, Logout
          </button>
          <button
            onClick={onCancel}
            className="cursor-pointer bg-gray-300 hover:bg-gray-400 rounded-lg p-2 text-black"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>,
    document.getElementById("modal-root")!
  );
}
