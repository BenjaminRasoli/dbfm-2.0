import {
  CustomDropdownPropsTypes,
  SortMediaTypes,
} from "@/app/Types/DropDownTypes";
import { MediaTypes } from "@/app/Types/MediaTypes";

export function sortMedia({ sortType, media }: SortMediaTypes): MediaTypes[] {
  const sortedMovies = [...media].sort((a, b) => {
    switch (sortType) {
      case "A-Z":
        return (a.title || a.name).localeCompare(b.title || b.name);
      case "Z-A":
        return (b.title || b.name).localeCompare(a.title || a.name);
      case "Date":
        return (
          new Date(b.release_date || b.first_air_date).getTime() -
          new Date(a.release_date || a.first_air_date).getTime()
        );
      case "Date (Oldest)":
        return (
          new Date(a.release_date || a.first_air_date).getTime() -
          new Date(b.release_date || b.first_air_date).getTime()
        );
      case "Rating":
        return b.vote_average - a.vote_average;
      case "Rating (Lowest)":
        return a.vote_average - b.vote_average;
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
  return (
    <div className="relative inline-block text-left z-10 mb-2">
      <select
        value={selectedOption}
        onChange={(e) => onSelect(e.target.value)}
        className="cursor-pointer w-full px-4 py-2 text-sm font-medium bg-white dark:bg-dark border border-gray-600 dark:border-gray-800 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-offset-1 transition-all duration-200 ease-in-out"
      >
        <option value="" disabled>
          Select filter
        </option>
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

export default CustomDropdown;
