import React, { createContext, useContext, useState } from 'react';

const SearchContext = createContext(null);

export const SearchProvider = ({ children }) => {
  const [filters, setFilters] = useState({
    keyword: '',
    city: '',
    locality: '',
    minRent: '',
    maxRent: '',
    genderPreference: 'ANY',
    furnishingStatus: '',
    roomType: '',
    availabilityStatus: '',
    sort: 'newest'
  });

  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const resetFilters = () => {
    setFilters({
      keyword: '',
      city: '',
      locality: '',
      minRent: '',
      maxRent: '',
      genderPreference: 'ANY',
      furnishingStatus: '',
      roomType: '',
      availabilityStatus: '',
      sort: 'newest'
    });
  };

  return (
    <SearchContext.Provider value={{ filters, setFilters, updateFilters, resetFilters }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};
