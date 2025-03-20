export interface UserTypes {
  email: string;
  firstName: string;
  lastName: string;
  userName: string;
  photoURL?: string;
  uid: string;
}

export interface UserLoginDataTypes {
  uid: string;
  email: string;
  userName: string;
  firstName: string;
  lastName: string;
}

export interface UserContextTypes {
  user: UserTypes | null;
  login: (user: UserLoginDataTypes) => void;
  logout: () => void;
}
