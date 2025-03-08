import MovieCard from "@/app/components/MovieCard/MovieCard";

type Params = Promise<{ slug: string }>;

const page = async ({ params }: { params: Params }) => {
  const { slug } = await params;
  const searchWord = slug;

  const movieRes = await fetch(
    `https://dbfm-2-0.vercel.app/api/searched?searchWord=${searchWord}`
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
