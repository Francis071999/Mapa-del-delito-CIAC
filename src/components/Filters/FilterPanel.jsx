// src/components/Filters/FilterPanel.jsx
import React from 'react';
import { CRIME_TYPES } from '../../data/crimeData';
import { Filter, Calendar, Layers, RotateCcw } from 'lucide-react';

export const FilterPanel = ({ 
  selectedMonth, 
  setSelectedMonth, 
  selectedCrimes, 
  setSelectedCrimes,
  selectedSubcategory,
  setSelectedSubcategory,
  contextualLayers,
  setContextualLayers,
  isAllYear,
  setIsAllYear,
  onResetFilters
}) => {

  const months = [
    { id: 'all', label: 'Todo el año 2026' },
    { id: '01', label: 'Enero' },
    { id: '02', label: 'Febrero' },
    { id: '03', label: 'Marzo' },
    { id: '04', label: 'Abril' },
    { id: '05', label: 'Mayo' },
    { id: '06', label: 'Junio' },
    { id: '07', label: 'Julio' },
    { id: '08', label: 'Agosto' },
    { id: '09', label: 'Septiembre' },
    { id: '10', label: 'Octubre' },
    { id: '11', label: 'Noviembre' },
    { id: '12', label: 'Diciembre' }
  ];

  const toggleCrime = (id) => {
    if (selectedCrimes.includes(id)) {
      setSelectedCrimes(selectedCrimes.filter(c => c !== id));
    } else {
      setSelectedCrimes([...selectedCrimes, id]);
    }
  };

  const selectAllCrimes = () => setSelectedCrimes(CRIME_TYPES.map(c => c.id));
  const clearCrimes = () => setSelectedCrimes([]);

  const toggleContextLayer = (key) => {
    setContextualLayers({ ...contextualLayers, [key]: !contextualLayers[key] });
  };

  // Obtener subcategorías disponibles según categorías seleccionadas
  const activeSubcategories = CRIME_TYPES
    .filter(c => selectedCrimes.includes(c.id))
    .flatMap(c => c.subcategories);

  return (
    <aside className="filter-panel-container">
      <div className="filter-panel-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Filter size={16} />
          <span style={{ fontWeight: '700', fontSize: '13px' }}>FILTROS CIAC</span>
        </div>
        <button onClick={onResetFilters} className="btn-reset-filters" title="Limpiar todos los filtros">
          <RotateCcw size={14} />
          <span>Limpiar</span>
        </button>
      </div>

      {/* Sección Período */}
      <div className="filter-section">
        <div className="filter-section-title">
          <Calendar size={15} />
          <span>PERÍODO DE ANÁLISIS</span>
        </div>
        
        <button 
          onClick={() => { setIsAllYear(true); setSelectedMonth('all'); }}
          className={`btn-year-toggle ${isAllYear ? 'active' : ''}`}
        >
          🌐 TODO EL AÑO 2026
        </button>

        <select 
          value={selectedMonth} 
          onChange={(e) => {
            setSelectedMonth(e.target.value);
            setIsAllYear(e.target.value === 'all');
          }}
          className="filter-select"
        >
          {months.map(m => (
            <option key={m.id} value={m.id}>{m.label}</option>
          ))}
        </select>
      </div>

      {/* Tipos de Incidentes */}
      <div className="filter-section">
        <div className="filter-section-title">
          <Filter size={15} />
          <span>DELITOS</span>
        </div>

        <div className="filter-quick-actions">
          <button onClick={selectAllCrimes} className="btn-link">Marcar todas</button>
          <button onClick={clearCrimes} className="btn-link">Desmarcar</button>
        </div>

        <div className="filter-checkbox-list">
          {CRIME_TYPES.map(crime => {
            const isChecked = selectedCrimes.includes(crime.id);
            return (
              <label key={crime.id} className="filter-checkbox-label">
                <input 
                  type="checkbox" 
                  checked={isChecked} 
                  onChange={() => toggleCrime(crime.id)}
                />
                <span className="crime-color-dot" style={{ backgroundColor: crime.color }}></span>
                <span className="crime-label-text">{crime.label}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Subcategorías Segmentadas */}
      {activeSubcategories.length > 0 && (
        <div className="filter-section">
          <div className="filter-section-title">
            <span>SUBCATEGORÍA ESPECÍFICA</span>
          </div>
          <select
            value={selectedSubcategory}
            onChange={(e) => setSelectedSubcategory(e.target.value)}
            className="filter-select"
          >
            <option value="ALL">Todas las subcategorías</option>
            {Array.from(new Set(activeSubcategories)).map(sub => (
              <option key={sub} value={sub}>{sub}</option>
            ))}
          </select>
        </div>
      )}

      {/* Capas Contextuales */}
      <div className="filter-section">
        <div className="filter-section-title">
          <Layers size={15} />
          <span>CAPAS CONTEXTUALES</span>
        </div>

        <div className="filter-checkbox-list">
          {[
            { key: 'comisarias', label: 'Comisarías y CIAC' },
            { key: 'motorizada', label: 'Patrulla Motorizada' },
            { key: 'casaCultura', label: 'Casa de la Cultura' },
            { key: 'salud', label: 'Hospital y CAPS' },
            { key: 'bomberos', label: 'Bomberos Voluntarios' }
          ].map(layer => (
            <label key={layer.key} className="filter-checkbox-label space-between">
              <span>{layer.label}</span>
              <input 
                type="checkbox" 
                checked={contextualLayers[layer.key] || false} 
                onChange={() => toggleContextLayer(layer.key)}
              />
            </label>
          ))}
        </div>
      </div>

      <div className="filter-footer-notice">
        <p>
          Registros georreferenciados del Municipio de Bella Vista, Tucumán. Los datos no confirmados se muestran como ficticios.
        </p>
      </div>
    </aside>
  );
};