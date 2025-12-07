import { Roboto, Cinzel } from "next/font/google";
import { UserProvider } from "./context/UserProvider";
import { ClipLoader } from "react-spinners";
import { Metadata } from "next";
import { Suspense } from "react";
import { Providers } from "./context/ThemeProvider";
import Footer from "./components/Footer/Footer";
import Snowfall from "./components/Snowfall/Snowfall";
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
  description:
    "DBFM is a movies website where you can check out the latest Movies and TV shows.",
  icons: {
    icon: "/black_favicon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${roboto.variable} ${cinzel.variable} antialiased bg-white dark:bg-dark flex flex-col`}
      >
        <Snowfall />
        <div id="modal-root"></div>
        <Providers>
          <UserProvider>
            <Suspense
              fallback={
                <div className="min-h-[100dvh] flex justify-center items-center">
                  <ClipLoader color="#2d99ff" size={60} />
                </div>
              }
            >
              {children}
            </Suspense>
            <Footer />
          </UserProvider>
        </Providers>
      </body>
    </html>
  );
}
