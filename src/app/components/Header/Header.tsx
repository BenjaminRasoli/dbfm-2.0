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
import LogoutModal from "../LogoutModal/LogoutModal";

function Header() {
  const [searchWord, setSearchWord] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState<boolean>(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const router = useRouter();
  const { user, logout } = useUser();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (searchWord.trim() !== "") {
      router.push(`/search?query=${encodeURIComponent(searchWord)}`);
    }

    if (inputRef.current) {
      inputRef.current.blur();
    }

    setSearchWord("");
  };

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      handleOutsideClick(e, modalRef, setIsModalOpen);
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <header className="py-6 px-3 border-b-1 border-gray-600 dark:border-gray-800 sticky top-0 z-20 bg-white dark:bg-dark">
      <div className="flex items-center justify-between">
        <form className="flex items-center gap-2">
          <button type="submit" onClick={handleSearch}>
            <IoIosSearch size={20} />
          </button>
          <input
            type="text"
            className="outline-none w-32 lg:w-96"
            placeholder="Search..."
            value={searchWord}
            ref={inputRef}
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
                className="flex hover:border-2 hover:border-dark dark:hover:border-white items-center justify-center w-12 h-12 rounded-full bg-blue text-white text-xl cursor-pointer"
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
                    className="bg-red hover:bg-red-hover rounded-lg w-full p-2 flex items-center gap-2 text-sm cursor-pointer"
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

      <LogoutModal
        isOpen={isLogoutModalOpen}
        onCancel={() => setIsLogoutModalOpen(false)}
        onConfirm={() => {
          logout();
          setIsLogoutModalOpen(false);
        }}
      />
    </header>
  );
}

export default Header;
