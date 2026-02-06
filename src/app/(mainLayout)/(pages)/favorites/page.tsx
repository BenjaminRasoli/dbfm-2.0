export const dynamic = "force-dynamic";

import MediaList from "@/app/components/MediaList/MediaList";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Your Favorites | DBFM",
    description: "Browse all your favorite movies and TV shows on DBFM.",
    openGraph: {
      title: "Your Favorites | DBFM",
      description: "Browse all your favorite movies and TV shows on DBFM.",
      type: "website",
    },
    twitter: {
      card: "summary",
      title: "Your Favorites | DBFM",
      description: "Browse all your favorite movies and TV shows on DBFM.",
    },
  };
}

export default async function Page() {
  return <MediaList type="favorites" />;
}
