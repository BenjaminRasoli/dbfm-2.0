export interface UserDataTypes {
  uid: string;
  email: string;
  userName: string;
  firstName: string;
  lastName: string;
  password: string;
  photoURL?: string;
  date?: string;
}

export interface UserDataSavedTypes {
  email: string;
  userName: string;
  firstName: string;
  lastName: string;
  uid: string;
  date?: string;
}
