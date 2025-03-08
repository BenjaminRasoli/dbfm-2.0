export const fetchFilter = async (
  filter: string,
  setMovies: React.Dispatch<React.SetStateAction<MovieTypes[]>>,
  setActiveFilter: React.Dispatch<React.SetStateAction<string>>
) => {
  switch (filter) {
    case "all":
      const res = await fetch("http://localhost:3000/api/movies?type=all");
      const data = await res.json();
      setMovies(data.results);
      setActiveFilter("all");
      break;
    case "movies":
      const resMovies = await fetch(
        "http://localhost:3000/api/movies?type=movie"
      );
      const dataMovies = await resMovies.json();
      setMovies(dataMovies.results);
      setActiveFilter("movies");

      break;
    case "tv":
      const resSeries = await fetch("http://localhost:3000/api/movies?type=tv");
      const dataSeries = await resSeries.json();
      setMovies(dataSeries.results);
      setActiveFilter("tv");

      break;
    default:
      break;
  }
};


