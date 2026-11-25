import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { CRIME_TYPES } from '../../data/crimeData';

export const CrimeMarker = ({ incident, onSelectIncident }) => {
  const crimeTypeObj = CRIME_TYPES.find(c => c.id === incident.tipo) || { color: '#3b82f6' };

  // Crear SVG Icon personalizado por delito
  const customIcon = L.divIcon({
    className: 'custom-crime-icon',
    html: `<div style="
      background-color: ${crimeTypeObj.color};
      width: 12px;
      height: 12px;
      border-radius: 50%;
      border: 2px solid white;
      box-shadow: 0 0 4px rgba(0,0,0,0.4);
    "></div>`,
    iconSize: [12, 12],
    iconAnchor: [6, 6]
  });

  return (
    <Marker 
      position={[incident.latitud, incident.longitud]} 
      icon={customIcon}
    >
      <Popup>
        <div style={{ fontSize: '13px' }}>
          <strong style={{ color: crimeTypeObj.color }}>{incident.tipo}</strong><br />
          <b>Barrio:</b> {incident.barrio}<br />
          <b>Fecha:</b> {incident.fecha} {incident.hora}<br />
          <button 
            onClick={() => onSelectIncident(incident)}
            style={{
              marginTop: '6px',
              padding: '4px 8px',
              backgroundColor: 'var(--accent-blue)',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '11px'
            }}
          >
            Ver Ficha Completa
          </button>
        </div>
      </Popup>
    </Marker>
  );
};