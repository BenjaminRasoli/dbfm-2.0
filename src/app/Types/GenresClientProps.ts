import { MediaTypes } from "./MediaTypes";

export interface GenresClientProps {
  initialMedia: MediaTypes[];
  initialTotalPages: number;
  initialGenreName: string;
  initialGenreSlug: string;
  initialPage: number;
}
