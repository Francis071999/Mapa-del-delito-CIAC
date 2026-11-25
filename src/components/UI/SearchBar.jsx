import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { NEIGHBORHOODS } from '../../data/neighborhoodData';

export const SearchBar = ({ onSelectNeighborhood }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setQuery(val);

    if (val.trim().length > 0) {
      const matches = NEIGHBORHOODS.filter(n => 
        n.name.toLowerCase().includes(val.toLowerCase())
      );
      setSuggestions(matches);
    } else {
      setSuggestions([]);
    }
  };

  const handleSelect = (neighborhood) => {
    setQuery(neighborhood.name);
    setSuggestions([]);
    onSelectNeighborhood(neighborhood);
  };

  return (
    <div style={{
      position: 'absolute',
      top: '16px',
      left: '16px',
      zIndex: 1000,
      width: '280px'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-color)',
        borderRadius: '8px',
        padding: '0 12px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
      }}>
        <Search size={16} color="var(--text-secondary)" />
        <input 
          type="text" 
          value={query} 
          onChange={handleInputChange} 
          placeholder="Buscar barrio..."
          style={{
            border: 'none',
            outline: 'none',
            padding: '10px',
            backgroundColor: 'transparent',
            color: 'var(--text-primary)',
            width: '100%',
            fontSize: '13px'
          }}
        />
      </div>

      {suggestions.length > 0 && (
        <ul style={{
          listStyle: 'none',
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-color)',
          borderRadius: '8px',
          marginTop: '4px',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden'
        }}>
          {suggestions.map(n => (
            <li 
              key={n.id}
              onClick={() => handleSelect(n)}
              style={{
                padding: '10px 14px',
                fontSize: '13px',
                cursor: 'pointer',
                color: 'var(--text-primary)',
                borderBottom: '1px solid var(--border-color)'
              }}
            >
              {n.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};