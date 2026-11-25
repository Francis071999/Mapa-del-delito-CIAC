// src/components/Panels/BarriosPanel.jsx
import React, { useState } from 'react';
import { Search, Building2, ChevronRight, Shield } from 'lucide-react';
import { NEIGHBORHOODS } from '../../data/neighborhoodData';
import { calculateStats } from '../../utils/statistics';

export const BarriosPanel = ({ incidents, onSelectNeighborhood }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredNeighborhoods = NEIGHBORHOODS.filter(n =>
    n.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="section-page-container">
      <div className="section-page-header">
        <div>
          <h2>📊 Panel de Análisis por Barrios</h2>
          <p>Consulta geográfica, indicadores y comparativa delictiva en Bella Vista, Tucumán.</p>
        </div>
        <div className="search-bar-inline">
          <Search size={16} color="var(--text-secondary)" />
          <input 
            type="text" 
            placeholder="Buscar barrio (ej. Centro, San Cayetano)..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="barrios-grid">
        {filteredNeighborhoods.map((n) => {
          const barrioIncidents = incidents.filter(i => i.barrio === n.name);
          const stats = calculateStats(barrioIncidents);

          return (
            <div key={n.id} className="barrio-card" onClick={() => onSelectNeighborhood(n)}>
              <div className="barrio-card-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Building2 size={20} color="var(--accent-blue)" />
                  <h3>{n.name}</h3>
                </div>
                <ChevronRight size={18} color="var(--text-secondary)" />
              </div>

              <div className="barrio-card-metrics">
                <div className="metric-box">
                  <small>TOTAL INCIDENTES</small>
                  <strong>{stats.total}</strong>
                </div>
                <div className="metric-box">
                  <small>DELITO FRECUENTE</small>
                  <strong style={{ fontSize: '12px' }}>{stats.topDelito}</strong>
                </div>
              </div>

              <div className="barrio-card-footer">
                <Shield size={14} />
                <span>Ver mapa y ficha detallada</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};