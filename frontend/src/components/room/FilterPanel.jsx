import React from 'react';
import {
  POPULAR_CITIES,
  GENDER_PREFERENCES,
  FURNISHING_STATUSES,
  ROOM_TYPES,
  AVAILABILITY_STATUSES
} from '../../utils/constants';
import { Filter, RotateCcw, X } from 'lucide-react';
import './FilterPanel.css';

const FilterPanel = ({ filters, onChange, onReset, onCloseMobile }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onChange({ [name]: value });
  };

  return (
    <div className="filter-panel-card card">
      <div className="filter-panel-header">
        <div className="filter-title-wrap">
          <Filter size={18} color="var(--primary)" />
          <h3>Filters</h3>
        </div>
        <div className="filter-actions-wrap">
          <button type="button" className="btn-reset-filters" onClick={onReset} title="Reset all filters">
            <RotateCcw size={14} />
            <span>Reset</span>
          </button>
          {onCloseMobile && (
            <button type="button" className="btn-close-filter-mobile" onClick={onCloseMobile}>
              <X size={20} />
            </button>
          )}
        </div>
      </div>

      <div className="filter-body">
        {/* City Filter */}
        <div className="form-group">
          <label className="form-label">City / Location</label>
          <select
            name="city"
            className="form-select"
            value={filters.city || ''}
            onChange={handleInputChange}
          >
            <option value="">All Cities</option>
            {POPULAR_CITIES.map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>

        {/* Locality Input */}
        <div className="form-group">
          <label className="form-label">Locality / Landmark</label>
          <input
            type="text"
            name="locality"
            className="form-input"
            placeholder="e.g. Kothrud, Hinjewadi"
            value={filters.locality || ''}
            onChange={handleInputChange}
          />
        </div>

        {/* Budget Rent Range */}
        <div className="form-group">
          <label className="form-label">Monthly Rent (₹)</label>
          <div className="rent-range-inputs">
            <input
              type="number"
              name="minRent"
              className="form-input"
              placeholder="Min ₹"
              value={filters.minRent || ''}
              onChange={handleInputChange}
            />
            <span className="rent-separator">-</span>
            <input
              type="number"
              name="maxRent"
              className="form-input"
              placeholder="Max ₹"
              value={filters.maxRent || ''}
              onChange={handleInputChange}
            />
          </div>
        </div>

        {/* Gender Preference */}
        <div className="form-group">
          <label className="form-label">Gender / Tenant Preference</label>
          <select
            name="genderPreference"
            className="form-select"
            value={filters.genderPreference || 'ANY'}
            onChange={handleInputChange}
          >
            {GENDER_PREFERENCES.map((gp) => (
              <option key={gp.value} value={gp.value}>{gp.label}</option>
            ))}
          </select>
        </div>

        {/* Room Type */}
        <div className="form-group">
          <label className="form-label">Room / Accommodation Type</label>
          <select
            name="roomType"
            className="form-select"
            value={filters.roomType || ''}
            onChange={handleInputChange}
          >
            <option value="">Any Room Type</option>
            {ROOM_TYPES.map((rt) => (
              <option key={rt.value} value={rt.value}>{rt.label}</option>
            ))}
          </select>
        </div>

        {/* Furnishing */}
        <div className="form-group">
          <label className="form-label">Furnishing Status</label>
          <select
            name="furnishingStatus"
            className="form-select"
            value={filters.furnishingStatus || ''}
            onChange={handleInputChange}
          >
            <option value="">Any Furnishing</option>
            {FURNISHING_STATUSES.map((fs) => (
              <option key={fs.value} value={fs.value}>{fs.label}</option>
            ))}
          </select>
        </div>

        {/* Availability */}
        <div className="form-group">
          <label className="form-label">Availability</label>
          <select
            name="availabilityStatus"
            className="form-select"
            value={filters.availabilityStatus || ''}
            onChange={handleInputChange}
          >
            <option value="">All Statuses</option>
            {AVAILABILITY_STATUSES.map((as) => (
              <option key={as.value} value={as.value}>{as.label}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
