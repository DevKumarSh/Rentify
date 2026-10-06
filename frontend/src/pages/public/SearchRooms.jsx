import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import FilterPanel from '../../components/room/FilterPanel';
import RoomGrid from '../../components/room/RoomGrid';
import Pagination from '../../components/common/Pagination';
import { roomService } from '../../services/roomService';
import { Filter, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import './SearchRooms.css';

const SearchRooms = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Read filters from URL
  const filters = {
    keyword: searchParams.get('keyword') || '',
    city: searchParams.get('city') || '',
    locality: searchParams.get('locality') || '',
    minRent: searchParams.get('minRent') || '',
    maxRent: searchParams.get('maxRent') || '',
    genderPreference: searchParams.get('genderPreference') || 'ANY',
    furnishingStatus: searchParams.get('furnishingStatus') || '',
    roomType: searchParams.get('roomType') || '',
    availabilityStatus: searchParams.get('availabilityStatus') || '',
    sort: searchParams.get('sort') || 'newest',
    page: parseInt(searchParams.get('page') || '0', 10)
  };

  const handleFilterChange = (newValues) => {
    const updated = new URLSearchParams(searchParams);
    Object.entries(newValues).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        updated.set(key, val);
      } else {
        updated.delete(key);
      }
    });
    updated.set('page', '0'); // Reset to first page
    setSearchParams(updated);
  };

  const handleResetFilters = () => {
    setSearchParams({});
  };

  const handlePageChange = (newPage) => {
    const updated = new URLSearchParams(searchParams);
    updated.set('page', newPage.toString());
    setSearchParams(updated);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true);
      try {
        const data = await roomService.searchRooms(filters);
        setRooms(data.content || []);
        setTotalElements(data.totalElements || 0);
        setTotalPages(data.totalPages || 1);
      } catch (err) {
        console.error('Error fetching rooms:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, [searchParams]);

  return (
    <div className="search-rooms-page">
      <div className="container">
        {/* Search Header Bar */}
        <div className="search-results-header">
          <div>
            <h1 className="search-page-title">Explore Rental Rooms</h1>
            <p className="search-page-subtitle">
              {loading ? 'Searching listings...' : `Showing ${totalElements} rooms available for rent`}
              {filters.city && ` in ${filters.city}`}
            </p>
          </div>

          <div className="search-header-controls">
            {/* Mobile Filter Toggle */}
            <button
              type="button"
              className="btn btn-secondary mobile-filter-btn"
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            >
              <SlidersHorizontal size={16} />
              <span>Filters</span>
            </button>

            {/* Sort Selector */}
            <div className="sort-selector-wrap">
              <ArrowUpDown size={15} color="var(--text-muted)" />
              <select
                className="sort-select"
                value={filters.sort}
                onChange={(e) => handleFilterChange({ sort: e.target.value })}
              >
                <option value="newest">Newest Listed</option>
                <option value="rent_asc">Rent: Low to High</option>
                <option value="rent_desc">Rent: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Main Content: Sidebar + Grid */}
        <div className="search-layout">
          {/* Desktop Filter Panel */}
          <aside className={`search-sidebar ${mobileFilterOpen ? 'mobile-open' : ''}`}>
            <FilterPanel
              filters={filters}
              onChange={handleFilterChange}
              onReset={handleResetFilters}
              onCloseMobile={() => setMobileFilterOpen(false)}
            />
          </aside>

          {/* Results Grid */}
          <main className="search-results-main">
            <RoomGrid rooms={rooms} loading={loading} />
            <Pagination
              currentPage={filters.page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </main>
        </div>
      </div>
    </div>
  );
};

export default SearchRooms;
