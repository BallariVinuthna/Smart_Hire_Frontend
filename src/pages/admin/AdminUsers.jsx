import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Users, ShieldCheck } from 'lucide-react';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAdminUsers()
      .then(setUsers)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 className="section-title">User Directory & Roles</h1>
        <p className="section-subtitle">Manage authenticated identities and role authorizations.</p>
      </div>

      <div className="apple-card" style={{ padding: '2rem', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '650px' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid rgba(0,0,0,0.06)', fontSize: '0.82rem', color: '#86868B', textTransform: 'uppercase' }}>
              <th style={{ padding: '1rem' }}>User ID</th>
              <th style={{ padding: '1rem' }}>Full Name</th>
              <th style={{ padding: '1rem' }}>Email Address</th>
              <th style={{ padding: '1rem' }}>Assigned Role</th>
              <th style={{ padding: '1rem' }}>Created At</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.04)', fontSize: '0.92rem' }}>
                <td style={{ padding: '1rem', fontFamily: 'monospace' }}>#{u.id}</td>
                <td style={{ padding: '1rem', fontWeight: 600 }}>{u.fullName}</td>
                <td style={{ padding: '1rem', color: '#6E6E73' }}>{u.email}</td>
                <td style={{ padding: '1rem' }}>
                  <span className="badge-pill badge-blue">{u.role}</span>
                </td>
                <td style={{ padding: '1rem', color: '#86868B', fontSize: '0.85rem' }}>
                  {new Date(u.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
