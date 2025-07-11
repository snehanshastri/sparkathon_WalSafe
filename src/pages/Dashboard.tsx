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
import { getAuth } from 'firebase/auth';

// Define the session type
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
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) {
          console.error('No user logged in');
          return;
        }

        const res = await fetch(`http://localhost:4000/sessions?userId=${user.email}`);
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error('Failed to fetch sessions', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <h1 className="dashboard-heading">
          🛡️ Trust Score Dashboard
        </h1>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            {/* Trust Score Chart */}
            <div>
              <h2 className="section-title">Trust Score Over Time</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="timestamp" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="trustScore"
                    stroke="#2563eb"
                    strokeWidth={3}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Session Table */}
            <div>
              <h2 className="section-title">Session History</h2>
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
                        <td>{session.timestamp}</td>
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
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
