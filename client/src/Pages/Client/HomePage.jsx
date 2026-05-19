import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

const API_BASE = 'http://localhost:4000';

function Homepage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(userData);
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/property/get`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        let propertiesArray = Array.isArray(data) ? data : (data.properties || data.data || [data]);
        setProperties(propertiesArray);
      } else {
        console.error('Failed to fetch properties');
        setProperties([]);
      }
    } catch (error) {
      console.error('Error:', error);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const handleAdvancedSearch = () => {
    navigate('/advanced-filter');
  };

  // Function to handle view details button click
  const handleViewDetails = (propertyId) => {
    navigate(`/property/${propertyId}`);
  };

  const filteredProperties = Array.isArray(properties) ? properties.filter(property => {
    const matchesSearch = property.propertyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          property.propertyLocation?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || property.propertyType === filterType;
    return matchesSearch && matchesType;
  }) : [];

  const formatPrice = (price) => {
    if (!price) return 'Price on request';
    return new Intl.NumberFormat('en-EG', {
      style: 'currency',
      currency: 'EGP',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="homepage">
      {/* Header */}
      <header className="home-header">
        <div className="header-container">
          <div className="logo">
            <h1>Darvo <span>Real Estate</span></h1>
          </div>
          
          <div className="user-info">
            <span className="user-name">Welcome, {user?.name || 'User'}!</span>
            <span className="user-role">{user?.role || 'Buyer'}</span>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h2>Find Your Dream Property</h2>
          <p>Discover the perfect home, office, or investment property in Egypt</p>
        </div>
      </section>

      {/* Search & Filter Bar */}
      <div className="search-section">
        <div className="search-container">
          <input
            type="text"
            placeholder="Quick search by title or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          
          <select 
            value={filterType} 
            onChange={(e) => setFilterType(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Properties</option>
            <option value="Apartment">Apartments</option>
            <option value="Villa">Villas</option>
            <option value="Townhouse">Townhouses</option>
            <option value="Land">Land</option>
            <option value="Commercial">Commercial</option>
            <option value="Studio">Studios</option>
          </select>

          <button onClick={handleAdvancedSearch} className="advanced-filters-btn">
            Advanced Filters
          </button>
        </div>
      </div>

      {/* Properties Grid */}
      <div className="properties-section">
        <div className="properties-container">
          {loading ? (
            <div className="loading-grid">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="property-skeleton">
                  <div className="skeleton-image"></div>
                  <div className="skeleton-content">
                    <div className="skeleton-title"></div>
                    <div className="skeleton-text"></div>
                    <div className="skeleton-price"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredProperties.length === 0 ? (
            <div className="empty-state">
              <p>No properties found</p>
              <p className="empty-subtitle">Try adjusting your search or use Advanced Search</p>
              <button onClick={handleAdvancedSearch} className="empty-search-btn">
                Advanced Search
              </button>
            </div>
          ) : (
            <div className="properties-grid">
              {filteredProperties.map(property => (
                <div key={property._id} className="property-card">
                  <div className="property-image">
                    {property.images && property.images[0] ? (
                      <img src={property.images[0]} alt={property.propertyName} />
                    ) : (
                      <div className="image-placeholder">No Image</div>
                    )}
                    <span className={`status-badge ${property.status?.toLowerCase()}`}>
                      {property.status || 'Available'}
                    </span>
                    {property.transactionType === 'Rent' && (
                      <span className="rent-badge">For Rent</span>
                    )}
                  </div>
                  
                  <div className="property-info">
                    <h3 className="property-title">{property.propertyName}</h3>
                    <p className="property-location">{property.propertyLocation}</p>
                    <p className="property-price">{formatPrice(property.price)}</p>
                    
                    <div className="property-details">
                      <span>{property.bedrooms || 0} beds</span>
                      <span>{property.bathrooms || 0} baths</span>
                      {property.livingArea && <span>{property.livingArea} m²</span>}
                    </div>
                    
                    <div className="property-type">
                      {property.propertyType}
                    </div>
                    
                    {/* Working View Details Button */}
                    <button 
                      className="view-details-btn"
                      onClick={() => handleViewDetails(property._id)}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Homepage;