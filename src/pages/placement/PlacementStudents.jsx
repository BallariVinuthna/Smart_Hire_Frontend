import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Users, Search, Award } from 'lucide-react';

export default function PlacementStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getPlacementStudents(2027)
      .then(setStudents)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div style={{ marginBottom: '2.5rem' }}>
        <span className="badge-pill badge-blue" style={{ marginBottom: '0.6rem' }}>
          <Users size={14} /> Batch 2027 Roster
        </span>
        <h1 className="section-title">Student Cohort Verification Roster</h1>
        <p className="section-subtitle">Real-time tracking of student readiness scores and credentials.</p>
      </div>

      <div className="apple-card" style={{ padding: '2rem', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '700px' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid rgba(0,0,0,0.06)', fontSize: '0.82rem', color: '#86868B', textTransform: 'uppercase' }}>
              <th style={{ padding: '1rem' }}>Student Name</th>
              <th style={{ padding: '1rem' }}>University & Batch</th>
              <th style={{ padding: '1rem' }}>Target Role</th>
              <th style={{ padding: '1rem' }}>CGPA</th>
              <th style={{ padding: '1rem' }}>Readiness Score</th>
              <th style={{ padding: '1rem' }}>Placement Status</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => (
              <tr key={s.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.04)', fontSize: '0.92rem' }}>
                <td style={{ padding: '1.2rem 1rem' }}>
                  <strong style={{ color: '#1D1D1F' }}>{s.user?.fullName || 'Ballari Vinuthna'}</strong>
                  <div style={{ fontSize: '0.78rem', color: '#6E6E73' }}>{s.user?.email}</div>
                </td>
                <td style={{ padding: '1.2rem 1rem', color: '#48484A' }}>
                  {s.university} ({s.batchYear})
                </td>
                <td style={{ padding: '1.2rem 1rem', fontWeight: 600 }}>
                  {s.targetRole}
                </td>
                <td style={{ padding: '1.2rem 1rem', color: '#10B981', fontWeight: 700 }}>
                  {s.cgpa}
                </td>
                <td style={{ padding: '1.2rem 1rem', fontWeight: 800, color: '#0071E3' }}>
                  {s.careerReadinessScore}%
                </td>
                <td style={{ padding: '1.2rem 1rem' }}>
                  <span className="badge-pill badge-success">Placement Ready</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
