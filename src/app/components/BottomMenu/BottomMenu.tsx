"use client";
import Link from "next/link";
import { FaStar } from "react-icons/fa";
import { usePathname } from "next/navigation";
import { useUser } from "@/app/context/UserProvider";
import { ImCheckmark } from "react-icons/im";
import { FiLogIn, FiUserPlus } from "react-icons/fi";
import { IoIosHome } from "react-icons/io";

function BottomMenu() {
  const pathname = usePathname();
  const { user } = useUser();

  const isActive = (path: string) => pathname === path;

  return (
    <div className="md:hidden z-10 fixed bottom-[-20px] right-0 w-full bg-white dark:bg-dark pt-4 flex justify-around shadow-lg">
      <Link
        href="/"
        className={`mb-8 flex flex-col items-center px-6 py-2 rounded-lg transition ${
          isActive("/") ? "text-blue" : "hover:text-blue"
        }`}
      >
        <IoIosHome size={24} color={isActive("/") ? "#2d99ff" : "currentColor"} />
        <span className="text-sm">Home</span>
      </Link>

      {user ? (
        <>
          <Link
            href="/favorites"
            className={`flex flex-col items-center px-6 py-2 rounded-lg transition ${
              isActive("/favorites") ? "text-blue" : "hover:text-blue"
            }`}
          >
            <FaStar
              size={24}
              color={isActive("/favorites") ? "#2d99ff" : "currentColor"}
            />
            <span className="text-sm">Favorites</span>
          </Link>
          <Link
            href="/watched"
            className={`flex flex-col items-center px-6 py-2 rounded-lg transition ${
              isActive("/watched") ? "text-blue" : "hover:text-blue"
            }`}
          >
            <ImCheckmark
              size={24}
              color={isActive("/watched") ? "#2d99ff" : "currentColor"}
            />
            <span className="text-sm">Watched</span>
          </Link>
        </>
      ) : (
        <>
          <Link
            href="/login"
            className={`flex flex-col items-center px-6 py-2 rounded-lg transition ${
              isActive("/login") ? "text-blue" : "hover:text-blue"
            }`}
          >
            <FiLogIn
              size={24}
              color={isActive("/login") ? "#2d99ff" : "currentColor"}
            />
            <span className="text-sm">Login</span>
          </Link>

          <Link
            href="/register"
            className={`flex flex-col items-center px-6 py-2 rounded-lg transition ${
              isActive("/register") ? "text-blue" : "hover:text-blue"
            }`}
          >
            <FiUserPlus
              size={24}
              color={isActive("/register") ? "#2d99ff" : "currentColor"}
            />
            <span className="text-sm">Register</span>
          </Link>
        </>
      )}
    </div>
  );
}

export default BottomMenu;
