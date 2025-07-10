import admin from 'firebase-admin';

// ✅ Use this instead:
import * as serviceAccount from '../firebase/serviceAccountKey.json';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount)
});
