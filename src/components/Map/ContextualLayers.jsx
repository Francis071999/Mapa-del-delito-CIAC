import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { CONTEXTUAL_LAYERS } from '../../data/contextualData';

const createIcon = (color) => L.divIcon({
  className: 'ctx-icon',
  html: `<div style="background:${color};width:10px;height:10px;border-radius:2px;border:1px solid #fff;"></div>`,
  iconSize: [10, 10]
});

export const ContextualLayers = ({ layers }) => {
  return (
    <>
      {layers.comisarias && CONTEXTUAL_LAYERS.comisarias.map(item => (
        <Marker key={item.id} position={[item.lat, item.lng]} icon={createIcon('#10b981')}>
          <Popup><b>POLICÍA:</b> {item.name}<br/>{item.address}</Popup>
        </Marker>
      ))}

      {layers.salud && CONTEXTUAL_LAYERS.salud.map(item => (
        <Marker key={item.id} position={[item.lat, item.lng]} icon={createIcon('#ef4444')}>
          <Popup><b>SALUD:</b> {item.name}<br/>{item.address}</Popup>
        </Marker>
      ))}

      {layers.educacion && CONTEXTUAL_LAYERS.educacion.map(item => (
        <Marker key={item.id} position={[item.lat, item.lng]} icon={createIcon('#f59e0b')}>
          <Popup><b>EDUCACIÓN:</b> {item.name}<br/>{item.address}</Popup>
        </Marker>
      ))}

      {layers.bancos && CONTEXTUAL_LAYERS.bancos.map(item => (
        <Marker key={item.id} position={[item.lat, item.lng]} icon={createIcon('#6366f1')}>
          <Popup><b>BANCO:</b> {item.name}<br/>{item.address}</Popup>
        </Marker>
      ))}

      {layers.bomberos && CONTEXTUAL_LAYERS.bomberos.map(item => (
        <Marker key={item.id} position={[item.lat, item.lng]} icon={createIcon('#ec4899')}>
          <Popup><b>BOMBEROS:</b> {item.name}<br/>{item.address}</Popup>
        </Marker>
      ))}
    </>
  );
};