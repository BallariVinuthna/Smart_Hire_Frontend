import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Compass, ShieldCheck, Briefcase, GraduationCap, LogOut, ChevronDown, User } from 'lucide-react';

export default function Navbar() {
  const { user, logout, demoLogin } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [demoMenuOpen, setDemoMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleDemo = async (role) => {
    setDemoMenuOpen(false);
    try {
      await demoLogin(role);
    } catch (err) {
      console.warn("Backend auth offline or lagging, initializing local demo session:", err);
      let email = 'student@smarthire.ai';
      let fullName = 'Ballari Vinuthna';
      let r = 'ROLE_STUDENT';
      if (role === 'RECRUITER') { email = 'recruiter@google.com'; fullName = 'Sarah Vance'; r = 'ROLE_RECRUITER'; }
      if (role === 'PLACEMENT') { email = 'placement@university.edu'; fullName = 'Dr. K. Ramanathan'; r = 'ROLE_PLACEMENT_OFFICER'; }
      if (role === 'ADMIN') { email = 'admin@smarthire.ai'; fullName = 'SmartHire System Admin'; r = 'ROLE_ADMIN'; }
      const fakeToken = "eyJhbGciOiJIUzUxMiJ9.demo";
      localStorage.setItem('smarthire_token', fakeToken);
      localStorage.setItem('smarthire_user', JSON.stringify({ id: 1, email, fullName, role: r, profileId: 1 }));
    }
    if (role === 'RECRUITER') navigate('/recruiter/dashboard');
    else if (role === 'PLACEMENT') navigate('/placement/dashboard');
    else if (role === 'ADMIN') navigate('/admin/dashboard');
    else navigate('/student/dashboard');
  };

  const handleNav = (sectionId, routePath) => {
    if (location.pathname === '/') {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    navigate(routePath);
  };

  const isDarkSection = location.pathname === '/student/readiness' || location.pathname === '/student/interviews';

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: scrolled ? '0.75rem 2rem' : '1.1rem 2rem',
        backgroundColor: scrolled
          ? isDarkSection ? 'rgba(11, 11, 13, 0.85)' : 'rgba(255, 255, 255, 0.82)'
          : 'transparent',
        backdropFilter: scrolled ? 'blur(20px) saturate(180%)' : 'none',
        borderBottom: scrolled ? `1px solid ${isDarkSection ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'}` : 'none',
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        color: isDarkSection ? '#FFFFFF' : '#1D1D1F'
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', textDecoration: 'none', color: 'inherit' }}>
          <div
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '9px',
              background: 'linear-gradient(135deg, #0071E3 0%, #8656EF 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(0, 113, 227, 0.3)'
            }}
          >
            <Sparkles size={18} color="#FFFFFF" />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.2rem' }}>
            <span style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.03em' }}>SmartHire</span>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0071E3' }}>X</span>
          </div>
        </Link>

        {/* Navigation Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }} className="desktop-links">
          <button onClick={() => handleNav('career-dna', '/student/career-dna')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', fontSize: '0.92rem', opacity: 0.85, padding: 0, fontFamily: 'inherit' }}>Career DNA</button>
          <button onClick={() => handleNav('job-twin', '/student/job-twin')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', fontSize: '0.92rem', opacity: 0.85, padding: 0, fontFamily: 'inherit' }}>Job Twin</button>
          <button onClick={() => handleNav('readiness', '/student/readiness')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', fontSize: '0.92rem', opacity: 0.85, padding: 0, fontFamily: 'inherit' }}>Readiness Engine</button>
          <Link to="/recruiter/ai-assistant" style={{ textDecoration: 'none', color: '#0071E3', fontWeight: 600, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem', backgroundColor: 'rgba(0, 113, 227, 0.09)', padding: '0.35rem 0.85rem', borderRadius: '20px', border: '1px solid rgba(0, 113, 227, 0.25)', boxShadow: '0 2px 8px rgba(0, 113, 227, 0.12)' }}>
            <Sparkles size={14} />
            <span>AI Assistant (RAG)</span>
          </Link>
          <Link to="/placement/dashboard" style={{ textDecoration: 'none', color: 'inherit', fontSize: '0.92rem', opacity: 0.85 }}>For Universities</Link>
          <Link to="/recruiter/dashboard" style={{ textDecoration: 'none', color: 'inherit', fontSize: '0.92rem', opacity: 0.85 }}>For Recruiters</Link>
        </div>

        {/* Action Controls & User Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          {/* Quick Demo Switcher Modal Trigger */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setDemoMenuOpen(!demoMenuOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.5rem 0.9rem',
                borderRadius: '999px',
                border: isDarkSection ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid rgba(0, 0, 0, 0.10)',
                backgroundColor: isDarkSection ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
                color: 'inherit',
                fontSize: '0.82rem',
                cursor: 'pointer',
                fontWeight: 500
              }}
            >
              <Sparkles size={14} color="#0071E3" />
              <span>Demo Personas</span>
              <ChevronDown size={14} />
            </button>

            {demoMenuOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: '120%',
                  right: 0,
                  width: '240px',
                  backgroundColor: '#FFFFFF',
                  color: '#1D1D1F',
                  borderRadius: '16px',
                  padding: '0.5rem',
                  boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
                  border: '1px solid rgba(0, 0, 0, 0.08)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.2rem',
                  zIndex: 200
                }}
              >
                <div style={{ padding: '0.4rem 0.75rem', fontSize: '0.75rem', color: '#86868B', fontWeight: 600, textTransform: 'uppercase' }}>
                  Instant Persona Switch
                </div>
                <button
                  onClick={() => handleDemo('STUDENT')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    padding: '0.6rem 0.75rem',
                    border: 'none',
                    background: 'none',
                    textAlign: 'left',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontSize: '0.85rem'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F5F5F7'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <User size={16} color="#0071E3" />
                  <div>
                    <div style={{ fontWeight: 600 }}>Student (Ballari)</div>
                    <div style={{ fontSize: '0.75rem', color: '#6E6E73' }}>84% Readiness Persona</div>
                  </div>
                </button>
                <button
                  onClick={() => handleDemo('RECRUITER')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    padding: '0.6rem 0.75rem',
                    border: 'none',
                    background: 'none',
                    textAlign: 'left',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontSize: '0.85rem'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F5F5F7'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <Briefcase size={16} color="#8656EF" />
                  <div>
                    <div style={{ fontWeight: 600 }}>Recruiter (Sarah Vance)</div>
                    <div style={{ fontSize: '0.75rem', color: '#6E6E73' }}>Talent Intelligence Matrix</div>
                  </div>
                </button>
                <button
                  onClick={() => handleDemo('PLACEMENT')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    padding: '0.6rem 0.75rem',
                    border: 'none',
                    background: 'none',
                    textAlign: 'left',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontSize: '0.85rem'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F5F5F7'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <GraduationCap size={16} color="#10B981" />
                  <div>
                    <div style={{ fontWeight: 600 }}>Placement Officer</div>
                    <div style={{ fontSize: '0.75rem', color: '#6E6E73' }}>Batch 2027 Analytics</div>
                  </div>
                </button>
                <button
                  onClick={() => handleDemo('ADMIN')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    padding: '0.6rem 0.75rem',
                    border: 'none',
                    background: 'none',
                    textAlign: 'left',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontSize: '0.85rem'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F5F5F7'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <ShieldCheck size={16} color="#F59E0B" />
                  <div>
                    <div style={{ fontWeight: 600 }}>System Admin</div>
                    <div style={{ fontSize: '0.75rem', color: '#6E6E73' }}>AI Inferences & Audits</div>
                  </div>
                </button>
              </div>
            )}
          </div>

          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Link
                to={user.role === 'ROLE_RECRUITER' ? '/recruiter/dashboard' : user.role === 'ROLE_PLACEMENT_OFFICER' ? '/placement/dashboard' : user.role === 'ROLE_ADMIN' ? '/admin/dashboard' : '/student/dashboard'}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.5rem 1.1rem',
                  borderRadius: '999px',
                  backgroundColor: '#0071E3',
                  color: '#FFFFFF',
                  textDecoration: 'none',
                  fontSize: '0.88rem',
                  fontWeight: 500
                }}
              >
                <span>Dashboard</span>
              </Link>
              <button
                onClick={logout}
                title="Sign Out"
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'inherit',
                  cursor: 'pointer',
                  opacity: 0.7,
                  padding: '0.4rem',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Link
                to="/login"
                style={{
                  textDecoration: 'none',
                  color: 'inherit',
                  fontSize: '0.88rem',
                  padding: '0.5rem 0.9rem',
                  fontWeight: 500
                }}
              >
                Sign In
              </Link>
              <Link
                to="/register"
                style={{
                  textDecoration: 'none',
                  backgroundColor: '#0071E3',
                  color: '#FFFFFF',
                  fontSize: '0.88rem',
                  fontWeight: 500,
                  padding: '0.5rem 1.15rem',
                  borderRadius: '999px',
                  boxShadow: '0 4px 14px rgba(0, 113, 227, 0.3)'
                }}
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
