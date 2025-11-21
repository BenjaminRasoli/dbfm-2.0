import Navbar from "../components/Navbar/Navbar";
import Header from "../components/Header/Header";
import ScrollToTopButton from "../components/ScrollToTopButton/ScrollToTopButton";
import GlobalTopLoader from "../components/GlobalTopLoader/GlobalTopLoader";
import { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "DBFM - Discover Movies & TV Shows",
  description:
    "DBFM is a movie and TV website where you can check out the latest releases and discover actors.",
  icons: {
    icon: "/black_favicon.png",
  },
  metadataBase: new URL("https://dbfm.vercel.app"),
  openGraph: {
    title: "DBFM - Discover Movies & TV Shows",
    description: "Check out the latest movies, TV shows, and actors on DBFM.",
    url: "https://dbfm.vercel.app",
    siteName: "DBFM",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid lg:grid-cols-[auto_1fr] grid-rows-[auto_1fr]">
      <GlobalTopLoader />
      <Navbar />
      <div className="flex flex-col">
        <Header />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
      <ScrollToTopButton />
    </div>
  );
}
