import React, { useEffect, useState } from 'react';
import './Dashboard.css';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from 'firebase/firestore';

const db = getFirestore();

type Session = {
  timestamp: string;
  trustScore: number;
  actionTaken: 'approved' | 'challenged' | 'blocked';
  explanation: string;
};

const Dashboard: React.FC = () => {
  const [data, setData] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const email = localStorage.getItem('userEmail');
      if (!email) {
        console.error('No user email found in localStorage.');
        setLoading(false);
        return;
      }

      try {
        const q = query(collection(db, 'loginBehavior'), where('userId', '==', email));
        const snapshot = await getDocs(q);
        const sessionData = snapshot.docs.map(doc => doc.data()) as Session[];

        // Sort sessions by timestamp
        sessionData.sort((a, b) => Number(a.timestamp) - Number(b.timestamp));
        setData(sessionData);
      } catch (err) {
        console.error('Failed to fetch sessions:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatTimestamp = (ts: string) =>
    new Date(Number(ts)).toLocaleString();

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <h1 className="dashboard-heading">🛡️ Trust Score Dashboard</h1>

        {loading ? (
          <p>Loading...</p>
        ) : data.length === 0 ? (
          <p>No session data found.</p>
        ) : (
          <>
            <h2 className="section-title">📈 Trust Score Over Time</h2>

            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="timestamp"
                  tickFormatter={tick =>
                    new Date(Number(tick)).toLocaleTimeString()
                  }
                />
                <YAxis domain={[0, 100]} />
                <Tooltip
                  labelFormatter={label =>
                    `Time: ${new Date(Number(label)).toLocaleString()}`
                  }
                />
                <Line
                  type="monotone"
                  dataKey="trustScore"
                  stroke="#2563eb"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>

            <h2 className="section-title">📋 Session History</h2>

            <div className="overflow-x-auto">
              <table className="session-table">
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>Trust Score</th>
                    <th>Outcome</th>
                    <th>Explanation</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((session, idx) => (
                    <tr key={idx}>
                      <td>{formatTimestamp(session.timestamp)}</td>
                      <td className="text-center">{session.trustScore}</td>
                      <td className="text-center">
                        <span
                          className={`session-badge ${
                            session.actionTaken === 'approved'
                              ? 'badge-approved'
                              : session.actionTaken === 'challenged'
                              ? 'badge-challenged'
                              : 'badge-blocked'
                          }`}
                        >
                          {session.actionTaken}
                        </span>
                      </td>
                      <td>{session.explanation}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
