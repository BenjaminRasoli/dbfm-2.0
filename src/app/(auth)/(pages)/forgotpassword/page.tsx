import { Metadata } from "next";
import Forgot from "./Forgot";

export const metadata: Metadata = {
  title: "Forgot password | DBFM",
  description: "Reset your DBFM account password to regain access.",
  robots: {
    index: false,
    follow: false,
  },
  icons: {
    icon: "/black_favicon.png",
  },
};

function page() {
  return (
    <>
      <Forgot />
    </>
  );
}

export default page;
