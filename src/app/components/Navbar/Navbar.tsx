"use client";
import Image from "next/image";
import DBFMLogoBlack from "../../images/DATABASEFORMOVIES-logos_black.png";
import DBFMLogoBlue from "../../images/DATABASEFORMOVIES-logos_blue.png";
import DBFMLogoWhite from "../../images/DATABASEFORMOVIES-logos_white.png";
import Link from "next/link";
import Hamburger from "hamburger-react";
import { GenresType } from "../../Types/Genres.Types";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { disableOverflow } from "@/app/utils/HandleDOM";
import { useTheme } from "next-themes";

function Navbar() {
  const [genres, setGenres] = useState<GenresType[]>([]);
  const [hovered, setHovered] = useState<boolean>(false);
  const [isHamburgerOpen, setIsHamburgerOpen] = useState<boolean>(false);
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);
  const { resolvedTheme } = useTheme();

  const pathname = usePathname();

  useEffect(() => {
    const handleWindowSizeChange = () => {
      setWindowWidth(window.innerWidth);
    };
    setIsHamburgerOpen(false);
    window.addEventListener("resize", handleWindowSizeChange);

    return () => {
      window.removeEventListener("resize", handleWindowSizeChange);
    };
  }, [windowWidth]);

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
    setHovered(false);
  }, [pathname]);

  useEffect(() => {
    disableOverflow(isHamburgerOpen);
    return () => disableOverflow(false);
  }, [isHamburgerOpen]);

  return (
    <aside className="relative border-r-1 border-gray-600 dark:border-gray-800">
      <div className="rounded  bg-white dark:bg-dark lg:hidden mt-[17px] z-[51] sticky top-5">
        <Hamburger
          toggled={isHamburgerOpen}
          toggle={setIsHamburgerOpen}
          direction="left"
          size={20}
        />
      </div>

      {isHamburgerOpen && (
        <div
          className="fixed inset-0 opacity-50 z-40"
          onClick={() => setIsHamburgerOpen(false)}
        ></div>
      )}

      <div
        className={`lg:hidden fixed top-0 left-0 w-[250px] h-full overflow-y-auto bg-white dark:bg-dark bg-opacity-50 border-r-1 border-gray-600 dark:border-gray-800 transform transition-transform duration-300 ease-in-out z-50 ${
          isHamburgerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4 ">
          <nav className="mt-10 space-y-7 pt-3">
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

      <div className="hidden lg:block p-4 min-w-[250px]  sticky top-0 overflow-y-auto h-screen scrollbar-thin scrollbar-thumb-rounded  ">
        <Link href="/">
          {pathname === "/" ? (
            <Image
              src={DBFMLogoBlue}
              width={200}
              height={200}
              alt="DATABASEFORMOVIES-blue-logo"
              priority
            />
          ) : (
            <Image
              src={
                hovered
                  ? DBFMLogoBlue
                  : resolvedTheme === "dark"
                  ? DBFMLogoWhite
                  : DBFMLogoBlack
              }
              width={200}
              height={200}
              alt="DATABASEFORMOVIES-black-logo"
              priority
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
            />
          )}
        </Link>

        <nav className="mt-10 space-y-11">
          <Link
            href="/favorites"
            className={`grid  relative border-b-2 group transition-all duration-300 ${
              pathname === "/favorites"
                ? "border-blue text-blue"
                : "hover:border-blue hover:text-blue border-gray-600 dark:border-gray-800"
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
                  ? "border-blue text-blue"
                  : "hover:border-blue hover:text-blue border-gray-600 dark:border-gray-800"
              }`}
            >
              {genre.name}
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
}

export default Navbar;
