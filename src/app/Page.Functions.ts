import { MovieTypes } from "./Types/MovieTypes";

export const fetchFilter = async (
  filter: string,
  setMovies: React.Dispatch<React.SetStateAction<MovieTypes[]>>,
  setActiveFilter: React.Dispatch<React.SetStateAction<string>>
) => {
  switch (filter) {
    case "all":
      const res = await fetch(
        "https://dbfm-2-0.vercel.app/api/movies?type=all"
      );
      const data = await res.json();
      setMovies(data.results);
      setActiveFilter("all");
      break;
    case "movies":
      const resMovies = await fetch(
        "https://dbfm-2-0.vercel.app/api/movies?type=movie"
      );
      const dataMovies = await resMovies.json();
      setMovies(dataMovies.results);
      setActiveFilter("movies");

      break;
    case "tv":
      const resSeries = await fetch(
        "https://dbfm-2-0.vercel.app/api/movies?type=tv"
      );
      const dataSeries = await resSeries.json();
      setMovies(dataSeries.results);
      setActiveFilter("tv");

      break;
    default:
      break;
  }
};
