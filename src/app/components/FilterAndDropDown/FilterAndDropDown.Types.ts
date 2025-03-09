export interface MovieFiltersProps {
  activeFilter: string;
  sortOption: string;
  handleFilterChange: (filter: string) => void;
  handleSortChange: (sort: string) => void;
}
