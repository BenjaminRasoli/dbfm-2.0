export interface FilterButtonTypes {
  label: string;
  filterValue: string;
  activeFilter: string;
  handleFilterChange: (filter: string) => void;
}

export interface FilterButtonsTypes {
  activeFilter: string;
  handleFilterChange: (filter: string) => void;
}
