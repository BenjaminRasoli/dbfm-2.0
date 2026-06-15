import { getApps, initializeApp, cert, App } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { FirebaseAdminAppParams } from "../Types/FirebaseAdminAppParams";

function formatPrivateKey(key: string) {
  return key.replace(/\\n/g, "\n");
}

let app: App | null = null;

export function createFirebaseAdminApp(params: FirebaseAdminAppParams) {
  if (getApps().length > 0) {
    return getApps()[0];
  }
  const privateKey = formatPrivateKey(params.privateKey);

  const certConfig = cert({
    projectId: params.projectId,
    clientEmail: params.clientEmail,
    privateKey,
  });

  return initializeApp({
    credential: certConfig,
    projectId: params.projectId,
    storageBucket: params.storageBucket,
  });
}

export async function initAdmin() {
  const params: FirebaseAdminAppParams = {
    projectId: process.env.NEXT_PUBLIC_PROJECT_ID as string,
    clientEmail: process.env.NEXT_PUBLIC_CLIENT_EMAIL as string,
    storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET as string,
    privateKey: process.env.NEXT_PUBLIC_PRIVATE_KEY as string,
  };

  return createFirebaseAdminApp(params);
}

export async function getAdminDB() {
  const app = await initAdmin();
  return getFirestore(app);
}
