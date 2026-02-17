import { NextRequest, NextResponse } from "next/server";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/app/config/FireBaseConfig";

export async function POST(req: NextRequest) {
  const { userId } = await req.json();
  if (!userId)
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });

  const userDocRef = doc(db, "users", userId);
  const docSnap = await getDoc(userDocRef);
  if (!docSnap.exists()) return NextResponse.json({ user: null });

  return NextResponse.json({ user: docSnap.data() });
}
