// src/components/Footer.jsx
import React from 'react';

export default function Footer() {
  return (
    <footer style={{
      padding: '1.25rem 1rem',
      backgroundColor: 'rgba(15, 23, 42, 0.95)',
      borderTop: '1px solid rgba(255, 255, 255, 0.08)',
      textAlign: 'center',
      color: 'var(--text-secondary, #94a3b8)',
      fontSize: '0.8rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.3rem'
    }}>
      <div>
        © 2026 CIAC — Mapa del Delito. Todos los derechos reservados.
      </div>
      <div style={{ color: '#38bdf8', fontWeight: '500', fontSize: '0.82rem' }}>
        Desarrollado por Franco Fabian Osores Vergara & Walter Santillan
      </div>
      <div style={{ fontSize: '0.72rem', opacity: 0.8 }}>
        Proyecto académico demostrativo — Centro de Asistencia Ciudadana (Fundado el 13 de diciembre de 2019)
      </div>
    </footer>
  );
}