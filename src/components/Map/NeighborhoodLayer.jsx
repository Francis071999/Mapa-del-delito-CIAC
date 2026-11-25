// src/components/Map/NeighborhoodLayer.jsx
import React from 'react';
import { Polygon, Tooltip } from 'react-leaflet';
import { NEIGHBORHOODS } from '../../data/neighborhoodData';

export const NeighborhoodLayer = ({ incidents, onSelectNeighborhood }) => {
  return (
    <>
      {NEIGHBORHOODS.map(n => {
        const nIncidents = incidents.filter(i => i.barrio === n.name);
        const count = nIncidents.length;

        return (
          <Polygon
            key={n.id}
            positions={n.coordinates}
            eventHandlers={{
              click: () => onSelectNeighborhood(n)
            }}
            pathOptions={{
              color: n.color || '#1e40af',
              weight: 2,
              fillColor: n.color || '#3b82f6',
              fillOpacity: 0.45
            }}
          >
            <Tooltip sticky>
              <div style={{ fontSize: '12px' }}>
                <strong style={{ color: n.color }}>{n.name}</strong><br/>
                Incidentes registrados: <b>{count}</b>
              </div>
            </Tooltip>
          </Polygon>
        );
      })}
    </>
  );
};