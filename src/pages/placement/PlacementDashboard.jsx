import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { GraduationCap, BarChart3, Users, AlertTriangle, CheckCircle2, ArrowRight, Lightbulb } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PlacementDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getBatchStats(2027)
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '3rem' }}>
        <span className="badge-pill badge-blue" style={{ marginBottom: '0.8rem' }}>
          <GraduationCap size={14} /> University Placement Intelligence
        </span>
        <h1 className="section-title">Understand your students.<br />Prepare them for industry.</h1>
        <p className="section-subtitle">
          Real-time batch cohort analytics identifying skill gaps before campus recruitment drives commence.
        </p>
      </div>

      {/* Batch Overview 4 Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <div className="apple-card" style={{ padding: '2rem', textAlign: 'center' }}>
          <span style={{ fontSize: '0.85rem', color: '#6E6E73', textTransform: 'uppercase', fontWeight: 600 }}>2027 BATCH</span>
          <div style={{ fontSize: '3.6rem', fontWeight: 800, color: '#1D1D1F', margin: '0.2rem 0' }}>
            {stats?.totalStudents || 842}
          </div>
          <span style={{ fontSize: '0.85rem', color: '#6E6E73' }}>Total Registered Students</span>
        </div>

        <div className="apple-card" style={{ padding: '2rem', textAlign: 'center' }}>
          <span style={{ fontSize: '0.85rem', color: '#6E6E73', textTransform: 'uppercase', fontWeight: 600 }}>Resume Ready</span>
          <div style={{ fontSize: '3.6rem', fontWeight: 800, color: '#0071E3', margin: '0.2rem 0' }}>
            {stats?.resumeReady || 683}
          </div>
          <span style={{ fontSize: '0.85rem', color: '#0071E3', fontWeight: 600 }}>ATS Score ≥ 80</span>
        </div>

        <div className="apple-card" style={{ padding: '2rem', textAlign: 'center' }}>
          <span style={{ fontSize: '0.85rem', color: '#6E6E73', textTransform: 'uppercase', fontWeight: 600 }}>Interview Ready</span>
          <div style={{ fontSize: '3.6rem', fontWeight: 800, color: '#8656EF', margin: '0.2rem 0' }}>
            {stats?.interviewReady || 491}
          </div>
          <span style={{ fontSize: '0.85rem', color: '#8656EF', fontWeight: 600 }}>Passed Mock Simulation</span>
        </div>

        <div className="apple-card" style={{ padding: '2rem', textAlign: 'center' }}>
          <span style={{ fontSize: '0.85rem', color: '#6E6E73', textTransform: 'uppercase', fontWeight: 600 }}>Placement Ready</span>
          <div style={{ fontSize: '3.6rem', fontWeight: 800, color: '#10B981', margin: '0.2rem 0' }}>
            {stats?.placementReady || 438}
          </div>
          <span style={{ fontSize: '0.85rem', color: '#10B981', fontWeight: 600 }}>Eligible for Tier-1 Drives</span>
        </div>
      </div>

      {/* Skill Gap Heatmap & Suggested Interventions */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '2rem', marginBottom: '3rem' }}>
        {/* Skill Gap Heatmap */}
        <div className="apple-card" style={{ padding: '2.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 700 }}>Skill Gap Heatmap</h2>
              <p style={{ fontSize: '0.85rem', color: '#6E6E73' }}>Identified across student code submissions and assessments</p>
            </div>
            <span className="badge-pill badge-warning">Critical Gaps Detected</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            {stats?.skillGaps?.map((gap) => {
              const isHigh = gap.gapLevel === 'High Gap';
              const isMedium = gap.gapLevel === 'Medium';
              return (
                <div key={gap.skillName} style={{ padding: '1rem', backgroundColor: '#F5F5F7', borderRadius: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                    <strong style={{ fontSize: '1rem', color: '#1D1D1F' }}>{gap.skillName}</strong>
                    <span
                      style={{
                        padding: '0.25rem 0.7rem',
                        borderRadius: '999px',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        backgroundColor: isHigh ? 'rgba(239, 68, 68, 0.12)' : isMedium ? 'rgba(245, 158, 11, 0.12)' : 'rgba(16, 185, 129, 0.12)',
                        color: isHigh ? '#EF4444' : isMedium ? '#F59E0B' : '#10B981'
                      }}
                    >
                      {gap.gapLevel}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: '#6E6E73' }}>
                    <span>Cohort Average: {gap.averageProficiency}%</span>
                    <span>Students Needing Support: <strong>{gap.studentsNeedingSupport}</strong></span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Suggested Interventions & Workshops */}
        <div className="apple-card" style={{ padding: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <Lightbulb size={20} color="#F59E0B" />
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700 }}>Suggested Interventions</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            {stats?.workshopSuggestions?.map((ws) => (
              <div key={ws.title} style={{ padding: '1.2rem', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '16px' }}>
                <span className="badge-pill badge-blue" style={{ fontSize: '0.75rem', marginBottom: '0.4rem' }}>
                  {ws.recommendedTimeline}
                </span>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginTop: '0.2rem', color: '#1D1D1F' }}>
                  {ws.title}
                </h3>
                <div style={{ fontSize: '0.85rem', color: '#6E6E73', marginTop: '0.3rem' }}>
                  {ws.focusArea}
                </div>
                <div style={{ fontSize: '0.88rem', color: '#0071E3', fontWeight: 600, marginTop: '0.6rem' }}>
                  Students affected: <strong>{ws.studentsAffected}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
