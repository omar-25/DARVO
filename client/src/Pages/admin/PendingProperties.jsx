import React, { useState, useEffect, useCallback } from 'react';
import './PendingProperties.css';

const API_BASE = 'http://localhost:4000';

function SkeletonCard() {
  return <div className="skeleton" />;
}

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

// ── Rejection reason modal ───────────────────────────────────────────────────
function RejectModal({ onConfirm, onCancel }) {
  const [reason, setReason] = useState('');

  return (
    <div
      className="modal-overlay open"
      onClick={e => { if (e.target === e.currentTarget) onCancel(); }}
    >
      <div className="modal" style={{ maxWidth: '420px' }}>
        <div className="modal-head">
          <div className="modal-title">Reject Property</div>
          <button className="modal-close" onClick={onCancel}>✕</button>
        </div>
        <div className="modal-body">
          <div className="modal-field-label">Reason for rejection</div>
          <textarea
            className="reject-textarea"
            placeholder="e.g. Incomplete information, images missing, suspicious listing..."
            value={reason}
            onChange={e => setReason(e.target.value)}
            rows={4}
          />
        </div>
        <div className="modal-footer">
          <button className="btn-modal-cancel" onClick={onCancel}>Cancel</button>
          <button
            className="btn-modal-reject"
            onClick={() => {
              if (!reason.trim()) return;
              onConfirm(reason.trim());
            }}
            disabled={!reason.trim()}
          >
            ✕ Confirm Reject
          </button>
        </div>
      </div>
    </div>
  );
}

function PropertyCard({ property, onView, onAccept, onReject }) {
  const { _id, propertyName, propertyType, propertyLocation, bedrooms, bathrooms, livingArea, createdAt } = property;

  const date = new Date(createdAt).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  });

  return (
    <div className="property-card" onClick={() => onView(property)}>
      <div className="card-info">
        <div className="card-name">{propertyName}</div>
        <div className="card-chips">
          <span className="chip chip-type">{propertyType}</span>
          <span className="chip">📍 {propertyLocation}</span>
          <span className="chip">🛏 {bedrooms} &nbsp; 🚿 {bathrooms}</span>
          {livingArea && <span className="chip">{livingArea} m²</span>}
        </div>
        <div className="card-hint">Click to view details · Submitted {date}</div>
      </div>

      <div className="card-actions" onClick={e => e.stopPropagation()}>
        <button className="btn-accept" onClick={() => onAccept(_id)}>✓ Accept</button>
        <button className="btn-reject" onClick={() => onReject(_id)}>✕ Reject</button>
      </div>
    </div>
  );
}

function PropertyModal({ property, onClose, onAccept, onReject }) {
  if (!property) return null;

  const {
    _id, propertyName, propertyType, propertyLocation, propertyDescription,
    bedrooms, bathrooms, livingArea, gardenArea, roofArea,
    propertyAmenities, createdAt,
  } = property;

  const date = new Date(createdAt).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  });

  const stats = [
    { label: 'Bedrooms',    value: bedrooms },
    { label: 'Bathrooms',   value: bathrooms },
    { label: 'Living Area', value: livingArea ? `${livingArea} m²` : '—' },
    { label: 'Garden',      value: gardenArea ? `${gardenArea} m²` : '—' },
    { label: 'Roof',        value: roofArea   ? `${roofArea} m²`   : '—' },
    { label: 'Submitted',   value: date },
  ];

  return (
    <div
      className="modal-overlay open"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="modal">
        <div className="modal-head">
          <div className="modal-title">{propertyName}</div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <div className="modal-field-label">Type &amp; Location</div>
          <div className="modal-field-value">
            <span className="highlight">{propertyType}</span> · {propertyLocation}
          </div>

          <div className="modal-field-label">Description</div>
          <div className="modal-field-value">{propertyDescription || '—'}</div>

          <div className="stats-grid">
            {stats.map(s => (
              <div className="stat-box" key={s.label}>
                <div className="modal-field-label">{s.label}</div>
                <div className="stat-value">{s.value}</div>
              </div>
            ))}
          </div>

          <div className="modal-field-label">Amenities</div>
          <div className="amenities">
            {propertyAmenities && propertyAmenities.length > 0
              ? propertyAmenities.map(a => <span className="amenity-tag" key={a}>{a}</span>)
              : <span className="chip">None listed</span>
            }
          </div>

          <hr className="modal-divider" />
        </div>

        <div className="modal-footer">
          <button className="btn-modal-accept" onClick={() => { onAccept(_id); onClose(); }}>
            ✓ Accept Property
          </button>
          <button className="btn-modal-reject" onClick={() => { onReject(_id); onClose(); }}>
            ✕ Reject Property
          </button>
        </div>
      </div>
    </div>
  );
}

function PendingProperties() {
  const [properties, setProperties]     = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState('');
  const [selected, setSelected]         = useState(null);
  const [toasts, setToasts]             = useState([]);
  const [rejectingId, setRejectingId]   = useState(null); // ID of property being rejected

  useEffect(() => {
    const handler = e => { if (e.key === 'Escape') { setSelected(null); setRejectingId(null); } };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/admin/getPendingProperties`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (!res.ok) throw new Error(`Server error ${res.status}`);
        const data = await res.json();
        setProperties(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const showToast = useCallback((message, type) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3200);
  }, []);

  const handleAccept = useCallback(async (id) => {
    try {
      const res = await fetch(`${API_BASE}/admin/property/${id}/approve`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ status: 'Available' }),
      });
      if (!res.ok) throw new Error(`Server error ${res.status}`);
      setProperties(prev => prev.filter(p => p._id !== id));
      showToast('✓ Property accepted', 'accept');
    } catch (err) {
      showToast('Action failed — please try again.', 'reject');
      console.error(err);
    }
  }, [showToast]);

  const handleReject = useCallback(async (id, reason) => {
    try {
      const res = await fetch(`${API_BASE}/admin/property/${id}/approve`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ status: 'Rejected', rejectionReason: reason }),
      });
      if (!res.ok) throw new Error(`Server error ${res.status}`);
      setProperties(prev => prev.filter(p => p._id !== id));
      setRejectingId(null);
      showToast('✕ Property rejected', 'reject');
    } catch (err) {
      showToast('Action failed — please try again.', 'reject');
      console.error(err);
    }
  }, [showToast]);

  return (
    <>
      <header className="admin-header">
        <h1>Prop<span>Admin</span></h1>
        <span className="header-badge">{properties.length} Pending</span>
      </header>

      <div className="admin-body">
        <div className="section-label">Pending Review</div>
        <div className="property-list">
          {loading && [1, 2, 3].map(i => <SkeletonCard key={i} />)}
          {error && <div className="empty-state">Could not load properties: {error}</div>}
          {!loading && !error && properties.length === 0 && (
            <div className="empty-state">No properties pending — you're all caught up!</div>
          )}
          {!loading && !error && properties.map(p => (
            <PropertyCard
              key={p._id}
              property={p}
              onView={setSelected}
              onAccept={id => handleAccept(id)}
              onReject={id => { setSelected(null); setRejectingId(id); }}
            />
          ))}
        </div>
      </div>

      {/* Property detail modal */}
      {selected && (
        <PropertyModal
          property={selected}
          onClose={() => setSelected(null)}
          onAccept={id => { handleAccept(id); setSelected(null); }}
          onReject={id => { setSelected(null); setRejectingId(id); }}
        />
      )}

      {/* Rejection reason modal */}
      {rejectingId && (
        <RejectModal
          onConfirm={reason => handleReject(rejectingId, reason)}
          onCancel={() => setRejectingId(null)}
        />
      )}

      <ToastContainer toasts={toasts} />
    </>
  );
}

export default PendingProperties;
