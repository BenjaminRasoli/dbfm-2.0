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

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (userData: UserDataSavedTypes) => {
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("favoriteMovies");
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};
