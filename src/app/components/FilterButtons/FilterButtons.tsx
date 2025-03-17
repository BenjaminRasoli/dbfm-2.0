import { FilterButtonsTypes, FilterButtonTypes } from "@/app/Types/FilterbuttonsTypes";
import clsx from "clsx";
import { usePathname } from "next/navigation";

const FilterButton = ({
  label,
  filterValue,
  activeFilter,
  handleFilterChange,
}: FilterButtonTypes) => (
  <button
    className={clsx(
      "cursor-pointer relative border-transparent transition-all duration-300 ease-in-out",
      activeFilter === filterValue &&
        "font-semibold after:block after:absolute text-blue after:bottom-0 after:left-0 after:w-full after:h-1 after:bg-blue-500 after:rounded-tl-lg after:rounded-tr-lg",
      "hover:text-blue hover:font-semibold hover:after:block hover:after:absolute hover:after:bottom-0 hover:after:left-0 hover:after:w-full hover:after:h-1 hover:after:bg-blue-500 hover:after:rounded-tl-lg hover:after:rounded-tr-lg"
    )}
    onClick={() => handleFilterChange(filterValue)}
  >
    {label}
  </button>
);

function FilterButtons({
  activeFilter,
  handleFilterChange,
}: FilterButtonsTypes) {
  const pathname = usePathname();

  const filterOptions = [
    {
      label: "All",
      value: pathname === "/search" ? "multi" : "all",
    },
    { label: "Movies", value: "movie" },
    { label: "TV Shows", value: "tv" },
  ];

  return (
    <div className="flex gap-5">
      {filterOptions.map((filter) => (
        <FilterButton
          key={filter.value}
          label={filter.label}
          filterValue={filter.value}
          activeFilter={activeFilter}
          handleFilterChange={handleFilterChange}
        />
      ))}
    </div>
  );
}

export default FilterButtons;
