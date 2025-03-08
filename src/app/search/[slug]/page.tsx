import MovieCard from "@/app/components/MovieCard/MovieCard";

const page = async ({ params }: { params: { slug: string } }) => {
  const searchWord = params.slug;
  const movieRes = await fetch(
    `http://localhost:3000/api/searched?searchWord=${searchWord}`
  );
  const movies = await movieRes.json();

  //const genreName = genre ? genre.name : "Unknown Genre";

  return (
    <div className="p-7">
      <h1>Searched movies</h1>
      <MovieCard movies={movies.results} />
    </div>
  );
};

export default page;
