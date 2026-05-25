import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

const API_BASE = 'http://localhost:4000';

function Homepage() {
  const [properties, setProperties]         = useState([]);
  const [loading, setLoading]               = useState(true);
  const [user, setUser]                     = useState(null);
  const [searchTerm, setSearchTerm]         = useState('');
  const [filterType, setFilterType]         = useState('all');
  const [compareSelection, setCompareSelection] = useState([]);
  const [compareError, setCompareError]     = useState('');
  const [theme, setTheme]                   = useState(() => localStorage.getItem('darvo-theme') || 'dark');
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('darvo-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark');

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
        let arr = Array.isArray(data) ? data : (data.properties || data.data || [data]);
        setProperties(arr);
      } else {
        setProperties([]);
      }
    } catch {
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

  const toggleCompare = (propertyId) => {
    setCompareError('');
    setCompareSelection(prev => {
      if (prev.includes(propertyId)) return prev.filter(id => id !== propertyId);
      if (prev.length >= 2) {
        setCompareError('You can only compare two properties at a time.');
        return prev;
      }
      return [...prev, propertyId];
    });
  };

  const handleCompareNow = () => {
    if (compareSelection.length !== 2) {
      setCompareError('Select exactly two properties to compare.');
      return;
    }
    navigate(`/compare/${compareSelection[0]}/${compareSelection[1]}`);
  };

  const filteredProperties = Array.isArray(properties)
    ? properties.filter(p => {
        const matchSearch = p.propertyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            p.propertyLocation?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchType   = filterType === 'all' || p.propertyType === filterType;
        return matchSearch && matchType;
      })
    : [];

  const formatPrice = (price) => {
    if (!price) return 'Price on request';
    return new Intl.NumberFormat('en-EG', { style: 'currency', currency: 'EGP', minimumFractionDigits: 0 }).format(price);
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getStatusClass = (status) => {
    if (!status) return 'available';
    return status.toLowerCase().replace(/\s+/g, '-');
  };

  const isOwnerOrAdmin = user?.role === 'property_owner' || user?.role === 'admin' || user?.role === 'owner';

  return (
    <div className="homepage">

      {/* ── Header ── */}
      <header className="home-header">
        <div className="header-container">
          <span className="darvo-logo">Darvo <span>Estates</span></span>

          <div className="user-info">
            {isOwnerOrAdmin && (
              <button className="nav-btn nav-btn-create" onClick={() => navigate('/create-property')}>
                + List Property
              </button>
            )}
            <button className="nav-btn theme-toggle-btn" onClick={toggleTheme} aria-label="Toggle theme">
              {theme === 'dark' ? (
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
              ) : (
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
              )}
            </button>
            <div className="user-pill">
              <div className="user-avatar">{getInitials(user?.name)}</div>
              <span className="user-name">{user?.name || 'User'}</span>
              <span className="user-role-badge">{user?.role || 'Buyer'}</span>
            </div>
            <button className="nav-btn nav-btn-logout" onClick={handleLogout}>Sign out</button>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero-grid" />
        <div className="hero-content fade-in-up">
          <div className="hero-eyebrow">Egypt's Premier Real Estate Platform</div>
          <h1 className="hero-title">
            Find Your <span>Dream</span> Property
          </h1>
          <p className="hero-subtitle">
            Discover apartments, villas, townhouses and more across Egypt's finest locations.
          </p>
          <div className="hero-actions">
            <button className="hero-primary-btn" onClick={() => navigate('/advanced-filter')}>
              Advanced Search
            </button>
            {isOwnerOrAdmin && (
              <button className="hero-secondary-btn" onClick={() => navigate('/create-property')}>
                List Your Property
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ── Search Bar ── */}
      <div className="search-section">
        <div className="search-card">
          <div className="search-input-wrap">
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              type="text"
              placeholder="Search by name or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Types</option>
            <option value="Apartment">Apartment</option>
            <option value="Villa">Villa</option>
            <option value="Townhouse">Townhouse</option>
            <option value="Land">Land</option>
            <option value="Commercial">Commercial</option>
            <option value="Studio">Studio</option>
          </select>

          <button onClick={() => navigate('/advanced-filter')} className="advanced-filters-btn">
            Advanced Filters
          </button>
        </div>
      </div>

      {/* ── Compare Toolbar ── */}
      {compareSelection.length > 0 && (
        <div className="compare-toolbar">
          <div className="compare-toolbar-inner">
            <div className="compare-status">
              <strong>{compareSelection.length}/2</strong> properties selected for comparison
            </div>
            <div className="compare-actions">
              <button className="clear-compare-btn" onClick={() => { setCompareSelection([]); setCompareError(''); }}>
                Clear
              </button>
              <button className="compare-now-btn" onClick={handleCompareNow} disabled={compareSelection.length !== 2}>
                Compare Now
              </button>
            </div>
          </div>
        </div>
      )}
      {compareError && <div className="compare-error-message">{compareError}</div>}

      {/* ── Properties Grid ── */}
      <div className="properties-section">
        {!loading && filteredProperties.length > 0 && (
          <div className="properties-header">
            <div className="properties-count">
              Showing <span>{filteredProperties.length}</span> {filteredProperties.length === 1 ? 'property' : 'properties'}
            </div>
          </div>
        )}

        {loading ? (
          <div className="loading-grid">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="property-skeleton">
                <div className="skeleton-image shimmer" />
                <div className="skeleton-content">
                  <div className="skeleton-chip shimmer" />
                  <div className="skeleton-title shimmer" />
                  <div className="skeleton-text shimmer" />
                  <div className="skeleton-price shimmer" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" color="var(--text-muted)">
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
            </div>
            <h3>No properties found</h3>
            <p>Try adjusting your search or explore advanced filters.</p>
            <button onClick={() => navigate('/advanced-filter')} className="empty-search-btn">
              Open Advanced Search
            </button>
          </div>
        ) : (
          <div className="properties-grid">
            {filteredProperties.map((property, idx) => (
              <div
                key={property._id}
                className={`property-card${compareSelection.includes(property._id) ? ' selected-card' : ''}`}
                style={{ animationDelay: `${idx * 0.04}s` }}
              >
                <div className="property-image">
                  {property.images && property.images[0]
                    ? <img src={property.images[0]} alt={property.propertyName} />
                    : <div className="image-placeholder">No Image</div>
                  }
                  <div className="property-image-overlay" />
                  <div className="card-badges">
                    <span className={`status-badge ${getStatusClass(property.status)}`}>
                      {property.status || 'Available'}
                    </span>
                    {property.transactionType === 'Rent' && (
                      <span className="rent-badge">For Rent</span>
                    )}
                  </div>
                </div>

                <div className="property-info">
                  <span className="property-type-chip">{property.propertyType}</span>
                  <h3 className="property-title">{property.propertyName}</h3>
                  <p className="property-location">
                    <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                      <circle cx="12" cy="10" r="3"/>
                    </svg>
                    {property.propertyLocation}
                  </p>
                  <p className="property-price">{formatPrice(property.price)}</p>

                  <div className="property-stats">
                    <div className="property-stat">
                      <span className="stat-value">{property.bedrooms ?? '—'}</span>
                      <span className="stat-label">Beds</span>
                    </div>
                    <div className="property-stat">
                      <span className="stat-value">{property.bathrooms ?? '—'}</span>
                      <span className="stat-label">Baths</span>
                    </div>
                    {property.livingArea && (
                      <div className="property-stat">
                        <span className="stat-value">{property.livingArea}</span>
                        <span className="stat-label">m²</span>
                      </div>
                    )}
                  </div>

                  <div className="card-actions">
                    <button className="view-details-btn" onClick={() => navigate(`/property/${property._id}`)}>
                      View Details
                    </button>
                    <button
                      className={`compare-btn${compareSelection.includes(property._id) ? ' selected' : ''}`}
                      onClick={() => toggleCompare(property._id)}
                    >
                      {compareSelection.includes(property._id) ? 'Remove' : 'Compare'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}

export default Homepage;