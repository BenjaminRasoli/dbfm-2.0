import Image from "next/image";
import DBFMLogoBlack from "../../images/DATABASEFORMOVIES-logos_black.png";
import Link from "next/link";
import { GenresType } from "./Genres.Types";

async function Navbar() {
  const getGenres = async () => {
    const res = await fetch(`http://localhost:3000/api/genres`);
    return res.json();
  };

  const genres = await getGenres();
  return (
    <aside className="relative">
      <div className="p-4 min-w-[250px] border-r-1 border-light overflow-y-auto h-screen sticky top-0">
        <Link href="/">
          <Image
            src={DBFMLogoBlack}
            width={200}
            height={100}
            alt="DATABASEFORMOVIES-logo"
          />
        </Link>

        <nav className="mt-10 space-y-11 ">
          <Link
            href="/favorites"
            className="grid text-dark border-b-1 border-light"
          >
            Favorites
          </Link>
          {genres.genres.map((genre: GenresType) => (
            <Link
              key={genre.id}
              href={`/genres/${genre.id}`}
              className="grid text-dark border-b-1 border-light"
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
