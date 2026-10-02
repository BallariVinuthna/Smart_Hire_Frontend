import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Sparkles, Users, CheckCircle2, TrendingUp, Award, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function RecruiterDashboard() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getRecruiterMetrics()
      .then(setMetrics)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <span className="badge-pill badge-blue" style={{ marginBottom: '0.6rem' }}>
            <Sparkles size={14} /> Talent Intelligence Hub
          </span>
          <h1 className="section-title">Candidate Pipeline Intelligence</h1>
          <p className="section-subtitle">Verified proof-of-skill matching with zero black box filtering.</p>
        </div>

        <Link to="/recruiter/candidates" className="btn-apple btn-apple-primary">
          <span>Candidate Comparison Matrix</span>
          <ArrowRight size={16} />
        </Link>
      </div>

      {/* 4 Core Pipeline Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <div className="apple-card" style={{ padding: '2rem', textAlign: 'center' }}>
          <span style={{ fontSize: '0.85rem', color: '#6E6E73', textTransform: 'uppercase', fontWeight: 600 }}>Total Applicants</span>
          <div style={{ fontSize: '3.6rem', fontWeight: 800, color: '#1D1D1F', margin: '0.2rem 0' }}>
            {metrics?.applicantsCount || 128}
          </div>
          <span style={{ fontSize: '0.82rem', color: '#6E6E73' }}>Across Active Postings</span>
        </div>

        <div className="apple-card" style={{ padding: '2rem', textAlign: 'center' }}>
          <span style={{ fontSize: '0.85rem', color: '#6E6E73', textTransform: 'uppercase', fontWeight: 600 }}>Strong Matches</span>
          <div style={{ fontSize: '3.6rem', fontWeight: 800, color: '#0071E3', margin: '0.2rem 0' }}>
            {metrics?.strongMatchesCount || 42}
          </div>
          <span style={{ fontSize: '0.82rem', color: '#0071E3', fontWeight: 600 }}>≥ 80% Job Twin Alignment</span>
        </div>

        <div className="apple-card" style={{ padding: '2rem', textAlign: 'center' }}>
          <span style={{ fontSize: '0.85rem', color: '#6E6E73', textTransform: 'uppercase', fontWeight: 600 }}>Interview Ready</span>
          <div style={{ fontSize: '3.6rem', fontWeight: 800, color: '#8656EF', margin: '0.2rem 0' }}>
            {metrics?.interviewReadyCount || 18}
          </div>
          <span style={{ fontSize: '0.82rem', color: '#8656EF', fontWeight: 600 }}>Passed Speech Simulations</span>
        </div>

        <div className="apple-card" style={{ padding: '2rem', textAlign: 'center' }}>
          <span style={{ fontSize: '0.85rem', color: '#6E6E73', textTransform: 'uppercase', fontWeight: 600 }}>Selected Offers</span>
          <div style={{ fontSize: '3.6rem', fontWeight: 800, color: '#10B981', margin: '0.2rem 0' }}>
            {metrics?.selectedCount || 7}
          </div>
          <span style={{ fontSize: '0.82rem', color: '#10B981', fontWeight: 600 }}>Verified Placements</span>
        </div>
      </div>

      {/* Top Candidate Showcase */}
      <div className="apple-card" style={{ padding: '2.5rem' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '1.5rem' }}>Top Ranked Candidates (Evidence-Verified)</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {metrics?.candidates?.slice(0, 3).map((c) => (
            <div key={c.fullName} style={{ padding: '1.4rem', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>{c.fullName}</h3>
                <div style={{ fontSize: '0.88rem', color: '#6E6E73' }}>{c.targetRole} • {c.experience}</div>
              </div>

              <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0071E3' }}>{c.jobMatch}%</div>
                  <span style={{ fontSize: '0.72rem', color: '#86868B' }}>Job Match</span>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#10B981' }}>{c.readiness}%</div>
                  <span style={{ fontSize: '0.72rem', color: '#86868B' }}>Readiness</span>
                </div>
                <span className="badge-pill badge-success">{c.applicationStatus}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
