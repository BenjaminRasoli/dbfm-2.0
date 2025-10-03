"use client";
import { useUser } from "@/app/context/UserProvider";
import { GenresType } from "@/app/Types/Genres.Types";
import { disableOverflow } from "@/app/utils/HandleDOM";
import { handleOutsideClick } from "@/app/utils/HandleOutsideClick";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { IoIosLogOut, IoIosSearch } from "react-icons/io";
import clsx from "clsx";
import Hamburger from "hamburger-react";
import Image from "next/image";
import Link from "next/link";
import LogoutModal from "../LogoutModal/LogoutModal";
import ThemeSwitch from "../ThemeSwitch/ThemeSwitch";

function Header() {
  const [searchWord, setSearchWord] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState<boolean>(false);
  const [isHamburgerOpen, setIsHamburgerOpen] = useState<boolean>(false);
  const [genres, setGenres] = useState<GenresType[]>([]);
  const modalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const router = useRouter();
  const { user, logout } = useUser();
  const pathname = usePathname();

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
    const getGenres = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_DBFM_SERVER}/api/getNavbarGenres`
        );
        const data = await res.json();
        setGenres(data.genres);
      } catch (error) {
        console.error(error);
      }
    };

    getGenres();
  }, []);

  useEffect(() => {
    window.scroll(0, 0);
    setIsHamburgerOpen(false);
  }, [pathname]);

  useEffect(() => {
    disableOverflow(isHamburgerOpen);
    return () => disableOverflow(false);
  }, [isHamburgerOpen]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      handleOutsideClick(e, modalRef, setIsModalOpen);
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <>
      <header className="py-5 px-3 lg:px-7 border-b-1 border-gray-600 h-20 dark:border-gray-800 sticky top-0 z-20 bg-white dark:bg-dark">
        {isHamburgerOpen && (
          <div
            className="fixed inset-0 opacity-50 z-40"
            onClick={() => setIsHamburgerOpen(false)}
          ></div>
        )}

        <div
          ref={sidebarRef}
          className={`lg:hidden fixed top-0 left-0 w-[250px] h-full overflow-y-auto bg-white dark:bg-dark bg-opacity-50 border-r-1 border-gray-600 dark:border-gray-800 transform transition-transform duration-300 ease-in-out z-50 ${
            isHamburgerOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="p-4 ">
            <nav className="mt-10 space-y-12 pt-8">
              <Link
                href="/"
                className={`grid  relative border-b-2 group transition-all duration-300 ${
                  pathname === "/"
                    ? "border-blue-500 text-blue-500"
                    : "border-gray-600 dark:border-gray-800"
                }`}
              >
                Home
              </Link>
              <Link
                href="/favorites"
                className={`grid  relative border-b-2 group transition-all duration-300 ${
                  pathname === "/favorites"
                    ? "border-blue-500 text-blue-500"
                    : "border-gray-600 dark:border-gray-800"
                }`}
              >
                Favorites
              </Link>

              {genres?.map((genre: GenresType) => (
                <Link
                  key={genre.id}
                  href={`/genres/${genre.id}`}
                  className={`grid  relative border-b-2 group transition-all duration-300 ${
                    pathname === `/genres/${genre.id}`
                      ? "border-blue-500 text-blue-500"
                      : "border-gray-600 dark:border-gray-800"
                  }`}
                >
                  {genre.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        <div
          className={clsx(
            "h-full absolute top-0 left-0 z-[100] lg:hidden border-r border-gray-600 dark:border-gray-800 flex items-center",
            { "border-none": isHamburgerOpen }
          )}
        >
          <div className="bg-white dark:bg-dark rounded-sm pt-4">
            <Hamburger
              toggled={isHamburgerOpen}
              toggle={setIsHamburgerOpen}
              direction="left"
              size={20}
            />
          </div>
        </div>

        <div className="flex items-center justify-between z-[100000000]">
          <form className="flex items-center gap-2 ml-15 lg:ml-0">
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
    </>
  );
}

export default Header;
