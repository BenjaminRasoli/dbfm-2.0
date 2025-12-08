"use client";
import Link from "next/link";
import React from "react";
import { FaHome, FaStar, FaUser } from "react-icons/fa";
import { usePathname } from "next/navigation";
import { useUser } from "@/app/context/UserProvider";

function BottomMenu() {
  const pathname = usePathname();
  const { user } = useUser();

  const isActive = (path: string) => pathname === path;

  return (
    <div className="md:hidden z-10 fixed bottom-[-20px] right-0 w-full bg-white dark:bg-dark pt-4  flex justify-around shadow-lg">
      <Link
        href="/"
        className={`mb-8 flex flex-col items-center px-6 py-2 rounded-lg transition ${
          isActive("/") ? "text-blue" : "hover:text-blue"
        }`}
      >
        <FaHome size={24} color={isActive("/") ? "#2d99ff" : "currentColor"} />
        <span className="text-sm">Home</span>
      </Link>

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

      {user ? (
        <Link
          href="/profile"
          className={`flex flex-col items-center px-6 py-2 rounded-lg transition ${
            isActive("/profile") ? "text-blue" : "hover:text-blue"
          }`}
        >
          <FaUser
            size={24}
            color={isActive("/profile") ? "#2d99ff" : "currentColor"}
          />
          <span className="text-sm">Profile</span>
        </Link>
      ) : (
        <Link
          href="/login"
          className={`flex flex-col items-center px-6 py-2 rounded-lg transition ${
            isActive("/Login") ? "text-blue" : "hover:text-blue"
          }`}
        >
          <FaUser
            size={24}
            color={isActive("/Login") ? "#2d99ff" : "currentColor"}
          />
          <span className="text-sm">Login</span>
        </Link>
      )}
    </div>
  );
}

export default BottomMenu;
