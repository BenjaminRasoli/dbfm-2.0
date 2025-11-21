import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | DBFM",
  description:
    "Access your DBFM account to manage your favorite movies and TV shows.",
  robots: "index, follow",
  icons: {
    icon: "/black_favicon.png",
  },
  openGraph: {
    title: "Login | DBFM",
    description:
      "Access your DBFM account to manage your favorite movies and TV shows.",
    url: "https://dbfm.vercel.app/login",
    siteName: "DBFM",
    images: [
      {
        url: "/black_favicon.png",
        width: 512,
        height: 512,
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Login | DBFM",
    description:
      "Access your DBFM account to manage your favorite movies and TV shows.",
    images: ["/black_favicon.png"],
  },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
