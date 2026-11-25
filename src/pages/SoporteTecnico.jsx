// src/pages/SoporteTecnico.jsx
import React from 'react';
import CiacLogo from '../components/CiacLogo';
import Footer from '../components/Footer';

export default function SoporteTecnico({ onNavigate }) {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh', 
      backgroundColor: '#090d16', 
      color: '#f8fafc',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Barra de Navegación Superior */}
      <nav style={{
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
        <div 
          style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} 
          onClick={() => onNavigate('landing')}
        >
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', overflow: 'hidden', border: '2px solid #3b82f6', background: '#0f172a', flexShrink: 0 }}>
            <img src="img/logo-ciac.jpg" alt="CIAC" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.style.display = 'none'; }} />
          </div>
          <div>
            <strong style={{ fontSize: '1rem', color: '#fff' }}>CIAC — Soporte Técnico</strong>
            <div style={{ fontSize: '0.65rem', color: '#38bdf8' }}>Asistencia y Protocolos de Ayuda</div>
          </div>
        </div>
        <button 
          onClick={() => onNavigate('landing')}
          style={{
            background: 'rgba(59, 130, 246, 0.1)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            color: '#38bdf8',
            padding: '0.45rem 1rem',
            borderRadius: '8px',
            fontWeight: '600',
            fontSize: '0.8rem',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          Volver al Inicio
        </button>
      </nav>

      {/* Contenido Principal */}
      <main style={{ flex: 1, padding: '3rem 1.5rem', maxWidth: '1000px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
        
        {/* Cabecera de la sección */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <span style={{ fontSize: '0.75rem', color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold' }}>
            Centro de Ayuda Institucional
          </span>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#fff', margin: '0.5rem 0 1rem' }}>
            ¿Cómo podemos asistirte?
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem', maxWidth: '600px', margin: '0 auto', lineHeight: '1.5' }}>
            Protocolos oficiales de resolución de fallas y canales de contacto directo para el Centro de Integración y Atención Ciudadana (CIAC).
          </p>
        </div>

        {/* Guías de resolución divididas (Ciudadano vs Administrador) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
          
          {/* Columna Ciudadanos / Usuarios Anónimos */}
          <div style={{
            background: 'rgba(30, 41, 59, 0.6)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '16px',
            padding: '1.8rem',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 10px 30px rgba(0,0,0,0.4)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.2rem' }}>
              <span style={{ fontSize: '1.4rem' }}>👤</span>
              <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#fff' }}>Usuarios / Ciudadanos</h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.85rem' }}>
              <div style={{ background: 'rgba(15, 23, 42, 0.5)', padding: '0.8rem 1rem', borderRadius: '10px', borderLeft: '3px solid #38bdf8' }}>
                <strong style={{ color: '#fff', display: 'block', marginBottom: '3px' }}>📍 Error al georreferenciar reporte</strong>
                <span style={{ color: '#94a3b8' }}>Asegurate de otorgar permisos de ubicación a tu navegador o selecciona manualmente el punto exacto haciendo clic en el mapa.</span>
              </div>

              <div style={{ background: 'rgba(15, 23, 42, 0.5)', padding: '0.8rem 1rem', borderRadius: '10px', borderLeft: '3px solid #38bdf8' }}>
                <strong style={{ color: '#fff', display: 'block', marginBottom: '3px' }}>❌ El reporte no aparece reflejado</strong>
                <span style={{ color: '#94a3b8' }}>Los reportes anónimos se guardan localmente de forma inmediata. Si limpias el caché del navegador, el almacenamiento local se reiniciará.</span>
              </div>
            </div>
          </div>

          {/* Columna Administradores */}
          <div style={{
            background: 'rgba(30, 41, 59, 0.6)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '16px',
            padding: '1.8rem',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 10px 30px rgba(0,0,0,0.4)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.2rem' }}>
              <span style={{ fontSize: '1.4rem' }}>🛡️</span>
              <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#fff' }}>Personal Administrador</h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.85rem' }}>
              <div style={{ background: 'rgba(15, 23, 42, 0.5)', padding: '0.8rem 1rem', borderRadius: '10px', borderLeft: '3px solid #f59e0b' }}>
                <strong style={{ color: '#fff', display: 'block', marginBottom: '3px' }}>🔑 Fallas de autenticación o acceso</strong>
                <span style={{ color: '#94a3b8' }}>Verificá que tus credenciales estén guardadas en el sistema o reingresa mediante el portal de login institucional.</span>
              </div>

              <div style={{ background: 'rgba(15, 23, 42, 0.5)', padding: '0.8rem 1rem', borderRadius: '10px', borderLeft: '3px solid #f59e0b' }}>
                <strong style={{ color: '#fff', display: 'block', marginBottom: '3px' }}>📊 Sincronización del Padrón Excel</strong>
                <span style={{ color: '#94a3b8' }}>Al importar planillas de ciudadanos, comprobá que las columnas respeten el orden preestablecido (Nombre, Domicilio, DNI, Barrio).</span>
              </div>
            </div>
          </div>

        </div>

        {/* Tarjetas de Contacto Institucional */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          borderRadius: '16px',
          padding: '2.2rem',
          textAlign: 'center',
          boxShadow: '0 12px 40px rgba(0,0,0,0.6)'
        }}>
          <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.2rem', color: '#fff' }}>Canales Oficiales de Contacto</h3>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '1.8rem' }}>
            Equipo de Operaciones y Soporte Tecnológico — Bella Vista, Tucumán
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.2rem', justifyContent: 'center' }}>
            <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '1rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <span style={{ fontSize: '1.2rem', display: 'block', marginBottom: '4px' }}>📧</span>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block' }}>Correo Electrónico</span>
              <strong style={{ fontSize: '0.85rem', color: '#38bdf8' }}>soporte@ciac.gob.ar</strong>
            </div>

            <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '1rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <span style={{ fontSize: '1.2rem', display: 'block', marginBottom: '4px' }}>📞</span>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block' }}>Línea de Guardia CIAC</span>
              <strong style={{ fontSize: '0.85rem', color: '#34d399' }}>+54 (381) 400-0000</strong>
            </div>

            <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '1rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <span style={{ fontSize: '1.2rem', display: 'block', marginBottom: '4px' }}>🏛️</span>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block' }}>Base Operativa</span>
              <strong style={{ fontSize: '0.85rem', color: '#f1f5f9' }}>Bella Vista, Tucumán</strong>
            </div>
          </div>
        </div>

      </main>
      <Footer />
    </div>
  );
}