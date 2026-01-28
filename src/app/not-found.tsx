import Link from "next/link";
import EmptyState from "./components/EmptyState/EmptyState";
import { IoIosHome } from "react-icons/io";

function NotFound() {
  return (
    <EmptyState
      title="404 - Page Not Found"
      description="The page youre looking for doesnt exist."
      linkHref="/"
      linkText="Get Back Home"
      icon={<IoIosHome size={24} />}
    />
  );
}

export default NotFound;
