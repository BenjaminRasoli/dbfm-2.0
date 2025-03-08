import { create } from "zustand";
import { MovieTypes } from "../Types/MovieTypes";

export const useMovieStore = create((set) => ({
  movies: [],
  setMovies: (newMovies: MovieTypes) => set(() => ({ movies: newMovies })),
}));
