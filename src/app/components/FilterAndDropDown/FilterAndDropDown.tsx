import CustomDropdown from "../DropDown/DropDown";
import FilterButtons from "../FilterButtons/FilterButtons";
import { MovieFiltersProps } from "./FilterAndDropDown.Types";

function MovieFilters({
  activeFilter,
  sortOption,
  handleFilterChange,
  handleSortChange,
}: MovieFiltersProps) {
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
