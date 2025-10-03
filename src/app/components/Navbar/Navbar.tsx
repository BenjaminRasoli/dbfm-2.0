"use client";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { GenresType } from "../../Types/Genres.Types";
import DBFMLogoBlack from "../../images/DATABASEFORMOVIES-logos_black.png";
import DBFMLogoBlue from "../../images/DATABASEFORMOVIES-logos_blue.png";
import DBFMLogoWhite from "../../images/DATABASEFORMOVIES-logos_white.png";
import Link from "next/link";
import Image from "next/image";

function Navbar() {
  const [genres, setGenres] = useState<GenresType[]>([]);
  const [hovered, setHovered] = useState<boolean>(false);
  const { resolvedTheme } = useTheme();

  const pathname = usePathname();

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
    setHovered(false);
  }, [pathname]);

  return (
    <aside className="relative">
      <div className="hidden lg:block p-4 min-w-[250px] border-r border-gray-600 dark:border-gray-800 sticky top-0 overflow-y-auto h-screen scrollbar-thin scrollbar-thumb-rounded  ">
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
