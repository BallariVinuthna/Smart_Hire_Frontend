import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Send, CheckCircle2, Clock, Building, ArrowRight, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ApplicationTracker() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getMyApplications()
      .then(setApplications)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const stages = ['APPLIED', 'SHORTLISTED', 'ASSESSMENT', 'INTERVIEW', 'SELECTED'];

  const getStageIndex = (status) => {
    const idx = stages.indexOf(status);
    return idx >= 0 ? idx : 0;
  };

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <span className="badge-pill badge-blue" style={{ marginBottom: '1rem' }}>
          <Send size={14} /> End-to-End Pipeline
        </span>
        <h1 className="section-title" style={{ marginBottom: '0.8rem' }}>
          Application Status Timeline
        </h1>
        <p className="section-subtitle" style={{ margin: '0 auto' }}>
          Track candidate advancement and interview scheduling in real-time.
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '5rem', color: '#6E6E73' }}>
          Loading active applications...
        </div>
      ) : applications.length === 0 ? (
        <div className="apple-card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <Building size={48} color="#C7C7CC" style={{ margin: '0 auto 1rem' }} />
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.5rem' }}>No Applications Yet</h2>
          <p style={{ color: '#6E6E73', marginBottom: '2rem' }}>Discover high-match roles tailored to your career readiness.</p>
          <Link to="/student/jobs" className="btn-apple btn-apple-primary">
            <span>Explore Matched Roles</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {applications.map((app) => {
            const currentStageIdx = getStageIndex(app.status);
            return (
              <div key={app.id} className="apple-card" style={{ padding: '2.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2.5rem' }}>
                  <div>
                    <span style={{ fontSize: '0.82rem', color: '#6E6E73', textTransform: 'uppercase', fontWeight: 600 }}>
                      {app.job?.company?.name || 'Apex Systems'}
                    </span>
                    <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#1D1D1F', marginTop: '0.2rem' }}>
                      {app.job?.title || 'Java Backend Engineer'}
                    </h2>
                    <div style={{ display: 'flex', gap: '1rem', color: '#6E6E73', fontSize: '0.85rem', marginTop: '0.4rem' }}>
                      <span>Location: {app.job?.location || 'Bengaluru / Hybrid'}</span>
                      <span>•</span>
                      <span>Applied: {new Date(app.appliedAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <span className="badge-pill badge-success" style={{ fontSize: '0.85rem' }}>
                      Status: {app.status}
                    </span>
                    <div style={{ fontSize: '0.8rem', color: '#86868B', marginTop: '0.3rem' }}>
                      Readiness Snapshot: {app.readinessSnapshot}%
                    </div>
                  </div>
                </div>

                {/* Apple-style Linear Stage Progression */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', margin: '2rem 1rem' }}>
                  {/* Background track */}
                  <div style={{ position: 'absolute', top: '15px', left: 0, right: 0, height: '3px', backgroundColor: '#E5E5EA', zIndex: 1 }}></div>
                  <div
                    style={{
                      position: 'absolute',
                      top: '15px',
                      left: 0,
                      width: `${(currentStageIdx / (stages.length - 1)) * 100}%`,
                      height: '3px',
                      backgroundColor: '#0071E3',
                      zIndex: 2,
                      transition: 'width 0.4s ease'
                    }}
                  ></div>

                  {stages.map((stage, sIdx) => {
                    const isPassed = sIdx <= currentStageIdx;
                    const isCurrent = sIdx === currentStageIdx;

                    return (
                      <div key={stage} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 3 }}>
                        <div
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            backgroundColor: isPassed ? '#0071E3' : '#FFFFFF',
                            border: isPassed ? '2px solid #0071E3' : '2px solid #C7C7CC',
                            color: isPassed ? '#FFFFFF' : '#8E8E93',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                            fontSize: '0.78rem',
                            boxShadow: isCurrent ? '0 0 12px rgba(0,113,227,0.4)' : 'none'
                          }}
                        >
                          {isPassed ? '✓' : sIdx + 1}
                        </div>
                        <span style={{ fontSize: '0.75rem', fontWeight: isCurrent ? 700 : 500, color: isPassed ? '#1D1D1F' : '#8E8E93', marginTop: '0.5rem', textTransform: 'capitalize' }}>
                          {stage.toLowerCase()}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Candidate Cover Note */}
                {app.coverNote && (
                  <div style={{ borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: '1.2rem', marginTop: '1.5rem', fontSize: '0.88rem', color: '#6E6E73' }}>
                    <strong>Note to Hiring Team: </strong>"{app.coverNote}"
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
