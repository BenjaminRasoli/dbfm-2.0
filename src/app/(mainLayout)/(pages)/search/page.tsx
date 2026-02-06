import Search from "./Search";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Search Movies and TV Shows | DBFM",
    description:
      "Search for your favorite movies, TV shows, and actors on DBFM.",
    openGraph: {
      title: "Search Movies and TV Shows | DBFM",
      description:
        "Search for your favorite movies, TV shows, and actors on DBFM.",
      type: "website",
    },
    twitter: {
      card: "summary",
      title: "Search Movies and TV Shows | DBFM",
      description:
        "Search for your favorite movies, TV shows, and actors on DBFM.",
    },
  };
}

export default function Page() {
  return <Search />;
}
