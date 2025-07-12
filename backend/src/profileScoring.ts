import express from 'express';
import { getFirestore } from 'firebase-admin/firestore';
const router = express.Router();
import { db } from './firebase/firebase';

function extractFeatures(data: any): number[] {
  const { keyTimings = [], mouseMoves = [], clicks = [] } = data;

  const keyIntervals = keyTimings.slice(1).map((k: any, i: number) => k.time - keyTimings[i].time);
  const avgKeyDelay = keyIntervals.reduce((a: any, b: any) => a + b, 0) / (keyIntervals.length || 1);
  const keyStdDev = Math.sqrt(
    keyIntervals.reduce((sum: number, val: number) => sum + (val - avgKeyDelay) ** 2, 0) / (keyIntervals.length || 1)
  );

  const distances = [];
  for (let i = 1; i < mouseMoves.length; i++) {
    const dx = mouseMoves[i].x - mouseMoves[i - 1].x;
    const dy = mouseMoves[i].y - mouseMoves[i - 1].y;
    distances.push(Math.sqrt(dx * dx + dy * dy));
  }
  const mouseDistAvg = distances.reduce((a, b) => a + b, 0) / (distances.length || 1);
  const mouseDistStdDev = Math.sqrt(
    distances.reduce((sum, val) => sum + (val - mouseDistAvg) ** 2, 0) / (distances.length || 1)
  );

  const clickRate =
    clicks.length > 1 ? (clicks.length - 1) / ((clicks[clicks.length - 1] - clicks[0]) / 1000) : 0;

  return [
    Math.round(avgKeyDelay),
    Math.round(keyStdDev),
    Math.round(mouseDistAvg),
    Math.round(mouseDistStdDev),
    Number(clickRate.toFixed(2)),
  ];
}

function cosineSimilarity(a: number[], b: number[]): number {
  const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return dot / (magA * magB);
}

router.post('/ml-score', async (req, res) => {
  const { behaviorData, email, timestamp, sourcePage, ip, location } = req.body;
  if (!behaviorData || !email || !timestamp) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  const features = extractFeatures(behaviorData);

  const userRef = db.collection('userProfiles').doc(email);
  const doc = await userRef.get();

  let trustScore = 100;
  let explanation = '';
  let actionTaken: 'approved' | 'challenged' | 'blocked' = 'approved';
  let adminAlert = false;

  if (!doc.exists) {
    await userRef.set({ profileVector: features });
    explanation = 'First login — baseline profile saved.';
  } else {
    const profile = doc.data()?.profileVector;
    const similarity = cosineSimilarity(features, profile);
    trustScore = Math.round(similarity * 100);
    explanation = `Cosine similarity with saved profile: ${similarity.toFixed(2)}`;

    if (trustScore < 60) {
      actionTaken = 'blocked';
      adminAlert = true;
    } else if (trustScore < 75) {
      actionTaken = 'challenged';
    } else {
      // Optional: update profile adaptively
      const updatedProfile = profile.map((val: number, i: number) => (val * 0.8 + features[i] * 0.2));
      await userRef.update({ profileVector: updatedProfile });
    }
  }

  const sessionLog = {
    userId: email,
    timestamp,
    trustScore,
    actionTaken,
    explanation,
    sourcePage: sourcePage || 'login',
    ip: ip || req.ip,
    location: location || 'unknown',
    adminAlert,
  };

  await db.collection('loginBehavior').add(sessionLog);

  if (adminAlert) {
    // Optional: Notify admin or trigger webhook
    console.warn(`[ALERT] Unusual login behavior for user ${email}`);
  }

  return res.status(200).json({ trustScore, actionTaken, explanation });
});

export default router;
