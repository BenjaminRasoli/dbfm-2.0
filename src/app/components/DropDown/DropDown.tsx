import { useState, useEffect, useRef } from "react";
import { FaChevronDown } from "react-icons/fa";
import { CustomDropdownPropsTypes, SortMediaTypes } from "@/app/Types/DropDownTypes";
import { MediaTypes } from "@/app/Types/MediaTypes";

export function sortMedia({ sortType, media }: SortMediaTypes): MediaTypes[] {
  const sortedMovies = [...media].sort((a, b) => {
    switch (sortType) {
      case "A-Z":
        return (a.title || a.name).localeCompare(b.title || b.name);
      case "Date":
        return (
          new Date(b.release_date || b.first_air_date).getTime() -
          new Date(a.release_date || a.first_air_date).getTime()
        );
      case "Rating":
        return b.vote_average - a.vote_average;
      default:
        return 0;
    }
  });
  return sortedMovies;
}

function CustomDropdown({
  options,
  selectedOption,
  onSelect,
}: CustomDropdownPropsTypes) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative inline-block text-left z-10" ref={dropdownRef}>
      <button
        type="button"
        onClick={toggleDropdown}
        className="inline-flex justify-between items-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-600 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 ease-in-out"
      >
        {selectedOption ? selectedOption : "Select filter"}
        <FaChevronDown className="w-5 h-5 ml-2 -mr-1 transition-all duration-200 ease-in-out" />
      </button>

      {isOpen && (
        <div className="absolute right-0 w-full mt-2 origin-top-right bg-white border border-gray-600 rounded-md shadow-lg">
          <div className="py-1">
            {options.map((option, index) => (
              <button
                key={index}
                onClick={() => {
                  onSelect(option);
                  setIsOpen(false);
                }}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left transition-colors duration-200 ease-in-out"
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default CustomDropdown;
