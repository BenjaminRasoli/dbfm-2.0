import Register from "./Register";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register | DBFM",
  description: "Create a new DBFM account to access personalized features.",
  robots: {
    index: false,
    follow: false,
  },
  icons: {
    icon: "/black_favicon.png",
  },
};

export default function Page() {
  return (
    <>
      <Register />
    </>
  );
}
