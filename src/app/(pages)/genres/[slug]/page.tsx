import MovieCard from "@/app/components/MovieCard/MovieCard";

type Params = Promise<{ slug: string }>;

const page = async ({ params }: { params: Params }) => {
  const { slug } = await params;
  const genreSlug = slug;

  const movieRes = await fetch(
    `${process.env.NEXT_PUBLIC_REACT_LOCAL_SERVER}/api/genreMovies?genre=${genreSlug}`
  );
  const movies = await movieRes.json();

  const genreRes = await fetch(
    `${process.env.NEXT_PUBLIC_REACT_LOCAL_SERVER}/api/genres`
  );
  const genres = await genreRes.json();
  const genre = genres.genres.find(
    (genre: { id: number }) => genre.id === parseInt(genreSlug)
  );

  const genreName = genre ? genre.name : "Unknown Genre";

  return (
    <div className="p-7">
      <h1 className="text-3xl text-blue">{genreName} Movies</h1>
      <MovieCard movies={movies.results} />
    </div>
  );
};

export default page;
