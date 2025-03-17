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
    <section className="border-b-1 border-gray-600 pt-5 flex justify-between">
      <FilterButtons
        activeFilter={activeFilter}
        handleFilterChange={handleFilterChange}
      />
      <CustomDropdown
        options={["A-Z", "Date", "Rating"]}
        selectedOption={
          sortOption === "standard"
            ? "Sort by"
            : sortOption === "Date"
            ? "Date"
            : sortOption === "Rating"
            ? "Rating"
            : "A-Z"
        }
        onSelect={handleSortChange}
        sortOption={sortOption}
      />
    </section>
  );
}

export default MovieFilters;
