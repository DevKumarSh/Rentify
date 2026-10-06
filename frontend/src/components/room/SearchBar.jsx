import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Building, ArrowRight } from 'lucide-react';
import { POPULAR_CITIES, ROOM_TYPES } from '../../utils/constants';
import './SearchBar.css';

const SearchBar = ({ initialValues = {}, onSearch }) => {
  const [city, setCity] = useState(initialValues.city || '');
  const [keyword, setKeyword] = useState(initialValues.keyword || '');
  const [roomType, setRoomType] = useState(initialValues.roomType || '');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const queryParams = new URLSearchParams();
    if (city) queryParams.set('city', city);
    if (keyword) queryParams.set('keyword', keyword);
    if (roomType) queryParams.set('roomType', roomType);

    if (onSearch) {
      onSearch({ city, keyword, roomType });
    } else {
      navigate(`/rooms?${queryParams.toString()}`);
    }
  };

  return (
    <form className="hero-search-bar card" onSubmit={handleSubmit}>
      {/* City Select */}
      <div className="search-field">
        <div className="search-field-icon">
          <MapPin size={18} color="var(--primary)" />
        </div>
        <div className="search-field-content">
          <label className="search-label">Location</label>
          <select
            className="search-select-input"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          >
            <option value="">Select City</option>
            {POPULAR_CITIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="search-divider" />

      {/* Room Type */}
      <div className="search-field">
        <div className="search-field-icon">
          <Building size={18} color="var(--primary)" />
        </div>
        <div className="search-field-content">
          <label className="search-label">Room Type</label>
          <select
            className="search-select-input"
            value={roomType}
            onChange={(e) => setRoomType(e.target.value)}
          >
            <option value="">Any Type (1 BHK, PG, Shared)</option>
            {ROOM_TYPES.map((rt) => (
              <option key={rt.value} value={rt.value}>{rt.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="search-divider" />

      {/* Keyword / Area */}
      <div className="search-field flex-grow">
        <div className="search-field-icon">
          <Search size={18} color="var(--primary)" />
        </div>
        <div className="search-field-content">
          <label className="search-label">Locality or Landmark</label>
          <input
            type="text"
            className="search-text-input"
            placeholder="e.g. Kothrud, Hitec City, Hebbal..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>
      </div>

      {/* Submit CTA */}
      <button type="submit" className="btn btn-primary search-submit-btn">
        <span>Find Rooms</span>
        <ArrowRight size={18} />
      </button>
    </form>
  );
};

export default SearchBar;
