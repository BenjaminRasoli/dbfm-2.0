import { MoviesTypes } from "@/app/Types/MoviesTypes";

export interface CustomDropdownProps {
  options: string[];
  selectedOption: string;
  onSelect: (option: string) => void;
  sortOption: string;
}

export interface SortMoviesTypes {
  sortType: string;
  movies: MoviesTypes[];
}
