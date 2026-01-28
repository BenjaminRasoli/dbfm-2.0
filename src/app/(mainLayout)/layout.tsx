import Navbar from "../components/Navbar/Navbar";
import Header from "../components/Header/Header";
import ScrollToTopButton from "../components/ScrollToTopButton/ScrollToTopButton";
import GlobalTopLoader from "../components/GlobalTopLoader/GlobalTopLoader";
import { Metadata } from "next";
import "../globals.css";
import BottomMenu from "../components/BottomMenu/BottomMenu";
import { GenresType } from "../Types/Genres.Types";

export const metadata: Metadata = {
  title: "DBFM | Discover Movies & TV Shows",
  description:
    "DBFM is a movie and TV website where you can check out the latest releases and discover actors.",
  icons: {
    icon: "/black_favicon.png",
  },
  metadataBase: new URL("https://dbfm.vercel.app"),
};

async function getGenres(): Promise<GenresType[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_DBFM_SERVER}/api/getNavbarGenres`,
      { cache: "force-cache", next: { revalidate: 3600 } },
    );
    const data = await res.json();
    return data.genres || [];
  } catch (error) {
    console.error("Error fetching genres:", error);
    return [];
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const genres = await getGenres();

  return (
    <div className="grid lg:grid-cols-[auto_1fr] grid-rows-[auto_1fr]">
      <GlobalTopLoader />
      <Navbar genres={genres} />
      <div className="flex flex-col">
        <Header genres={genres} />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
      <BottomMenu />
      <ScrollToTopButton />
    </div>
  );
}
