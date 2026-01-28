import { Metadata } from "next";
import Login from "./Login";

export const metadata: Metadata = {
  title: "Login | DBFM",
  description: "Access your DBFM account with your credentials.",
  robots: {
    index: false,
    follow: false,
  },
  icons: {
    icon: "/black_favicon.png",
  },
};

function Page() {
  return (
    <>
      <Login />
    </>
  );
}

export default Page;
