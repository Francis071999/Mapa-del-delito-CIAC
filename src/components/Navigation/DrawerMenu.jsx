// src/components/Navigation/DrawerMenu.jsx
import React, { useState, useEffect } from 'react';
import { CRIME_TYPES } from '../../data/crimeData';
import { NEIGHBORHOODS } from '../../data/neighborhoodData';

export function DrawerMenu({ 
  isOpen, 
  onClose, 
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
  selectedBarrio,          
  setSelectedBarrio,       
  onApplyFilters           
}) {
  const [slideIn, setSlideIn] = useState(false);
  const [selectedYear, setSelectedYear] = useState('2026'); // Año predeterminado sincronizable
  const [exactDate, setExactDate] = useState(''); // Fecha exacta opcional para reportes futuros

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => setSlideIn(true), 10);
      return () => clearTimeout(timer);
    } else {
      setSlideIn(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCrimeToggle = (crimeId) => {
    if (selectedCrimes.includes(crimeId)) {
      setSelectedCrimes(selectedCrimes.filter(id => id !== crimeId));
    } else {
      setSelectedCrimes([...selectedCrimes, crimeId]);
    }
  };

  const handleSelectAllCrimes = () => setSelectedCrimes(CRIME_TYPES.map(c => c.id));
  const handleClearCrimes = () => setSelectedCrimes([]);

  return (
    <div style={{ 
      position: 'fixed', 
      inset: 0, 
      zIndex: 3000, 
      display: 'flex', 
      pointerEvents: 'none' 
    }}>
      {/* Fondo SIN difuminación (transparente pero captura clics para cerrar) */}
      <div 
        style={{ position: 'absolute', inset: 0, background: 'transparent', pointerEvents: 'auto' }} 
        onClick={onClose} 
      />

      <div style={{
        position: 'relative',
        width: '350px',
        maxWidth: '90%',
        backgroundColor: 'rgba(11, 17, 32, 0.96)',
        backdropFilter: 'blur(20px)',
        borderRight: '1px solid rgba(59, 130, 246, 0.25)',
        boxShadow: '15px 0 50px rgba(0, 0, 0, 0.8), 0 0 20px rgba(59, 130, 246, 0.15)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        padding: '1.4rem 1.1rem',
        zIndex: 3001,
        overflowY: 'auto',
        color: '#f8fafc',
        pointerEvents: 'auto',
        fontFamily: 'Inter, system-ui, sans-serif',
        transform: slideIn ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)'
      }}>
        
        <div style={{ 
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
          marginBottom: '1.2rem', borderBottom: '1px solid rgba(59, 130, 246, 0.2)', paddingBottom: '0.8rem' 
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ 
              width: '40px', height: '40px', borderRadius: '8px', overflow: 'hidden', 
              border: '1px solid rgba(59, 130, 246, 0.6)', background: '#1e293b', flexShrink: 0,
              boxShadow: '0 0 10px rgba(59, 130, 246, 0.3)'
            }}>
              <img 
                src="img/logo-ciac.jpg" 
                alt="CIAC" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                onError={(e) => { e.target.style.display = 'none'; }} 
              />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '0.92rem', color: '#fff', fontWeight: '700', letterSpacing: '0.4px' }}>
                MAPA DEL DELITO
              </h3>
              <span style={{ fontSize: '0.62rem', color: '#38bdf8', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Sistema Inteligente de Análisis
              </span>
            </div>
          </div>
          <button 
            onClick={onClose}
            style={{ 
              background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', 
              color: '#cbd5e1', width: '28px', height: '28px', borderRadius: '50%', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', 
              fontSize: '0.9rem', transition: 'all 0.2s' 
            }}
          >
            ✕
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
          
          {/* Selector de Barrio / Sector */}
          <div style={{ 
            background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.5) 0%, rgba(15, 23, 42, 0.7) 100%)', 
            padding: '0.9rem', borderRadius: '12px', border: '1px solid rgba(59, 130, 246, 0.3)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)'
          }}>
            <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: '700', color: '#38bdf8', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
              Seleccionar Barrio / Sector
            </label>
            <select
              value={selectedBarrio || 'todos'}
              onChange={(e) => setSelectedBarrio(e.target.value)}
              style={{ 
                width: '100%', padding: '0.5rem', background: '#090d16', 
                border: '1px solid rgba(59, 130, 246, 0.4)', borderRadius: '8px', 
                color: '#f8fafc', fontSize: '0.78rem', outline: 'none', cursor: 'pointer' 
              }}
            >
              <option value="todos">-- Todos los Barrios (Ocultos) --</option>
              {NEIGHBORHOODS.filter(n => n.name).map((n, idx) => (
                <option key={idx} value={n.name}>{n.name}</option>
              ))}
            </select>
          </div>

          {/* PERÍODO DE ANÁLISIS CON CALENDARIO MODERNO MINIMALISTA CRISTALIZADO */}
          <div style={{ 
            background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.55) 0%, rgba(15, 23, 42, 0.75) 100%)', 
            padding: '1rem', borderRadius: '14px', border: '1px solid rgba(56, 189, 248, 0.25)',
            backdropFilter: 'blur(16px)', boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.7rem' }}>
              <label style={{ fontSize: '0.72rem', fontWeight: '700', color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                📅 Período y Calendario
              </label>
              <div style={{ display: 'flex', gap: '4px' }}>
                <button
                  onClick={() => setIsAllYear(true)}
                  style={{
                    padding: '0.25rem 0.6rem', fontSize: '0.68rem', borderRadius: '6px', cursor: 'pointer',
                    backgroundColor: isAllYear ? '#2563eb' : 'rgba(255, 255, 255, 0.03)',
                    color: isAllYear ? '#fff' : '#94a3b8', 
                    border: isAllYear ? '1px solid #3b82f6' : '1px solid rgba(255,255,255,0.08)', 
                    fontWeight: '600'
                  }}
                >
                  Anual
                </button>
                <button
                  onClick={() => setIsAllYear(false)}
                  style={{
                    padding: '0.25rem 0.6rem', fontSize: '0.68rem', borderRadius: '6px', cursor: 'pointer',
                    backgroundColor: !isAllYear ? '#2563eb' : 'rgba(255, 255, 255, 0.03)',
                    color: !isAllYear ? '#fff' : '#94a3b8', 
                    border: !isAllYear ? '1px solid #3b82f6' : '1px solid rgba(255,255,255,0.08)', 
                    fontWeight: '600'
                  }}
                >
                  Mensual / Fecha
                </button>
              </div>
            </div>

            {/* Controles del Calendario Minimalista Profesional */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: '0.65rem', color: '#94a3b8', display: 'block', marginBottom: '3px' }}>Año</span>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    style={{ 
                      width: '100%', padding: '0.45rem', background: 'rgba(9, 13, 22, 0.8)', 
                      border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: '8px', 
                      color: '#f8fafc', fontSize: '0.75rem', outline: 'none', cursor: 'pointer' 
                    }}
                  >
                    <option value="2026">2026</option>
                    <option value="2025">2025</option>
                    <option value="2024">2024</option>
                  </select>
                </div>

                <div style={{ flex: 1.5 }}>
                  <span style={{ fontSize: '0.65rem', color: '#94a3b8', display: 'block', marginBottom: '3px' }}>Mes / Período</span>
                  <select
                    value={selectedMonth}
                    onChange={(e) => {
                      setSelectedMonth(e.target.value);
                      setIsAllYear(false);
                    }}
                    style={{ 
                      width: '100%', padding: '0.45rem', background: 'rgba(9, 13, 22, 0.8)', 
                      border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: '8px', 
                      color: '#f8fafc', fontSize: '0.75rem', outline: 'none', cursor: 'pointer' 
                    }}
                  >
                    <option value="all">Todo el año ({selectedYear})</option>
                    <option value="01">Enero</option>
                    <option value="02">Febrero</option>
                    <option value="03">Marzo</option>
                    <option value="04">Abril</option>
                    <option value="05">Mayo</option>
                    <option value="06">Junio</option>
                    <option value="07">Julio</option>
                    <option value="08">Agosto</option>
                    <option value="09">Septiembre</option>
                    <option value="10">Octubre</option>
                    <option value="11">Noviembre</option>
                    <option value="12">Diciembre</option>
                  </select>
                </div>
              </div>

              {/* Selector de fecha exacta opcional para sincronizar reportes */}
              <div>
                <span style={{ fontSize: '0.65rem', color: '#94a3b8', display: 'block', marginBottom: '3px' }}>Fecha exacta (Sincronización de Reporte)</span>
                <input 
                  type="date"
                  value={exactDate}
                  onChange={(e) => setExactDate(e.target.value)}
                  style={{
                    width: '100%', padding: '0.45rem', background: 'rgba(9, 13, 22, 0.8)',
                    border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: '8px',
                    color: '#f8fafc', fontSize: '0.75rem', outline: 'none', cursor: 'pointer',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Categoría Selectiva */}
          <div style={{ 
            background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.5) 0%, rgba(15, 23, 42, 0.7) 100%)', 
            padding: '0.9rem', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.07)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
              <label style={{ fontSize: '0.72rem', fontWeight: '700', color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                DELITOS
              </label>
              <div style={{ display: 'flex', gap: '8px', background: 'rgba(255,255,255,0.04)', padding: '2px 6px', borderRadius: '6px' }}>
                <button onClick={handleSelectAllCrimes} style={{ fontSize: '0.66rem', background: 'none', border: 'none', color: '#38bdf8', cursor: 'pointer', fontWeight: '600' }}>Todos</button>
                <span style={{ color: '#475569' }}>|</span>
                <button onClick={handleClearCrimes} style={{ fontSize: '0.66rem', background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', fontWeight: '600' }}>Ninguno</button>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '130px', overflowY: 'auto', paddingRight: '4px' }}>
              {CRIME_TYPES.map(c => (
                <label key={c.id} style={{ 
                  display: 'flex', alignItems: 'center', gap: '9px', fontSize: '0.76rem', 
                  color: '#cbd5e1', cursor: 'pointer', padding: '3px 6px', borderRadius: '6px',
                  backgroundColor: 'rgba(255, 255, 255, 0.02)'
                }}>
                  <input
                    type="checkbox"
                    checked={selectedCrimes.includes(c.id)}
                    onChange={() => handleCrimeToggle(c.id)}
                    style={{ accentColor: c.color, width: '14px', height: '14px', cursor: 'pointer' }}
                  />
                  <span style={{ display: 'inline-block', width: '7px', height: '7px', borderRadius: '50%', backgroundColor: c.color, boxShadow: `0 0 6px ${c.color}` }} />
                  <span style={{ fontWeight: '500' }}>{c.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Subcategoría Específica */}
          <div style={{ 
            background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.5) 0%, rgba(15, 23, 42, 0.7) 100%)', 
            padding: '0.9rem', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.07)'
          }}>
            <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: '700', color: '#38bdf8', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
              Subcategoría DELITOS
            </label>
            <select
              value={selectedSubcategory}
              onChange={(e) => setSelectedSubcategory(e.target.value)}
              style={{ 
                width: '100%', padding: '0.5rem', background: '#090d16', 
                border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: '8px', 
                color: '#f8fafc', fontSize: '0.76rem', outline: 'none', cursor: 'pointer' 
              }}
            >
              <option value="ALL">Todas las Subcategorías</option>
              {CRIME_TYPES.filter(c => selectedCrimes.includes(c.id)).flatMap(c => c.subcategories).map((sub, idx) => (
                <option key={idx} value={sub}>{sub}</option>
              ))}
            </select>
          </div>

          {/* Capas Contextuales */}
          <div style={{ 
            background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.5) 0%, rgba(15, 23, 42, 0.7) 100%)', 
            padding: '0.9rem', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.07)'
          }}>
            <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: '700', color: '#38bdf8', marginBottom: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
              Capas Contextuales
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {[
                { key: 'comisarias', label: 'Comisarías' },
                { key: 'motorizada', label: 'Patrullaje Motorizado' },
                { key: 'casaCultura', label: 'Casa de la Cultura' },
                { key: 'salud', label: 'Centros de Salud' },
                { key: 'bomberos', label: 'Bomberos' }
              ].map(layer => (
                <label key={layer.key} style={{ 
                  display: 'flex', alignItems: 'center', gap: '9px', fontSize: '0.76rem', 
                  color: '#cbd5e1', cursor: 'pointer', padding: '3px 6px', borderRadius: '6px',
                  backgroundColor: 'rgba(255, 255, 255, 0.02)'
                }}>
                  <input
                    type="checkbox"
                    checked={contextualLayers[layer.key]}
                    onChange={() => setContextualLayers({ ...contextualLayers, [layer.key]: !contextualLayers[layer.key] })}
                    style={{ accentColor: '#3b82f6', width: '14px', height: '14px', cursor: 'pointer' }}
                  />
                  <span style={{ fontWeight: '500' }}>{layer.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Botón Aplicar Filtros */}
        <div style={{ marginTop: '1.2rem', borderTop: '1px solid rgba(59, 130, 246, 0.2)', paddingTop: '1rem' }}>
          <button
            onClick={() => {
              if (onApplyFilters) onApplyFilters();
              onClose();
            }}
            style={{
              width: '100%',
              padding: '0.7rem',
              backgroundColor: '#2563eb',
              color: '#fff',
              border: 'none',
              borderRadius: '10px',
              fontWeight: '700',
              fontSize: '0.84rem',
              cursor: 'pointer',
              boxShadow: '0 4px 20px rgba(37, 99, 235, 0.5)',
              transition: 'all 0.2s ease'
            }}
          >
            Aplicar Filtros
          </button>
        </div>
      </div>
    </div>
  );
}