import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PendingProperties.css';

const API_BASE = 'http://localhost:4000';

function ManageUsers() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_BASE}/admin/getAllUsers`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) {
          const txt = await res.text();
          throw new Error(txt || 'Failed to load users');
        }
        const data = await res.json();
        setUsers(data || []);
      } catch (err) {
        setError(err.message || 'Failed to load users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div>
      <header className="admin-header">
        <div className="header-left">
          <h1>Prop<span>Admin</span></h1>
          <span className="header-badge">{users.length} Users</span>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="add-user-btn" onClick={() => navigate('/admin/add-user')}>+ Add User</button>
          <button id="logout-btn" onClick={() => { localStorage.removeItem('token'); localStorage.removeItem('user'); navigate('/login'); }}>Logout</button>
        </div>
      </header>

      <div className="admin-body">
        <div className="section-label">Users</div>

        {loading && <div className="empty-state">Loading users…</div>}
        {error && <div className="empty-state">Could not load users: {error}</div>}

        <div className="property-list">
          {!loading && !error && users.length === 0 && (
            <div className="empty-state">No users found.</div>
          )}

          {!loading && !error && users.map(u => (
            <div className="property-card" key={u._id} onClick={() => {}}>
              <div className="card-info">
                <div className="card-name">{u.name}</div>
                <div className="card-chips">
                  <span className="chip">{u.email}</span>
                  <span className="chip chip-type">{u.role}</span>
                </div>
                <div className="card-hint">ID: {u._id}</div>
              </div>

              <div className="card-actions" onClick={e => e.stopPropagation()}>
                <button className="btn-accept" onClick={() => navigate(`/admin/update-user/${u._id}`)}>Edit</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ManageUsers;
