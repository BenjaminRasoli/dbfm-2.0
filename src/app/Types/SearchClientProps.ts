import { MediaTypes } from "./MediaTypes";

export interface SearchClientProps {
  initialMedia: MediaTypes[];
  initialTotalResults: number;
  initialTotalPages: number;
  initialSearchWord: string;
  initialActiveFilter: string;
  initialPage: number;
}
