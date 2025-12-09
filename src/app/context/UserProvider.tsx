"use client";
import {
  useContext,
  createContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { UserContextTypes } from "../Types/UserContextTypes";
import { UserDataSavedTypes } from "../Types/UserDataTypes";
import { useRouter } from "next/navigation";

const UserContext = createContext<UserContextTypes | null>(null);

export const useUser = (): UserContextTypes => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }

  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<UserDataSavedTypes | null>(null);
  const [isHydrating, setIsHydrating] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsHydrating(false);
  }, []);

  const login = (userData: UserDataSavedTypes) => {
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("user");
    router.push("/");
    setUser(null);
  };

  if (isHydrating) {
    return null;
  }

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};
