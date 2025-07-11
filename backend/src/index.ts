import express from 'express'
import admin from 'firebase-admin'
import authRoutes from '../routes/auth';
import cors from 'cors';

import * as serviceAccountData from '../firebase/serviceAccountKey.json'

const app = express()
app.use(express.json())
app.use(cors());

admin.initializeApp({
  credential: admin.credential.cert(serviceAccountData as admin.ServiceAccount),
})
app.use('/api', authRoutes);
// Example route
app.get('/', (req, res) => {
  res.send('Backend is working ✅')
})

// Start server
app.listen(5000, () => {
  console.log('Server running on http://localhost:5000')
})
