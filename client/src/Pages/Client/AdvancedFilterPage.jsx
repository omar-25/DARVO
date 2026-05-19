import React, { useState, useEffect, useCallback } from 'react';
import './AdvancedFilterPage.css';

const API_BASE = 'http://localhost:4000';

function AdvancedFilterPage() {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [showFilters, setShowFilters] = useState(true);

  // Filter states
  const [filters, setFilters] = useState({
    // Price range
    minPrice: '',
    maxPrice: '',
    
    // Area range
    minArea: '',
    maxArea: '',
    
    // Property details
    propertyType: 'all',
    bedrooms: 'all',
    bathrooms: 'all',
    status: 'all',
    
    // Amenities
    amenities: [],
    
    // Garden & Roof
    hasGarden: false,
    hasRoof: false,
    minGardenArea: '',
    minRoofArea: '',
    
    // Search
    search: '',
  });

  // Available amenities list
  const availableAmenities = [
    'Swimming Pool',
    'Private Garden',
    'Garage',
    'Security',
    'Elevator',
    'Central AC',
    'Furnished',
    'Pets Allowed',
    'Gym',
    'Jacuzzi',
    'Balcony',
    'Storage Room',
    'Maids Room',
    'Study Room',
    'Smart Home'
  ];

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
        setFilteredProperties(propertiesArray);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Apply all filters - wrapped in useCallback to fix ESLint warning
  const applyFilters = useCallback(() => {
    let filtered = [...properties];

    // Search filter
    if (filters.search) {
      filtered = filtered.filter(p => 
        p.propertyName?.toLowerCase().includes(filters.search.toLowerCase()) ||
        p.propertyLocation?.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Price range filter
    if (filters.minPrice) {
      filtered = filtered.filter(p => p.price >= Number(filters.minPrice));
    }
    if (filters.maxPrice) {
      filtered = filtered.filter(p => p.price <= Number(filters.maxPrice));
    }

    // Area filter (living area)
    if (filters.minArea) {
      filtered = filtered.filter(p => (p.livingArea || 0) >= Number(filters.minArea));
    }
    if (filters.maxArea) {
      filtered = filtered.filter(p => (p.livingArea || 0) <= Number(filters.maxArea));
    }

    // Property type filter
    if (filters.propertyType !== 'all') {
      filtered = filtered.filter(p => p.propertyType === filters.propertyType);
    }

    // Bedrooms filter
    if (filters.bedrooms !== 'all') {
      filtered = filtered.filter(p => p.bedrooms >= Number(filters.bedrooms));
    }

    // Bathrooms filter
    if (filters.bathrooms !== 'all') {
      filtered = filtered.filter(p => p.bathrooms >= Number(filters.bathrooms));
    }

    // Status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(p => p.status === filters.status);
    }

    // Amenities filter
    if (filters.amenities.length > 0) {
      filtered = filtered.filter(p => 
        filters.amenities.every(amenity => 
          p.propertyAmenities?.includes(amenity)
        )
      );
    }

    // Garden filter
    if (filters.hasGarden) {
      filtered = filtered.filter(p => (p.gardenArea || 0) > 0);
    }
    if (filters.minGardenArea) {
      filtered = filtered.filter(p => (p.gardenArea || 0) >= Number(filters.minGardenArea));
    }

    // Roof filter
    if (filters.hasRoof) {
      filtered = filtered.filter(p => (p.roofArea || 0) > 0);
    }
    if (filters.minRoofArea) {
      filtered = filtered.filter(p => (p.roofArea || 0) >= Number(filters.minRoofArea));
    }

    setFilteredProperties(filtered);
  }, [properties, filters]); // Added dependencies

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      minPrice: '',
      maxPrice: '',
      minArea: '',
      maxArea: '',
      propertyType: 'all',
      bedrooms: 'all',
      bathrooms: 'all',
      status: 'all',
      amenities: [],
      hasGarden: false,
      hasRoof: false,
      minGardenArea: '',
      minRoofArea: '',
      search: '',
    });
    setFilteredProperties(properties);
  };

  // Handle amenity toggle
  const toggleAmenity = (amenity) => {
    setFilters(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  // Handle input changes
  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Apply filters whenever filters or properties change
  useEffect(() => {
    applyFilters();
  }, [applyFilters]); // Now this is fixed - applyFilters is stable

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-EG', {
      style: 'currency',
      currency: 'EGP',
      minimumFractionDigits: 0
    }).format(price);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <div className="filter-page">
      {/* Header */}
      <header className="filter-header">
        <div className="header-container">
          <div className="logo">
            <h1>Darvo <span>Real Estate</span></h1>
          </div>
          <div className="user-info">
            <span className="user-name">Welcome, {user?.name || 'User'}!</span>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </div>
        </div>
      </header>

      <div className="filter-layout">
        {/* Filters Sidebar */}
        <aside className={`filters-sidebar ${!showFilters ? 'collapsed' : ''}`}>
          <div className="filters-header">
            <h3>Filter Properties</h3>
            <button onClick={() => setShowFilters(!showFilters)} className="toggle-filters">
              {showFilters ? 'Hide' : 'Show'} Filters
            </button>
          </div>

          {showFilters && (
            <div className="filters-content">
              {/* Search */}
              <div className="filter-group">
                <label>Search</label>
                <input
                  type="text"
                  name="search"
                  placeholder="Search by title or location..."
                  value={filters.search}
                  onChange={handleFilterChange}
                  className="filter-input"
                />
              </div>

              {/* Price Range */}
              <div className="filter-group">
                <label>Price Range (EGP)</label>
                <div className="range-inputs">
                  <input
                    type="number"
                    name="minPrice"
                    placeholder="Min"
                    value={filters.minPrice}
                    onChange={handleFilterChange}
                    className="filter-input"
                  />
                  <span>-</span>
                  <input
                    type="number"
                    name="maxPrice"
                    placeholder="Max"
                    value={filters.maxPrice}
                    onChange={handleFilterChange}
                    className="filter-input"
                  />
                </div>
              </div>

              {/* Area Range */}
              <div className="filter-group">
                <label>Living Area (m²)</label>
                <div className="range-inputs">
                  <input
                    type="number"
                    name="minArea"
                    placeholder="Min"
                    value={filters.minArea}
                    onChange={handleFilterChange}
                    className="filter-input"
                  />
                  <span>-</span>
                  <input
                    type="number"
                    name="maxArea"
                    placeholder="Max"
                    value={filters.maxArea}
                    onChange={handleFilterChange}
                    className="filter-input"
                  />
                </div>
              </div>

              {/* Property Type */}
              <div className="filter-group">
                <label>Property Type</label>
                <select name="propertyType" value={filters.propertyType} onChange={handleFilterChange} className="filter-select">
                  <option value="all">All Types</option>
                  <option value="Apartment">Apartment</option>
                  <option value="Villa">Villa</option>
                  <option value="Townhouse">Townhouse</option>
                  <option value="Land">Land</option>
                  <option value="Commercial">Commercial</option>
                </select>
              </div>

              {/* Bedrooms */}
              <div className="filter-group">
                <label>Bedrooms</label>
                <select name="bedrooms" value={filters.bedrooms} onChange={handleFilterChange} className="filter-select">
                  <option value="all">Any</option>
                  <option value="1">1+</option>
                  <option value="2">2+</option>
                  <option value="3">3+</option>
                  <option value="4">4+</option>
                  <option value="5">5+</option>
                </select>
              </div>

              {/* Bathrooms */}
              <div className="filter-group">
                <label>Bathrooms</label>
                <select name="bathrooms" value={filters.bathrooms} onChange={handleFilterChange} className="filter-select">
                  <option value="all">Any</option>
                  <option value="1">1+</option>
                  <option value="2">2+</option>
                  <option value="3">3+</option>
                  <option value="4">4+</option>
                </select>
              </div>

              {/* Status */}
              <div className="filter-group">
                <label>Property Status</label>
                <select name="status" value={filters.status} onChange={handleFilterChange} className="filter-select">
                  <option value="all">All</option>
                  <option value="Available">Available</option>
                  <option value="Pending Review">Pending Review</option>
                  <option value="Sold">Sold</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              {/* Garden Options */}
              <div className="filter-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="hasGarden"
                    checked={filters.hasGarden}
                    onChange={handleFilterChange}
                  />
                  Has Garden
                </label>
                {filters.hasGarden && (
                  <input
                    type="number"
                    name="minGardenArea"
                    placeholder="Min garden area (m²)"
                    value={filters.minGardenArea}
                    onChange={handleFilterChange}
                    className="filter-input"
                  />
                )}
              </div>

              {/* Roof Options */}
              <div className="filter-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="hasRoof"
                    checked={filters.hasRoof}
                    onChange={handleFilterChange}
                  />
                  Has Roof
                </label>
                {filters.hasRoof && (
                  <input
                    type="number"
                    name="minRoofArea"
                    placeholder="Min roof area (m²)"
                    value={filters.minRoofArea}
                    onChange={handleFilterChange}
                    className="filter-input"
                  />
                )}
              </div>

              {/* Amenities */}
              <div className="filter-group">
                <label>Amenities</label>
                <div className="amenities-grid">
                  {availableAmenities.map(amenity => (
                    <label key={amenity} className="amenity-checkbox">
                      <input
                        type="checkbox"
                        checked={filters.amenities.includes(amenity)}
                        onChange={() => toggleAmenity(amenity)}
                      />
                      {amenity}
                    </label>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="filter-actions">
                <button onClick={applyFilters} className="btn-apply">Apply Filters</button>
                <button onClick={resetFilters} className="btn-reset">Reset All</button>
              </div>
            </div>
          )}
        </aside>

        {/* Properties Grid */}
        <main className="properties-main">
          <div className="results-header">
            <h3>Found {filteredProperties.length} Properties</h3>
          </div>

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
              <p>No properties match your filters</p>
              <button onClick={resetFilters} className="reset-btn">Clear All Filters</button>
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
                    <span className={`status-badge ${property.status?.toLowerCase().replace(' ', '-')}`}>
                      {property.status || 'Available'}
                    </span>
                  </div>
                  
                  <div className="property-info">
                    <h3 className="property-title">{property.propertyName}</h3>
                    <p className="property-location">{property.propertyLocation}</p>
                    <p className="property-price">{formatPrice(property.price)}</p>
                    
                    <div className="property-details">
                      <span>{property.bedrooms} beds</span>
                      <span>{property.bathrooms} baths</span>
                      {property.livingArea && <span>{property.livingArea} m²</span>}
                    </div>

                    {property.gardenArea > 0 && (
                      <div className="property-feature">Garden: {property.gardenArea} m²</div>
                    )}
                    {property.roofArea > 0 && (
                      <div className="property-feature">Roof: {property.roofArea} m²</div>
                    )}
                    
                    {property.propertyAmenities && property.propertyAmenities.length > 0 && (
                      <div className="property-amenities">
                        {property.propertyAmenities.slice(0, 3).map(amenity => (
                          <span key={amenity} className="amenity-tag">{amenity}</span>
                        ))}
                        {property.propertyAmenities.length > 3 && (
                          <span className="amenity-tag">+{property.propertyAmenities.length - 3}</span>
                        )}
                      </div>
                    )}
                    
                    <button className="view-details-btn">View Details</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default AdvancedFilterPage;