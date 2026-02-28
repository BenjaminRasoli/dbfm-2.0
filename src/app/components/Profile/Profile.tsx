"use client";
import Connection from "../Connection/Connection";
import Export from "../Export/Export";
import { useUser } from "@/app/context/UserProvider";
import EmptyState from "../EmptyState/EmptyState";
import { FiLogIn } from "react-icons/fi";

function Profile() {
  const { user: currentUser } = useUser();

  if (!currentUser) {
    return (
      <EmptyState
        title="You must be logged in"
        description="to view your connections."
        linkHref="/login"
        linkText="Login"
        icon={<FiLogIn size={24} />}
      />
    );
  }

  const info = (text: string, data: any) => {
    return (
      <div className="py-2 border-b border-gray-200 dark:border-gray-700 last:border-none">
        <span className="font-semibold mr-2">{text}</span>
        <span>{data}</span>
      </div>
    );
  };

  const formattedDate = currentUser.date
    ? new Date(currentUser.date).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "";

  return (
    <div className="customContainer">
      <div className="p-6 my-8 dark:bg-dark rounded-lg border border-gray-200 dark:border-gray-800">
        <h2 className="text-2xl font-semibold pb-6 dark:text-white border-b border-gray-200 dark:border-gray-700">
          User Info
        </h2>

        <div className="pt-6">
          {info("Email:", currentUser?.email)}
          {info("Name:", currentUser?.firstName)}
          {info("Lastname:", currentUser?.lastName)}
          {info("Username:", currentUser?.userName)}
          {info("User since:", formattedDate)}
        </div>
      </div>

      <Export />
      <Connection />
    </div>
  );
}

export default Profile;
