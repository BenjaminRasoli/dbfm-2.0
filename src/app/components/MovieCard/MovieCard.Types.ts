import { MoviesTypes } from "@/app/Types/MoviesTypes";

export interface MovieCardTypes {
  movies: MoviesTypes[];
  loading: boolean | null;
}
