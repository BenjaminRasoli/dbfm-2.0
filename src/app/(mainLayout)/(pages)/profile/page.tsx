"use client";
import React from "react";
import { useUser } from "@/app/context/UserProvider";
import { useRouter } from "next/navigation";

const ProfilePage = () => {
  const { user, logout } = useUser();
  const navigate = useRouter();

  if (!user) {
    navigate.push("/login");
    return null;
  }

  const firstLetter = user.userName.charAt(0).toUpperCase();

  return (
    <div className="h-[80dvh] max-w-3xl mx-auto p-8 bg-white dark:bg-dark rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-dark dark:text-white">
          Your Profile
        </h1>
        <button
          onClick={logout}
          className="bg-red-500 cursor-pointer text-white px-6 py-2 rounded-lg hover:bg-red-600 transition"
        >
          Log out
        </button>
      </div>

      <div className="flex flex-col items-center bg-white dark:bg-dark p-6">
        <div className="mb-4">
          {user.photoURL ? (
            <img
              src={user.photoURL}
              alt="User Avatar"
              className="w-32 h-32 rounded-full border-4 border-blue"
            />
          ) : (
            <div className="w-32 h-32 flex items-center justify-center bg-blue text-white font-semibold text-4xl rounded-full">
              {firstLetter}
            </div>
          )}
        </div>
        <h2 className="text-xl font-semibold text-dark dark:text-white">
          {user.firstName} {user.lastName}
        </h2>
        <p className="text-md text-dark dark:text-white">@{user.userName}</p>
        <p className="text-md text-dark dark:text-white">{user.email}</p>
      </div>
    </div>
  );
};

export default ProfilePage;
