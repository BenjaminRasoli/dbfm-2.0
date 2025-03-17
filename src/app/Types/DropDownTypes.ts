import { MediaTypes } from "./MediaTypes";

export interface CustomDropdownPropsTypes {
  options: string[];
  selectedOption: string;
  onSelect: (option: string) => void;
  sortOption: string;
}

export interface SortMediaTypes {
  sortType: string;
  media: MediaTypes[];
}
