import { MovieTypes } from "@/app/Types/MovieTypes";

export interface CustomDropdownProps {
  options: string[];
  selectedOption: string;
  onSelect: (option: string) => void;
  sortOption: string;
}

export interface SortMoviesTypes {
  sortType: string;
  movies: MovieTypes[];
}
