import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Account",
  description: "Manage your DBFM account to access personalized features.",
  robots: {
    index: false,
    follow: false,
  },
  icons: {
    icon: "/black_favicon.png",
  },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
