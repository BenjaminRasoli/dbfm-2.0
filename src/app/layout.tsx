import { Roboto, Cinzel } from "next/font/google";
import { UserProvider } from "./context/UserProvider";
import { Metadata } from "next";
import { Providers } from "./context/ThemeProvider";
import Footer from "./components/Footer/Footer";
import Snowfall from "./components/Snowfall/Snowfall";
import "./globals.css";
import { Suspense } from "react";
import Loading from "./components/Loading/Loading";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  display: "swap",
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://dbfm.vercel.app"),
  title: {
    default: "DBFM | Movies & TV Shows",
    template: "%s | DBFM",
  },
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
        <Providers>
          <UserProvider>
            <Suspense
              fallback={
                <div className="flex justify-center items-center min-h-screen">
                  <Loading size={100} />
                </div>
              }
            >
              <Snowfall />
              <div id="modal-root"></div>

              {children}
            </Suspense>
            <Footer />
          </UserProvider>
        </Providers>
      </body>
    </html>
  );
}
