// src/components/Panels/ContextualPanel.jsx
import React from 'react';
import { CONTEXTUAL_LAYERS } from '../../data/contextualData';
import { MapPin, Phone, CheckCircle, Shield } from 'lucide-react';

export const ContextualPanel = ({ onFocusMapLocation }) => {
  const allPoints = Object.values(CONTEXTUAL_LAYERS).flat();

  return (
    <div className="section-page-container">
      <div className="section-page-header">
        <div>
          <h2>🗺️ Capas y Puntos Contextuales de Bella Vista</h2>
          <p>Instalaciones clave y puntos institucionales de referencia en el municipio.</p>
        </div>
      </div>

      <div className="contextual-grid">
        {allPoints.map((pt) => (
          <div key={pt.id} className="contextual-card">
            <div className="contextual-card-badge">
              <Shield size={14} />
              <span>{pt.category}</span>
            </div>

            <h3>{pt.name}</h3>
            
            <div className="contextual-card-info">
              <p><MapPin size={14} /> {pt.address}</p>
              {pt.phone && <p><Phone size={14} /> {pt.phone}</p>}
            </div>

            <p className="contextual-card-desc">{pt.description}</p>

            <div className="contextual-card-footer">
              <span className="badge-verified">
                <CheckCircle size={12} /> Verificado
              </span>
              <button className="btn-focus-map" onClick={() => onFocusMapLocation([pt.lat, pt.lng])}>
                Ubicación en Mapa
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};