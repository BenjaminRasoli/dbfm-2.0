"use client"; // Make sure this component is client-side

import Image from "next/image";
import DBFMLogoBlack from "../../images/DATABASEFORMOVIES-logos_black.png";
import DBFMLogoBlue from "../../images/DATABASEFORMOVIES-logos_blue.png";
import Link from "next/link";
import { GenresType } from "./Genres.Types";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

function Navbar() {
  const [genres, setGenres] = useState<GenresType[]>([]);
  const pathname = usePathname();

  useEffect(() => {
    const getGenres = async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_REACT_LOCAL_SERVER}/api/genres`
      );
      const data = await res.json();
      setGenres(data.genres);
    };

    getGenres();
  }, []);

  return (
    <aside className="relative">
      <div className="p-4 min-w-[250px] border-r-1 border-gray-600 sticky top-0 overflow-y-auto h-screen scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-dark-200 scrollbar-track-gray-600">
        <Link href="/">
          {pathname === "/" ? (
            <Image
              src={DBFMLogoBlue}
              width={200}
              height={100}
              alt="DATABASEFORMOVIES-blue-logo"
            />
          ) : (
            <Image
              src={DBFMLogoBlack}
              width={200}
              height={100}
              alt="DATABASEFORMOVIES-black-logo"
            />
          )}
        </Link>

        <nav className="mt-10 space-y-11">
          <Link
            href="/favorites"
            className={`grid text-dark relative border-b-2 border-gray-600 group transition-all duration-300 ${
              pathname === "/favorites"
                ? "border-blue text-blue"
                : "hover:border-blue hover:text-blue"
            }`}
          >
            Favorites
          </Link>

          {genres.map((genre: GenresType) => (
            <Link
              key={genre.id}
              href={`/genres/${genre.id}`}
              className={`grid text-dark relative border-b-2 border-gray-600 group transition-all duration-300 ${
                pathname === `/genres/${genre.id}`
                  ? "border-blue text-blue"
                  : "hover:border-blue hover:text-blue"
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
