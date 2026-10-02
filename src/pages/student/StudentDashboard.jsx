import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import confetti from 'canvas-confetti';
import {
  Sparkles, Target, Compass, SlidersHorizontal, ArrowRight,
  CheckCircle2, Flame, Award, Briefcase, FileText, QrCode,
  Shield, Cpu, AlertCircle
} from 'lucide-react';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [readiness, setReadiness] = useState(null);
  const [dailyMissions, setDailyMissions] = useState([]);
  const [applications, setApplications] = useState([]);
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [profData, readData, missionsData, appsData, drivesData] = await Promise.all([
        api.getStudentProfile().catch(() => null),
        api.getReadiness().catch(() => null),
        api.getDailyMissions().catch(() => []),
        api.getMyApplications().catch(() => []),
        api.getPlacementDrives().catch(() => [])
      ]);
      setProfile(profData);
      setReadiness(readData);
      setDailyMissions(missionsData);
      setApplications(appsData);
      setDrives(drivesData);
    } catch (err) {
      console.error("Dashboard loading error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteMission = async (id) => {
    try {
      await api.completeMission(id);
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
      loadDashboardData();
    } catch (err) {
      console.error(err);
    }
  };

  const score = readiness?.overallScore || profile?.careerReadinessScore || 84;

  return (
    <div>
      {/* Hero Welcome Banner */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '24px',
          padding: '2.5rem',
          border: '1px solid rgba(0, 0, 0, 0.06)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '2rem',
          marginBottom: '2.5rem'
        }}
      >
        <div style={{ maxWidth: '650px' }}>
          <span className="badge-pill badge-blue" style={{ marginBottom: '0.8rem' }}>
            <Sparkles size={13} /> Active Readiness Sprint • Batch 2027
          </span>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '0.5rem' }}>
            Welcome back, {user?.fullName || profile?.user?.fullName || 'Ballari Vinuthna'}
          </h1>
          <p style={{ color: '#6E6E73', fontSize: '1.05rem', lineHeight: 1.5 }}>
            Targeting <strong>{profile?.targetRole || 'Java Full Stack Engineer'}</strong>. Your evidence-backed readiness is in the elite 95th percentile.
          </p>
        </div>

        {/* Circular Readiness Gauge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div
            style={{
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              background: 'radial-gradient(circle at 30% 30%, #1D1D22 0%, #000000 100%)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              boxShadow: '0 0 30px rgba(0, 113, 227, 0.35)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF'
            }}
          >
            <span style={{ fontSize: '2.4rem', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1 }}>
              {score}%
            </span>
            <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: '#A1A1A6', letterSpacing: '0.08em', marginTop: '0.2rem' }}>
              Readiness
            </span>
          </div>

          <div>
            <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#1D1D1F', marginBottom: '0.3rem' }}>
              Top 5% Candidate
            </div>
            <Link
              to="/student/readiness"
              style={{
                fontSize: '0.85rem',
                color: '#0071E3',
                fontWeight: 600,
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '0.2rem'
              }}
            >
              <span>View 5 Pillars</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>

      {/* 5 Readiness Pillars Breakdown Bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
        {[
          { label: 'Skills', score: readiness?.skillsScore || 89, color: '#0071E3' },
          { label: 'Evidence', score: readiness?.evidenceScore || 82, color: '#8656EF' },
          { label: 'Projects', score: readiness?.projectsScore || 91, color: '#06B6D4' },
          { label: 'Interview', score: readiness?.interviewScore || 76, color: '#F59E0B' },
          { label: 'Experience', score: readiness?.experienceScore || 65, color: '#10B981' }
        ].map((p) => (
          <div key={p.label} className="apple-card" style={{ padding: '1.2rem 1.4rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <span style={{ fontSize: '0.85rem', color: '#6E6E73', fontWeight: 500 }}>{p.label}</span>
              <span style={{ fontSize: '1.2rem', fontWeight: 800, color: p.color }}>{p.score}%</span>
            </div>
            <div style={{ height: '6px', backgroundColor: '#EFEFEF', borderRadius: '999px', overflow: 'hidden' }}>
              <div style={{ width: `${p.score}%`, height: '100%', backgroundColor: p.color, borderRadius: '999px' }}></div>
            </div>
          </div>
        ))}
      </div>

      {/* Grid: Daily Missions & Active Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem', marginBottom: '3rem' }}>
        {/* Daily Career Missions */}
        <div className="apple-card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 700 }}>Today's Career Missions</h2>
              <span style={{ fontSize: '0.85rem', color: '#6E6E73' }}>Apple Fitness-style habit reinforcement</span>
            </div>
            <Link to="/student/missions" style={{ fontSize: '0.85rem', color: '#0071E3', fontWeight: 600, textDecoration: 'none' }}>
              View All
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {dailyMissions.slice(0, 3).map((mission) => (
              <div
                key={mission.id}
                style={{
                  border: '1px solid rgba(0, 0, 0, 0.08)',
                  borderRadius: '16px',
                  padding: '1.2rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  backgroundColor: mission.completed ? 'rgba(16, 185, 129, 0.04)' : '#FFFFFF'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
                    <span className="badge-pill badge-blue" style={{ fontSize: '0.72rem', padding: '0.2rem 0.6rem' }}>
                      {mission.category}
                    </span>
                    <span style={{ fontSize: '0.78rem', color: '#86868B' }}>{mission.estimatedMinutes} min</span>
                  </div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '0.2rem' }}>
                    {mission.title}
                  </h3>
                  <div style={{ fontSize: '0.82rem', color: '#0071E3', fontWeight: 600 }}>
                    +{mission.points} Readiness Points • {mission.targetSkill} Evidence
                  </div>
                </div>

                <button
                  onClick={() => !mission.completed && handleCompleteMission(mission.id)}
                  disabled={mission.completed}
                  style={{
                    padding: '0.55rem 1.1rem',
                    borderRadius: '999px',
                    border: 'none',
                    backgroundColor: mission.completed ? '#10B981' : '#0071E3',
                    color: '#FFFFFF',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: mission.completed ? 'default' : 'pointer'
                  }}
                >
                  {mission.completed ? '✓ Completed' : 'Start'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Career Intelligence Hub */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Link
            to="/student/job-twin"
            className="apple-card"
            style={{ textDecoration: 'none', color: 'inherit', padding: '1.6rem', display: 'flex', alignItems: 'center', gap: '1.2rem' }}
          >
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(0, 113, 227, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Target size={24} color="#0071E3" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.2rem' }}>Job Twin Match</h3>
              <p style={{ fontSize: '0.82rem', color: '#6E6E73' }}>Compare profile with industry benchmark requirements</p>
            </div>
          </Link>

          <Link
            to="/student/what-if"
            className="apple-card"
            style={{ textDecoration: 'none', color: 'inherit', padding: '1.6rem', display: 'flex', alignItems: 'center', gap: '1.2rem' }}
          >
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(134, 86, 239, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <SlidersHorizontal size={24} color="#8656EF" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.2rem' }}>What-If Simulator</h3>
              <p style={{ fontSize: '0.82rem', color: '#6E6E73' }}>Project readiness gains for Docker and System Design</p>
            </div>
          </Link>

          <Link
            to="/student/interviews"
            className="apple-card"
            style={{ textDecoration: 'none', color: 'inherit', padding: '1.6rem', display: 'flex', alignItems: 'center', gap: '1.2rem' }}
          >
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Cpu size={24} color="#F59E0B" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.2rem' }}>AI Interview Simulator</h3>
              <p style={{ fontSize: '0.82rem', color: '#6E6E73' }}>Practice oral technical rounds with real-time speech evaluation</p>
            </div>
          </Link>

          <Link
            to="/student/career-passport"
            className="apple-card"
            style={{ textDecoration: 'none', color: 'inherit', padding: '1.6rem', display: 'flex', alignItems: 'center', gap: '1.2rem' }}
          >
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <QrCode size={24} color="#10B981" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.2rem' }}>Public Career Passport</h3>
              <p style={{ fontSize: '0.82rem', color: '#6E6E73' }}>Share your verifiable credential badge and QR token</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Applications & Placement Drives Overview */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
        {/* Active Applications */}
        <div className="apple-card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Tracked Applications</h2>
            <Link to="/student/applications" style={{ fontSize: '0.85rem', color: '#0071E3', textDecoration: 'none', fontWeight: 600 }}>
              Timeline View
            </Link>
          </div>

          {applications.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#86868B', fontSize: '0.9rem' }}>
              No active applications. Explore matched jobs to apply!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              {applications.map((app) => (
                <div key={app.id} style={{ padding: '1rem', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>{app.job?.title}</h3>
                    <div style={{ fontSize: '0.82rem', color: '#6E6E73' }}>{app.job?.company?.name}</div>
                  </div>
                  <span className="badge-pill badge-success">
                    {app.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Campus Placement Drives */}
        <div className="apple-card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Upcoming Campus Drives</h2>
            <span className="badge-pill badge-blue">Batch 2027</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            {drives.slice(0, 2).map((drive) => (
              <div key={drive.id} style={{ padding: '1.1rem', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.3rem' }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 600 }}>{drive.title}</h3>
                  <span style={{ fontSize: '0.82rem', color: '#10B981', fontWeight: 700 }}>{drive.packageOffered}</span>
                </div>
                <div style={{ fontSize: '0.82rem', color: '#6E6E73', marginBottom: '0.6rem' }}>
                  Eligible: Min CGPA {drive.minCgpa} • Min Readiness {drive.minReadiness}% (You: {score}%)
                </div>
                <Link
                  to="/student/jobs"
                  className="btn-apple btn-apple-secondary"
                  style={{ width: '100%', fontSize: '0.85rem', padding: '0.55rem' }}
                >
                  View Eligibility & Register
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
