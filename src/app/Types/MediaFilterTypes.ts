export interface MediaFiltersTypes {
  activeFilter: string;
  sortOption: string;
  handleFilterChange: (filter: string) => void;
  handleSortChange: (sort: string) => void;
}
