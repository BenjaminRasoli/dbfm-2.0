export const dynamic = "force-dynamic";

import MediaList from "@/app/components/MediaList/MediaList";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Your Watched | DBFM",
    description: "Browse all your watched movies and TV shows on DBFM.",
    openGraph: {
      title: "Your Watched | DBFM",
      description: "Browse all your watched movies and TV shows on DBFM.",
      type: "website",
    },
    twitter: {
      card: "summary",
      title: "Your Watched | DBFM",
      description: "Browse all your watched movies and TV shows on DBFM.",
    },
  };
}

export default async function Page() {
  return <MediaList type="watched" />;
}
