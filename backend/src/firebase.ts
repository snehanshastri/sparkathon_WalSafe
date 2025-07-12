import admin from 'firebase-admin';

// ✅ Use this instead:
import * as serviceAccount from '../firebase/serviceAccountKey.json';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount)
  });
}


const db = admin.firestore();
export { db };