

import express from 'express';
import { db } from './firebase';

const router = express.Router();

function extractFeatures(data: any): number[] {
  const { keyTimings = [], mouseMoves = [], clicks = [] } = data;

  const keyIntervals = keyTimings.slice(1).map((k: any, i: number) => k.time - keyTimings[i].time);
  const avgKeyDelay = keyIntervals.reduce((a: number, b: number) => a + b, 0) / (keyIntervals.length || 1);
  const keyStdDev = Math.sqrt(
    keyIntervals.reduce((sum: number, val: number) => sum + (val - avgKeyDelay) ** 2, 0) / (keyIntervals.length || 1)
  );

  const distances: number[] = [];
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
    Math.round(avgKeyDelay * 1.2),
    Math.round(keyStdDev * 1.2),
    Math.round(mouseDistAvg * 0.8),
    Math.round(mouseDistStdDev * 0.8),
    Number((clickRate * 1.5).toFixed(2))
  ];
}

function cosineSimilarity(a: number[], b: number[]): number {
  const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return dot / (magA * magB);
}

function euclideanDistance(a: number[], b: number[]): number {
  return Math.sqrt(a.reduce((sum, val, i) => sum + (val - b[i]) ** 2, 0));
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
  let securityQuestion = null;

  if (!doc.exists) {
    await userRef.set({ profileVector: features });
    explanation = 'First login — baseline profile saved.';
  } else {
    const profile = doc.data()?.profileVector;
    const similarity = cosineSimilarity(features, profile);
    const distance = euclideanDistance(features, profile);

    const cappedDistance = Math.min(distance, 300);
    const distancePenalty = Math.log1p(cappedDistance);
    trustScore = Math.max(0, Math.round(similarity * 100 - distancePenalty * 1.5));

    explanation = `Cosine sim: ${similarity.toFixed(2)}, Euclidean dist: ${distance.toFixed(2)}`;

    const isLogin = (sourcePage || 'login') === 'login';
    const isProduct = sourcePage === 'product';

    const keyDelayDiff = Math.abs(features[0] - profile[0]);
    const clickRate = features[4];

    if (isLogin) {
  if (trustScore < 35) {
    actionTaken = 'blocked';
    explanation += ' — Low trust (login)';
    adminAlert = true;
  } else if (trustScore < 90) {
    actionTaken = 'challenged';
    explanation += ' — Moderate trust (login)';
  }
  else {
    actionTaken = 'approved';
    explanation += ' — High trust (login)';
  }

  // if (keyDelayDiff > 500) {
  //   explanation += ' — Typing behavior unusual';
  // }
}

    else if (isProduct) {
  if (trustScore < 35) {
    actionTaken = 'blocked';
    explanation += ' — Low trust (product)';
    adminAlert = true;
  } else if (trustScore < 90) {
    actionTaken = 'challenged';
    explanation += ' — Moderate trust (product)';
  } else {
    actionTaken = 'approved';
    explanation += ' — High trust (product)';
  }

  if (clickRate > 30) {
    explanation += ' — Excessive clicks';
  }
}
else {
      if (trustScore < 30) {
        actionTaken = 'blocked';
        explanation += ' — Low trust (general)';
        adminAlert = true;
      } else if (trustScore < 87) {
        actionTaken = 'challenged';
        explanation += ' — Moderate trust (general)';
      }
    }

    // Update profile only if trustable
    if (actionTaken === 'approved' || actionTaken === 'challenged') {
      const updateWeight = Math.min(0.2, Math.max(0.05, trustScore / 500));
      const updatedProfile = profile.map((val: number, i: number) =>
        val * (1 - updateWeight) + features[i] * updateWeight
      );
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
    console.warn(`[ALERT] Unusual login behavior for user ${email}`);
  }

  return res.status(200).json({ trustScore, actionTaken, explanation, securityQuestion });
});



router.post('/verify-challenge', async (req, res) => {
  const { email, answer, page } = req.body;

  if (!email || !answer) {
    return res.status(400).json({ success: false });
  }

  const usersSnapshot = await db.collection('users').where('email', '==', email).get();
  if (usersSnapshot.empty) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  const userDoc = usersSnapshot.docs[0];
  const userRef = userDoc.ref;

  try {
    await db.runTransaction(async (t) => {
      const freshDoc = await t.get(userRef);
      const userData = freshDoc.data();

      if (!userData || !userData.securityAnswer) {
        throw new Error('Security answer missing.');
      }

      const expected = userData.securityAnswer.trim().toLowerCase();
      const attempts = userData.challengeAttempts || 0;
      const isCorrect = answer.trim().toLowerCase() === expected;

      if (isCorrect) {
        t.update(userRef, { challengeAttempts: 0 });
        res.status(200).json({ success: true, blocked: false });
        return;
      } else {
        const newAttempts = attempts + 1;
        t.update(userRef, { challengeAttempts: newAttempts });

        if (newAttempts >= 2) {
          await db.collection('loginBehavior').add({
            userId: email,
            timestamp: Date.now(),
            actionTaken: 'blocked',
            explanation: 'Challenge failed multiple times',
            sourcePage: page || 'login',
            adminAlert: true,
          });

          res.status(403).json({ success: false, blocked: true });
        } else {
          res.status(403).json({ success: false, blocked: false });
        }

        return;
      }
    });
  } catch (error) {
    console.error('Error verifying challenge:', error);
    return res.status(500).json({ success: false, message: 'Internal error' });
  }
});



export default router;