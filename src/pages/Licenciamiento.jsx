import React, { useState } from 'react';
import CiacLogo from '../components/CiacLogo';
import Footer from '../components/Footer';

export default function Licenciamiento({ onNavigate }) {
  const [modalRenovar, setModalRenovar] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <nav className="navbar">
        <div className="logo-container" onClick={() => onNavigate('landing')}>
          <CiacLogo size={38} />
          <div>
            <strong style={{ fontSize: '1.1rem' }}>Centro de Gestión y Licenciamiento</strong>
          </div>
        </div>
        <button className="btn-secundario" onClick={() => onNavigate('landing')}>Volver</button>
      </nav>

      <main style={{ flex: 1, padding: '2.5rem 1.5rem', maxWidth: '1100px', margin: '0 auto', width: '100%' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <span className="badge-proposito">🛡 Sistema Comercial Institucional SaaS</span>
          <h1 style={{ fontSize: '2.4rem', margin: '0.6rem 0 0.3rem' }}>Centro de Gestión y Licenciamiento</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: '650px', margin: '0 auto' }}>
            Administrá las licencias, suscripciones, contratos y configuraciones comerciales de tus soluciones de software CIAC.
          </p>
        </div>

        <div className="panel" style={{
          background: 'linear-gradient(135deg, rgba(21, 32, 54, 0.95), rgba(15, 23, 42, 0.98))',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          marginBottom: '2rem',
          padding: '2rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <span style={{ color: '#60a5fa', fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase' }}>Software Contratado</span>
              <h2 style={{ margin: '0.2rem 0', fontSize: '1.8rem' }}>CIAC — Mapa del Delito</h2>
              <small style={{ color: 'var(--text-secondary)' }}>Licencia de Software para Monitoreo y Asistencia Ciudadana</small>
            </div>
            <span style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', border: '1px solid #10b981', padding: '0.4rem 1rem', borderRadius: '20px', fontWeight: 'bold', fontSize: '0.88rem' }}>
              ● Licencia ACTIVA
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>PLAN CONTRATADO</span>
              <strong style={{ display: 'block', fontSize: '1.1rem', marginTop: '0.2rem' }}>Institucional / Gobierno</strong>
            </div>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>MODALIDAD</span>
              <strong style={{ display: 'block', fontSize: '1.1rem', marginTop: '0.2rem' }}>Suscripción Anual</strong>
            </div>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>EQUIPOS AUTORIZADOS</span>
              <strong style={{ display: 'block', fontSize: '1.1rem', marginTop: '0.2rem' }}>5 Terminales Activas</strong>
            </div>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>SOPORTE Y ACTUALIZACIONES</span>
              <strong style={{ display: 'block', fontSize: '1.1rem', color: '#10b981', marginTop: '0.2rem' }}>✓ Incluidos 24/7</strong>
            </div>
          </div>
        </div>

        <div className="panel" style={{ marginBottom: '2rem' }}>
          <h3 style={{ marginTop: 0 }}>✓ Cobertura y Beneficios Incluidos</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            Servicios habilitados dentro del contrato de licenciamiento vigente.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
            {[
              'Acceso total al sistema CIAC',
              'Gestión de reportes ciudadanos anónimos',
              'Mapa interactivo georreferenciado (Leaflet)',
              'Panel de control administrativo con métricas',
              'Planilla de datos tipo Excel interna',
              'Estadísticas e indicadores en tiempo real',
              'Soporte técnico preferencial 24/7',
              'Actualizaciones y parches de seguridad'
            ].map((item, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.8rem', background: 'var(--bg-surface)', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                <span style={{ color: '#10b981', fontWeight: 'bold' }}>✓</span>
                <span style={{ fontSize: '0.88rem' }}>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          <div className="panel">
            <h3>⏳ Vigencia y Estado Contratado</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Fecha de Inicio:</span>
                <strong>01 / 01 / 2026</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Fecha de Vencimiento:</span>
                <strong style={{ color: '#f59e0b' }}>31 / 12 / 2026</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Días Restantes:</span>
                <strong style={{ color: '#10b981' }}>90 Días Vigentes</strong>
              </div>
            </div>

            <button className="btn-principal" style={{ width: '100%', marginTop: '1.5rem' }} onClick={() => setModalRenovar(true)}>
              🔄 Solicitud de Renovación
            </button>
          </div>

          <div className="panel">
            <h3>💳 Modalidades de Licenciamiento Comercial</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginTop: '1rem' }}>
              <div style={{ padding: '0.75rem', background: 'var(--bg-surface)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <strong>Licencia Mensual</strong>
                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Acceso continuo mes a mes para evaluaciones.</p>
              </div>
              <div style={{ padding: '0.75rem', background: 'var(--bg-surface)', borderRadius: '8px', border: '1px solid var(--accent)' }}>
                <strong style={{ color: 'var(--accent)' }}>Licencia Anual (Actual)</strong>
                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>12 meses con soporte 24/7 y mantenimiento garantizado.</p>
              </div>
              <div style={{ padding: '0.75rem', background: 'var(--bg-surface)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <strong>Licencia Institucional / Municipal</strong>
                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Diseñada para organismos públicos con múltiples terminales.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="panel">
          <h3>📜 Historial de Eventos de Licencia</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginTop: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', fontSize: '0.88rem' }}>
              <span>2026-01-01 — Activación Inicial de Licencia Institucional</span>
              <span style={{ color: '#10b981', fontWeight: 'bold' }}>Completado</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', fontSize: '0.88rem' }}>
              <span>2026-05-15 — Actualización del Núcleo del Mapa y Planilla Interna</span>
              <span style={{ color: '#10b981', fontWeight: 'bold' }}>Aplicado</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', fontSize: '0.88rem' }}>
              <span>2026-09-01 — Auditoría Anual de Seguridad y Rendimiento</span>
              <span style={{ color: '#10b981', fontWeight: 'bold' }}>Aprobado</span>
            </div>
          </div>
        </div>

      </main>

      {modalRenovar && (
        <div className="drawer-overlay" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="panel" style={{ maxWidth: '450px', width: '100%', textAlign: 'center' }}>
            <h3>🔄 Solicitud de Renovación</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6' }}>
              Esta función está lista para conectarse con una pasarela de pagos institucionales (Mercado Pago / Stripe). La licencia actual vence el <b>31/12/2026</b>.
            </p>
            <button className="btn-principal" style={{ width: '100%', marginTop: '1rem' }} onClick={() => setModalRenovar(false)}>
              Entendido
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}