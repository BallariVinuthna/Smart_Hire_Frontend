import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import confetti from 'canvas-confetti';
import { Briefcase, Search, MapPin, DollarSign, CheckCircle2, AlertTriangle, ArrowRight, X, Sparkles } from 'lucide-react';

export default function JobSearch() {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Smart Pre-Apply Modal State
  const [activeJob, setActiveJob] = useState(null);
  const [preCheck, setPreCheck] = useState(null);
  const [coverNote, setCoverNote] = useState('');
  const [applying, setApplying] = useState(false);
  const [appliedSuccess, setAppliedSuccess] = useState(false);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async (term = '') => {
    try {
      setLoading(true);
      const data = await api.getJobs(term);
      setJobs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadJobs(search);
  };

  const handleOpenApplyModal = async (job) => {
    setActiveJob(job);
    setAppliedSuccess(false);
    try {
      const check = await api.preApplyCheck(job.id);
      setPreCheck(check);
    } catch (err) {
      console.error(err);
    }
  };

  const handleConfirmApply = async () => {
    if (!activeJob) return;
    setApplying(true);
    try {
      await api.applyToJob(activeJob.id, coverNote);
      setAppliedSuccess(true);
      confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
    } catch (err) {
      console.error(err);
    } finally {
      setApplying(false);
    }
  };

  return (
    <div>
      {/* Header & Search Bar */}
      <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 3rem' }}>
        <span className="badge-pill badge-blue" style={{ marginBottom: '1rem' }}>
          <Briefcase size={14} /> Intelligent Role Matching
        </span>
        <h1 className="section-title" style={{ marginBottom: '0.8rem' }}>
          Explore roles that fit you.
        </h1>
        <p className="section-subtitle" style={{ margin: '0 auto 2rem' }}>
          Real-time match scoring comparing your verified evidence to company technical demands.
        </p>

        {/* Apple-style search box */}
        <form onSubmit={handleSearchSubmit} style={{ position: 'relative', maxWidth: '540px', margin: '0 auto' }}>
          <input
            type="text"
            className="apple-input"
            placeholder="Search by title or tech stack (e.g. Java, React, Cloud)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: '3rem', borderRadius: '999px', height: '52px' }}
          />
          <Search size={18} color="#86868B" style={{ position: 'absolute', left: '1.2rem', top: '17px' }} />
        </form>
      </div>

      {/* Jobs List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '5rem', color: '#6E6E73' }}>
          Matching live opportunities to your Career DNA...
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '1000px', margin: '0 auto' }}>
          {jobs.map((job) => (
            <div
              key={job.id}
              className="apple-card"
              style={{
                padding: '2.5rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                flexWrap: 'wrap',
                gap: '2rem'
              }}
            >
              <div style={{ maxWidth: '600px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '1.1rem', fontWeight: 600, color: '#6E6E73' }}>
                    {job.company}
                  </span>
                  <span className="badge-pill badge-blue" style={{ fontSize: '0.75rem' }}>
                    {job.workType}
                  </span>
                </div>

                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1D1D1F', marginBottom: '0.6rem' }}>
                  {job.title}
                </h2>

                <div style={{ display: 'flex', gap: '1.5rem', color: '#6E6E73', fontSize: '0.88rem', marginBottom: '1.2rem', flexWrap: 'wrap' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <MapPin size={15} /> {job.location}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#10B981', fontWeight: 600 }}>
                    <DollarSign size={15} /> {job.salaryRange}
                  </span>
                </div>

                {/* Why breakdown */}
                <div style={{ padding: '1rem', backgroundColor: '#F5F5F7', borderRadius: '14px', fontSize: '0.88rem' }}>
                  <div style={{ fontWeight: 600, color: '#1D1D1F', marginBottom: '0.3rem' }}>
                    Why are you a fit?
                  </div>
                  <p style={{ color: '#48484A', lineHeight: 1.5 }}>
                    {job.whyText}
                  </p>
                </div>
              </div>

              {/* Match Score & Pre-Apply Trigger */}
              <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-between', minHeight: '140px' }}>
                <div>
                  <div style={{ fontSize: '0.78rem', color: '#86868B', textTransform: 'uppercase', fontWeight: 700 }}>
                    YOUR MATCH
                  </div>
                  <div style={{ fontSize: '3rem', fontWeight: 800, color: '#0071E3', letterSpacing: '-0.04em', lineHeight: 1 }}>
                    {job.matchScore}%
                  </div>
                </div>

                <button
                  onClick={() => handleOpenApplyModal(job)}
                  className="btn-apple btn-apple-primary"
                  style={{ fontSize: '0.95rem', padding: '0.75rem 1.6rem' }}
                >
                  <span>View Role & Apply</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Smart Pre-Apply Modal */}
      {activeJob && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(12px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 200,
            padding: '1.5rem'
          }}
        >
          <div
            className="apple-card"
            style={{
              width: '100%',
              maxWidth: '650px',
              padding: '2.5rem',
              maxHeight: '90vh',
              overflowY: 'auto',
              position: 'relative'
            }}
          >
            <button
              onClick={() => setActiveJob(null)}
              style={{
                position: 'absolute',
                top: '1.5rem',
                right: '1.5rem',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#86868B'
              }}
            >
              <X size={20} />
            </button>

            {appliedSuccess ? (
              <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                  <CheckCircle2 size={32} color="#10B981" />
                </div>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.5rem' }}>Application Submitted</h2>
                <p style={{ color: '#6E6E73', fontSize: '0.95rem', marginBottom: '2rem' }}>
                  Your application for {activeJob.title} has been logged with full verified evidence credentials.
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                  <a href="/student/applications" className="btn-apple btn-apple-primary">
                    <span>View in Application Tracker</span>
                    <ArrowRight size={16} />
                  </a>
                </div>
              </div>
            ) : (
              <div>
                <span className="badge-pill badge-blue" style={{ marginBottom: '0.8rem' }}>
                  BEFORE YOU APPLY
                </span>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.2rem' }}>
                  {preCheck?.matchVerdict || "You're a strong match."}
                </h2>
                <p style={{ color: '#6E6E73', fontSize: '0.92rem', marginBottom: '2rem' }}>
                  Applying to <strong>{activeJob.title}</strong> at {activeJob.company}.
                </p>

                {/* Pre-check 4-Stat Row */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.8rem', marginBottom: '2rem', textAlign: 'center' }}>
                  <div style={{ padding: '0.8rem 0.4rem', backgroundColor: '#F5F5F7', borderRadius: '12px' }}>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0071E3' }}>{preCheck?.readinessScore}%</div>
                    <span style={{ fontSize: '0.72rem', color: '#6E6E73' }}>Readiness</span>
                  </div>
                  <div style={{ padding: '0.8rem 0.4rem', backgroundColor: '#F5F5F7', borderRadius: '12px' }}>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#8656EF' }}>{preCheck?.jobMatchScore}%</div>
                    <span style={{ fontSize: '0.72rem', color: '#6E6E73' }}>Job Match</span>
                  </div>
                  <div style={{ padding: '0.8rem 0.4rem', backgroundColor: '#F5F5F7', borderRadius: '12px' }}>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#06B6D4' }}>{preCheck?.resumeMatchScore}%</div>
                    <span style={{ fontSize: '0.72rem', color: '#6E6E73' }}>Resume Match</span>
                  </div>
                  <div style={{ padding: '0.8rem 0.4rem', backgroundColor: '#F5F5F7', borderRadius: '12px' }}>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#F59E0B' }}>{preCheck?.interviewPrepScore}%</div>
                    <span style={{ fontSize: '0.72rem', color: '#6E6E73' }}>Interview Prep</span>
                  </div>
                </div>

                {/* Recommended Actions */}
                <div style={{ marginBottom: '2rem' }}>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.8rem' }}>Recommended Pre-Submission Actions:</div>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.9rem', color: '#2C2C2E' }}>
                    {preCheck?.recommendedActions?.map((action, i) => (
                      <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <CheckCircle2 size={16} color="#10B981" />
                        <span>{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Cover Note */}
                <div style={{ marginBottom: '2rem' }}>
                  <label className="apple-label">Brief Candidate Statement</label>
                  <textarea
                    className="apple-input"
                    rows={3}
                    placeholder="Why my verified Spring Boot and JPA project evidence makes me an exceptional fit..."
                    value={coverNote}
                    onChange={(e) => setCoverNote(e.target.value)}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.8rem' }}>
                  <button onClick={() => setActiveJob(null)} className="btn-apple btn-apple-secondary">
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmApply}
                    disabled={applying}
                    className="btn-apple btn-apple-primary"
                  >
                    <span>{applying ? 'Submitting...' : 'Submit Application'}</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
