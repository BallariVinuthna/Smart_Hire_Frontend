import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Users, CheckCircle2, Award, Sparkles, Filter } from 'lucide-react';

export default function CandidateIntelligence() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getRecruiterMetrics().then((data) => {
      setCandidates(data?.candidates || []);
    }).finally(() => setLoading(false));
  }, []);

  const handleUpdateStatus = (index, newStatus) => {
    const updated = [...candidates];
    updated[index].applicationStatus = newStatus;
    setCandidates(updated);
  };

  return (
    <div>
      <div style={{ marginBottom: '3rem' }}>
        <span className="badge-pill badge-blue" style={{ marginBottom: '0.6rem' }}>
          <Users size={14} /> Transparent Decision Matrix
        </span>
        <h1 className="section-title">Candidate Comparison Intelligence</h1>
        <p className="section-subtitle">
          Holistic multi-dimensional evidence review. SmartHire X does not auto-reject candidates based solely on algorithmic scores.
        </p>
      </div>

      <div className="apple-card" style={{ padding: '2rem', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '850px' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid rgba(0,0,0,0.06)', fontSize: '0.82rem', color: '#86868B', textTransform: 'uppercase' }}>
              <th style={{ padding: '1rem' }}>Candidate</th>
              <th style={{ padding: '1rem' }}>Job Match</th>
              <th style={{ padding: '1rem' }}>Readiness</th>
              <th style={{ padding: '1rem' }}>Skills Score</th>
              <th style={{ padding: '1rem' }}>Evidence</th>
              <th style={{ padding: '1rem' }}>Assessment</th>
              <th style={{ padding: '1rem' }}>Experience</th>
              <th style={{ padding: '1rem' }}>Current Status</th>
              <th style={{ padding: '1rem' }}>Recruiter Action</th>
            </tr>
          </thead>
          <tbody>
            {candidates.map((c, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid rgba(0,0,0,0.04)', fontSize: '0.92rem' }}>
                <td style={{ padding: '1.2rem 1rem' }}>
                  <strong style={{ color: '#1D1D1F' }}>{c.fullName}</strong>
                  <div style={{ fontSize: '0.78rem', color: '#6E6E73' }}>{c.targetRole}</div>
                </td>
                <td style={{ padding: '1.2rem 1rem', fontWeight: 800, color: '#0071E3' }}>
                  {c.jobMatch}%
                </td>
                <td style={{ padding: '1.2rem 1rem', fontWeight: 800, color: '#10B981' }}>
                  {c.readiness}%
                </td>
                <td style={{ padding: '1.2rem 1rem', color: '#48484A' }}>
                  {c.skillsScore}%
                </td>
                <td style={{ padding: '1.2rem 1rem', color: '#8656EF', fontWeight: 600 }}>
                  {c.evidenceScore}%
                </td>
                <td style={{ padding: '1.2rem 1rem', color: '#06B6D4', fontWeight: 600 }}>
                  {c.assessmentScore}%
                </td>
                <td style={{ padding: '1.2rem 1rem', color: '#6E6E73', fontSize: '0.85rem' }}>
                  {c.experience}
                </td>
                <td style={{ padding: '1.2rem 1rem' }}>
                  <span className="badge-pill badge-success">{c.applicationStatus}</span>
                </td>
                <td style={{ padding: '1.2rem 1rem' }}>
                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    <button
                      onClick={() => handleUpdateStatus(idx, 'INTERVIEW')}
                      style={{ padding: '0.35rem 0.7rem', borderRadius: '6px', border: '1px solid #0071E3', background: 'rgba(0,113,227,0.06)', color: '#0071E3', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
                    >
                      Invite
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(idx, 'SELECTED')}
                      style={{ padding: '0.35rem 0.7rem', borderRadius: '6px', border: '1px solid #10B981', background: 'rgba(16,185,129,0.06)', color: '#10B981', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
                    >
                      Select
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
