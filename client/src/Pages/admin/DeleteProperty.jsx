import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './PendingProperties.css';

const API_BASE = 'http://localhost:4000';

function ToastContainer({ toasts }) {
  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`toast ${t.type === 'accept' ? 'toast-accept' : 'toast-reject'}`}>
          {t.message}
        </div>
      ))}
    </div>
  );
}

function DeleteProperty() {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'accept') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  }, []);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE}/admin/getAllProperties`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const text = await response.text();
          throw new Error(text || 'Failed to load properties');
        }

        const data = await response.json();
        setProperties(data || []);
      } catch (err) {
        setError(err.message || 'Failed to load properties');
        showToast('Load failed: ' + (err.message || 'Unknown error'), 'reject');
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const ShowToast = useCallback((message, type = 'accept') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  }, []);

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Delete this property? This cannot be undone.');
    if (!confirmed) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/admin/deleteProperty/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete property');
      }

      setProperties(prev => prev.filter(p => p._id !== id));
      showToast('Property deleted successfully', 'reject');
    } catch (err) {
      showToast('Delete failed: ' + (err.message || 'Unknown error'), 'reject');
    }
  };

  return (
    <div>
      <header className="admin-header">
        <div className="header-left">
          <h1>Prop<span>Admin</span></h1>
          <span className="header-badge">{properties.length} Properties</span>
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button className="back-btn" onClick={() => navigate('/admin/properties')}>
            Back to Admin
          </button>
          <button className="add-user-btn" onClick={() => navigate('/admin/add-user')}>
            + Add User
          </button>
          <button className="update-user-btn" onClick={() => navigate('/admin/manage-users')}>
            Manage Users
          </button>
        </div>

        <div id="size">
          <button id="logout-btn" onClick={() => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            navigate('/login');
          }}>
            Logout
          </button>
        </div>
      </header>

      <div className="admin-body">
        <div className="section-label">Delete Property</div>

        {loading && <div className="empty-state">Loading properties…</div>}
        {error && <div className="empty-state">Could not load properties: {error}</div>}

        <div className="property-list">
          {!loading && !error && properties.length === 0 && (
            <div className="empty-state">No properties available to delete.</div>
          )}

          {!loading && !error && properties.map(p => (
            <div className="property-card" key={p._id}>
              <div className="card-info">
                <div className="card-name">{p.propertyName || 'Untitled Property'}</div>
                <div className="card-chips">
                  <span className="chip chip-type">{p.propertyType || 'Unknown type'}</span>
                  <span className="chip">{p.propertyLocation || 'Unknown location'}</span>
                  {p.status && <span className="chip">Status: {p.status}</span>}
                </div>
                <div className="card-hint">ID: {p._id}</div>
              </div>

              <div className="card-actions" onClick={e => e.stopPropagation()}>
                <button className="btn-reject" onClick={() => handleDelete(p._id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ToastContainer toasts={toasts} />
    </div>
  );
}

export default DeleteProperty;
