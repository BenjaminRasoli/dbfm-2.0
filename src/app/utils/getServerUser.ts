import { cookies } from "next/headers";
import { UserDataSavedTypes } from "../Types/UserDataTypes";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../config/FireBaseConfig";

export async function getServerUser(): Promise<UserDataSavedTypes | null> {
  const cookieStore = cookies();
  const userId = (await cookieStore).get("userId")?.value;

  if (!userId) return null;

  const userDocRef = doc(db, "users", userId);
  const docSnap = await getDoc(userDocRef);

  if (!docSnap.exists()) return null;

  const data = docSnap.data() as Partial<UserDataSavedTypes>;

  if (
    data.email &&
    data.userName &&
    data.firstName &&
    data.lastName &&
    data.uid
  ) {
    return data as UserDataSavedTypes;
  }

  return null;
}
