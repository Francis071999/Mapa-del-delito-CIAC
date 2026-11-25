// src/pages/Admin.jsx
import React, { useState, useMemo, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { CRIME_CATEGORIES } from '../data/crimeData';
import { GeneralStats } from '../components/Dashboard/GeneralStats';
import { InfoModal } from '../components/Panels/InfoModal';
import SoporteTecnico from './SoporteTecnico';

export function Admin({ onNavigate, crimeData, setCrimeData, onLogout }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('ALL');
  const [mensajeExito, setMensajeExito] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('');

  // Estados para las vistas del Administrador ('gestion', 'excel', 'mapa', 'estadisticas', 'info', 'soporte')
  const [currentAdminView, setCurrentAdminView] = useState('gestion'); 
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  // Estados de animación para desplazamiento fluido de ida y vuelta (sin difuminado de fondo)
  const [menuAnim, setMenuAnim] = useState(false);
  const [notifAnim, setNotifAnim] = useState(false);

  useEffect(() => {
    if (isMenuOpen) {
      setTimeout(() => setMenuAnim(true), 10);
    } else {
      setMenuAnim(false);
    }
  }, [isMenuOpen]);

  useEffect(() => {
    if (isNotifOpen) {
      setTimeout(() => setNotifAnim(true), 10);
    } else {
      setNotifAnim(false);
    }
  }, [isNotifOpen]);

  // Estado de las líneas de ejemplo para la planilla Excel con Lat y Lng
  const [excelRows, setExcelRows] = useState([
    { id: 1, colA: 'Mariano Martínez', colB: 'Av. San Martín 450', colC: '28.451.236', edad: '42', lat: '-27.03420', lng: '-65.30190' },
    { id: 2, colA: 'Pérez, Juan Carlos', colB: 'B° 240 Viviendas Mz 3', colC: '32.112.987', edad: '35', lat: '-27.04011', lng: '-65.30743' },
    { id: 3, colA: 'Gómez, María Elena', colB: 'Calle Belgrano 120', colC: '24.987.321', edad: '29', lat: '-27.03726', lng: '-65.31196' },
    { id: 4, colA: 'Benítez, Sofía', colB: 'B° Santa Rita Casa 12', colC: '35.654.123', edad: '50', lat: '-27.03081', lng: '-65.31162' },
    { id: 5, colA: 'Soria, Luis Alberto', colB: 'Ruta 305 Km 2', colC: '21.432.876', edad: '38', lat: '-27.02793', lng: '-65.28678' },
  ]);

  // Coordenada temporal para centrar el mapa cuando el administrador hace clic en "Ver en Mapa"
  const [mapTargetCenter, setMapTargetCenter] = useState([-27.0342, -65.3019]);

  // Estado de notificaciones del administrador
  const [notifications, setNotifications] = useState(() => {
    const reportes = JSON.parse(localStorage.getItem('reportes_ciac')) || [];
    const initialNotifs = [
      {
        id: 'NOTIF-001',
        title: 'Nuevo Reporte Ciudadano',
        description: 'Se ha georreferenciado un nuevo reporte pendiente de revisión.',
        fecha: new Date().toLocaleDateString(),
        hora: '10:30',
        leida: false,
        tipo: 'reporte'
      },
      {
        id: 'NOTIF-002',
        title: 'Sistema Actualizado',
        description: 'El módulo cartográfico y de polígonos de Bella Vista opera con normalidad.',
        fecha: new Date().toLocaleDateString(),
        hora: '08:00',
        leida: true,
        tipo: 'sistema'
      }
    ];
    return reportes.slice(0, 3).map((rep, idx) => ({
      id: `NOTIF-REP-${idx}`,
      title: `Incidencia: ${rep.tipo}`,
      description: `Registrado en ${rep.barrio || 'Bella Vista'}. Estado: ${rep.estadoVerificacion || 'En revisión'}.`,
      fecha: rep.fecha || new Date().toLocaleDateString(),
      hora: rep.hora || '12:00',
      leida: false,
      tipo: 'incidencia'
    })).concat(initialNotifs);
  });

  // Estadísticas calculadas
  const stats = useMemo(() => {
    const total = crimeData.length;
    const verificados = crimeData.filter(item => item.estadoVerificacion === 'Verificado' || item.estado === 'Verificado').length;
    const pendientes = total - verificados;

    const porCategoria = {};
    Object.keys(CRIME_CATEGORIES).forEach(catKey => {
      porCategoria[catKey] = 0;
    });

    crimeData.forEach(item => {
      const catKeyFound = Object.keys(CRIME_CATEGORIES).find(key => 
        CRIME_CATEGORIES[key].id.toLowerCase() === item.tipo?.toLowerCase() ||
        CRIME_CATEGORIES[key].label.toLowerCase() === item.tipo?.toLowerCase()
      );
      if (catKeyFound) {
        porCategoria[catKeyFound] = (porCategoria[catKeyFound] || 0) + 1;
      } else {
        porCategoria['OTROS'] = (porCategoria['OTROS'] || 0) + 1;
      }
    });

    return { total, verificados, pendientes, porCategoria };
  }, [crimeData]);

  // Filtrado de incidentes en la tabla
  const filteredIncidents = useMemo(() => {
    return crimeData.filter(item => {
      const matchSearch = (item.id + item.tipo + item.barrio + item.descripcion + item.direccion)
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      
      const matchCat = selectedCategoryFilter === 'ALL' || item.tipo?.toLowerCase() === selectedCategoryFilter.toLowerCase();
      return matchSearch && matchCat;
    });
  }, [crimeData, searchTerm, selectedCategoryFilter]);

  const handleToggleEstado = (id) => {
    const actualizados = crimeData.map(item => {
      if (item.id === id) {
        const nuevoEstado = (item.estadoVerificacion === 'Verificado' || item.estado === 'Verificado') ? 'En revisión' : 'Verificado';
        return { ...item, estadoVerificacion: nuevoEstado, estado: nuevoEstado };
      }
      return item;
    });
    setCrimeData(actualizados);
    localStorage.setItem('ciac_crime_data_v2', JSON.stringify(actualizados));
    setMensajeExito(`Incidente ${id} actualizado correctamente.`);
    setTimeout(() => setMensajeExito(''), 3000);
  };

  const handleDeleteIncident = (id) => {
    if (window.confirm(`¿Estás seguro de eliminar el incidente ${id}?`)) {
      const actualizados = crimeData.filter(item => item.id !== id);
      setCrimeData(actualizados);
      localStorage.setItem('ciac_crime_data_v2', JSON.stringify(actualizados));
      setMensajeExito(`Incidente ${id} eliminado.`);
      setTimeout(() => setMensajeExito(''), 3000);
    }
  };

  const handleMarkAsRead = (notifId) => {
    setNotifications(prev => prev.map(n => n.id === notifId ? { ...n, leida: true } : n));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, leida: true })));
  };

  const unreadCount = notifications.filter(n => !n.leida).length;

  const conicGradientStyle = useMemo(() => {
    let cumulativePercent = 0;
    const total = stats.total || 1;
    const segments = [];

    Object.entries(stats.porCategoria).forEach(([key, count]) => {
      if (count === 0) return;
      const percentage = (count / total) * 100;
      const start = cumulativePercent;
      cumulativePercent += percentage;
      const end = cumulativePercent;

      const color = CRIME_CATEGORIES[key]?.color || '#64748b';
      segments.push(`${color} ${start}% ${end}%`);
    });

    if (segments.length === 0) return 'conic-gradient(#1e293b 0% 100%)';
    return `conic-gradient(${segments.join(', ')})`;
  }, [stats]);

  const handleAddExcelRow = () => {
    const newRow = {
      id: excelRows.length + 1,
      colA: 'Nuevo Ciudadano',
      colB: 'Dirección...',
      colC: '00.000.000',
      edad: '30',
      lat: '-27.03420',
      lng: '-65.30190'
    };
    setExcelRows([...excelRows, newRow]);
    setMensajeExito('Nueva fila agregada a la hoja de cálculo.');
    setTimeout(() => setMensajeExito(''), 3000);
  };

  const handleExportExcel = () => {
    alert('Exportando base de datos de Bella Vista a formato CSV / Excel...');
  };

  const triggerLoadingAndLogout = () => {
    setLoadingText('Cerrando Sesión de Administrador...');
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLogout();
    }, 1200);
  };

  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      height: '100vh',
      overflowY: 'auto',
      backgroundColor: '#090d16',
      color: '#f8fafc',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      boxSizing: 'border-box',
      position: 'relative'
    }}>
      {/* PANTALLA DE CARGA ANIMADA DEL ADMIN */}
      {isLoading && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(5, 7, 12, 0.95)',
          backdropFilter: 'blur(16px)',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '20px',
          animation: 'fadeIn 0.3s ease-in-out'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            overflow: 'hidden',
            border: '3px solid #38bdf8',
            boxShadow: '0 0 25px rgba(56, 189, 248, 0.6)',
            animation: 'pulseLogo 1.5s infinite ease-in-out',
            background: '#0f172a'
          }}>
            <img src="img/logo-ciac.jpg" alt="CIAC Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.style.display = 'none'; }} />
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '36px',
              height: '36px',
              border: '4px solid rgba(56, 189, 248, 0.2)',
              borderTop: '4px solid #38bdf8',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
              margin: '0 auto 12px'
            }} />
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#fff', fontWeight: '700' }}>{loadingText}</h3>
            <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Centro de Integración y Atención Ciudadana</span>
          </div>
        </div>
      )}

      {/* BARRA SUPERIOR EXCLUSIVA DEL ADMINISTRADOR */}
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem 2rem',
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        borderBottom: '1px solid rgba(59, 130, 246, 0.25)',
        backdropFilter: 'blur(12px)',
        position: 'sticky',
        top: 0,
        zIndex: 1000
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={() => { setIsMenuOpen(true); setIsNotifOpen(false); }}
            title="Menú de Navegación"
            style={{
              background: 'rgba(59, 130, 246, 0.1)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              borderRadius: '8px',
              padding: '0.5rem 0.7rem',
              color: '#38bdf8',
              cursor: 'pointer',
              fontSize: '1.1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            ☰
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => setCurrentAdminView('gestion')}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', overflow: 'hidden', border: '2px solid #3b82f6', background: '#0f172a', flexShrink: 0 }}>
              <img src="img/logo-ciac.jpg" alt="CIAC" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.style.display = 'none'; }} />
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: '1rem', color: '#fff', fontWeight: '700' }}>CIAC — Administrador</h2>
              <span style={{ fontSize: '0.7rem', color: '#38bdf8' }}>Panel de Control Institucional</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Campana con movimiento solo si hay notificaciones pendientes */}
          <button
            onClick={() => { setIsNotifOpen(!isNotifOpen); setIsMenuOpen(false); }}
            title="Notificaciones"
            style={{
              position: 'relative',
              background: 'rgba(30, 41, 59, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '10px',
              padding: '0.5rem 0.75rem',
              color: '#f8fafc',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '1rem',
              animation: unreadCount > 0 ? 'bellPulse 1.8s infinite ease-in-out' : 'none'
            }}
          >
            🔔
            {unreadCount > 0 && (
              <span style={{
                position: 'absolute', top: '-5px', right: '-5px',
                background: '#ef4444', color: '#fff', fontSize: '0.65rem',
                fontWeight: 'bold', padding: '2px 6px', borderRadius: '10px'
              }}>
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* MENÚ LATERAL DESPLEGABLE (Izquierda - SIN DIFUMINADO) */}
      {isMenuOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 2000, display: 'flex', pointerEvents: 'none' }}>
          <div 
            style={{ position: 'absolute', inset: '0', background: 'transparent', pointerEvents: 'auto' }} 
            onClick={() => setIsMenuOpen(false)} 
          />
          <div style={{
            position: 'relative',
            width: '280px',
            backgroundColor: '#0f172a',
            borderRight: '1px solid rgba(59, 130, 246, 0.3)',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            padding: '1.5rem 1rem',
            boxShadow: '5px 0 25px rgba(0,0,0,0.8)',
            zIndex: 2001,
            pointerEvents: 'auto',
            transform: menuAnim ? 'translateX(0)' : 'translateX(-100%)',
            transition: 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>
              <span style={{ fontWeight: 'bold', fontSize: '0.95rem', color: '#38bdf8' }}>Menú Administrativo</span>
              <button 
                onClick={() => setIsMenuOpen(false)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '1.2rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
              <button
                onClick={() => { setCurrentAdminView('gestion'); setIsMenuOpen(false); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '0.75rem 1rem',
                  background: currentAdminView === 'gestion' ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
                  border: currentAdminView === 'gestion' ? '1px solid rgba(59, 130, 246, 0.4)' : '1px solid transparent',
                  borderRadius: '10px', color: '#f8fafc', cursor: 'pointer', textAlign: 'left', fontWeight: '500', fontSize: '0.9rem'
                }}
              >
                <span>📋</span> Gestión de Registros
              </button>

              <button
                onClick={() => { setCurrentAdminView('excel'); setIsMenuOpen(false); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '0.75rem 1rem',
                  background: currentAdminView === 'excel' ? 'rgba(16, 185, 129, 0.2)' : 'transparent',
                  border: currentAdminView === 'excel' ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid transparent',
                  borderRadius: '10px', color: '#34d399', cursor: 'pointer', textAlign: 'left', fontWeight: '600', fontSize: '0.9rem'
                }}
              >
                <span>📊</span> Excel (Padrón Bella Vista)
              </button>

              <button
                onClick={() => { setCurrentAdminView('mapa'); setIsMenuOpen(false); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '0.75rem 1rem',
                  background: currentAdminView === 'mapa' ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
                  border: currentAdminView === 'mapa' ? '1px solid rgba(59, 130, 246, 0.4)' : '1px solid transparent',
                  borderRadius: '10px', color: '#f8fafc', cursor: 'pointer', textAlign: 'left', fontWeight: '500', fontSize: '0.9rem'
                }}
              >
                <span>🗺️</span> Mapa
              </button>

              <button
                onClick={() => { setCurrentAdminView('estadisticas'); setIsMenuOpen(false); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '0.75rem 1rem',
                  background: currentAdminView === 'estadisticas' ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
                  border: currentAdminView === 'estadisticas' ? '1px solid rgba(59, 130, 246, 0.4)' : '1px solid transparent',
                  borderRadius: '10px', color: '#f8fafc', cursor: 'pointer', textAlign: 'left', fontWeight: '500', fontSize: '0.9rem'
                }}
              >
                <span>📈</span> Estadísticas
              </button>

              <button
                onClick={() => { setCurrentAdminView('info'); setIsMenuOpen(false); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '0.75rem 1rem',
                  background: currentAdminView === 'info' ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
                  border: currentAdminView === 'info' ? '1px solid rgba(59, 130, 246, 0.4)' : '1px solid transparent',
                  borderRadius: '10px', color: '#f8fafc', cursor: 'pointer', textAlign: 'left', fontWeight: '500', fontSize: '0.9rem'
                }}
              >
                <span>ℹ️</span> Info
              </button>

              <button
                onClick={() => { setCurrentAdminView('soporte'); setIsMenuOpen(false); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '0.75rem 1rem',
                  background: currentAdminView === 'soporte' ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
                  border: currentAdminView === 'soporte' ? '1px solid rgba(59, 130, 246, 0.4)' : '1px solid transparent',
                  borderRadius: '10px', color: '#f8fafc', cursor: 'pointer', textAlign: 'left', fontWeight: '500', fontSize: '0.9rem'
                }}
              >
                <span>🛠️</span> Soporte Técnico
              </button>
            </nav>

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem' }}>
              <button
                onClick={() => { setIsMenuOpen(false); triggerLoadingAndLogout(); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '0.75rem 1rem',
                  background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.4)',
                  borderRadius: '10px', color: '#fca5a5', cursor: 'pointer', fontWeight: '600', fontSize: '0.9rem'
                }}
              >
                <span>🚪</span> Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PANEL DE NOTIFICACIONES (Derecha - SIN DIFUMINADO Y CON DESPLAZAMIENTO FLUIDO) */}
      {isNotifOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 2000, display: 'flex', justifyContent: 'flex-end', pointerEvents: 'none' }}>
          <div 
            style={{ position: 'absolute', inset: '0', background: 'transparent', pointerEvents: 'auto' }} 
            onClick={() => setIsNotifOpen(false)} 
          />
          <div style={{
            position: 'relative',
            width: '360px',
            maxWidth: '100%',
            backgroundColor: '#0f172a',
            borderLeft: '1px solid rgba(59, 130, 246, 0.3)',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            padding: '1.5rem',
            boxShadow: '-5px 0 25px rgba(0,0,0,0.8)',
            zIndex: 2001,
            pointerEvents: 'auto',
            transform: notifAnim ? 'translateX(0)' : 'translateX(100%)',
            transition: 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.8rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ margin: 0, fontSize: '1rem', color: '#fff' }}>Notificaciones</h3>
                <span style={{ background: '#3b82f6', color: '#fff', fontSize: '0.7rem', padding: '2px 6px', borderRadius: '10px', fontWeight: 'bold' }}>
                  {unreadCount}
                </span>
              </div>
              <button 
                onClick={() => setIsNotifOpen(false)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '1.1rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Centro de alertas CIAC</span>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  style={{ background: 'none', border: 'none', color: '#38bdf8', fontSize: '0.75rem', cursor: 'pointer', fontWeight: '500' }}
                >
                  Marcar todas como leídas
                </button>
              )}
            </div>

            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {notifications.map(notif => (
                <div
                  key={notif.id}
                  onClick={() => handleMarkAsRead(notif.id)}
                  style={{
                    padding: '0.9rem',
                    borderRadius: '12px',
                    backgroundColor: notif.leida ? 'rgba(30, 41, 59, 0.4)' : 'rgba(30, 41, 59, 0.9)',
                    border: notif.leida ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(59, 130, 246, 0.4)',
                    cursor: 'pointer',
                    opacity: notif.leida ? 0.7 : 1
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.3rem' }}>
                    <span style={{ fontWeight: '600', fontSize: '0.85rem', color: notif.leida ? '#cbd5e1' : '#fff' }}>
                      {notif.title}
                    </span>
                    {!notif.leida && (
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#38bdf8', flexShrink: 0, marginTop: '4px' }} />
                    )}
                  </div>
                  <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.78rem', color: '#94a3b8', lineHeight: '1.3' }}>
                    {notif.description}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: '#64748b' }}>
                    <span>{notif.fecha} {notif.hora}</span>
                    <span>{!notif.leida ? 'Clic para leer' : 'Leída'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CONTENIDO DE LAS VISTAS */}
      <div style={{ padding: '2rem', maxWidth: '1400px', width: '100%', margin: '0 auto', flex: 1, boxSizing: 'border-box' }}>
        
        {mensajeExito && (
          <div style={{
            padding: '0.8rem 1.2rem',
            marginBottom: '1.5rem',
            backgroundColor: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid #10b981',
            color: '#34d399',
            borderRadius: '10px',
            fontSize: '0.9rem',
            fontWeight: '500'
          }}>
            ✨ {mensajeExito}
          </div>
        )}

        {/* VISTA: EXCEL / HOJA DE CÁLCULO */}
        {currentAdminView === 'excel' && (
          <div style={{
            background: '#ffffff',
            color: '#1e293b',
            borderRadius: '16px',
            padding: '1.5rem',
            boxShadow: '0 15px 40px rgba(0,0,0,0.5)',
            border: '1px solid #cbd5e1'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '1rem', flexWrap: 'wrap', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ background: '#107c41', color: '#fff', padding: '0.5rem 0.8rem', borderRadius: '8px', fontWeight: 'bold', fontSize: '0.9rem' }}>
                  📊 Excel CIAC
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#0f172a' }}>Padrón y Georreferenciación de Ciudadanos</h3>
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Gestión conectada directamente con el mapa geográfico del administrador</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <button
                  onClick={handleAddExcelRow}
                  style={{ background: '#334155', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', fontWeight: '600', fontSize: '0.82rem', cursor: 'pointer' }}
                >
                  ➕ Nueva Fila
                </button>

                <button
                  onClick={handleExportExcel}
                  style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', fontWeight: '600', fontSize: '0.82rem', cursor: 'pointer' }}
                >
                  💾 Exportar
                </button>
              </div>
            </div>

            <div style={{ overflowX: 'auto', border: '1px solid #cbd5e1', borderRadius: '6px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ background: '#f1f5f9', color: '#475569', borderBottom: '2px solid #cbd5e1', textAlign: 'center' }}>
                    <th style={{ padding: '0.6rem', borderRight: '1px solid #cbd5e1', width: '40px' }}>#</th>
                    <th style={{ padding: '0.6rem', borderRight: '1px solid #cbd5e1' }}>Nombre y Apellido</th>
                    <th style={{ padding: '0.6rem', borderRight: '1px solid #cbd5e1' }}>Dirección / Domicilio</th>
                    <th style={{ padding: '0.6rem', borderRight: '1px solid #cbd5e1' }}>DNI</th>
                    <th style={{ padding: '0.6rem', borderRight: '1px solid #cbd5e1' }}>Edad</th>
                    <th style={{ padding: '0.6rem', borderRight: '1px solid #cbd5e1' }}>Latitud</th>
                    <th style={{ padding: '0.6rem', borderRight: '1px solid #cbd5e1' }}>Longitud</th>
                    <th style={{ padding: '0.6rem' }}>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {excelRows.map((row, index) => (
                    <tr key={row.id} style={{ borderBottom: '1px solid #e2e8f0', backgroundColor: index % 2 === 0 ? '#ffffff' : '#f8fafc' }}>
                      <td style={{ padding: '0.5rem', textAlign: 'center', background: '#f1f5f9', borderRight: '1px solid #cbd5e1', color: '#64748b', fontSize: '0.78rem' }}>
                        {index + 1}
                      </td>
                      <td style={{ padding: '0.5rem', borderRight: '1px solid #e2e8f0' }}>{row.colA}</td>
                      <td style={{ padding: '0.5rem', borderRight: '1px solid #e2e8f0' }}>{row.colB}</td>
                      <td style={{ padding: '0.5rem', borderRight: '1px solid #e2e8f0' }}>{row.colC}</td>
                      <td style={{ padding: '0.5rem', borderRight: '1px solid #e2e8f0' }}>{row.edad || 'N/A'}</td>
                      <td style={{ padding: '0.5rem', borderRight: '1px solid #e2e8f0', color: '#2563eb', fontWeight: 'bold' }}>{row.lat}</td>
                      <td style={{ padding: '0.5rem', borderRight: '1px solid #e2e8f0', color: '#2563eb', fontWeight: 'bold' }}>{row.lng}</td>
                      <td style={{ padding: '0.5rem', textAlign: 'center' }}>
                        <button
                          onClick={() => {
                            const latNum = parseFloat(row.lat) || -27.0342;
                            const lngNum = parseFloat(row.lng) || -65.3019;
                            setMapTargetCenter([latNum, lngNum]);
                            setCurrentAdminView('mapa');
                            setMensajeExito(`Localizando domicilio de: ${row.colA}`);
                            setTimeout(() => setMensajeExito(''), 3000);
                          }}
                          style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '0.3rem 0.6rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: '600' }}
                        >
                          📍 Ver en Mapa
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* VISTA 1: GESTIÓN DE REGISTROS */}
        {currentAdminView === 'gestion' && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
              <div style={{ background: 'rgba(30, 41, 59, 0.7)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '1.5rem', backdropFilter: 'blur(8px)' }}>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total de Incidentes</span>
                <div style={{ fontSize: '2rem', fontWeight: '800', color: '#fff', marginTop: '0.5rem' }}>{stats.total}</div>
              </div>
              <div style={{ background: 'rgba(30, 41, 59, 0.7)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '1.5rem', backdropFilter: 'blur(8px)' }}>
                <span style={{ fontSize: '0.8rem', color: '#34d399', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Verificados / Gestionados</span>
                <div style={{ fontSize: '2rem', fontWeight: '800', color: '#34d399', marginTop: '0.5rem' }}>{stats.verificados}</div>
              </div>
              <div style={{ background: 'rgba(30, 41, 59, 0.7)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '1.5rem', backdropFilter: 'blur(8px)' }}>
                <span style={{ fontSize: '0.8rem', color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Pendientes de Revisión</span>
                <div style={{ fontSize: '2rem', fontWeight: '800', color: '#f59e0b', marginTop: '0.5rem' }}>{stats.pendientes}</div>
              </div>
            </div>

            {/* GRÁFICO DE TORTA ANIMADO Y LEYENDA */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', marginBottom: '2.5rem', alignItems: 'center' }}>
              <div style={{ background: 'rgba(30, 41, 59, 0.7)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.05rem', color: '#f1f5f9', alignSelf: 'flex-start' }}>
                  📊 Distribución por Categorías Delictivas
                </h3>
                <div style={{ width: '180px', height: '180px', borderRadius: '50%', background: conicGradientStyle, boxShadow: '0 0 20px rgba(0,0,0,0.6)' }} />
              </div>

              <div style={{ background: 'rgba(30, 41, 59, 0.7)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '2rem', maxHeight: '320px', overflowY: 'auto' }}>
                <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.05rem', color: '#f1f5f9' }}>🎨 Leyenda de Categorías y Porcentajes</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {Object.entries(CRIME_CATEGORIES).map(([key, cat]) => {
                    const count = stats.porCategoria[key] || 0;
                    const percentage = stats.total > 0 ? ((count / stats.total) * 100).toFixed(1) : 0;
                    return (
                      <div key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: cat.color }} />
                          <span style={{ color: '#cbd5e1', fontWeight: '500' }}>{cat.label}</span>
                        </div>
                        <div style={{ display: 'flex', gap: '15px' }}>
                          <span style={{ color: '#94a3b8' }}>{count} registros</span>
                          <span style={{ color: '#38bdf8', fontWeight: '600', width: '45px', textAlign: 'right' }}>{percentage}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* TABLA DE GESTIÓN DE INCIDENTES */}
            <div style={{ background: 'rgba(30, 41, 59, 0.7)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '2rem', marginBottom: '3rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#fff' }}>📋 Listado y Gestión de Registros</h3>

                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <input
                    type="text"
                    placeholder="Buscar por ID, barrio, detalle..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ padding: '0.5rem 1rem', background: '#0f172a', border: '1px solid #475569', borderRadius: '8px', color: '#fff', fontSize: '0.85rem', outline: 'none', width: '240px' }}
                  />

                  <select
                    value={selectedCategoryFilter}
                    onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                    style={{ padding: '0.5rem 1rem', background: '#0f172a', border: '1px solid #475569', borderRadius: '8px', color: '#fff', fontSize: '0.85rem', outline: 'none' }}
                  >
                    <option value="ALL">Todas las Categorías</option>
                    {Object.entries(CRIME_CATEGORIES).map(([key, cat]) => (
                      <option key={key} value={cat.id}>{cat.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid rgba(255,255,255,0.1)', color: '#94a3b8' }}>
                      <th style={{ padding: '0.8rem' }}>ID</th>
                      <th style={{ padding: '0.8rem' }}>Fecha / Hora</th>
                      <th style={{ padding: '0.8rem' }}>Tipo / Subtipo</th>
                      <th style={{ padding: '0.8rem' }}>Barrio / Dirección</th>
                      <th style={{ padding: '0.8rem' }}>Estado</th>
                      <th style={{ padding: '0.8rem', textAlign: 'center' }}>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredIncidents.length === 0 ? (
                      <tr>
                        <td colSpan="6" style={{ textAlign: 'center', padding: '2.5rem', color: '#94a3b8' }}>
                          No se encontraron registros coincidentes.
                        </td>
                      </tr>
                    ) : (
                      filteredIncidents.map((item) => {
                        const isVerificado = item.estadoVerificacion === 'Verificado' || item.estado === 'Verificado';
                        return (
                          <tr key={item.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                            <td style={{ padding: '0.9rem 0.8rem', fontWeight: 'bold', color: '#38bdf8' }}>{item.id}</td>
                            <td style={{ padding: '0.9rem 0.8rem', color: '#cbd5e1' }}>{item.fecha}</td>
                            <td style={{ padding: '0.9rem 0.8rem' }}>
                              <span style={{ fontWeight: '600', color: '#fff' }}>{item.tipo}</span>
                              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{item.subtipo}</div>
                            </td>
                            <td style={{ padding: '0.9rem 0.8rem', color: '#cbd5e1' }}>{item.barrio}</td>
                            <td style={{ padding: '0.9rem 0.8rem' }}>
                              <span style={{
                                padding: '0.25rem 0.6rem', borderRadius: '6px', fontSize: '0.72rem', fontWeight: '600',
                                backgroundColor: isVerificado ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                                color: isVerificado ? '#34d399' : '#f59e0b'
                              }}>
                                {isVerificado ? 'Verificado' : 'En revisión'}
                              </span>
                            </td>
                            <td style={{ padding: '0.9rem 0.8rem', textAlign: 'center' }}>
                              <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                <button
                                  onClick={() => handleToggleEstado(item.id)}
                                  style={{ padding: '0.35rem 0.7rem', background: isVerificado ? 'rgba(245, 158, 11, 0.2)' : 'rgba(16, 185, 129, 0.2)', border: 'none', color: isVerificado ? '#f59e0b' : '#34d399', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: '600' }}
                                >
                                  {isVerificado ? 'Marcar Pendiente' : 'Verificar'}
                                </button>
                                <button
                                  onClick={() => handleDeleteIncident(item.id)}
                                  style={{ padding: '0.35rem 0.6rem', background: 'rgba(239, 68, 68, 0.15)', border: 'none', color: '#fca5a5', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem' }}
                                >
                                  🗑️
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* VISTA 2: MAPA DEL ADMINISTRADOR CON CUADRO DE REGISTRO DE CIUDADANOS */}
        {currentAdminView === 'mapa' && (
          <AdminInteractiveMap 
            crimeData={crimeData} 
            mapTargetCenter={mapTargetCenter} 
            onAddCitizenRow={(newCitizen) => {
              setExcelRows(prev => [newCitizen, ...prev]);
              setMensajeExito(`Ciudadano ${newCitizen.colA} registrado exitosamente en la planilla Excel.`);
              setTimeout(() => setMensajeExito(''), 4000);
            }} 
          />
        )}

        {/* VISTA 3: ESTADÍSTICAS */}
        {currentAdminView === 'estadisticas' && (
          <div style={{ background: 'rgba(30, 41, 59, 0.7)', borderRadius: '16px', padding: '1.5rem', border: '1px solid rgba(255,255,255,0.08)' }}>
            <GeneralStats incidents={crimeData} onClose={() => setCurrentAdminView('gestion')} isModal={false} />
          </div>
        )}

        {/* VISTA 4: INFO */}
        {currentAdminView === 'info' && (
          <div style={{ background: 'rgba(30, 41, 59, 0.7)', borderRadius: '16px', padding: '2rem', border: '1px solid rgba(255,255,255,0.08)' }}>
            <InfoModal onClose={() => setCurrentAdminView('gestion')} />
          </div>
        )}

        {/* VISTA 5: SOPORTE TÉCNICO */}
        {currentAdminView === 'soporte' && (
          <div style={{ background: 'rgba(30, 41, 59, 0.7)', borderRadius: '16px', padding: '2rem', border: '1px solid rgba(255,255,255,0.08)' }}>
            <SoporteTecnico onNavigate={() => setCurrentAdminView('gestion')} />
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes pulseLogo {
          0% { transform: scale(0.95); box-shadow: 0 0 15px rgba(56, 189, 248, 0.4); }
          50% { transform: scale(1.05); box-shadow: 0 0 30px rgba(56, 189, 248, 0.8); }
          100% { transform: scale(0.95); box-shadow: 0 0 15px rgba(56, 189, 248, 0.4); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes bellPulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.12) rotate(8deg); }
          100% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
}

// Componente interno del Mapa del Administrador con marcador temporal y persistente al ver desde el Excel
function AdminInteractiveMap({ crimeData, mapTargetCenter, onAddCitizenRow }) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markersLayerRef = useRef(null);
  const tempMarkerRef = useRef(null);
  const clickCoordRef = useRef(null);
  
  const [clickCoord, setClickCoord] = useState(null);
  const [nombre, setNombre] = useState('');
  const [direccion, setDireccion] = useState('');
  const [dni, setDni] = useState('');
  const [edad, setEdad] = useState('');
  const [registradoExito, setRegistradoExito] = useState(false);

  // Inicializar el mapa Leaflet del administrador
  useEffect(() => {
    if (mapRef.current && !mapInstance.current) {
      const map = L.map(mapRef.current, { zoomControl: false }).setView(mapTargetCenter || [-27.0342, -65.3019], 14);
      L.control.zoom({ position: 'bottomright' }).addTo(map);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap'
      }).addTo(map);

      const markersGroup = L.layerGroup().addTo(map);
      markersLayerRef.current = markersGroup;

      map.on('click', (e) => {
        const { lat, lng } = e.latlng;
        const coords = { lat: lat.toFixed(5), lng: lng.toFixed(5) };
        clickCoordRef.current = coords;
        setClickCoord(coords);
        setRegistradoExito(false);
        setNombre('');
        setDireccion('');
        setDni('');
        setEdad('');

        // Mostrar pelotita temporal instantánea donde hizo clic el administrador
        if (tempMarkerRef.current) {
          tempMarkerRef.current.setLatLng([lat, lng]);
        } else {
          tempMarkerRef.current = L.marker([lat, lng], {
            icon: L.divIcon({
              className: 'custom-temp-marker',
              html: `<div style="background-color: #38bdf8; width: 16px; height: 16px; border-radius: 50%; border: 2px solid #ffffff; box-shadow: 0 0 8px rgba(0,0,0,0.6);"></div>`,
              iconSize: [16, 16],
              iconAnchor: [8, 8]
            })
          }).addTo(map);
        }
      });

      mapInstance.current = map;
      setTimeout(() => map.invalidateSize(), 250);
    }
  }, []);

  // Centrar el mapa y mostrar el marcador cuando el administrador hace clic en "Ver en Mapa" desde el Excel
  useEffect(() => {
    if (mapInstance.current && mapTargetCenter) {
      mapInstance.current.setView(mapTargetCenter, 16);

      if (markersLayerRef.current) {
        markersLayerRef.current.clearLayers();
        const marker = L.marker(mapTargetCenter, {
          icon: L.divIcon({
            className: 'custom-citizen-marker',
            html: `<div style="background-color: #2563eb; width: 18px; height: 18px; border-radius: 50%; border: 2px solid #ffffff; box-shadow: 0 0 10px rgba(0,0,0,0.6);"></div>`,
            iconSize: [18, 18],
            iconAnchor: [9, 9]
          })
        });
        marker.bindPopup(`<b>Ciudadano Seleccionado</b><br>Coordenadas: ${mapTargetCenter[0]}, ${mapTargetCenter[1]}`).openPopup();
        markersLayerRef.current.addLayer(marker);
      }
    }
  }, [mapTargetCenter]);

  const handleSubmitAdminCitizen = (e) => {
    e.preventDefault();
    if (!clickCoordRef.current) return;

    const latVal = parseFloat(clickCoordRef.current.lat);
    const lngVal = parseFloat(clickCoordRef.current.lng);

    const newCitizenRow = {
      id: Date.now().toString().slice(-5),
      colA: nombre,
      colB: direccion,
      colC: dni,
      edad: edad,
      lat: latVal.toFixed(5),
      lng: lngVal.toFixed(5)
    };

    onAddCitizenRow(newCitizenRow);
    setRegistradoExito(true);

    // Fijar el marcador definitivo en el mapa del administrador
    if (markersLayerRef.current) {
      const marker = L.marker([latVal, lngVal], {
        icon: L.divIcon({
          className: 'custom-citizen-marker',
          html: `<div style="background-color: #10b981; width: 16px; height: 16px; border-radius: 50%; border: 2px solid #ffffff; box-shadow: 0 0 8px rgba(0,0,0,0.6);"></div>`,
          iconSize: [16, 16],
          iconAnchor: [8, 8]
        })
      });
      marker.bindPopup(`<b>${nombre}</b><br>DNI: ${dni}<br>Edad: ${edad}<br>${direccion}`);
      markersLayerRef.current.addLayer(marker);
    }

    // Remover marcador temporal de selección
    if (tempMarkerRef.current && mapInstance.current) {
      mapInstance.current.removeLayer(tempMarkerRef.current);
      tempMarkerRef.current = null;
    }

    setTimeout(() => {
      setClickCoord(null);
      clickCoordRef.current = null;
    }, 1500);
  };

  return (
    <div style={{ height: '75vh', width: '100%', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(59, 130, 246, 0.3)', position: 'relative' }}>
      <div ref={mapRef} style={{ width: '100%', height: '100%', zIndex: 1 }} />

      {clickCoord && (
        <div style={{
          position: 'absolute', top: '20px', right: '20px', zIndex: 1000,
          width: '340px', background: 'rgba(15, 23, 42, 0.96)', backdropFilter: 'blur(14px)',
          border: '1px solid rgba(59, 130, 246, 0.4)', borderRadius: '16px', padding: '1.2rem',
          boxShadow: '0 12px 32px rgba(0,0,0,0.7)', color: '#f8fafc'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>
            <h4 style={{ margin: 0, fontSize: '0.9rem', color: '#38bdf8' }}>📝 Registrar Ciudadano en Planilla</h4>
            <button onClick={() => {
              setClickCoord(null);
              if (tempMarkerRef.current && mapInstance.current) {
                mapInstance.current.removeLayer(tempMarkerRef.current);
                tempMarkerRef.current = null;
              }
            }} style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '1.1rem', cursor: 'pointer' }}>✕</button>
          </div>

          {registradoExito ? (
            <div style={{ textAlign: 'center', padding: '1.2rem 0' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.4rem' }}>✅</div>
              <h5 style={{ color: '#34d399', margin: '0 0 0.2rem', fontSize: '0.95rem' }}>Ciudadano Registrado</h5>
              <p style={{ fontSize: '0.72rem', color: '#94a3b8', margin: 0 }}>Pelotita fijada en el mapa y guardada en Excel.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmitAdminCitizen}>
              <div style={{ fontSize: '0.7rem', color: '#38bdf8', marginBottom: '0.5rem', background: 'rgba(56, 189, 248, 0.1)', padding: '0.3rem 0.5rem', borderRadius: '6px' }}>
                📍 Coordenadas: {clickCoord.lat}, {clickCoord.lng}
              </div>

              <div style={{ marginBottom: '0.4rem' }}>
                <label style={{ display: 'block', fontSize: '0.7rem', color: '#cbd5e1', marginBottom: '0.1rem' }}>Nombre y Apellido</label>
                <input type="text" required value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Ej. Juan Pérez" style={{ width: '100%', padding: '0.35rem', background: '#1e293b', border: '1px solid #475569', borderRadius: '6px', color: '#fff', fontSize: '0.78rem' }} />
              </div>

              <div style={{ marginBottom: '0.4rem' }}>
                <label style={{ display: 'block', fontSize: '0.7rem', color: '#cbd5e1', marginBottom: '0.1rem' }}>Dirección / Domicilio</label>
                <input type="text" required value={direccion} onChange={e => setDireccion(e.target.value)} placeholder="Ej. Av. San Martín 450" style={{ width: '100%', padding: '0.35rem', background: '#1e293b', border: '1px solid #475569', borderRadius: '6px', color: '#fff', fontSize: '0.78rem' }} />
              </div>

              <div style={{ display: 'flex', gap: '8px', marginBottom: '0.5rem' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.7rem', color: '#cbd5e1', marginBottom: '0.1rem' }}>DNI</label>
                  <input type="text" required value={dni} onChange={e => setDni(e.target.value)} placeholder="Ej. 32.112.987" style={{ width: '100%', padding: '0.35rem', background: '#1e293b', border: '1px solid #475569', borderRadius: '6px', color: '#fff', fontSize: '0.78rem' }} />
                </div>
                <div style={{ width: '80px' }}>
                  <label style={{ display: 'block', fontSize: '0.7rem', color: '#cbd5e1', marginBottom: '0.1rem' }}>Edad</label>
                  <input type="number" required value={edad} onChange={e => setEdad(e.target.value)} placeholder="Ej. 35" style={{ width: '100%', padding: '0.35rem', background: '#1e293b', border: '1px solid #475569', borderRadius: '6px', color: '#fff', fontSize: '0.78rem' }} />
                </div>
              </div>

              <button type="submit" style={{ width: '100%', padding: '0.45rem', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '0.78rem', cursor: 'pointer' }}>
                💾 Guardar en Planilla Excel
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}

export default Admin;