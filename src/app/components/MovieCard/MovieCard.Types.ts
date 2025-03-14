import { MovieTypes } from "@/app/Types/MovieTypes";

export interface MovieCardTypes {
  movies: MovieTypes[];
  loading: boolean | null;
}
