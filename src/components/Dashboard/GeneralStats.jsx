import React from 'react';
import { X } from 'lucide-react';
import { calculateStats } from '../../utils/statistics';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#dc2626', '#ea580c', '#b91c1c', '#d97706', '#ca8a04', '#2563eb', '#7c3aed'];

export const GeneralStats = ({ incidents, onClose }) => {
  const stats = calculateStats(incidents);

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '900px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2>Estadísticas Generales 2026</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-primary)' }}>
            <X size={24} />
          </button>
        </div>

        {/* Resumen Superior */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: '20px' }}>
          <div className="card">
            <span style={labelStyle}>TOTAL INCIDENTES</span>
            <div style={valStyle}>{stats.total}</div>
          </div>
          <div className="card">
            <span style={labelStyle}>BARRIO MÁS AFECTADO</span>
            <div style={{ fontSize: '14px', fontWeight: 'bold', marginTop: '4px' }}>{stats.topBarrio}</div>
          </div>
          <div className="card">
            <span style={labelStyle}>DELITO MÁS FRECUENTE</span>
            <div style={{ fontSize: '14px', fontWeight: 'bold', marginTop: '4px' }}>{stats.topDelito}</div>
          </div>
          <div className="card">
            <span style={labelStyle}>MES CON MAYOR REGISTRO</span>
            <div style={{ fontSize: '14px', fontWeight: 'bold', marginTop: '4px' }}>{stats.maxMonth}</div>
          </div>
        </div>

        {/* Gráficos Recharts */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div className="card">
            <h4 style={{ fontSize: '14px', marginBottom: '10px' }}>Distribución Porcentual</h4>
            <div style={{ width: '100%', height: 220 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie 
                    data={Object.entries(stats.byType).map(([name, value]) => ({ name, value }))} 
                    dataKey="value" 
                    nameKey="name" 
                    cx="50%" 
                    cy="50%" 
                    outerRadius={70}
                  >
                    {Object.keys(stats.byType).map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card">
            <h4 style={{ fontSize: '14px', marginBottom: '10px' }}>Distribución Horaria</h4>
            <div style={{ width: '100%', height: 220 }}>
              <ResponsiveContainer>
                <BarChart data={stats.hourly}>
                  <XAxis dataKey="range" stroke="var(--text-secondary)" fontSize={10} />
                  <YAxis stroke="var(--text-secondary)" fontSize={10} />
                  <Tooltip />
                  <Bar dataKey="count" fill="var(--accent-blue)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const labelStyle = { fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 'bold' };
const valStyle = { fontSize: '24px', fontWeight: 'bold', marginTop: '4px' };