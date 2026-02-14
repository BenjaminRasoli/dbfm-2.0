import Link from "next/link";
import { FaGithub, FaLinkedin } from "react-icons/fa";

function Footer() {
  return (
    <footer className="bg-white mb-20 md:mb-0 dark:bg-dark text-center flex flex-col justify-center items-center w-full py-10 gap-5 border-t border-gray-600 dark:border-gray-800">
      <p className="text-sm mt-3">
        ©{new Date().getFullYear()} DATA BASE FOR MOVIES | All Rights Reserved
      </p>
      <ul className="flex justify-center gap-5">
        <li className="hover:text-blue cursor-pointer">
          <Link
            target="_blank"
            rel="noopener noreferrer"
            title="Visit my GitHub profile"
            aria-label="Visit my GitHub profile"
            href="https://github.com/BenjaminRasoli"
          >
            <FaGithub size={30} />
          </Link>
        </li>
        <li className="hover:text-blue cursor-pointer">
          <Link
            target="_blank"
            rel="noopener noreferrer"
            title="Visit my LinkedIn profile"
            aria-label="Visit my LinkedIn profile"
            href="https://www.linkedin.com/in/benjamin-rasoli-2948ab300"
          >
            <FaLinkedin size={30} />
          </Link>
        </li>
      </ul>
    </footer>
  );
}

export default Footer;
