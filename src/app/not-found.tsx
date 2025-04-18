import Link from "next/link";

function NotFound() {
  return (
    <div className="p-7 text-center">
      <h1 className="text-2xl font-bold">404 - Page Not Found</h1>
      <p>The page youre looking for doesnt exist.</p>
      <h1 className="text-2xl text-blue pt-5">
        <Link href="/"> Get Back Home </Link>
      </h1>
    </div>
  );
}

export default NotFound;
