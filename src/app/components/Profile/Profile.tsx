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

  return (
    <div className="customContainer">
      <div className="p-6 my-8 dark:bg-dark rounded-lg border border-gray-200 dark:border-gray-800">
        <h2 className="text-2xl font-semibold pb-6 dark:text-white border-b border-gray-200 dark:border-gray-700">
          User Info
        </h2>
        <p className="pt-6">
          <strong>Email:</strong> {currentUser.email || "N/A"}
        </p>
        <p>
          <strong>Name:</strong> {currentUser.firstName || "N/A"}
        </p>
        <p>
          <strong>Lastname:</strong> {currentUser.lastName || "N/A"}
        </p>
        <p>
          <strong>Username:</strong> {currentUser.userName || "N/A"}
        </p>
      </div>
      <Export />
      <Connection />
    </div>
  );
}

export default Profile;
