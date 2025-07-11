// profileScoring.ts
import express from 'express';
import { getFirestore } from 'firebase-admin/firestore';
const router = express.Router();
const db = getFirestore();

// ---------- Feature Extraction ----------
function extractFeatures(data: any): number[] {
  const { keyTimings = [], mouseMoves = [], clicks = [] } = data;

  // Keystroke features
  const keyIntervals = keyTimings.slice(1).map((k: any, i: number) => k.time - keyTimings[i].time);
  const avgKeyDelay = keyIntervals.reduce((a: any, b: any) => a + b, 0) / (keyIntervals.length || 1);
  const keyStdDev = Math.sqrt(
    keyIntervals.reduce((sum: number, val: number) => sum + (val - avgKeyDelay) ** 2, 0) / (keyIntervals.length || 1)
  );

  // Mouse movement features
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

  // Click rate
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

// ---------- Similarity ----------
function cosineSimilarity(a: number[], b: number[]): number {
  const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return dot / (magA * magB);
}

// ---------- POST /ml-score ----------
router.post('/ml-score', async (req, res) => {
  const { behaviorData, email, timestamp, sourcePage } = req.body;
  if (!behaviorData || !email || !timestamp) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  const features = extractFeatures(behaviorData);

  const userRef = db.collection('userProfiles').doc(email);
  const doc = await userRef.get();

  let trustScore = 100;
  let explanation = '';
  let actionTaken: 'approved' | 'challenged' | 'blocked' = 'approved';

  if (!doc.exists) {
    await userRef.set({ profileVector: features });
    explanation = 'First login — baseline profile saved.';
  } else {
    const profile = doc.data()?.profileVector;
    const similarity = cosineSimilarity(features, profile);
    trustScore = Math.round(similarity * 100);
    explanation = `Cosine similarity: ${similarity.toFixed(2)}`;

    if (trustScore < 60) actionTaken = 'blocked';
    else if (trustScore < 75) actionTaken = 'challenged';
  }

  const sessionLog = {
    userId: email,
    timestamp,
    trustScore,
    actionTaken,
    explanation,
    sourcePage: sourcePage || 'login',
  };

  await db.collection('sessions').add(sessionLog);

  return res.status(200).json(sessionLog);
});

export default router;
