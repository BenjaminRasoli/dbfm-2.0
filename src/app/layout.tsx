// export const dynamic = "force-dynamic";
// export const fetchCache = "force-no-store";
import type { Metadata } from "next";
import { Roboto, Cinzel } from "next/font/google";
import { Suspense } from "react";

import Navbar from "./components/Navbar/Navbar";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import "./globals.css";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DBFM | Home",
  description:
    "DBFM is a movies website where you can check out the latest Movies and TV shows.",
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
            <main className="flex-1 overflow-y-auto">
              <Suspense fallback={null}>{children}</Suspense>
            </main>
          </div>
        </div>

        <Footer />
      </body>
    </html>
  );
}
