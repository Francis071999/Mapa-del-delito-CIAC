// src/components/Navigation/StatsPanel.jsx
import React, { useState } from 'react';
import { CRIME_TYPES } from '../../data/crimeData';

export function StatsPanel({ isOpen, onClose, selectedBarrio }) {
  const [activeTab, setActiveTab] = useState('delitos');

  if (!isOpen) return null;

  // Cargar datos reales empezando en 0
  const reportesStorage = JSON.parse(localStorage.getItem('reportes_ciac')) || [];
  
  const reportesFiltrados = selectedBarrio && selectedBarrio !== 'todos'
    ? reportesStorage.filter(r => (r.barrio || '').toLowerCase().includes(selectedBarrio.toLowerCase()))
    : reportesStorage;

  const totalCount = reportesFiltrados.length;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      right: 0,
      width: '440px',
      maxWidth: '90%',
      height: '100%',
      backgroundColor: 'rgba(11, 17, 32, 0.98)',
      backdropFilter: 'blur(20px)',
      borderLeft: '1px solid rgba(59, 130, 246, 0.3)',
      boxShadow: '-15px 0 50px rgba(0, 0, 0, 0.8)',
      zIndex: 3002,
      display: 'flex',
      flexDirection: 'column',
      padding: '1.2rem',
      color: '#f8fafc',
      fontFamily: 'Inter, system-ui, sans-serif',
      overflowY: 'auto'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.8rem', marginBottom: '1rem' }}>
        <div>
          <span style={{ fontSize: '0.65rem', color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            {selectedBarrio && selectedBarrio !== 'todos' ? `Análisis de Sector: ${selectedBarrio}` : 'Análisis General CIAC (Base en 0)'}
          </span>
          <h3 style={{ margin: '2px 0 0', fontSize: '1rem', color: '#fff' }}>
            Estadísticas y Desglose por Categorías
          </h3>
        </div>
        <button 
          onClick={onClose}
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', width: '30px', height: '30px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          ✕
        </button>
      </div>

      <div style={{ background: 'rgba(30, 41, 59, 0.5)', padding: '1rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#38bdf8' }}>{totalCount}</span>
            <p style={{ margin: 0, fontSize: '0.75rem', color: '#94a3b8' }}>Casos registrados en la zona seleccionada</p>
          </div>
          <div style={{ background: 'rgba(56, 189, 248, 0.1)', padding: '0.5rem', borderRadius: '8px', color: '#38bdf8', fontSize: '0.8rem', fontWeight: '600' }}>
            📊 En Vivo
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '4px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.6rem', marginBottom: '1rem' }}>
        <button 
          onClick={() => setActiveTab('delitos')}
          style={{ padding: '0.4rem 0.7rem', fontSize: '0.7rem', borderRadius: '6px', cursor: 'pointer', background: activeTab === 'delitos' ? '#2563eb' : 'transparent', color: activeTab === 'delitos' ? '#fff' : '#94a3b8', border: 'none', fontWeight: '600' }}
        >
          CATEGORÍAS & DELITOS
        </button>
        <button 
          onClick={() => setActiveTab('km2')}
          style={{ padding: '0.4rem 0.7rem', fontSize: '0.7rem', borderRadius: '6px', cursor: 'pointer', background: activeTab === 'km2' ? '#2563eb' : 'transparent', color: activeTab === 'km2' ? '#fff' : '#94a3b8', border: 'none', fontWeight: '600' }}
        >
          DELITOS POR KM2
        </button>
        <button 
          onClick={() => setActiveTab('temporal')}
          style={{ padding: '0.4rem 0.7rem', fontSize: '0.7rem', borderRadius: '6px', cursor: 'pointer', background: activeTab === 'temporal' ? '#2563eb' : 'transparent', color: activeTab === 'temporal' ? '#fff' : '#94a3b8', border: 'none', fontWeight: '600' }}
        >
          GRILLA HORARIA
        </button>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.8rem', overflowY: 'auto' }}>
        
        {activeTab === 'delitos' && (
          <div>
            <h4 style={{ fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '0.8rem' }}>Desglose por Categoría Selectiva y Subcategorías</h4>
            {CRIME_TYPES.map((crime, idx) => {
              const cantCategoria = reportesFiltrados.filter(r => 
                (r.tipo || '').toLowerCase() === crime.id.toLowerCase() || 
                (r.tipo || '').toLowerCase() === crime.label.toLowerCase()
              ).length;

              return (
                <div key={idx} style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', padding: '0.7rem', marginBottom: '0.6rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: crime.color }} />
                      <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#fff' }}>{crime.label}</span>
                    </div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#38bdf8' }}>{cantCategoria} casos</span>
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#94a3b8', paddingLeft: '16px' }}>
                    Subcategorías: {crime.subcategories.join(', ')}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'km2' && (
          <div>
            <h4 style={{ fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '0.8rem' }}>Densidad Delictiva por Kilómetro Cuadrado</h4>
            {[
              { zona: selectedBarrio && selectedBarrio !== 'todos' ? selectedBarrio : 'Bella Vista Centro', densidad: `${(totalCount * 1.5).toFixed(1)} inc/km²`, color: '#ef4444' },
              { zona: 'Periferia / Sectores Adyacentes', densidad: `${(totalCount * 0.5).toFixed(1)} inc/km²`, color: '#f59e0b' }
            ].map((item, idx) => (
              <div key={idx} style={{ background: 'rgba(30, 41, 59, 0.4)', padding: '0.6rem 0.8rem', borderRadius: '8px', marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.76rem', color: '#cbd5e1' }}>{item.zona}</span>
                <span style={{ fontSize: '0.78rem', fontWeight: 'bold', color: item.color }}>{item.densidad}</span>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'temporal' && (
          <div>
            <h4 style={{ fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '0.6rem' }}>Franjas Horarias Registradas</h4>
            {reportesFiltrados.length === 0 ? (
              <p style={{ fontSize: '0.75rem', color: '#64748b', fontStyle: 'italic' }}>Sin reportes activos en 0.</p>
            ) : (
              reportesFiltrados.map((r, idx) => (
                <div key={idx} style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(59, 130, 246, 0.2)', borderRadius: '8px', padding: '0.6rem', marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '0.76rem', fontWeight: 'bold', color: '#f8fafc' }}>{r.tipo} ({r.subtipo})</div>
                    <div style={{ fontSize: '0.68rem', color: '#38bdf8' }}>🕒 Hora: {r.hora}</div>
                  </div>
                  <span style={{ fontSize: '0.68rem', fontWeight: 'bold', padding: '2px 6px', borderRadius: '4px', backgroundColor: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8' }}>
                    {r.barrio}
                  </span>
                </div>
              ))
            )}
          </div>
        )}

      </div>

      <div style={{ marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '0.8rem' }}>
        <button 
          onClick={onClose}
          style={{ width: '100%', padding: '0.6rem', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.82rem' }}
        >
          Cerrar Panel
        </button>
      </div>
    </div>
  );
}