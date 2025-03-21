"use client";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { IoIosSearch } from "react-icons/io";
import { useRouter } from "next/navigation";
import { IoIosLogOut } from "react-icons/io";
import Link from "next/link";
import { useUser } from "@/app/context/UserProvider";
import { handleOutsideClick } from "@/app/utils/HandleOutsideClick";

import ThemeSwitch from "../ThemeSwitch/ThemeSwitch";
import { FaWindowClose } from "react-icons/fa";
import { disableOverflow } from "@/app/utils/HandleDOM";

function Header() {
  const [searchWord, setSearchWord] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState<boolean>(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const router = useRouter();
  const { user, logout } = useUser();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (searchWord.trim() !== "") {
      router.push(`/search?query=${encodeURIComponent(searchWord)}`);
    }
    setSearchWord("");
  };

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      handleOutsideClick(e, modalRef, setIsModalOpen);
      handleOutsideClick(e, modalRef, setIsLogoutModalOpen);
    };

    document.addEventListener("mousedown", handleClick);

    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, []);

  useEffect(() => {
    disableOverflow(isLogoutModalOpen);
    return () => disableOverflow(false);
  }, [isLogoutModalOpen]);

  return (
    <header className="py-6 px-1 border-b-1 border-gray-600 dark:border-gray-800 sticky top-0 z-20 bg-white dark:bg-dark ">
      <div className="flex items-center justify-between">
        <form className="flex items-center gap-5">
          <button type="submit" onClick={handleSearch}>
            <IoIosSearch size={20} />
          </button>
          <input
            type="text"
            className="outline-none w-32 lg:w-96"
            placeholder="Search..."
            value={searchWord}
            maxLength={50}
            onChange={(e) => setSearchWord(e.target.value)}
          />
        </form>

        <div className="flex items-center gap-3 relative">
          {user ? (
            <>
              <h3 className="hidden sm:block">{user.userName}</h3>
              <div
                onClick={() => setIsModalOpen(true)}
                className="flex hover:border-2  hover:border-dark dark:hover:border-white items-center justify-center w-12 h-12 rounded-full bg-blue text-white text-xl cursor-pointer"
              >
                {user.photoURL ? (
                  <Image
                    src={user.photoURL}
                    height={700}
                    width={700}
                    alt="avatar"
                    className="rounded-full"
                  />
                ) : (
                  <span>{user.userName[0].toUpperCase()}</span>
                )}
              </div>

              {isModalOpen && (
                <div
                  ref={modalRef}
                  className="absolute top-[60px] right-0 w-48 bg-white dark:bg-dark shadow-md p-4 rounded-lg"
                >
                  <h3 className="pb-4">{user.userName}</h3>

                  <button
                    onClick={() => {
                      setIsLogoutModalOpen(true);
                      setIsModalOpen(false);
                    }}
                    className="bg-red hover:bg-red-hover  rounded-lg w-full p-2 flex items-center gap-2 text-sm cursor-pointer"
                  >
                    Logout <IoIosLogOut />
                  </button>

                  <button
                    className="mt-3 text-blue text-sm cursor-pointer hover:underline"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Close
                  </button>
                </div>
              )}
            </>
          ) : (
            <Link href="/login" className="hover:text-blue">
              Login
            </Link>
          )}
          <ThemeSwitch />
        </div>
      </div>
      {isLogoutModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center z-[55]">
          <div
            className="absolute inset-0 bg-black"
            style={{ opacity: 0.5 }}
          ></div>

          <div
            ref={modalRef}
            className="bg-white dark:bg-dark w-[320px] h-[200px] flex flex-col rounded-lg shadow-lg p-6 relative z-[55]"
          >
            <button
              onClick={() => setIsLogoutModalOpen(false)}
              className="absolute top-2 right-2 cursor-pointer  hover:text-red-hover"
            >
              <FaWindowClose size={24} />
            </button>

            <p className="text-lg font-semibold text-center my-auto">
              Are you sure you want to log out?
            </p>

            <div className="flex justify-between px-5 gap-2">
              <button
                onClick={() => {
                  logout();
                  setIsLogoutModalOpen(false);
                }}
                className="cursor-pointer bg-red hover:bg-red-hover rounded-lg p-2 text-white"
              >
                Yes, Logout
              </button>
              <button
                onClick={() => setIsLogoutModalOpen(false)}
                className="cursor-pointer bg-gray-300 hover:bg-gray-400 rounded-lg p-2 text-black"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
