"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { FaWindowClose } from "react-icons/fa";
import { LoginModalTypes } from "@/app/Types/LoginModalTypes";
import { disableOverflow } from "@/app/utils/HandleDOM";
import { handleOutsideClick } from "@/app/utils/HandleOutsideClick";
import { useEscapeListener } from "@/app/utils/HandleEsc";

function JsonModal({ isModalOpen, setIsModalOpen }: LoginModalTypes) {
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
        className="bg-white dark:bg-dark w-[550px] h-[450px] flex flex-col rounded-lg shadow-lg p-6 m-4 relative z-[9999]"
      >
        <button
          onClick={() => setIsModalOpen(false)}
          className="absolute top-2 right-2 cursor-pointer hover:text-red-hover"
        >
          <FaWindowClose size={24} />
        </button>

        <h2 className="text-xl font-bold text-center mb-4">
          How to Import Media
        </h2>

        <p className="text-center mb-4">
          You can import your media using a JSON file. Each entry should include
          the TMDB (The Movie DB) ID and the type (tv or movie):
        </p>

        <pre className="bg-gray-100 dark:bg-gray-700 p-2 rounded overflow-x-auto text-sm mb-4">
          {`[
  {
    "id": 60743,
    "type": "tv"
  },
  {
    "id": 62125,
    "type": "movie"
  },
]`}
        </pre>

        <p className="text-center text-sm text-gray-400 mb-4">
          Make sure your JSON file follows this format for each media item.
        </p>
      </div>
    </div>,

    document.getElementById("modal-root")!
  );
}

export default JsonModal;
