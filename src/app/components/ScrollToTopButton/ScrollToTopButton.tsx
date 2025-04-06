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
      className={`fixed bottom-6 right-6 z-50 transition-opacity duration-500 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      onClick={scrollToTop}
    >
      <button aria-label="Scroll to top">
        <FaArrowCircleUp
          size={40}
          className="rounded-full bg-black hover:bg-blue transition-all duration-300 ease-in-out"
        />
      </button>
    </div>
  );
}

export default ScrollToTopButton;
