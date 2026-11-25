// src/components/Header/Header.jsx
import React from 'react';
import { Menu, BarChart2, Info, Lock } from 'lucide-react';

export const Header = ({ 
  onOpenStats, 
  onOpenInfo, 
  onOpenMenu, 
  onNavigate,
  currentRoute 
}) => {
  return (
    <header style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0.75rem 1.5rem',
      backgroundColor: 'rgba(15, 23, 42, 0.95)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(59, 130, 246, 0.25)',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Lado Izquierdo: Menú Hamburguesa + Logo y Título Minimalista */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <button 
          onClick={onOpenMenu} 
          title="Abrir Menú Principal"
          style={{
            background: 'rgba(59, 130, 246, 0.1)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            borderRadius: '8px',
            padding: '0.45rem 0.6rem',
            color: '#38bdf8',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s'
          }}
        >
          <Menu size={20} />
        </button>

        <div 
          onClick={() => onNavigate('landing')} 
          style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
          title="Volver al Inicio"
        >
          <div style={{ 
            width: '38px', 
            height: '38px', 
            borderRadius: '50%', 
            overflow: 'hidden', 
            border: '2px solid #3b82f6', 
            background: '#0f172a',
            flexShrink: 0,
            boxShadow: '0 0 10px rgba(59, 130, 246, 0.4)'
          }}>
            <img src="img/logo-ciac.jpg" alt="CIAC Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.style.display = 'none'; }} />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '0.95rem', fontWeight: '800', color: '#fff', letterSpacing: '0.3px' }}>CIAC</h1>
            <p style={{ margin: 0, fontSize: '0.62rem', color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.6px', fontWeight: '600' }}>Mapa del Delito — Bella Vista</p>
          </div>
        </div>
      </div>

      {/* Lado Derecho: Botones de Acción (Info, Estadísticas, Admin) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button 
          onClick={onOpenStats}
          title="Estadísticas Generales"
          style={{
            background: 'rgba(30, 41, 59, 0.7)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: '#f8fafc',
            padding: '0.45rem 0.85rem',
            borderRadius: '8px',
            fontSize: '0.8rem',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'background 0.2s'
          }}
        >
          <BarChart2 size={15} color="#38bdf8" />
          <span style={{ display: window.innerWidth < 640 ? 'none' : 'inline' }}>Estadísticas</span>
        </button>

        <button 
          onClick={onOpenInfo}
          title="Información Institucional"
          style={{
            background: 'rgba(30, 41, 59, 0.7)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: '#f8fafc',
            padding: '0.45rem 0.85rem',
            borderRadius: '8px',
            fontSize: '0.8rem',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'background 0.2s'
          }}
        >
          <Info size={15} color="#38bdf8" />
          <span style={{ display: window.innerWidth < 640 ? 'none' : 'inline' }}>Info</span>
        </button>

        <button 
          onClick={() => onNavigate('admin')}
          title="Panel de Administración"
          style={{
            background: 'rgba(37, 99, 235, 0.2)',
            border: '1px solid rgba(59, 130, 246, 0.4)',
            color: '#38bdf8',
            padding: '0.45rem 0.85rem',
            borderRadius: '8px',
            fontSize: '0.8rem',
            fontWeight: '700',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.2s'
          }}
        >
          <Lock size={14} />
          <span></span>
        </button>
      </div>
    </header>
  );
};