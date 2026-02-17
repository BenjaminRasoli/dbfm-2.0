"use client";
import { useContext, createContext, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { UserContextTypes, UserProviderProps } from "../Types/UserContextTypes";
import { UserDataSavedTypes } from "../Types/UserDataTypes";

const UserContext = createContext<UserContextTypes | null>(null);

export const useUser = (): UserContextTypes => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};



async function updateCookie(action: "set" | "remove", userId?: string) {
  await fetch(`${process.env.NEXT_PUBLIC_DBFM_SERVER}/api/userCookie`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, userId }),
  });
}

export const UserProvider = ({
  children,
  initialUser = null,
}: UserProviderProps) => {
  const [user, setUser] = useState<UserDataSavedTypes | null>(initialUser);
  const router = useRouter();

  const login = async (userData: UserDataSavedTypes) => {
    setUser(userData);
    if (userData.uid) await updateCookie("set", userData.uid);
  };

  const logout = async () => {
    setUser(null);
    await updateCookie("remove");
    router.push("/");
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};
