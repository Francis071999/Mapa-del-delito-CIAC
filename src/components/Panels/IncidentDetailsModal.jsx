import React from 'react';
import { X, Calendar, Clock, MapPin, Shield } from 'lucide-react';

export const IncidentDetailsModal = ({ incident, onClose }) => {
  if (!incident) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '500px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '18px' }}>Ficha de Registro de Incidente</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-primary)' }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px' }}>
          <div style={itemStyle}>
            <Shield size={16} color="var(--accent-blue)" />
            <span><b>Tipo:</b> {incident.tipo} ({incident.subtipo})</span>
          </div>
          <div style={itemStyle}>
            <Calendar size={16} />
            <span><b>Fecha:</b> {incident.fecha}</span>
          </div>
          <div style={itemStyle}>
            <Clock size={16} />
            <span><b>Hora:</b> {incident.hora} hs</span>
          </div>
          <div style={itemStyle}>
            <MapPin size={16} />
            <span><b>Ubicación:</b> {incident.direccion}, {incident.barrio}</span>
          </div>
          <div style={itemStyle}>
            <span><b>Coordenadas:</b> {incident.latitud}, {incident.longitud}</span>
          </div>
          
          <div style={{ marginTop: '8px', padding: '12px', backgroundColor: 'var(--bg-panel)', borderRadius: '6px' }}>
            <p style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '4px' }}>Descripción:</p>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{incident.descripcion}</p>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-secondary)', marginTop: '8px' }}>
            <span>Estado: <b>{incident.estado}</b></span>
            <span>Fuente: <b>{incident.fuente}</b></span>
          </div>
        </div>
      </div>
    </div>
  );
};

const itemStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px'
};