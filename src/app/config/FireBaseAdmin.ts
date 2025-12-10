import admin from "firebase-admin";
import { FirebaseAdminAppParams } from "../Types/FirebaseAdminAppParams";

function formatPrivateKey(key: string) {
  return key.replace(/\\n/g, "\n");
}

export function createFirebaseAdminApp(params: FirebaseAdminAppParams) {
  const privateKey = formatPrivateKey(params.privateKey);

  if (admin.apps.length > 0) {
    return admin.app();
  }

  const cert = admin.credential.cert({
    projectId: params.projectId,
    clientEmail: params.clientEmail,
    privateKey,
  });

  return admin.initializeApp({
    credential: cert,
    projectId: params.projectId,
    storageBucket: params.storageBucket,
  });
}

export async function initAdmin() {
  const params = {
    projectId: process.env.NEXT_PUBLIC_PROJECT_ID as string,
    clientEmail: process.env.NEXT_PUBLIC_CLIENT_EMAIL as string,
    storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET as string,
    privateKey: process.env.NEXT_PUBLIC_PRIVATE_KEY as string,
  };

  return createFirebaseAdminApp(params);
}

export async function getAdminDB() {
  const app = await initAdmin();
  return app.firestore();
}
