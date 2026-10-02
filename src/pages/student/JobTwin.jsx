import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Target, CheckCircle2, AlertTriangle, ArrowRight, Sparkles } from 'lucide-react';

export default function JobTwin() {
  const [role, setRole] = useState('Java Full Stack Engineer');
  const [comparison, setComparison] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadComparison(role);
  }, [role]);

  const loadComparison = async (targetRole) => {
    try {
      setLoading(true);
      const data = await api.getJobTwin(targetRole);
      setComparison(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#0B0B0D', color: '#FFFFFF', borderRadius: '28px', padding: '3.5rem 2.5rem', boxShadow: '0 10px 50px rgba(0,0,0,0.5)' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 3rem' }}>
        <span className="badge-pill badge-dark" style={{ marginBottom: '1rem' }}>
          <Target size={14} color="#0071E3" /> Role Demand Mirror
        </span>
        <h1 className="section-title hero-title-dark" style={{ marginBottom: '0.8rem' }}>
          Meet your Job Twin.
        </h1>
        <p className="section-subtitle" style={{ color: '#A1A1A6', margin: '0 auto 2rem' }}>
          Before you apply, understand exactly what the role demands.
        </p>

        {/* Role Selector Tabs */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
          {['Java Full Stack Engineer', 'React Developer', 'Cloud & DevOps Engineer'].map((r) => (
            <button
              key={r}
              onClick={() => setRole(r)}
              style={{
                padding: '0.6rem 1.2rem',
                borderRadius: '999px',
                border: role === r ? '1px solid #0071E3' : '1px solid rgba(255,255,255,0.12)',
                backgroundColor: role === r ? '#0071E3' : 'rgba(255,255,255,0.06)',
                color: '#FFFFFF',
                fontSize: '0.88rem',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#A1A1A6' }}>
          Running Job Twin comparison...
        </div>
      ) : (
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          {/* Match Verdict Card */}
          <div
            style={{
              backgroundColor: '#141417',
              borderRadius: '20px',
              padding: '2rem',
              border: '1px solid rgba(255,255,255,0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1.5rem',
              marginBottom: '2.5rem'
            }}
          >
            <div>
              <div style={{ fontSize: '0.85rem', color: '#A1A1A6', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Competitive Alignment
              </div>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 700, marginTop: '0.2rem' }}>
                {comparison?.overallMatch}% Job Match
              </h2>
              <p style={{ fontSize: '0.92rem', color: '#A1A1A6', marginTop: '0.4rem', maxWidth: '600px' }}>
                {comparison?.recommendation}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.8rem' }}>
              <span className="badge-pill badge-success" style={{ fontSize: '0.88rem', padding: '0.5rem 1rem' }}>
                ✓ Strong Candidate
              </span>
            </div>
          </div>

          {/* Comparison Side-by-Side Matrix */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', marginBottom: '2.5rem' }}>
            {/* Role Demands */}
            <div className="apple-card-dark">
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#A1A1A6', marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Target Role Benchmark
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                {Object.entries(comparison?.roleDemand || {}).map(([skill, req]) => (
                  <div key={skill}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.4rem' }}>
                      <span>{skill}</span>
                      <strong style={{ color: '#0071E3' }}>{req}%</strong>
                    </div>
                    <div style={{ height: '7px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '999px', overflow: 'hidden' }}>
                      <div style={{ width: `${req}%`, height: '100%', backgroundColor: '#0071E3', borderRadius: '999px' }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Candidate Profile */}
            <div className="apple-card-dark" style={{ border: '1.5px solid rgba(0, 113, 227, 0.35)' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#FFFFFF', marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Your Current Evidence
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                {Object.entries(comparison?.roleDemand || {}).map(([skill, req]) => {
                  const actual = comparison?.userProfile?.[skill] || 50;
                  const isMet = actual >= req - 8;
                  return (
                    <div key={skill}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.4rem' }}>
                        <span>
                          {skill}{' '}
                          <small style={{ color: isMet ? '#10B981' : '#F59E0B' }}>
                            {isMet ? '✓ Match' : '⚠ Bridgeable Gap'}
                          </small>
                        </span>
                        <strong style={{ color: isMet ? '#10B981' : '#FFFFFF' }}>{actual}%</strong>
                      </div>
                      <div style={{ height: '7px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '999px', overflow: 'hidden' }}>
                        <div
                          style={{
                            width: `${actual}%`,
                            height: '100%',
                            background: isMet ? 'linear-gradient(90deg, #0071E3, #10B981)' : '#F59E0B',
                            borderRadius: '999px'
                          }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Strengths & Gaps */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className="apple-card-dark">
              <h4 style={{ fontSize: '1rem', fontWeight: 600, color: '#10B981', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <CheckCircle2 size={16} /> Verified Strengths
              </h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem', color: '#D1D1D6' }}>
                {comparison?.strengths?.map((s, idx) => (
                  <li key={idx}>✓ {s}</li>
                ))}
              </ul>
            </div>

            <div className="apple-card-dark">
              <h4 style={{ fontSize: '1rem', fontWeight: 600, color: '#F59E0B', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <AlertTriangle size={16} /> Skill Gaps to Bridge
              </h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem', color: '#D1D1D6' }}>
                {comparison?.gaps?.map((g, idx) => (
                  <li key={idx}>⚠ {g}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
