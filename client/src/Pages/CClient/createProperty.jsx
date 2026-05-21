import React, { useState } from 'react';
import './createProperty.css';

const CreateProperty = ({ userId = '6765a8b3c4d5e6f7a8b9c0d1' }) => {
  const [formData, setFormData] = useState({
    propertyName: '',
    propertyDescription: '',
    propertyLocation: '',
    propertyType: '',
    propertyOwner: userId,
    propertyAmenities: [],
    bedrooms: '',
    bathrooms: '',
    livingArea: '',
    assignedSales: null,
    price: '',
    status: 'Pending Review',
    gardenArea: '',
    roofArea: '',
    offers: [],
    images: []
  });

  const [amenityInput, setAmenityInput] = useState('');
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const propertyTypes = ['Apartment', 'House', 'Villa', 'Townhouse', 'Land', 'Commercial', 'Studio'];

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value === '' ? '' : Number(value) }));
  };

  const addAmenity = () => {
    if (amenityInput && amenityInput.trim() !== '') {
      setFormData(prev => ({
        ...prev,
        propertyAmenities: [...prev.propertyAmenities, amenityInput.trim()]
      }));
      setAmenityInput('');
    }
  };

  const removeAmenity = (indexToRemove) => {
    setFormData(prev => ({
      ...prev,
      propertyAmenities: prev.propertyAmenities.filter((_, index) => index !== indexToRemove)
    }));
  };

  const handleImageSelect = async (e) => {
    const files = Array.from(e.target.files);
    
    for (const file of files) {
      try {
        const base64 = await convertToBase64(file);
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, base64]
        }));
        setImagePreviews(prev => [...prev, base64]);
      } catch (error) {
        console.error('Error converting image:', error);
      }
    }
  };

  const removeImage = (indexToRemove) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove)
    }));
    setImagePreviews(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const validateForm = () => {
    const required = ['propertyName', 'propertyDescription', 'propertyLocation', 'propertyType', 'bedrooms', 'bathrooms', 'price'];
    for (let field of required) {
      if (!formData[field]) {
        setError(`Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return false;
      }
    }
    if (formData.bedrooms <= 0 || formData.bathrooms <= 0) {
      setError('Bedrooms and bathrooms must be greater than 0');
      return false;
    }
    if (formData.price <= 0) {
      setError('Price must be greater than 0');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!validateForm()) return;
    
    setLoading(true);

    try {
      const cleanData = { ...formData };
      if (!cleanData.assignedSales) delete cleanData.assignedSales;
      if (!cleanData.livingArea) delete cleanData.livingArea;
      if (!cleanData.gardenArea) delete cleanData.gardenArea;
      if (!cleanData.roofArea) delete cleanData.roofArea;
      if (cleanData.offers.length === 0) delete cleanData.offers;
      
      const response = await fetch('http://localhost:4000/property/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cleanData)
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to create property');
      }
      
      setSuccess('Property created successfully! Your property will be reviewed by admin.');
      
      setFormData({
        propertyName: '',
        propertyDescription: '',
        propertyLocation: '',
        propertyType: '',
        propertyOwner: userId,
        propertyAmenities: [],
        bedrooms: '',
        bathrooms: '',
        livingArea: '',
        assignedSales: null,
        price: '',
        status: 'Pending Review',
        gardenArea: '',
        roofArea: '',
        offers: [],
        images: []
      });
      setImagePreviews([]);
      setAmenityInput('');
      
      window.scrollTo(0, 0);
      
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
      
    } catch (err) {
      console.error('Error creating property:', err);
      setError(err.message || 'Failed to create property. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-property-page">
      <div className="create-property-container">
        <div className="create-property-header">
          <h1>List Your Property</h1>
          <p>Fill in the details below to list your property for sale or rent</p>
        </div>

        {error && (
          <div className="error-alert">
            <span>⚠️</span>
            <p>{error}</p>
            <button onClick={() => setError('')} className="close-alert">×</button>
          </div>
        )}

        {success && (
          <div className="success-alert">
            <span>✓</span>
            <p>{success}</p>
            <button onClick={() => setSuccess('')} className="close-alert">×</button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="property-form">
          <div className="form-section">
            <h2>Basic Information</h2>
            <div className="form-grid">
              <div className="form-group">
                <label>Property Name *</label>
                <input
                  type="text"
                  name="propertyName"
                  value={formData.propertyName}
                  onChange={handleChange}
                  placeholder="e.g., Luxury Villa in Palm Hills"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Property Type *</label>
                <select
                  name="propertyType"
                  value={formData.propertyType}
                  onChange={handleChange}
                  className="form-input"
                >
                  <option value="">Select type</option>
                  {propertyTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div className="form-group full-width">
                <label>Property Description *</label>
                <textarea
                  name="propertyDescription"
                  value={formData.propertyDescription}
                  onChange={handleChange}
                  placeholder="Describe your property in detail..."
                  rows="4"
                  className="form-textarea"
                />
              </div>

              <div className="form-group full-width">
                <label>Location *</label>
                <input
                  type="text"
                  name="propertyLocation"
                  value={formData.propertyLocation}
                  onChange={handleChange}
                  placeholder="Full address, e.g., 123 Nile Street, Cairo"
                  className="form-input"
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2>Property Details</h2>
            <div className="form-grid">
              <div className="form-group">
                <label>Bedrooms *</label>
                <input
                  type="number"
                  name="bedrooms"
                  value={formData.bedrooms}
                  onChange={handleNumberChange}
                  min="0"
                  step="1"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Bathrooms *</label>
                <input
                  type="number"
                  name="bathrooms"
                  value={formData.bathrooms}
                  onChange={handleNumberChange}
                  min="0"
                  step="0.5"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Living Area (sqm)</label>
                <input
                  type="number"
                  name="livingArea"
                  value={formData.livingArea}
                  onChange={handleNumberChange}
                  min="0"
                  step="1"
                  placeholder="e.g., 150"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Garden Area (sqm)</label>
                <input
                  type="number"
                  name="gardenArea"
                  value={formData.gardenArea}
                  onChange={handleNumberChange}
                  min="0"
                  step="1"
                  placeholder="If applicable"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Roof Area (sqm)</label>
                <input
                  type="number"
                  name="roofArea"
                  value={formData.roofArea}
                  onChange={handleNumberChange}
                  min="0"
                  step="1"
                  placeholder="If applicable"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Price (EGP) *</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleNumberChange}
                  min="0"
                  placeholder="Enter price"
                  className="form-input"
                />
              </div>
            </div>
          </div>

          {/* Amenities Section - FIXED WORKING VERSION */}
          <div className="form-section">
            <h2>Amenities</h2>
            
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                <input
                  type="text"
                  value={amenityInput}
                  onChange={(e) => setAmenityInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addAmenity();
                    }
                  }}
                  placeholder="Type amenity (e.g., Swimming Pool, Gym, Parking)"
                  style={{
                    flex: 1,
                    minWidth: '200px',
                    padding: '12px 16px',
                    border: '2px solid #4caf50',
                    borderRadius: '8px',
                    fontSize: '16px',
                    backgroundColor: '#ffffff',
                    color: '#333333',
                    outline: 'none'
                  }}
                />
                <button
                  type="button"
                  onClick={addAmenity}
                  style={{
                    padding: '12px 24px',
                    background: '#4caf50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '14px'
                  }}
                  onMouseEnter={(e) => e.target.style.background = '#388e3c'}
                  onMouseLeave={(e) => e.target.style.background = '#4caf50'}
                >
                  + Add Amenity
                </button>
              </div>
            </div>
            
            <div style={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: '10px', 
              padding: '15px', 
              background: '#f9f9f9', 
              borderRadius: '8px',
              minHeight: '80px',
              border: '1px dashed #ddd'
            }}>
              {formData.propertyAmenities && formData.propertyAmenities.length > 0 ? (
                formData.propertyAmenities.map((amenity, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      background: '#e8f5e9',
                      color: '#2e7d32',
                      padding: '6px 12px',
                      borderRadius: '20px',
                      fontSize: '14px',
                      fontWeight: '500'
                    }}
                  >
                    <span>{amenity}</span>
                    <button
                      type="button"
                      onClick={() => removeAmenity(index)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '18px',
                        fontWeight: 'bold',
                        color: '#ef5350',
                        padding: '0 4px',
                        borderRadius: '50%',
                        width: '22px',
                        height: '22px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = '#ef5350';
                        e.target.style.color = 'white';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = 'none';
                        e.target.style.color = '#ef5350';
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))
              ) : (
                <div style={{ width: '100%', textAlign: 'center', color: '#999', padding: '20px' }}>
                  No amenities added yet. Add swimming pool, gym, parking, etc.
                </div>
              )}
            </div>
          </div>

          {/* Image Upload Section */}
          <div className="form-section">
            <h2>Property Images</h2>
            <div className="images-section">
              <div className="images-input-group">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageSelect}
                  className="form-input"
                />
                <p className="image-note">Select images from your device. They will be saved directly to the database.</p>
              </div>
              
              <div className="images-preview">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="image-preview-item">
                    <img src={preview} alt={`Property ${index + 1}`} />
                    <button type="button" onClick={() => removeImage(index)} className="remove-image">×</button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" onClick={() => window.history.back()} className="cancel-btn">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="submit-btn">
              {loading ? 'Creating Property...' : 'List Property'}
            </button>
          </div>

          <p className="form-note">
            * Required fields. Images are saved directly to MongoDB database.
          </p>
        </form>
      </div>
    </div>
  );
};

export default CreateProperty;