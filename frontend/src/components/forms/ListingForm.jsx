import React, { useState } from 'react';
import {
  POPULAR_CITIES,
  GENDER_PREFERENCES,
  FURNISHING_STATUSES,
  ROOM_TYPES,
  DEFAULT_AMENITIES
} from '../../utils/constants';
import { validateRoomForm } from '../../utils/validators';
import ImageUploader from './ImageUploader';
import { Building, Save, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const ListingForm = ({ initialValues = {}, onSubmit, isSubmitting = false, isEdit = false }) => {
  const [formData, setFormData] = useState({
    title: initialValues.title || '',
    description: initialValues.description || '',
    rent: initialValues.rent || '',
    securityDeposit: initialValues.securityDeposit || '',
    city: initialValues.city || 'Pune',
    locality: initialValues.locality || '',
    address: initialValues.address || '',
    genderPreference: initialValues.genderPreference || 'ANY',
    furnishingStatus: initialValues.furnishingStatus || 'FULLY_FURNISHED',
    roomType: initialValues.roomType || 'ONE_BHK',
    amenities: initialValues.amenities || ['WiFi (High Speed)', 'Attached Bathroom', 'Geyser / Hot Water'],
    images: initialValues.images || [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1000&q=80'
    ]
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleAmenityToggle = (amenity) => {
    setFormData((prev) => {
      const exists = prev.amenities.includes(amenity);
      return {
        ...prev,
        amenities: exists
          ? prev.amenities.filter((a) => a !== amenity)
          : [...prev.amenities, amenity]
      };
    });
  };

  const handleImagesChange = (newImages) => {
    setFormData((prev) => ({ ...prev, images: newImages }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateRoomForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="card" style={{ padding: '2rem' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1.75rem',
        paddingBottom: '1rem',
        borderBottom: '1px solid var(--border-light)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--primary-light)',
            color: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Building size={22} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>
              {isEdit ? 'Edit Room Listing' : 'Create New Room Listing'}
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Fill in the property details. All genuine listings are verified within 24 hours.
            </p>
          </div>
        </div>

        <Link to="/owner/rooms" className="btn btn-sm btn-secondary">
          <ArrowLeft size={16} /> Back to Listings
        </Link>
      </div>

      {/* Basic Title & Details */}
      <div className="form-group">
        <label className="form-label">Listing Title *</label>
        <input
          type="text"
          name="title"
          className={`form-input ${errors.title ? 'error' : ''}`}
          placeholder="e.g. Spacious 1 BHK Flat near MIT World Peace University"
          value={formData.title}
          onChange={handleInputChange}
          required
        />
        {errors.title && <p className="form-error">{errors.title}</p>}
      </div>

      <div className="form-group">
        <label className="form-label">Full Description *</label>
        <textarea
          name="description"
          rows={4}
          className={`form-textarea ${errors.description ? 'error' : ''}`}
          placeholder="Describe room layout, nearby transit, rules, utilities included, etc."
          value={formData.description}
          onChange={handleInputChange}
          required
        />
        {errors.description && <p className="form-error">{errors.description}</p>}
      </div>

      {/* Pricing Row */}
      <div className="grid grid-cols-2" style={{ marginBottom: '1.25rem' }}>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Monthly Rent (₹) *</label>
          <input
            type="number"
            name="rent"
            className={`form-input ${errors.rent ? 'error' : ''}`}
            placeholder="e.g. 9500"
            value={formData.rent}
            onChange={handleInputChange}
            required
          />
          {errors.rent && <p className="form-error">{errors.rent}</p>}
        </div>

        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Security Deposit (₹)</label>
          <input
            type="number"
            name="securityDeposit"
            className={`form-input ${errors.securityDeposit ? 'error' : ''}`}
            placeholder="e.g. 15000"
            value={formData.securityDeposit}
            onChange={handleInputChange}
          />
          {errors.securityDeposit && <p className="form-error">{errors.securityDeposit}</p>}
        </div>
      </div>

      {/* Location Details */}
      <div className="grid grid-cols-2" style={{ marginBottom: '1.25rem' }}>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">City *</label>
          <select
            name="city"
            className="form-select"
            value={formData.city}
            onChange={handleInputChange}
            required
          >
            {POPULAR_CITIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Locality / Area *</label>
          <input
            type="text"
            name="locality"
            className={`form-input ${errors.locality ? 'error' : ''}`}
            placeholder="e.g. Kothrud, Hinjewadi"
            value={formData.locality}
            onChange={handleInputChange}
            required
          />
          {errors.locality && <p className="form-error">{errors.locality}</p>}
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Complete Street Address</label>
        <input
          type="text"
          name="address"
          className="form-input"
          placeholder="e.g. Plot 42, Ideal Colony, Near Paud Road"
          value={formData.address}
          onChange={handleInputChange}
        />
      </div>

      {/* Room Specifications */}
      <div className="grid grid-cols-3" style={{ marginBottom: '1.25rem' }}>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Room Type *</label>
          <select
            name="roomType"
            className="form-select"
            value={formData.roomType}
            onChange={handleInputChange}
          >
            {ROOM_TYPES.map((rt) => (
              <option key={rt.value} value={rt.value}>{rt.label}</option>
            ))}
          </select>
        </div>

        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Gender Preference *</label>
          <select
            name="genderPreference"
            className="form-select"
            value={formData.genderPreference}
            onChange={handleInputChange}
          >
            {GENDER_PREFERENCES.map((gp) => (
              <option key={gp.value} value={gp.value}>{gp.label}</option>
            ))}
          </select>
        </div>

        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Furnishing Status *</label>
          <select
            name="furnishingStatus"
            className="form-select"
            value={formData.furnishingStatus}
            onChange={handleInputChange}
          >
            {FURNISHING_STATUSES.map((fs) => (
              <option key={fs.value} value={fs.value}>{fs.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Photos Section */}
      <div style={{ margin: '1.75rem 0' }}>
        <label className="form-label" style={{ fontSize: '1rem', marginBottom: '0.75rem' }}>
          Property Photos
        </label>
        <ImageUploader images={formData.images} onChange={handleImagesChange} />
      </div>

      {/* Amenities Checklist */}
      <div style={{ margin: '1.75rem 0' }}>
        <label className="form-label" style={{ fontSize: '1rem', marginBottom: '0.75rem' }}>
          Available Amenities
        </label>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '0.75rem'
        }}>
          {DEFAULT_AMENITIES.map((amenity) => {
            const isChecked = formData.amenities.includes(amenity);
            return (
              <label
                key={amenity}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.875rem',
                  color: isChecked ? 'var(--primary)' : 'var(--text-secondary)',
                  fontWeight: isChecked ? 600 : 400,
                  cursor: 'pointer',
                  backgroundColor: isChecked ? 'var(--primary-light)' : 'var(--bg-surface)',
                  padding: '0.6rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  transition: 'all 0.15s ease'
                }}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => handleAmenityToggle(amenity)}
                  style={{ accentColor: 'var(--primary)' }}
                />
                <span>{amenity}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Form Submission */}
      <div style={{
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '1rem',
        paddingTop: '1.5rem',
        borderTop: '1px solid var(--border-light)'
      }}>
        <Link to="/owner/rooms" className="btn btn-secondary">
          Cancel
        </Link>
        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
          <Save size={18} />
          <span>{isSubmitting ? 'Saving Listing...' : (isEdit ? 'Update Listing' : 'Publish Room Listing')}</span>
        </button>
      </div>
    </form>
  );
};

export default ListingForm;
