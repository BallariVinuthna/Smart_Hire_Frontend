import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function Register() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'ROLE_STUDENT',
    university: 'National Institute of Technology',
    batchYear: 2027,
    targetRole: 'Java Full Stack Engineer',
    companyName: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const user = await register(formData);
      if (user.role === 'ROLE_RECRUITER') navigate('/recruiter/dashboard');
      else if (user.role === 'ROLE_PLACEMENT_OFFICER') navigate('/placement/dashboard');
      else navigate('/student/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#FBFBFD' }}>
      <Navbar />

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '6rem 1.5rem' }}>
        <div style={{ width: '100%', maxWidth: '520px' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'linear-gradient(135deg, #0071E3 0%, #8656EF 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.2rem', boxShadow: '0 8px 24px rgba(0, 113, 227, 0.3)' }}>
              <Sparkles size={24} color="#FFFFFF" />
            </div>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '0.5rem' }}>
              Create Your Career Profile
            </h1>
            <p style={{ color: '#6E6E73', fontSize: '1rem' }}>
              Become job-ready with verifiable proof-of-skill.
            </p>
          </div>

          <div className="apple-card" style={{ padding: '2.5rem' }}>
            {error && (
              <div style={{ backgroundColor: '#FEE2E2', color: '#B91C1C', padding: '0.8rem 1rem', borderRadius: '10px', fontSize: '0.88rem', marginBottom: '1.5rem' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <div>
                <label className="apple-label">I am a</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: 'ROLE_STUDENT' })}
                    style={{
                      padding: '0.7rem',
                      borderRadius: '10px',
                      border: formData.role === 'ROLE_STUDENT' ? '1.5px solid #0071E3' : '1px solid rgba(0,0,0,0.1)',
                      backgroundColor: formData.role === 'ROLE_STUDENT' ? 'rgba(0,113,227,0.08)' : '#FFFFFF',
                      color: formData.role === 'ROLE_STUDENT' ? '#0071E3' : '#1D1D1F',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Student / Candidate
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: 'ROLE_RECRUITER' })}
                    style={{
                      padding: '0.7rem',
                      borderRadius: '10px',
                      border: formData.role === 'ROLE_RECRUITER' ? '1.5px solid #0071E3' : '1px solid rgba(0,0,0,0.1)',
                      backgroundColor: formData.role === 'ROLE_RECRUITER' ? 'rgba(0,113,227,0.08)' : '#FFFFFF',
                      color: formData.role === 'ROLE_RECRUITER' ? '#0071E3' : '#1D1D1F',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Recruiter
                  </button>
                </div>
              </div>

              <div>
                <label className="apple-label">Full Name</label>
                <input
                  type="text"
                  className="apple-input"
                  placeholder="Ballari Vinuthna"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="apple-label">Email Address</label>
                <input
                  type="email"
                  className="apple-input"
                  placeholder="student@smarthire.ai"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="apple-label">Password</label>
                <input
                  type="password"
                  className="apple-input"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>

              {formData.role === 'ROLE_STUDENT' ? (
                <>
                  <div>
                    <label className="apple-label">Target Role</label>
                    <input
                      type="text"
                      className="apple-input"
                      placeholder="Java Full Stack Engineer"
                      value={formData.targetRole}
                      onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="apple-label">University / College</label>
                    <input
                      type="text"
                      className="apple-input"
                      value={formData.university}
                      onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                    />
                  </div>
                </>
              ) : (
                <div>
                  <label className="apple-label">Company Name</label>
                  <input
                    type="text"
                    className="apple-input"
                    placeholder="Apex Systems"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    required
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-apple btn-apple-primary"
                style={{ width: '100%', padding: '0.95rem', marginTop: '0.6rem' }}
              >
                <span>{loading ? 'Creating Profile...' : 'Build My Profile'}</span>
                <ArrowRight size={18} />
              </button>
            </form>
          </div>

          <div style={{ textAlign: 'center', fontSize: '0.9rem', color: '#6E6E73', marginTop: '1.5rem' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#0071E3', fontWeight: 600, textDecoration: 'none' }}>
              Sign in
            </Link>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
}
