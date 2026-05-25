import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from '../../components/ThemeToggle';
import './PendingProperties.css';

const API_BASE = 'http://localhost:4000';

function ManageUsers() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'accept') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  }, []);

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

  const handleDelete = async (id) => {
    const ok = window.confirm('Are you sure you want to delete this user? This action cannot be undone.');
    if (!ok) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/deleteUser/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to delete user');
      setUsers(prev => prev.filter(u => u._id !== id));
      showToast('User deleted successfully', 'reject');
    } catch (err) {
      showToast('Delete failed: ' + err.message, 'reject');
    }
  };

  return (
    <div>
      <header className="admin-header">
        <div className="header-left">
          <h1>Prop<span>Admin</span></h1>
          <span className="header-badge">{users.length} Users</span>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button className="back-btn" onClick={() => navigate('/admin/properties')}>Back to Admin</button>
          <button className="add-user-btn" onClick={() => navigate('/admin/add-user')}>+ Add User</button>
          <ThemeToggle iconOnly />
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
                <button className="btn-reject" onClick={() => handleDelete(u._id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="toast-container">
        {toasts.map(t => (
          <div key={t.id} className={`toast ${t.type === 'accept' ? 'toast-accept' : 'toast-reject'}`}>
            {t.message}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ManageUsers;
