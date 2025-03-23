"use client";
import { LoginModalTypes } from "@/app/Types/LoginModalTypes";
import { disableOverflow } from "@/app/utils/HandleDOM";
import { handleOutsideClick } from "@/app/utils/HandleOutsideClick";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { FaWindowClose } from "react-icons/fa";

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
  }, []);

  return (
    <>
      {isModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center z-[55]">
          <div
            className="absolute inset-0 bg-black"
            style={{ opacity: 0.5 }}
          ></div>

          <div
            ref={modalRef}
            className="bg-white dark:bg-dark w-[300px] h-[200px] flex flex-col rounded-lg shadow-lg p-6 relative z-[55]"
          >
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-2 right-2 cursor-pointer hover:text-red-hover"
            >
              <FaWindowClose size={24} />
            </button>

            <p className="text-lg font-semibold text-center my-auto">
              Please Register or Login to add media to your favorite list
            </p>
            <div className="flex justify-between px-10 ">
              <Link
                className="bg-blue hover:bg-blue-hover rounded-lg p-2 text-white"
                href={"/login"}
              >
                Login
              </Link>
              <Link
                className="bg-blue hover:bg-blue-hover rounded-lg p-2 text-white"
                href={"/register"}
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default LoginModal;
