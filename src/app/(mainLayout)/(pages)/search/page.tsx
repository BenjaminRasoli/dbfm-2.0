import Search from "./Search";

export async function generateMetadata() {
  return {
    title: "Search Movies and TV Shows | DBFM",
    description:
      "Search for your favorite movies, TV shows, and actors on DBFM.",
  };
}

export default function Page() {
  return <Search />;
}
