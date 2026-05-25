import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ThemeToggle from '../../components/ThemeToggle';
import './PropertyDetails.css';

const API_BASE = 'http://localhost:4000';

function PropertyDetails() {
  const { id }       = useParams();
  const navigate     = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');

  const fetchPropertyDetails = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/property/get/${id}`, {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
      });
      if (response.ok) {
        const data = await response.json();
        let prop = data;
        if (data.property) prop = data.property;
        if (data.data)     prop = data.data;
        setProperty(prop);
      } else {
        const err = await response.json();
        setError(err.message || 'Failed to load property details.');
      }
    } catch {
      setError('Network error occurred.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchPropertyDetails(); }, [fetchPropertyDetails]);

  const formatPrice = (price) => {
    if (!price) return 'Price on request';
    return new Intl.NumberFormat('en-EG', { style: 'currency', currency: 'EGP', minimumFractionDigits: 0 }).format(price);
  };

  const getStatusClass = (s) => {
    if (!s) return 'available';
    return s.toLowerCase().replace(/\s+/g, '-');
  };

  if (loading) {
    return (
      <div className="property-details-page">
        <header className="details-header">
          <div className="header-container">
            <span className="darvo-logo">Darvo <span>Estates</span></span>
          </div>
        </header>
        <div className="details-container">
          <span className="loading-spinner">Loading property details…</span>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="property-details-page">
        <header className="details-header">
          <div className="header-container">
            <span className="darvo-logo">Darvo <span>Estates</span></span>
          </div>
        </header>
        <div className="details-container" style={{ flexDirection: 'column', gap: '16px' }}>
          <div className="error-message">{error || 'Property not found.'}</div>
          <button onClick={() => navigate('/home')} className="back-btn">Back to Home</button>
        </div>
      </div>
    );
  }

  return (
    <div className="property-details-page">

      <header className="details-header">
        <div className="header-container">
          <span className="darvo-logo">Darvo <span>Estates</span></span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ThemeToggle iconOnly />
            <button onClick={() => navigate('/home')} className="back-arrow-btn" aria-label="Go back">
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
              Back to Listings
            </button>
          </div>
        </div>
      </header>

      <div className="details-content fade-in-up">
        <div className="property-details-card">

          {/* Image */}
          <div className="details-image">
            {property.images && property.images[0]
              ? <img src={property.images[0]} alt={property.propertyName} />
              : <div className="no-image-large">No Image Available</div>
            }
          </div>

          {/* Info */}
          <div className="details-info">
            <h1 className="details-title">{property.propertyName}</h1>
            <p className="details-location">
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              {property.propertyLocation}
            </p>
            <p className="details-price">{formatPrice(property.price)}</p>

            <div className="details-stats">
              <div className="stat">
                <span className="stat-label">Bedrooms</span>
                <span className="stat-value">{property.bedrooms ?? '—'}</span>
              </div>
              <div className="stat">
                <span className="stat-label">Bathrooms</span>
                <span className="stat-value">{property.bathrooms ?? '—'}</span>
              </div>
              {property.livingArea && (
                <div className="stat">
                  <span className="stat-label">Living Area</span>
                  <span className="stat-value">{property.livingArea} m²</span>
                </div>
              )}
              {property.gardenArea > 0 && (
                <div className="stat">
                  <span className="stat-label">Garden</span>
                  <span className="stat-value">{property.gardenArea} m²</span>
                </div>
              )}
              {property.roofArea > 0 && (
                <div className="stat">
                  <span className="stat-label">Roof</span>
                  <span className="stat-value">{property.roofArea} m²</span>
                </div>
              )}
            </div>

            {property.propertyDescription && (
              <div className="details-description">
                <h3>About this property</h3>
                <p>{property.propertyDescription}</p>
              </div>
            )}

            {property.propertyAmenities && property.propertyAmenities.length > 0 && (
              <div className="details-amenities">
                <h3>Amenities</h3>
                <div className="amenities-list">
                  {property.propertyAmenities.map(a => (
                    <span key={a} className="amenity-badge">{a}</span>
                  ))}
                </div>
              </div>
            )}

            <div className="details-status">
              <span className={`status ${getStatusClass(property.status)}`}>
                {property.status || 'Available'}
              </span>
            </div>

            <button className="contact-agent-btn">Contact Agent</button>
          </div>
        </div>
      </div>

    </div>
  );
}

export default PropertyDetails;