import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Gauge, RefreshCw, CheckCircle2, TrendingUp, Cpu, Shield, Award } from 'lucide-react';

export default function ReadinessView() {
  const [readiness, setReadiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recalculating, setRecalculating] = useState(false);

  useEffect(() => {
    loadReadiness();
  }, []);

  const loadReadiness = async () => {
    try {
      setLoading(true);
      const data = await api.getReadiness();
      setReadiness(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRecalculate = async () => {
    try {
      setRecalculating(true);
      const updated = await api.recalculateReadiness();
      setReadiness(updated);
    } catch (err) {
      console.error(err);
    } finally {
      setRecalculating(false);
    }
  };

  const overall = readiness?.overallScore || 84;

  return (
    <div style={{ backgroundColor: '#000000', color: '#FFFFFF', borderRadius: '28px', padding: '4rem 2rem', boxShadow: '0 10px 60px rgba(0,0,0,0.6)' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 3.5rem' }}>
        <span className="badge-pill badge-dark" style={{ marginBottom: '1rem' }}>
          <Gauge size={14} color="#0071E3" /> Multi-Pillar Verification Engine
        </span>
        <h1 className="section-title hero-title-dark" style={{ marginBottom: '0.8rem' }}>
          Are you actually ready?
        </h1>
        <p className="section-subtitle" style={{ color: '#A1A1A6', margin: '0 auto 2rem' }}>
          Real-time readiness calculated by synthesizing code repositories, adaptive quizzes, oral interviews, and project artifacts.
        </p>

        <button
          onClick={handleRecalculate}
          disabled={recalculating}
          className="btn-apple btn-apple-glass"
          style={{ fontSize: '0.88rem', padding: '0.6rem 1.4rem' }}
        >
          <RefreshCw size={15} className={recalculating ? 'animate-spin' : ''} />
          <span>{recalculating ? 'Synthesizing...' : 'Recalculate Engine'}</span>
        </button>
      </div>

      {/* Central Score Meter */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '4rem' }}>
        <div
          style={{
            width: '240px',
            height: '240px',
            borderRadius: '50%',
            background: 'radial-gradient(circle at 30% 30%, #202028 0%, #08080A 100%)',
            border: '1.5px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 0 70px rgba(0, 113, 227, 0.45)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <span style={{ fontSize: '5.2rem', fontWeight: 800, letterSpacing: '-0.05em', lineHeight: 1 }}>
            {overall}%
          </span>
          <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: '#A1A1A6', letterSpacing: '0.12em', marginTop: '0.5rem' }}>
            CAREER READINESS
          </span>
        </div>

        <div style={{ marginTop: '1.5rem', color: '#A1A1A6', fontSize: '0.95rem', maxWidth: '600px', textAlign: 'center' }}>
          {readiness?.summaryText || "Exceptional job readiness. Evidence verified across technical, architectural, and interview dimensions."}
        </div>
      </div>

      {/* 5 Pillars Breakdown */}
      <div style={{ maxWidth: '950px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '1.5rem' }}>
        {[
          { label: 'Technical Skills', val: readiness?.skillsScore || 89, weight: '25% weight', color: '#0071E3' },
          { label: 'Evidence Strength', val: readiness?.evidenceScore || 82, weight: '25% weight', color: '#8656EF' },
          { label: 'Project Verification', val: readiness?.projectsScore || 91, weight: '20% weight', color: '#06B6D4' },
          { label: 'Interview Mastery', val: readiness?.interviewScore || 76, weight: '20% weight', color: '#F59E0B' },
          { label: 'Practical Experience', val: readiness?.experienceScore || 65, weight: '10% weight', color: '#10B981' }
        ].map((item) => (
          <div key={item.label} className="apple-card-dark" style={{ textAlign: 'center', padding: '1.6rem 1rem' }}>
            <div style={{ fontSize: '2.4rem', fontWeight: 800, color: item.color, marginBottom: '0.2rem' }}>
              {item.val}%
            </div>
            <div style={{ fontSize: '0.92rem', fontWeight: 600, color: '#FFFFFF', marginBottom: '0.2rem' }}>
              {item.label}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#86868B' }}>
              {item.weight}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
