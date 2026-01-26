import { MediaFiltersTypes } from "@/app/Types/MediaFilterTypes";
import CustomDropdown from "../DropDown/DropDown";
import FilterButtons from "../FilterButtons/FilterButtons";

function MovieFilters({
  activeFilter,
  sortOption,
  handleFilterChange,
  handleSortChange,
}: MediaFiltersTypes) {
  return (
    <section className="border-b-1 border-gray-600 dark:border-gray-800 pt-5 flex justify-between">
      <FilterButtons
        activeFilter={activeFilter}
        handleFilterChange={handleFilterChange}
      />
      <CustomDropdown
        options={
          activeFilter === "person" || activeFilter === "collection"
            ? ["A-Z", "Z-A"]
            : [
                "A-Z",
                "Z-A",
                "Date",
                "Date (Oldest)",
                "Rating",
                "Rating (Lowest)",
              ]
        }
        selectedOption={
          sortOption === "standard"
            ? "Sort by"
            : sortOption === "Date"
            ? "Date"
            : sortOption === "Rating"
            ? "Rating"
            : sortOption === "Z-A"
            ? "Z-A"
            : sortOption === "Date (Oldest)"
            ? "Date (Oldest)"
            : sortOption === "Rating (Lowest)"
            ? "Rating (Lowest)"
            : "A-Z"
        }
        onSelect={handleSortChange}
        sortOption={sortOption}
      />
    </section>
  );
}

export default MovieFilters;
