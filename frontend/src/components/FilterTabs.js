import React, { useState } from 'react';
import { Chip, Box } from '@mui/material';

const filters = [
  { label: 'All Post', value: 'all' },
  { label: 'For You', value: 'for-you' },
  { label: 'Most Liked', value: 'most-liked' },
  { label: 'Most Commented', value: 'most-commented' },
  { label: 'Most Shared', value: 'most-shared' },
];

const FilterTabs = ({ onFilterChange }) => {
  const [activeFilter, setActiveFilter] = useState('all');

  const handleFilterClick = (value) => {
    setActiveFilter(value);
    if (onFilterChange) {
      onFilterChange(value);
    }
  };

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        gap: 1, 
        mb: 2, 
        overflowX: 'auto',
        pb: 1,
        '&::-webkit-scrollbar': { display: 'none' },
        scrollbarWidth: 'none'
      }}
    >
      {filters.map((filter) => (
        <Chip
          key={filter.value}
          label={filter.label}
          onClick={() => handleFilterClick(filter.value)}
          sx={{
            backgroundColor: activeFilter === filter.value ? '#1976d2' : 'white',
            color: activeFilter === filter.value ? 'white' : '#666',
            border: activeFilter === filter.value ? 'none' : '1px solid #e0e0e0',
            fontWeight: activeFilter === filter.value ? 'bold' : 'normal',
            '&:hover': {
              backgroundColor: activeFilter === filter.value ? '#1565c0' : '#f5f5f5',
            },
            whiteSpace: 'nowrap'
          }}
        />
      ))}
    </Box>
  );
};

export default FilterTabs;
