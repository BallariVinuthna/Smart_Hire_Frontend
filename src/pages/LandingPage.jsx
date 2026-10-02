import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import confetti from 'canvas-confetti';
import {
  Sparkles, ArrowRight, CheckCircle2, Shield, Target,
  Dna, SlidersHorizontal, Flame, QrCode, Mic, Cpu,
  Award, Play, ChevronRight, Activity, Terminal
} from 'lucide-react';

export default function LandingPage() {
  const { user, demoLogin } = useAuth();
  const navigate = useNavigate();

  // What-If Simulator Interactive State
  const [selectedSkills, setSelectedSkills] = useState([]);
  const baseScore = 72;
  const skillValues = {
    'Spring Boot': 6,
    'Docker': 5,
    'AWS Cloud': 5,
    'System Design': 6
  };
  const simulatedScore = Math.min(99, baseScore + selectedSkills.reduce((acc, s) => acc + (skillValues[s] || 0), 0));

  const toggleSkill = (skill) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  // Daily Mission interactive demonstration
  const [missionDone, setMissionDone] = useState(false);
  const handleCompleteMission = () => {
    setMissionDone(true);
    confetti({ particleCount: 60, spread: 60, origin: { y: 0.8 } });
  };

  const handleLaunchApp = async () => {
    if (!user) {
      await demoLogin('STUDENT');
    }
    navigate('/student/dashboard');
  };

  return (
    <div style={{ backgroundColor: '#FFFFFF', color: '#1D1D1F', overflowX: 'hidden' }}>
      <Navbar />

      {/* =========================================================================
          1. HERO SECTION (Cinematic Apple Typography & Readiness Orb)
          ========================================================================= */}
      <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '100px', paddingBottom: '60px', position: 'relative' }}>
        <div className="container-max" style={{ textAlign: 'center', width: '100%' }}>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            style={{ marginBottom: '1.5rem' }}
          >
            <span className="badge-pill badge-blue">
              <Sparkles size={14} /> The Next-Gen Career Readiness Intelligence Platform
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1 }}
            className="hero-title"
            style={{ marginBottom: '1.2rem' }}
          >
            Don't Just Apply.<br />
            Become Job-Ready.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="section-subtitle"
            style={{ margin: '0 auto 2.5rem' }}
          >
            SmartHire X understands your skills, evidence, experience, and goals — then builds your path to the role you want.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}
          >
            <button
              onClick={handleLaunchApp}
              className="btn-apple btn-apple-primary"
              style={{ fontSize: '1.1rem', padding: '1rem 2.2rem' }}
            >
              <span>Build My Career Profile</span>
              <ArrowRight size={18} />
            </button>
            <a
              href="#career-dna"
              className="btn-apple btn-apple-secondary"
              style={{ fontSize: '1.1rem', padding: '1rem 2.2rem' }}
            >
              Explore SmartHire
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2.5rem', color: '#86868B', fontSize: '0.92rem' }}
          >
            <span>• AI-powered</span>
            <span>• Evidence-based</span>
            <span>• Personalized</span>
          </motion.div>

          {/* Futuristic Interactive Readiness Orb Visualization */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.1, delay: 0.4 }}
            style={{ marginTop: '4.5rem', position: 'relative' }}
          >
            <div className="readiness-orb-container animate-float">
              {/* Central Readiness Score Ring */}
              <div className="readiness-orb-center">
                <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#A1A1A6', marginBottom: '0.2rem' }}>
                  CAREER READINESS
                </span>
                <span style={{ fontSize: '3.6rem', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1, color: '#FFFFFF' }}>
                  84%
                </span>
                <span style={{ fontSize: '0.75rem', color: '#0071E3', fontWeight: 600, marginTop: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                  <CheckCircle2 size={12} /> Top 5% Talent
                </span>
              </div>

              {/* Orbiting Satellite Evidence Badges */}
              <div className="satellite-badge" style={{ top: '10px', left: '20px' }}>
                Skills <strong style={{ color: '#0071E3' }}>89%</strong>
              </div>
              <div className="satellite-badge" style={{ top: '25px', right: '15px' }}>
                Evidence <strong style={{ color: '#8656EF' }}>82%</strong>
              </div>
              <div className="satellite-badge" style={{ bottom: '110px', right: '-25px' }}>
                Resume <strong style={{ color: '#06B6D4' }}>84 ATS</strong>
              </div>
              <div className="satellite-badge" style={{ bottom: '15px', right: '35px' }}>
                GitHub <strong style={{ color: '#10B981' }}>24 Repos</strong>
              </div>
              <div className="satellite-badge" style={{ bottom: '20px', left: '25px' }}>
                Interview <strong style={{ color: '#F59E0B' }}>76%</strong>
              </div>
              <div className="satellite-badge" style={{ top: '110px', left: '-25px' }}>
                Projects <strong style={{ color: '#0071E3' }}>91%</strong>
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* =========================================================================
          2. PROBLEM STORYTELLING SECTION
          ========================================================================= */}
      <section style={{ padding: '7rem 1.5rem', backgroundColor: '#F5F5F7', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
        <div className="container-narrow" style={{ textAlign: 'center' }}>
          <span className="badge-pill badge-warning" style={{ marginBottom: '1.5rem' }}>
            The Industry Reality
          </span>
          <h2 className="section-title" style={{ marginBottom: '1.5rem' }}>
            Applying isn't the same as being ready.
          </h2>
          <p style={{ fontSize: '1.3rem', lineHeight: 1.6, color: '#424245', marginBottom: '3.5rem' }}>
            A resume tells recruiters who you say you are.<br />
            <strong>SmartHire discovers what you can actually prove.</strong>
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', textAlign: 'left' }}>
            <div className="apple-card" style={{ padding: '2rem' }}>
              <div style={{ color: '#EF4444', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.8rem' }}>Traditional Job Search</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.8rem' }}>Passive Rejections</h3>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', color: '#6E6E73', fontSize: '0.95rem' }}>
                <li>✕ Spraying 500 unverified resumes into ATS black boxes</li>
                <li>✕ Zero feedback on actual technical discrepancies</li>
                <li>✕ Imposter syndrome before technical rounds</li>
                <li>✕ Guesswork on what companies really look for</li>
              </ul>
            </div>

            <div className="apple-card" style={{ padding: '2rem', border: '1.5px solid var(--accent-blue)', boxShadow: '0 8px 30px rgba(0, 113, 227, 0.12)' }}>
              <div style={{ color: '#0071E3', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.8rem' }}>SmartHire X Engine</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.8rem' }}>Verifiable Preparedness</h3>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', color: '#1D1D1F', fontSize: '0.95rem' }}>
                <li>✓ Career DNA maps verified code against target Job Twin</li>
                <li>✓ Resume Truth Checker audits claims against GitHub</li>
                <li>✓ AI mock simulator conditions real-time oral delivery</li>
                <li>✓ Targeted daily missions eliminate exact skill gaps</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. CAREER DNA SECTION 🧬
          ========================================================================= */}
      <section id="career-dna" style={{ padding: '8rem 1.5rem', backgroundColor: '#FFFFFF' }}>
        <div className="container-max">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <span className="badge-pill badge-blue" style={{ marginBottom: '1rem' }}>
              <Dna size={14} /> Foundational Intelligence
            </span>
            <h2 className="section-title" style={{ marginBottom: '1rem' }}>
              Your career has a DNA.
            </h2>
            <p className="section-subtitle" style={{ margin: '0 auto' }}>
              A living profile built from what you know, what you've built, and what you can prove.
            </p>
          </div>

          {/* Interactive Career DNA Tree Graph */}
          <div
            style={{
              maxWidth: '900px',
              margin: '0 auto',
              backgroundColor: '#F5F5F7',
              borderRadius: '28px',
              padding: '3.5rem 2rem',
              position: 'relative',
              boxShadow: 'inset 0 0 40px rgba(0, 0, 0, 0.02)'
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2.5rem' }}>
              {/* Node 1: Skills */}
              <div style={{ backgroundColor: '#1D1D1F', color: '#FFFFFF', padding: '0.9rem 2rem', borderRadius: '999px', fontWeight: 600, boxShadow: '0 8px 25px rgba(0,0,0,0.15)', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Cpu size={18} color="#0071E3" />
                <span>SKILLS (Java, Spring Boot, React, SQL)</span>
              </div>

              <div style={{ width: '2px', height: '40px', backgroundColor: '#C7C7CC' }}></div>

              {/* Node 2: Projects & Evidence */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '3rem', width: '100%', flexWrap: 'wrap' }}>
                <div style={{ backgroundColor: '#FFFFFF', padding: '1.2rem 1.8rem', borderRadius: '18px', border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.8rem', color: '#6E6E73', textTransform: 'uppercase', fontWeight: 600 }}>PROJECTS</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#1D1D1F' }}>3 Verified Repos</div>
                  <div style={{ fontSize: '0.85rem', color: '#10B981', marginTop: '0.2rem' }}>Sub-20ms Latency</div>
                </div>

                <div style={{ backgroundColor: '#FFFFFF', padding: '1.2rem 1.8rem', borderRadius: '18px', border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.8rem', color: '#6E6E73', textTransform: 'uppercase', fontWeight: 600 }}>EVIDENCE</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#8656EF' }}>84% Proven Strength</div>
                  <div style={{ fontSize: '0.85rem', color: '#8656EF', marginTop: '0.2rem' }}>GitHub + Test Proof</div>
                </div>
              </div>

              <div style={{ width: '2px', height: '40px', backgroundColor: '#C7C7CC' }}></div>

              {/* Node 3: Experience */}
              <div style={{ backgroundColor: '#1D1D1F', color: '#FFFFFF', padding: '0.9rem 2rem', borderRadius: '999px', fontWeight: 600, boxShadow: '0 8px 25px rgba(0,0,0,0.15)', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Award size={18} color="#10B981" />
                <span>EXPERIENCE & CAPSTONE PRODUCTION VERIFICATION</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. JOB TWIN SECTION 🎯 (Dark Cinematic)
          ========================================================================= */}
      <section id="job-twin" className="cinematic-section">
        <div className="container-max">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <span className="badge-pill badge-dark" style={{ marginBottom: '1rem' }}>
              <Target size={14} color="#0071E3" /> Industry Demand Simulation
            </span>
            <h2 className="section-title hero-title-dark" style={{ marginBottom: '1rem' }}>
              Meet your Job Twin.
            </h2>
            <p className="section-subtitle" style={{ color: '#A1A1A6', margin: '0 auto' }}>
              Before you apply, understand exactly what the role demands.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
            {/* Target Role Demands */}
            <div className="apple-card-dark">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 600 }}>JAVA FULL STACK BENCHMARK</h3>
                <span className="badge-pill badge-blue">Role Demand</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[
                  { name: 'Java', req: 95 },
                  { name: 'Spring Boot', req: 90 },
                  { name: 'SQL', req: 85 },
                  { name: 'React', req: 82 },
                  { name: 'Docker', req: 65 },
                  { name: 'System Design', req: 60 }
                ].map((item) => (
                  <div key={item.name}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', marginBottom: '0.35rem' }}>
                      <span>{item.name}</span>
                      <span style={{ color: '#0071E3', fontWeight: 600 }}>{item.req}%</span>
                    </div>
                    <div style={{ height: '7px', backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '999px', overflow: 'hidden' }}>
                      <div style={{ width: `${item.req}%`, height: '100%', backgroundColor: '#0071E3', borderRadius: '999px' }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Candidate Match Breakdown */}
            <div className="apple-card-dark" style={{ border: '1.5px solid rgba(0, 113, 227, 0.4)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 600 }}>YOUR VERIFIED PROFILE</h3>
                <span className="badge-pill badge-success">92% Match</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[
                  { name: 'Java', actual: 90, status: '✓ Verified' },
                  { name: 'Spring Boot', actual: 88, status: '✓ Verified' },
                  { name: 'SQL', actual: 85, status: '✓ Verified' },
                  { name: 'React', actual: 85, status: '✓ Strong' },
                  { name: 'Docker', actual: 65, status: '⚠ Gap Bridgeable' },
                  { name: 'System Design', actual: 60, status: '✓ Foundation' }
                ].map((item) => (
                  <div key={item.name}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', marginBottom: '0.35rem' }}>
                      <span>{item.name} <small style={{ color: item.status.includes('✓') ? '#10B981' : '#F59E0B' }}>{item.status}</small></span>
                      <span style={{ color: '#FFFFFF', fontWeight: 600 }}>{item.actual}%</span>
                    </div>
                    <div style={{ height: '7px', backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '999px', overflow: 'hidden' }}>
                      <div style={{ width: `${item.actual}%`, height: '100%', background: 'linear-gradient(90deg, #0071E3, #8656EF)', borderRadius: '999px' }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          5. READINESS ENGINE SECTION (Large Dark Cinematic)
          ========================================================================= */}
      <section id="readiness" style={{ backgroundColor: '#000000', color: '#FFFFFF', padding: '8rem 1.5rem', textAlign: 'center' }}>
        <div className="container-max">
          <span className="badge-pill badge-dark" style={{ marginBottom: '1.2rem' }}>
            5-Pillar Evaluation
          </span>
          <h2 className="section-title" style={{ color: '#FFFFFF', marginBottom: '4rem' }}>
            Are you actually ready?
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '4rem' }}>
            <div
              style={{
                width: '220px',
                height: '220px',
                borderRadius: '50%',
                background: 'radial-gradient(circle at 30% 30%, #1D1D22 0%, #000000 100%)',
                border: '1px solid rgba(255, 255, 255, 0.18)',
                boxShadow: '0 0 60px rgba(0, 113, 227, 0.45)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <span style={{ fontSize: '4.8rem', fontWeight: 800, letterSpacing: '-0.05em', lineHeight: 1 }}>84%</span>
              <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#A1A1A6', marginTop: '0.4rem' }}>
                CAREER READINESS
              </span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.5rem', maxWidth: '1000px', margin: '0 auto' }}>
            {[
              { label: 'Skills', score: 89, color: '#0071E3' },
              { label: 'Evidence', score: 82, color: '#8656EF' },
              { label: 'Projects', score: 91, color: '#06B6D4' },
              { label: 'Interview', score: 76, color: '#F59E0B' },
              { label: 'Experience', score: 65, color: '#10B981' }
            ].map((pillar) => (
              <div key={pillar.label} style={{ backgroundColor: '#111113', borderRadius: '20px', padding: '1.6rem 1rem', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ fontSize: '2.4rem', fontWeight: 700, color: pillar.color, marginBottom: '0.2rem' }}>
                  {pillar.score}%
                </div>
                <div style={{ fontSize: '0.9rem', color: '#A1A1A6' }}>{pillar.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          6. WHAT-IF SIMULATOR SECTION (Interactive)
          ========================================================================= */}
      <section id="what-if" style={{ padding: '8rem 1.5rem', backgroundColor: '#FFFFFF' }}>
        <div className="container-narrow" style={{ textAlign: 'center' }}>
          <span className="badge-pill badge-blue" style={{ marginBottom: '1rem' }}>
            <SlidersHorizontal size={14} /> Interactive Projection
          </span>
          <h2 className="section-title" style={{ marginBottom: '1rem' }}>
            What if you learned one more skill?
          </h2>
          <p className="section-subtitle" style={{ margin: '0 auto 3rem' }}>
            Simulate your readiness increase when adding high-leverage skills to your verified profile.
          </p>

          <div
            style={{
              backgroundColor: '#F5F5F7',
              borderRadius: '28px',
              padding: '3rem 2rem',
              border: '1px solid rgba(0,0,0,0.06)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.04)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2rem', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontSize: '0.85rem', color: '#6E6E73', textTransform: 'uppercase', fontWeight: 600 }}>CURRENT</div>
                <div style={{ fontSize: '2.5rem', fontWeight: 700, color: '#6E6E73' }}>72%</div>
              </div>

              <ArrowRight size={32} color="#86868B" />

              <div>
                <div style={{ fontSize: '0.85rem', color: '#0071E3', textTransform: 'uppercase', fontWeight: 600 }}>PROJECTED</div>
                <div style={{ fontSize: '3.5rem', fontWeight: 800, color: '#0071E3', letterSpacing: '-0.04em' }}>
                  {simulatedScore}%
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.8rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
              {Object.keys(skillValues).map((skill) => {
                const active = selectedSkills.includes(skill);
                return (
                  <button
                    key={skill}
                    onClick={() => toggleSkill(skill)}
                    style={{
                      padding: '0.7rem 1.4rem',
                      borderRadius: '999px',
                      border: active ? '1.5px solid #0071E3' : '1px solid rgba(0,0,0,0.12)',
                      backgroundColor: active ? '#0071E3' : '#FFFFFF',
                      color: active ? '#FFFFFF' : '#1D1D1F',
                      fontWeight: 600,
                      cursor: 'pointer',
                      fontSize: '0.95rem',
                      boxShadow: active ? '0 4px 14px var(--accent-blue-glow)' : 'none',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {active ? `✓ ${skill}` : `+ ${skill}`} (+{skillValues[skill]}%)
                  </button>
                );
              })}
            </div>

            <p style={{ fontSize: '0.9rem', color: '#6E6E73', maxWidth: '580px', margin: '0 auto', fontStyle: 'italic' }}>
              * Estimated improvement based on your target role and current profile. Clearly labeled as a heuristic projection.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          7. PROOF OF SKILL SECTION
          ========================================================================= */}
      <section style={{ padding: '8rem 1.5rem', backgroundColor: '#F5F5F7' }}>
        <div className="container-narrow">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span className="badge-pill badge-dark" style={{ marginBottom: '1rem' }}>
              <Shield size={14} color="#10B981" /> No Black Boxes
            </span>
            <h2 className="section-title" style={{ marginBottom: '1rem' }}>
              Don't tell recruiters.<br />Show them.
            </h2>
            <p className="section-subtitle" style={{ margin: '0 auto' }}>
              SmartHire replaces unverified resume claims with multi-source verified evidence.
            </p>
          </div>

          <div className="apple-card" style={{ maxWidth: '650px', margin: '0 auto', padding: '2.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid rgba(0,0,0,0.08)', paddingBottom: '1.2rem' }}>
              <div>
                <h3 style={{ fontSize: '1.6rem', fontWeight: 800 }}>JAVA</h3>
                <span style={{ fontSize: '0.85rem', color: '#6E6E73' }}>Verified Skill Matrix</span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.8rem', color: '#86868B', textTransform: 'uppercase' }}>Evidence Strength</div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#10B981' }}>84%</div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              {[
                { label: 'Claim', val: 90, color: '#1D1D1F' },
                { label: 'Adaptive Assessment', val: 82, color: '#0071E3' },
                { label: 'Project Evidence', val: 91, color: '#8656EF' },
                { label: 'GitHub Evidence', val: 78, color: '#06B6D4' },
                { label: 'AI Mock Interview', val: 74, color: '#F59E0B' }
              ].map((row) => (
                <div key={row.label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.92rem', marginBottom: '0.35rem' }}>
                    <span style={{ fontWeight: 500 }}>{row.label}</span>
                    <span style={{ fontWeight: 700, color: row.color }}>{row.val}%</span>
                  </div>
                  <div style={{ height: '8px', backgroundColor: '#E8E8ED', borderRadius: '999px', overflow: 'hidden' }}>
                    <div style={{ width: `${row.val}%`, height: '100%', backgroundColor: row.color, borderRadius: '999px' }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          8. DAILY MISSIONS PREVIEW (Apple Fitness Style)
          ========================================================================= */}
      <section style={{ padding: '8rem 1.5rem', backgroundColor: '#FFFFFF' }}>
        <div className="container-narrow" style={{ textAlign: 'center' }}>
          <span className="badge-pill badge-warning" style={{ marginBottom: '1rem' }}>
            <Flame size={14} /> Active Daily Habit
          </span>
          <h2 className="section-title" style={{ marginBottom: '1rem' }}>
            Close gaps with Daily Career Missions.
          </h2>
          <p className="section-subtitle" style={{ margin: '0 auto 3.5rem' }}>
            Micro-tasks that directly build proof-of-skill and boost your readiness points.
          </p>

          <div
            className="apple-card"
            style={{
              maxWidth: '520px',
              margin: '0 auto',
              padding: '2.5rem',
              textAlign: 'left',
              border: missionDone ? '2px solid #10B981' : '1px solid rgba(0,0,0,0.08)',
              transition: 'all 0.3s ease'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span className="badge-pill badge-blue">TODAY'S MISSION</span>
              <span style={{ fontSize: '0.85rem', color: '#6E6E73' }}>25 min</span>
            </div>

            <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              Build a Spring Boot REST API
            </h3>
            <p style={{ fontSize: '0.95rem', color: '#6E6E73', marginBottom: '1.5rem' }}>
              Implement an authenticated endpoint with role authorization and push code to your verified repository.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: '1.2rem' }}>
              <div>
                <span style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0071E3' }}>+4 Readiness Points</span>
                <div style={{ fontSize: '0.8rem', color: '#86868B' }}>
                  {missionDone ? 'Spring Boot Evidence: 65% → 70%' : 'Direct proof boost'}
                </div>
              </div>

              <button
                onClick={handleCompleteMission}
                className={missionDone ? 'btn-apple' : 'btn-apple btn-apple-primary'}
                style={{
                  backgroundColor: missionDone ? '#10B981' : undefined,
                  color: '#FFFFFF'
                }}
              >
                {missionDone ? '✓ Mission Complete' : 'Start Mission'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          9. CINEMATIC CALL TO ACTION
          ========================================================================= */}
      <section style={{ backgroundColor: '#0B0B0D', color: '#FFFFFF', padding: '10rem 1.5rem', textAlign: 'center' }}>
        <div className="container-narrow">
          <h2 className="section-title" style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.1, marginBottom: '1.5rem' }}>
            Your next opportunity starts before you apply.
          </h2>
          <p style={{ fontSize: '1.25rem', color: '#A1A1A6', maxWidth: '640px', margin: '0 auto 3rem' }}>
            Join thousands of modern developers turning verifiable proof into tier-1 technology offers.
          </p>
          <button
            onClick={handleLaunchApp}
            className="btn-apple btn-apple-dark"
            style={{ fontSize: '1.2rem', padding: '1.1rem 2.8rem' }}
          >
            <span>Build Your Career Profile</span>
            <ArrowRight size={20} />
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
