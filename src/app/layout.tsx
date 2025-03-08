import type { Metadata } from "next";
import { Roboto, Cinzel } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar/Navbar";
import Header from "./components/Header/Header";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DBFM",
  description:
    "DBFM is a movies website where you can check out the latest movies and TV shows.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${roboto.variable} ${cinzel.variable} antialiased`}>
        <div className="grid grid-cols-[auto_1fr] grid-rows-[auto_1fr] h-screen">
          <Navbar />

          <div className="flex flex-col">
            <Header />
            <main className="flex-1 overflow-y-auto">{children}</main>
          </div>
        </div>

        {/* <Footer /> */}
      </body>
    </html>
  );
}
