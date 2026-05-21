import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './PropertyDetails.css';

const API_BASE = 'http://localhost:4000';

function PropertyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchPropertyDetails = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Correct endpoint based on your router
      const response = await fetch(`${API_BASE}/property/get/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        // Handle different response formats
        let propertyData = data;
        if (data.property) propertyData = data.property;
        if (data.data) propertyData = data.data;
        
        setProperty(propertyData);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to load property details');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchPropertyDetails();
  }, [fetchPropertyDetails]);

  const formatPrice = (price) => {
    if (!price) return 'Price on request';
    return new Intl.NumberFormat('en-EG', {
      style: 'currency',
      currency: 'EGP',
      minimumFractionDigits: 0
    }).format(price);
  };

  if (loading) {
    return (
      <div className="details-container">
        <div className="loading-spinner">Loading property details...</div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="details-container">
        <div className="error-message">{error || 'Property not found'}</div>
        <button onClick={() => navigate('/home')} className="back-btn">Back to Home</button>
      </div>
    );
  }

  return (
    <div className="property-details-page">
      <header className="details-header">
        <div className="header-container">
          <div className="logo">
            <h1>Darvo <span>Real Estate</span></h1>
          </div>
          <button onClick={() => navigate('/home')} className="back-arrow-btn" aria-label="Go back">
            ←
          </button>        
</div>
      </header>

      <div className="details-content">
        <div className="property-details-card">
          <div className="details-image">
            {property.images && property.images[0] ? (
              <img src={property.images[0]} alt={property.propertyName} />
            ) : (
              <div className="no-image-large">No Image Available</div>
            )}
          </div>

          <div className="details-info">
            <h1 className="details-title">{property.propertyName}</h1>
            <p className="details-location">{property.propertyLocation}</p>
            <p className="details-price">{formatPrice(property.price)}</p>
            
            <div className="details-stats">
              <div className="stat">
                <span className="stat-label">Bedrooms</span>
                <span className="stat-value">{property.bedrooms}</span>
              </div>
              <div className="stat">
                <span className="stat-label">Bathrooms</span>
                <span className="stat-value">{property.bathrooms}</span>
              </div>
              {property.livingArea && (
                <div className="stat">
                  <span className="stat-label">Living Area</span>
                  <span className="stat-value">{property.livingArea} m²</span>
                </div>
              )}
              {property.gardenArea > 0 && (
                <div className="stat">
                  <span className="stat-label">Garden Area</span>
                  <span className="stat-value">{property.gardenArea} m²</span>
                </div>
              )}
              {property.roofArea > 0 && (
                <div className="stat">
                  <span className="stat-label">Roof Area</span>
                  <span className="stat-value">{property.roofArea} m²</span>
                </div>
              )}
            </div>

            <div className="details-description">
              <h3>Description</h3>
              <p>{property.propertyDescription || 'No description available'}</p>
            </div>

            {property.propertyAmenities && property.propertyAmenities.length > 0 && (
              <div className="details-amenities">
                <h3>Amenities</h3>
                <div className="amenities-list">
                  {property.propertyAmenities.map(amenity => (
                    <span key={amenity} className="amenity-badge">{amenity}</span>
                  ))}
                </div>
              </div>
            )}

            <div className="details-status">
              <span className={`status ${property.status?.toLowerCase().replace(' ', '-')}`}>
                Status: {property.status || 'Available'}
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