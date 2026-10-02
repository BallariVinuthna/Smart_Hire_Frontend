import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import confetti from 'canvas-confetti';
import { Flame, Clock, Award, CheckCircle2, ArrowRight } from 'lucide-react';

export default function DailyMissions() {
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMissions();
  }, []);

  const loadMissions = async () => {
    try {
      setLoading(true);
      const data = await api.getDailyMissions();
      setMissions(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async (id) => {
    try {
      await api.completeMission(id);
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.7 } });
      loadMissions();
    } catch (err) {
      console.error(err);
    }
  };

  const completedCount = missions.filter(m => m.completed).length;

  return (
    <div style={{ maxWidth: '880px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <span className="badge-pill badge-warning" style={{ marginBottom: '1rem' }}>
          <Flame size={14} /> Apple Fitness-Inspired Habit System
        </span>
        <h1 className="section-title" style={{ marginBottom: '0.8rem' }}>
          Daily Career Missions
        </h1>
        <p className="section-subtitle" style={{ margin: '0 auto' }}>
          Small, verified daily actions that build undeniable engineering proof and accelerate your readiness.
        </p>
      </div>

      {/* Progress Ring Banner */}
      <div
        className="apple-card"
        style={{
          padding: '2rem 2.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.5rem',
          marginBottom: '2.5rem',
          background: 'linear-gradient(135deg, #FFFFFF 0%, #F5F5F7 100%)'
        }}
      >
        <div>
          <span style={{ fontSize: '0.85rem', color: '#6E6E73', textTransform: 'uppercase', fontWeight: 600 }}>
            DAILY PROGRESS
          </span>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '0.2rem' }}>
            {completedCount} of {missions.length} Missions Closed
          </h2>
          <p style={{ fontSize: '0.9rem', color: '#6E6E73', marginTop: '0.2rem' }}>
            Closing all today will award +15 total readiness points.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.8rem' }}>
          <span className="badge-pill badge-success" style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}>
            🔥 4-Day Streak
          </span>
        </div>
      </div>

      {/* Missions Cards List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
        {missions.map((m) => (
          <div
            key={m.id}
            className="apple-card"
            style={{
              padding: '2rem',
              border: m.completed ? '1.5px solid #10B981' : '1px solid rgba(0,0,0,0.08)',
              backgroundColor: m.completed ? 'rgba(16, 185, 129, 0.03)' : '#FFFFFF'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '0.8rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
                  <span className="badge-pill badge-blue" style={{ fontSize: '0.75rem' }}>
                    {m.category}
                  </span>
                  <span style={{ fontSize: '0.82rem', color: '#6E6E73', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Clock size={13} /> {m.estimatedMinutes} min
                  </span>
                </div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#1D1D1F' }}>
                  {m.title}
                </h3>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0071E3' }}>
                  +{m.points} Points
                </span>
                <div style={{ fontSize: '0.78rem', color: '#86868B' }}>
                  {m.targetSkill} Evidence +{m.evidenceDelta}%
                </div>
              </div>
            </div>

            <p style={{ fontSize: '0.92rem', color: '#6E6E73', lineHeight: 1.5, marginBottom: '1.5rem' }}>
              {m.description}
            </p>

            <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: '1.2rem' }}>
              <button
                onClick={() => !m.completed && handleComplete(m.id)}
                disabled={m.completed}
                className={m.completed ? 'btn-apple' : 'btn-apple btn-apple-primary'}
                style={{
                  backgroundColor: m.completed ? '#10B981' : undefined,
                  color: '#FFFFFF',
                  padding: '0.65rem 1.6rem',
                  fontSize: '0.92rem'
                }}
              >
                {m.completed ? '✓ MISSION COMPLETE' : 'Start Mission'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
