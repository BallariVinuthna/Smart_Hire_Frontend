import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { SlidersHorizontal, ArrowRight, Sparkles, CheckCircle2, TrendingUp, Info } from 'lucide-react';

export default function WhatIfSimulator() {
  const [selectedSkills, setSelectedSkills] = useState(['Spring Boot']);
  const [simResult, setSimResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const availableSkills = ['Spring Boot', 'Docker', 'AWS', 'System Design', 'React'];

  useEffect(() => {
    runSimulation(selectedSkills);
  }, [selectedSkills]);

  const runSimulation = async (skills) => {
    try {
      setLoading(true);
      const res = await api.simulateWhatIf(skills);
      setSimResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleSkill = (skill) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <span className="badge-pill badge-blue" style={{ marginBottom: '1rem' }}>
          <SlidersHorizontal size={14} /> Career Projection Model
        </span>
        <h1 className="section-title" style={{ marginBottom: '0.8rem' }}>
          What if you learned one more skill?
        </h1>
        <p className="section-subtitle" style={{ margin: '0 auto' }}>
          Simulate the strategic readiness return on investment for your target engineering role.
        </p>
      </div>

      <div className="apple-card" style={{ padding: '3rem 2.5rem', marginBottom: '2.5rem' }}>
        {/* Score Transition Visual */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3rem', marginBottom: '3rem', flexWrap: 'wrap' }}>
          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: '#86868B', textTransform: 'uppercase', fontWeight: 600 }}>CURRENT READINESS</span>
            <div style={{ fontSize: '3.2rem', fontWeight: 700, color: '#6E6E73', letterSpacing: '-0.03em' }}>
              {simResult?.currentReadiness || 72}%
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontSize: '0.9rem', color: '#0071E3', fontWeight: 700, marginBottom: '0.4rem' }}>
              +{simResult?.delta || 6}% GAIN
            </span>
            <ArrowRight size={36} color="#0071E3" />
          </div>

          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: '#0071E3', textTransform: 'uppercase', fontWeight: 600 }}>PROJECTED READINESS</span>
            <div style={{ fontSize: '4.2rem', fontWeight: 800, color: '#0071E3', letterSpacing: '-0.04em', lineHeight: 1 }}>
              {simResult?.projectedReadiness || 78}%
            </div>
          </div>
        </div>

        {/* Skill Toggles */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '1rem' }}>
            Select Skills to Simulate:
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.8rem', flexWrap: 'wrap' }}>
            {availableSkills.map((skill) => {
              const active = selectedSkills.includes(skill);
              return (
                <button
                  key={skill}
                  onClick={() => toggleSkill(skill)}
                  style={{
                    padding: '0.75rem 1.4rem',
                    borderRadius: '999px',
                    border: active ? '1.5px solid #0071E3' : '1px solid rgba(0,0,0,0.12)',
                    backgroundColor: active ? '#0071E3' : '#FFFFFF',
                    color: active ? '#FFFFFF' : '#1D1D1F',
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    boxShadow: active ? '0 4px 14px var(--accent-blue-glow)' : 'none',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {active ? `✓ ${skill}` : `+ ${skill}`}
                </button>
              );
            })}
          </div>
        </div>

        {/* Breakdown of gains */}
        {simResult?.gains && simResult.gains.length > 0 && (
          <div style={{ borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: '2rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>
              Impact Analysis & Target Role Justification
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              {simResult.gains.map((g) => (
                <div key={g.skill} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '1rem', backgroundColor: '#F5F5F7', borderRadius: '14px' }}>
                  <div>
                    <strong style={{ fontSize: '1rem', color: '#1D1D1F' }}>{g.skill}</strong>
                    <p style={{ fontSize: '0.85rem', color: '#6E6E73', marginTop: '0.2rem' }}>{g.reason}</p>
                  </div>
                  <span className="badge-pill badge-blue" style={{ fontSize: '0.85rem' }}>
                    +{g.addedPoints}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Disclaimer Note */}
        <div style={{ marginTop: '2.5rem', display: 'flex', alignItems: 'flex-start', gap: '0.6rem', padding: '1rem', backgroundColor: 'rgba(0,113,227,0.05)', borderRadius: '12px', border: '1px solid rgba(0,113,227,0.12)' }}>
          <Info size={18} color="#0071E3" style={{ flexShrink: 0, marginTop: '2px' }} />
          <p style={{ fontSize: '0.82rem', color: '#424245', lineHeight: 1.5 }}>
            {simResult?.explanation || "Estimated improvement based on your target role and current profile. Results reflect potential readiness upon completing verified project proof."}
          </p>
        </div>
      </div>
    </div>
  );
}
