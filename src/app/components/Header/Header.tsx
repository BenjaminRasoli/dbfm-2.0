"use client";
import Image from "next/image";
import { useState } from "react";
import { IoIosSearch } from "react-icons/io";
import { useRouter } from "next/navigation";
import avatar from "../../images/avatar.svg";
import { IoMdSettings, IoIosLogOut } from "react-icons/io";
import Link from "next/link";

function Header() {
  const [searchWord, setSearchWord] = useState<string>("");
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const router = useRouter();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (searchWord.trim() !== "") {
      router.push(`/search?query=${encodeURIComponent(searchWord)}`);
    }
    setSearchWord("");
  };

  const toggleModal = () => {
    setModalOpen(!isModalOpen);
  };

  return (
    <header className="p-4 border-b-1 border-gray-600 text-dark sticky top-0 z-20 bg-white">
      <div className="flex items-center justify-between">
        <form className="flex items-center gap-5">
          <button type="submit" onClick={handleSearch}>
            <IoIosSearch size={20} />
          </button>
          <input
            type="text"
            className="outline-none w-32 lg:w-96 text-dark"
            placeholder="Search anything..."
            value={searchWord}
            maxLength={50}
            onChange={(e) => setSearchWord(e.target.value)}
          />
        </form>

        <div className="flex items-center gap-3 relative">
          <h3>John Doe</h3>
          <Image
            src={avatar}
            height={50}
            width={50}
            alt="avatar"
            onClick={toggleModal}
            className="cursor-pointer"
          />

          {isModalOpen && (
            <div className="absolute top-[60px] right-0 w-48 bg-white border border-gray-600 shadow-md p-4 rounded-lg">
              <p className="bg-blue mb-4 rounded-lg p-2 text-sm">
                <Link className="flex items-center gap-2" href="/settings">
                  Setings <IoMdSettings />
                </Link>
              </p>
              <p className="bg-red rounded-lg p-2 flex items-center gap-2 text-sm">
                Logout <IoIosLogOut />
              </p>

              <button
                className="mt-3 text-blue text-sm cursor-pointer"
                onClick={() => setModalOpen(false)}
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
