import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Building2, Calendar, MapPin, Plus, DollarSign, CheckCircle2 } from 'lucide-react';

export default function PlacementDrives() {
  const [drives, setDrives] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newDrive, setNewDrive] = useState({
    title: '',
    batchYear: 2027,
    minCgpa: 7.5,
    minReadiness: 75,
    location: 'Main Campus & Virtual',
    packageOffered: '18 - 24 LPA',
    rolesOffered: 'Software Engineer, Full Stack Developer'
  });

  useEffect(() => {
    loadDrives();
  }, []);

  const loadDrives = () => {
    api.getPlacementDrives().then(setDrives).catch(console.error);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.getPlacementDrives(); // simulate save or post
      setShowModal(false);
      loadDrives();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="section-title">Campus Placement Drives</h1>
          <p className="section-subtitle">Coordinate company campus visits and monitor student eligibility thresholds.</p>
        </div>

        <button onClick={() => setShowModal(true)} className="btn-apple btn-apple-primary">
          <Plus size={16} />
          <span>Schedule Campus Drive</span>
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {drives.map((d) => (
          <div key={d.id} className="apple-card" style={{ padding: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
                <span className="badge-pill badge-blue">Batch {d.batchYear}</span>
                <span className="badge-pill badge-success">{d.packageOffered}</span>
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 700 }}>{d.title}</h3>
              <p style={{ fontSize: '0.88rem', color: '#6E6E73', marginTop: '0.3rem' }}>
                Roles: <strong>{d.rolesOffered}</strong> • Eligibility: Min CGPA {d.minCgpa}, Min Career Readiness {d.minReadiness}%
              </p>
            </div>

            <div style={{ textAlign: 'right' }}>
              <span className="badge-pill badge-blue" style={{ fontSize: '0.88rem' }}>Status: {d.status}</span>
              <div style={{ fontSize: '0.8rem', color: '#86868B', marginTop: '0.3rem' }}>{d.location}</div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: '1.5rem' }}>
          <div className="apple-card" style={{ maxWidth: '550px', width: '100%', padding: '2.5rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>Schedule Recruitment Drive</h2>
            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="apple-label">Company & Drive Title</label>
                <input className="apple-input" placeholder="Google Campus Drive 2027" value={newDrive.title} onChange={e => setNewDrive({...newDrive, title: e.target.value})} required />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="apple-label">Min CGPA</label>
                  <input type="number" step="0.1" className="apple-input" value={newDrive.minCgpa} onChange={e => setNewDrive({...newDrive, minCgpa: Number(e.target.value)})} />
                </div>
                <div>
                  <label className="apple-label">Min Readiness (%)</label>
                  <input type="number" className="apple-input" value={newDrive.minReadiness} onChange={e => setNewDrive({...newDrive, minReadiness: Number(e.target.value)})} />
                </div>
              </div>
              <div>
                <label className="apple-label">Package Offered</label>
                <input className="apple-input" value={newDrive.packageOffered} onChange={e => setNewDrive({...newDrive, packageOffered: e.target.value})} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.8rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn-apple btn-apple-secondary">Cancel</button>
                <button type="submit" className="btn-apple btn-apple-primary">Publish Drive</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
