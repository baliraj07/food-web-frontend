import { createContext, useContext, useState, useCallback } from 'react';

const FilterContext = createContext();

export const useFilter = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useFilter must be used within FilterProvider');
  }
  return context;
};

export const FilterProvider = ({ children }) => {
  const [search, setSearch] = useState('');
  const [minRating, setMinRating] = useState(0);
  const [priceRange, setPriceRange] = useState('all'); // 'all'|'low'(<300)|'med'(300-700)|'high'(>700)

  const resetFilters = useCallback(() => {
    setSearch('');
    setMinRating(0);
    setPriceRange('all');
  }, []);

  return (
    <FilterContext.Provider value={{
      search, setSearch,
      minRating, setMinRating,
      priceRange, setPriceRange,
      resetFilters
    }}>
      {children}
    </FilterContext.Provider>
  );
};
