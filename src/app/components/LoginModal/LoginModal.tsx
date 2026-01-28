"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { FaWindowClose } from "react-icons/fa";
import { LoginModalTypes } from "@/app/Types/LoginModalTypes";
import { disableOverflow } from "@/app/utils/HandleDOM";
import { handleOutsideClick } from "@/app/utils/HandleOutsideClick";
import { useEscapeListener } from "@/app/utils/HandleEsc";

function LoginModal({ isModalOpen, setIsModalOpen }: LoginModalTypes) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    disableOverflow(isModalOpen);
    return () => disableOverflow(false);
  }, [isModalOpen]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      handleOutsideClick(e, modalRef, setIsModalOpen);
    };

    document.addEventListener("mousedown", handleClick);
    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, [setIsModalOpen]);
  useEscapeListener(setIsModalOpen);

  if (!isModalOpen) return null;

  return createPortal(
    <div className="fixed inset-0 flex justify-center items-center z-[9999]">
      <div className="absolute inset-0 bg-black opacity-50 z-[9998]" />

      <div
        ref={modalRef}
        className="bg-white dark:bg-dark max-w-[350px] h-[200px] flex flex-col rounded-lg shadow-lg p-6 relative z-[9999]"
      >
        <button
          onClick={() => setIsModalOpen(false)}
          className="absolute top-2 right-2 cursor-pointer hover:text-red-hover"
        >
          <FaWindowClose size={24} />
        </button>

        <p className="text-lg font-semibold text-center my-auto">
          Please Register or Login to save media
        </p>

        <div className="flex justify-between px-10 mt-6 gap-4">
          <Link
            className="bg-blue hover:bg-blue-hover w-1/2 text-center rounded-lg p-2 text-white"
            href="/login"
          >
            Login
          </Link>
          <Link
            className="bg-blue hover:bg-blue-hover w-1/2 text-center rounded-lg p-2 text-white"
            href="/register"
          >
            Register
          </Link>
        </div>
      </div>
    </div>,
    document.getElementById("modal-root")!,
  );
}

export default LoginModal;
