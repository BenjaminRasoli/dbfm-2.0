import Navbar from "../components/Navbar/Navbar";
import Header from "../components/Header/Header";
import "../globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-[auto_1fr] grid-rows-[auto_1fr]">
      <Navbar />
      <div className="flex flex-col">
        <Header />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
