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
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [success, setSuccess]   = useState('');

  const propertyTypes = ['Apartment', 'House', 'Villa', 'Townhouse', 'Land', 'Commercial', 'Studio'];

  const convertToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload  = () => resolve(reader.result);
      reader.onerror = (err) => reject(err);
    });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value === '' ? '' : Number(value) }));
  };

  const addAmenity = () => {
    if (amenityInput && amenityInput.trim()) {
      setFormData(prev => ({ ...prev, propertyAmenities: [...prev.propertyAmenities, amenityInput.trim()] }));
      setAmenityInput('');
    }
  };

  const removeAmenity = (i) =>
    setFormData(prev => ({ ...prev, propertyAmenities: prev.propertyAmenities.filter((_, idx) => idx !== i) }));

  const handleImageSelect = async (e) => {
    const files = Array.from(e.target.files);
    for (const file of files) {
      try {
        const b64 = await convertToBase64(file);
        setFormData(prev => ({ ...prev, images: [...prev.images, b64] }));
        setImagePreviews(prev => [...prev, b64]);
      } catch {}
    }
  };

  const removeImage = (i) => {
    setFormData(prev => ({ ...prev, images: prev.images.filter((_, idx) => idx !== i) }));
    setImagePreviews(prev => prev.filter((_, idx) => idx !== i));
  };

  const validateForm = () => {
    const required = ['propertyName', 'propertyDescription', 'propertyLocation', 'propertyType', 'bedrooms', 'bathrooms', 'price'];
    for (let field of required) {
      if (!formData[field]) {
        setError(`Please fill in: ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return false;
      }
    }
    if (formData.bedrooms <= 0 || formData.bathrooms <= 0) { setError('Bedrooms and bathrooms must be greater than 0.'); return false; }
    if (formData.price <= 0) { setError('Price must be greater than 0.'); return false; }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (!validateForm()) return;
    setLoading(true);
    try {
      const cleanData = { ...formData };
      if (!cleanData.assignedSales) delete cleanData.assignedSales;
      if (!cleanData.livingArea)    delete cleanData.livingArea;
      if (!cleanData.gardenArea)    delete cleanData.gardenArea;
      if (!cleanData.roofArea)      delete cleanData.roofArea;
      if (cleanData.offers.length === 0) delete cleanData.offers;

      const response = await fetch('http://localhost:4000/property/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cleanData)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to create property');

      setSuccess('Property created successfully! It will be reviewed by admin before going live.');
      setFormData({
        propertyName: '', propertyDescription: '', propertyLocation: '', propertyType: '',
        propertyOwner: userId, propertyAmenities: [], bedrooms: '', bathrooms: '', livingArea: '',
        assignedSales: null, price: '', status: 'Pending Review', gardenArea: '', roofArea: '',
        offers: [], images: []
      });
      setImagePreviews([]); setAmenityInput('');
      window.scrollTo(0, 0);
      setTimeout(() => { window.location.href = '/'; }, 2200);
    } catch (err) {
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
          <p>Fill in the details below to submit your property for review.</p>
        </div>

        {error && (
          <div className="error-alert">
            <span>!</span>
            <p>{error}</p>
            <button onClick={() => setError('')} className="close-alert">&times;</button>
          </div>
        )}
        {success && (
          <div className="success-alert">
            <span>✓</span>
            <p>{success}</p>
            <button onClick={() => setSuccess('')} className="close-alert">&times;</button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="property-form">

          {/* Basic Information */}
          <div className="form-section">
            <h2>Basic Information</h2>
            <div className="form-grid">
              <div className="form-group">
                <label>Property Name *</label>
                <input type="text" name="propertyName" value={formData.propertyName} onChange={handleChange}
                  placeholder="e.g. Luxury Villa in Palm Hills" className="form-input" />
              </div>

              <div className="form-group">
                <label>Property Type *</label>
                <select name="propertyType" value={formData.propertyType} onChange={handleChange} className="form-input">
                  <option value="">Select type</option>
                  {propertyTypes.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div className="form-group full-width">
                <label>Description *</label>
                <textarea name="propertyDescription" value={formData.propertyDescription} onChange={handleChange}
                  placeholder="Describe your property in detail..." rows="4" className="form-textarea" />
              </div>

              <div className="form-group full-width">
                <label>Location *</label>
                <input type="text" name="propertyLocation" value={formData.propertyLocation} onChange={handleChange}
                  placeholder="Full address, e.g. 123 Nile Street, Cairo" className="form-input" />
              </div>
            </div>
          </div>

          {/* Property Details */}
          <div className="form-section">
            <h2>Property Details</h2>
            <div className="form-grid">
              <div className="form-group">
                <label>Bedrooms *</label>
                <input type="number" name="bedrooms" value={formData.bedrooms} onChange={handleNumberChange}
                  min="0" step="1" placeholder="0" className="form-input" />
              </div>

              <div className="form-group">
                <label>Bathrooms *</label>
                <input type="number" name="bathrooms" value={formData.bathrooms} onChange={handleNumberChange}
                  min="0" step="0.5" placeholder="0" className="form-input" />
              </div>

              <div className="form-group">
                <label>Living Area (m²)</label>
                <input type="number" name="livingArea" value={formData.livingArea} onChange={handleNumberChange}
                  min="0" step="1" placeholder="e.g. 150" className="form-input" />
              </div>

              <div className="form-group">
                <label>Garden Area (m²)</label>
                <input type="number" name="gardenArea" value={formData.gardenArea} onChange={handleNumberChange}
                  min="0" step="1" placeholder="If applicable" className="form-input" />
              </div>

              <div className="form-group">
                <label>Roof Area (m²)</label>
                <input type="number" name="roofArea" value={formData.roofArea} onChange={handleNumberChange}
                  min="0" step="1" placeholder="If applicable" className="form-input" />
              </div>

              <div className="form-group">
                <label>Price (EGP) *</label>
                <input type="number" name="price" value={formData.price} onChange={handleNumberChange}
                  min="0" placeholder="Enter price" className="form-input" />
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div className="form-section">
            <h2>Amenities</h2>
            <div className="amenities-input-row">
              <input
                type="text"
                value={amenityInput}
                onChange={(e) => setAmenityInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addAmenity(); } }}
                placeholder="Type amenity then press Enter or click Add..."
                className="form-input"
                style={{ flex: 1, minWidth: '200px' }}
              />
              <button type="button" onClick={addAmenity} className="add-amenity-btn">
                + Add
              </button>
            </div>
            <div className="amenities-pool">
              {formData.propertyAmenities.length > 0
                ? formData.propertyAmenities.map((a, i) => (
                    <div key={i} className="amenity-pill">
                      <span>{a}</span>
                      <button type="button" className="amenity-pill-remove" onClick={() => removeAmenity(i)}>
                        &times;
                      </button>
                    </div>
                  ))
                : <span className="amenities-empty-hint">No amenities added yet — e.g. Swimming Pool, Gym, Parking...</span>
              }
            </div>
          </div>

          {/* Images */}
          <div className="form-section">
            <h2>Property Images</h2>
            <div className="images-section">
              <div className="images-input-group">
                <input type="file" accept="image/*" multiple onChange={handleImageSelect} className="form-input" />
                <p className="image-note">Supported formats: JPG, PNG, WEBP. Images are stored directly in the database.</p>
              </div>
              {imagePreviews.length > 0 && (
                <div className="images-preview">
                  {imagePreviews.map((preview, i) => (
                    <div key={i} className="image-preview-item">
                      <img src={preview} alt={`Property ${i + 1}`} />
                      <button type="button" onClick={() => removeImage(i)} className="remove-image">&times;</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="form-actions">
            <button type="button" onClick={() => window.history.back()} className="cancel-btn">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="submit-btn">
              {loading ? 'Submitting...' : 'Submit for Review'}
            </button>
          </div>
          <p className="form-note">* Required fields. Property goes live after admin approval.</p>

        </form>
      </div>
    </div>
  );
};

export default CreateProperty;