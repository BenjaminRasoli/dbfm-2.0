import { ReactNode } from "react";
import { UserDataSavedTypes } from "./UserDataTypes";

export interface UserTypes {
  email: string;
  firstName: string;
  lastName: string;
  userName: string;
  photoURL?: string;
  uid: string;
  date: string;
}

export interface UserLoginDataTypes {
  uid: string;
  email: string;
  userName: string;
  firstName: string;
  lastName: string;
  date: string;
}

export interface UserContextTypes {
  user: UserTypes | null;
  login: (user: UserLoginDataTypes) => void;
  logout: () => void;
}

export interface UserProviderProps {
  children: ReactNode;
  initialUser?: UserDataSavedTypes | null;
}
