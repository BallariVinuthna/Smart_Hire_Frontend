import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Sparkles, ArrowRight, User, Briefcase, GraduationCap, ShieldCheck } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('student@smarthire.ai');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, demoLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const user = await login(email, password);
      redirectUser(user.role);
    } catch (err) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = async (role) => {
    setLoading(true);
    setError('');
    try {
      const user = await demoLogin(role);
      redirectUser(user.role);
    } catch (err) {
      setError(err.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  const redirectUser = (role) => {
    if (role === 'ROLE_RECRUITER') navigate('/recruiter/dashboard');
    else if (role === 'ROLE_PLACEMENT_OFFICER') navigate('/placement/dashboard');
    else if (role === 'ROLE_ADMIN') navigate('/admin/dashboard');
    else navigate('/student/dashboard');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#FBFBFD' }}>
      <Navbar />

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '6rem 1.5rem' }}>
        <div style={{ width: '100%', maxWidth: '440px' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'linear-gradient(135deg, #0071E3 0%, #8656EF 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.2rem', boxShadow: '0 8px 24px rgba(0, 113, 227, 0.3)' }}>
              <Sparkles size={24} color="#FFFFFF" />
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '0.5rem' }}>
              Sign in to SmartHire X
            </h1>
            <p style={{ color: '#6E6E73', fontSize: '0.95rem' }}>
              Your career readiness intelligence hub.
            </p>
          </div>

          <div className="apple-card" style={{ padding: '2.5rem 2rem', marginBottom: '1.5rem' }}>
            {error && (
              <div style={{ backgroundColor: '#FEE2E2', color: '#B91C1C', padding: '0.8rem 1rem', borderRadius: '10px', fontSize: '0.88rem', marginBottom: '1.5rem' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <div>
                <label className="apple-label">Email Address</label>
                <input
                  type="email"
                  className="apple-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="apple-label">Password</label>
                <input
                  type="password"
                  className="apple-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-apple btn-apple-primary"
                style={{ width: '100%', padding: '0.9rem', marginTop: '0.5rem' }}
              >
                <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
                <ArrowRight size={18} />
              </button>
            </form>

            <div style={{ position: 'relative', textAlign: 'center', margin: '2rem 0 1.5rem' }}>
              <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '1px', backgroundColor: '#E5E5EA' }}></div>
              <span style={{ position: 'relative', backgroundColor: '#FFFFFF', padding: '0 0.8rem', color: '#8E8E93', fontSize: '0.78rem', textTransform: 'uppercase', fontWeight: 600 }}>
                One-Click Demo Personas
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
              <button
                type="button"
                onClick={() => handleDemo('STUDENT')}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 0.8rem', borderRadius: '10px', border: '1px solid rgba(0,0,0,0.1)', background: '#F5F5F7', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', textAlign: 'left' }}
              >
                <User size={15} color="#0071E3" />
                <span>Student (84%)</span>
              </button>

              <button
                type="button"
                onClick={() => handleDemo('RECRUITER')}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 0.8rem', borderRadius: '10px', border: '1px solid rgba(0,0,0,0.1)', background: '#F5F5F7', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', textAlign: 'left' }}
              >
                <Briefcase size={15} color="#8656EF" />
                <span>Recruiter</span>
              </button>

              <button
                type="button"
                onClick={() => handleDemo('PLACEMENT')}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 0.8rem', borderRadius: '10px', border: '1px solid rgba(0,0,0,0.1)', background: '#F5F5F7', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', textAlign: 'left' }}
              >
                <GraduationCap size={15} color="#10B981" />
                <span>Placement</span>
              </button>

              <button
                type="button"
                onClick={() => handleDemo('ADMIN')}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 0.8rem', borderRadius: '10px', border: '1px solid rgba(0,0,0,0.1)', background: '#F5F5F7', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', textAlign: 'left' }}
              >
                <ShieldCheck size={15} color="#F59E0B" />
                <span>Admin</span>
              </button>
            </div>
          </div>

          <div style={{ textAlign: 'center', fontSize: '0.9rem', color: '#6E6E73' }}>
            New to SmartHire X?{' '}
            <Link to="/register" style={{ color: '#0071E3', fontWeight: 600, textDecoration: 'none' }}>
              Create an account
            </Link>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
}
