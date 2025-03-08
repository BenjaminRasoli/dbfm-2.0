import MovieCard from "@/app/components/MovieCard/MovieCard";

const page = async ({ params }: { params: { slug: string } }) => {
  const genreSlug = params.slug;

  const movieRes = await fetch(
    `http://localhost:3000/api/genreMovies?genre=${genreSlug}`
  );
  const movies = await movieRes.json();

  const genreRes = await fetch("http://localhost:3000/api/genres");
  const genres = await genreRes.json();
  const genre = genres.genres.find(
    (genre: { id: number }) => genre.id === parseInt(genreSlug)
  );

  const genreName = genre ? genre.name : "Unknown Genre";

  return (
    <div className="p-7">
      <h1>{genreName} Movies</h1>
      <MovieCard movies={movies.results} />
    </div>
  );
};

export default page;
