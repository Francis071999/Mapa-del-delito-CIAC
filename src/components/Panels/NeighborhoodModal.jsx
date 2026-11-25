import React from 'react';
import { X } from 'lucide-react';
import { calculateStats } from '../../utils/statistics';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

export const NeighborhoodModal = ({ neighborhood, incidents, onClose }) => {
  if (!neighborhood) return null;

  const neighborhoodIncidents = incidents.filter(i => i.barrio === neighborhood.name);
  const stats = calculateStats(neighborhoodIncidents);

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: '700' }}>Análisis de Barrio: {neighborhood.name}</h2>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Resumen Anual y Análisis Estadístico 2026</p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-primary)' }}>
            <X size={24} />
          </button>
        </div>

        {/* Tarjetas Estadísticas */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px', marginBottom: '20px' }}>
          <div className="card">
            <span style={cardLabel}>TOTAL</span>
            <div style={cardVal}>{stats.total}</div>
          </div>
          <div className="card">
            <span style={cardLabel}>ROBOS</span>
            <div style={cardVal}>{(stats.byType['Robo con arma'] || 0) + (stats.byType['Robo sin arma'] || 0)}</div>
          </div>
          <div className="card">
            <span style={cardLabel}>HURTOS</span>
            <div style={cardVal}>{stats.byType['Hurto'] || 0}</div>
          </div>
          <div className="card">
            <span style={cardLabel}>LESIONES</span>
            <div style={cardVal}>{stats.byType['Lesiones'] || 0}</div>
          </div>
          <div className="card">
            <span style={cardLabel}>VIALIDAD</span>
            <div style={cardVal}>{stats.byType['Vialidad'] || 0}</div>
          </div>
        </div>

        {/* Gráfico por Tipo */}
        <div style={{ marginBottom: '20px' }}>
          <h4 style={{ fontSize: '14px', marginBottom: '10px' }}>Incidentes por Tipo</h4>
          <div style={{ width: '100%', height: 200 }}>
            <ResponsiveContainer>
              <BarChart data={Object.entries(stats.byType).map(([k, v]) => ({ name: k, cantidad: v }))}>
                <XAxis dataKey="name" stroke="var(--text-secondary)" fontSize={10} />
                <YAxis stroke="var(--text-secondary)" fontSize={10} />
                <Tooltip />
                <Bar dataKey="cantidad" fill="var(--accent-blue)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Evolución Mensual */}
        <div>
          <h4 style={{ fontSize: '14px', marginBottom: '10px' }}>Evolución Mensual 2026</h4>
          <div style={{ width: '100%', height: 180 }}>
            <ResponsiveContainer>
              <LineChart data={stats.monthly}>
                <XAxis dataKey="mes" stroke="var(--text-secondary)" fontSize={10} />
                <YAxis stroke="var(--text-secondary)" fontSize={10} />
                <Tooltip />
                <Line type="monotone" dataKey="cantidad" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

const cardLabel = { fontSize: '10px', color: 'var(--text-secondary)', fontWeight: 'bold' };
const cardVal = { fontSize: '20px', fontWeight: 'bold', marginTop: '4px' };