import express from 'express';
import {db} from './firebase';

const router = express.Router();

router.get('/sessions', async (req, res) => {
const userId = req.query.userId;
if (!userId) return res.status(400).send({ error: 'userId is required' });

const snapshot = await db.collection('sessions').where('userId', '==', userId).get();
const sessions = snapshot.docs.map(doc => doc.data());
res.json(sessions);
});

router.get('/all-sessions', async (req, res) => {
const snapshot = await db.collection('sessions').get();
const sessions = snapshot.docs.map(doc => doc.data());
res.json(sessions);
});

export default router;