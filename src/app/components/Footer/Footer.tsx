"use client";
import { useUser } from "@/app/context/UserProvider";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaGithub, FaLinkedin } from "react-icons/fa";

function Footer() {
  const { user } = useUser();
  const pathname = usePathname();

  return (
    <div className="bg-white dark:bg-dark text-center gap-5 flex flex-col justify-center items-center w-full py-10 border-t-1 border-gray-600 dark:border-gray-800">
      <ul className="flex justify-center gap-5 text-lg">
        <li>
          <Link
            className={pathname === "/" ? "text-blue" : "hover:text-blue"}
            href={"/"}
          >
            Home
          </Link>
        </li>
        <li>
          <Link
            className={
              pathname === "/favorites" ? "text-blue" : "hover:text-blue"
            }
            href={"/favorites"}
          >
            Favorites
          </Link>
        </li>
        {!user && (
          <>
            <li>
              <Link
                className={
                  pathname === "/login" ? "text-blue" : "hover:text-blue"
                }
                href={"/login"}
              >
                Login
              </Link>
            </li>
            <li>
              <Link
                className={
                  pathname === "/register" ? "text-blue" : "hover:text-blue"
                }
                href={"/register"}
              >
                Register
              </Link>
            </li>
          </>
        )}
      </ul>
      <ul className="flex justify-center gap-5">
        <li className="hover:text-blue cursor-pointer">
          <Link target="_blank" href={"https://github.com/BenjaminRasoli"}>
            <FaGithub size={30} />
          </Link>
        </li>
        <li className="hover:text-blue cursor-pointer">
          <Link
            target="_blank"
            href={"https://www.linkedin.com/in/benjamin-rasoli-2948ab300"}
          >
            <FaLinkedin size={30} />
          </Link>
        </li>
      </ul>
      <p>
        ©{new Date().getFullYear()} DATA BASE FOR MOVIES | All Rights Reserved
      </p>
    </div>
  );
}

export default Footer;
