"use client";
import Image from "next/image";
import React, { useState } from "react";
import { IoIosSearch } from "react-icons/io";
import avatar from "../../images/avatar.svg";
import { useRouter } from "next/navigation";

function Header() {
  const [searchWord, setSearchWord] = useState("");
  const [movies, setMovies] = useState<MovieTypes[]>([]);
  const router = useRouter();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (searchWord.trim() !== "") {
      router.push(`/search/${encodeURIComponent(searchWord)}`);
    }
    setSearchWord("");
  };

  return (
    <header className="p-4 border-b-1 border-light text-dark">
      <div className="flex items-center justify-between">
        <form className="flex items-center gap-5">
          <button type="submit" onClick={handleSearch}>
            <IoIosSearch size={20} />
          </button>
          <input
            type="text"
            className="outline-none w-96 text-dark"
            placeholder="Search anything..."
            value={searchWord}
            onChange={(e) => setSearchWord(e.target.value)}
          />
        </form>

        <div className="flex items-center gap-3 ml-auto">
          <h3>John Doe</h3>
          <Image src={avatar} height={50} width={50} alt="avatar" />
        </div>
      </div>
    </header>
  );
}

export default Header;
