import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Dna, Cpu, GitBranch, Award, ShieldCheck, CheckCircle2, ExternalLink } from 'lucide-react';

export default function CareerDNA() {
  const [dna, setDna] = useState(null);
  const [activeTab, setActiveTab] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getCareerDna()
      .then(setDna)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '6rem 0', color: '#6E6E73' }}>
        Synthesizing Career DNA from verified proofs...
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 3rem' }}>
        <span className="badge-pill badge-blue" style={{ marginBottom: '1rem' }}>
          <Dna size={14} /> Living Professional Genome
        </span>
        <h1 className="section-title" style={{ marginBottom: '0.8rem' }}>
          Your career has a DNA.
        </h1>
        <p className="section-subtitle" style={{ margin: '0 auto' }}>
          A living profile built from what you know, what you've built, and what you can prove.
        </p>
      </div>

      {/* Interactive Genome Visualization Container */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '24px',
          border: '1px solid rgba(0,0,0,0.06)',
          boxShadow: '0 4px 25px rgba(0,0,0,0.04)',
          padding: '3rem 2rem',
          marginBottom: '3rem'
        }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
          <div style={{ padding: '1.5rem', borderRadius: '18px', backgroundColor: '#F5F5F7', border: '1px solid rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0071E3', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.4rem' }}>
              <Cpu size={16} /> SKILLS NODE
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>{dna?.skills?.length || 6} Verified</div>
            <p style={{ fontSize: '0.82rem', color: '#6E6E73', marginTop: '0.3rem' }}>Java, Spring Boot, React, SQL</p>
          </div>

          <div style={{ padding: '1.5rem', borderRadius: '18px', backgroundColor: '#F5F5F7', border: '1px solid rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#8656EF', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.4rem' }}>
              <GitBranch size={16} /> PROJECT EVIDENCE
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>{dna?.projects?.length || 3} Production Repos</div>
            <p style={{ fontSize: '0.82rem', color: '#6E6E73', marginTop: '0.3rem' }}>JWT Auth, Microservices, Caching</p>
          </div>

          <div style={{ padding: '1.5rem', borderRadius: '18px', backgroundColor: '#F5F5F7', border: '1px solid rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10B981', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.4rem' }}>
              <ShieldCheck size={16} /> EVIDENCE STRENGTH
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>84% Proven</div>
            <p style={{ fontSize: '0.82rem', color: '#6E6E73', marginTop: '0.3rem' }}>Assessment + Git verification</p>
          </div>

          <div style={{ padding: '1.5rem', borderRadius: '18px', backgroundColor: '#F5F5F7', border: '1px solid rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#F59E0B', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.4rem' }}>
              <Award size={16} /> TARGET MATCH
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>92% Job Fit</div>
            <p style={{ fontSize: '0.82rem', color: '#6E6E73', marginTop: '0.3rem' }}>{dna?.targetRole}</p>
          </div>
        </div>

        {/* Genome Evidence Drilldown */}
        <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '1.5rem' }}>
          Verified Genetic Skills & Source Artifacts
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {dna?.skills?.map((s) => (
            <div key={s.name} className="apple-card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>{s.name}</h3>
                  <span style={{ fontSize: '0.82rem', color: '#6E6E73' }}>{s.category} Stack</span>
                </div>
                <span className="badge-pill badge-success">
                  {s.evidenceStrength}% Verified
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#6E6E73' }}>Assessment Score:</span>
                  <strong style={{ color: '#0071E3' }}>{s.assessmentScore}%</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#6E6E73' }}>Project Evidence:</span>
                  <strong style={{ color: '#8656EF' }}>{s.projectScore}%</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#6E6E73' }}>GitHub Code Evidence:</span>
                  <strong style={{ color: '#06B6D4' }}>{s.gitHubScore}%</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#6E6E73' }}>Mock Interview Score:</span>
                  <strong style={{ color: '#F59E0B' }}>{s.interviewScore}%</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
