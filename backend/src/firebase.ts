import admin from 'firebase-admin';
import serviceAccount from './your-service-key.json'; // Download this from Firebase

admin.initializeApp({
credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

const db = admin.firestore();
export default db;