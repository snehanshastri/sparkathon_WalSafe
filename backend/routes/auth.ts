// backend/routes/auth.ts
import express from 'express';
import admin from 'firebase-admin';
const router = express.Router();

// Signup route
router.post('/signup', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await admin.auth().createUser({ email, password });
    res.status(201).json({ uid: user.uid, message: 'User created successfully' });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

// Login route - just logs behavioral data
router.post('/login', async (req, res) => {
  const { email, behaviorData } = req.body;

  try {
    const db = admin.firestore();
    await db.collection('loginEvents').add({
  email,
  timestamp: admin.firestore.FieldValue.serverTimestamp()
});
    res.status(200).json({ message: 'stores user login with timestamp' });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.post('/track', async (req, res) => {
  const { email, behaviorData, page, timestamp } = req.body;

  try {
    const db = admin.firestore();
    await db.collection('behaviorTracking').add({
      email,
      behaviorData,
      page,
      timestamp: timestamp ? new Date(timestamp) : new Date(),
    });

    res.status(200).json({ message: 'Behavior data tracked' });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});


export default router;
