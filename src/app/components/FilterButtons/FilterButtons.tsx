import { fetchFilter } from "@/app/Page.Functions";
import clsx from "clsx";
import React, { useState } from "react";
import { filterOptions } from "./FilterOptions";

const FilterButton = ({
  label,
  filterValue,
  activeFilter,
  handleFilterChange,
}: {
  label: string;
  filterValue: string;
  activeFilter: string;
  handleFilterChange: (filter: string) => void;
}) => (
  <button
    className={clsx(
      "cursor-pointer relative border-transparent",
      activeFilter === filterValue &&
        "text-blue font-semibold after:block after:absolute after:bottom-0 after:left-0 after:w-full after:h-1 after:bg-blue-500 after:rounded-tl-lg after:rounded-tr-lg"
    )}
    onClick={() => handleFilterChange(filterValue)}
  >
    {label}
  </button>
);

function FilterButtons({
  activeFilter,
  handleFilterChange,
}: {
  activeFilter: string;
  handleFilterChange: (filter: string) => void;
}) {
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
