"use client";
import { useState, useEffect } from "react";
import { FaArrowCircleUp } from "react-icons/fa";

function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div
      className={`hidden md:block fixed bottom-2 right-2 z-50 transition-opacity duration-500  ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      onClick={scrollToTop}
    >
      <button aria-label="Scroll to top">
        <FaArrowCircleUp
          size={40}
          className="text-white dark:text-black cursor-pointer rounded-full bg-black dark:bg-white hover:bg-blue transition-all duration-300 ease-in-out"
        />
      </button>
    </div>
  );
}

export default ScrollToTopButton;
