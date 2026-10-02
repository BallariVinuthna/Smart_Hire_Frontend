import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Briefcase, Plus, CheckCircle2, ArrowRight } from 'lucide-react';

export default function RecruiterJobs() {
  const [jobs, setJobs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newJob, setNewJob] = useState({
    title: '',
    location: 'Bengaluru / Hybrid',
    workType: 'Hybrid',
    salaryRange: '18 - 24 LPA',
    experienceRequired: '0-2 Years',
    skillsRequired: 'Java, Spring Boot, SQL, Docker',
    minReadinessScore: 80,
    description: '',
    requirements: ''
  });

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = () => {
    api.getJobs().then(setJobs).catch(console.error);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.createJob(newJob);
      setShowModal(false);
      loadJobs();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="section-title">Manage Job Openings</h1>
          <p className="section-subtitle">Set verified readiness benchmarks and skill twin weights for each opening.</p>
        </div>

        <button onClick={() => setShowModal(true)} className="btn-apple btn-apple-primary">
          <Plus size={16} />
          <span>Post New Benchmark Job</span>
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {jobs.map((job) => (
          <div key={job.id} className="apple-card" style={{ padding: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
                <span className="badge-pill badge-blue">{job.workType}</span>
                <span style={{ fontSize: '0.85rem', color: '#6E6E73' }}>Min Readiness: {job.minReadinessScore}%</span>
              </div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#1D1D1F' }}>{job.title}</h3>
              <p style={{ fontSize: '0.88rem', color: '#6E6E73', marginTop: '0.2rem' }}>
                {job.location} • {job.salaryRange} • Required Skills: {job.skillsRequired}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <span className="badge-pill badge-success">Status: ACTIVE</span>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: '1.5rem' }}>
          <div className="apple-card" style={{ maxWidth: '600px', width: '100%', padding: '2.5rem', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '1.5rem' }}>Create Job Twin Benchmark</h2>
            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <div>
                <label className="apple-label">Job Title</label>
                <input className="apple-input" value={newJob.title} onChange={e => setNewJob({...newJob, title: e.target.value})} required />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="apple-label">Location</label>
                  <input className="apple-input" value={newJob.location} onChange={e => setNewJob({...newJob, location: e.target.value})} />
                </div>
                <div>
                  <label className="apple-label">Salary Range</label>
                  <input className="apple-input" value={newJob.salaryRange} onChange={e => setNewJob({...newJob, salaryRange: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="apple-label">Required Skills (Comma separated)</label>
                <input className="apple-input" value={newJob.skillsRequired} onChange={e => setNewJob({...newJob, skillsRequired: e.target.value})} />
              </div>
              <div>
                <label className="apple-label">Min Career Readiness Score (%)</label>
                <input type="number" className="apple-input" value={newJob.minReadinessScore} onChange={e => setNewJob({...newJob, minReadinessScore: Number(e.target.value)})} />
              </div>
              <div>
                <label className="apple-label">Role Description</label>
                <textarea className="apple-input" rows={3} value={newJob.description} onChange={e => setNewJob({...newJob, description: e.target.value})} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.8rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn-apple btn-apple-secondary">Cancel</button>
                <button type="submit" className="btn-apple btn-apple-primary">Publish Role</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
