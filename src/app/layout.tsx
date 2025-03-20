import { Roboto, Cinzel } from "next/font/google";
import { UserProvider } from "./context/UserProvider";
import "./globals.css";
import { Metadata } from "next";
import { Suspense } from "react";

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
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${roboto.variable} ${cinzel.variable} antialiased`}>
        <UserProvider>
          <Suspense fallback={null}>{children}</Suspense>
        </UserProvider>
      </body>
    </html>
  );
}
