import React from 'react';
import { X, ShieldCheck } from 'lucide-react';

export const InfoModal = ({ onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '600px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={24} color="var(--accent-blue)" />
            <h3 style={{ fontSize: '18px' }}>CIAC — Información Institucional</h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-primary)' }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ fontSize: '13px', lineHeight: '1.6', color: 'var(--text-primary)' }}>
          <p style={{ marginBottom: '12px' }}>
            El <b>Centro de Monitoreo y Asistencia Ciudadana (CIAC)</b> presenta la plataforma tecnológica <b>Mapa del Delito 2026</b>, diseñada para el análisis geoespacial y estadístico de incidentes en el municipio.
          </p>

          <h4 style={{ fontWeight: 'bold', marginBottom: '6px' }}>Funcionalidades Clave:</h4>
          <ul style={{ paddingLeft: '20px', marginBottom: '16px' }}>
            <li>Visualización geolocalizada por mapas coropléticos.</li>
            <li>Filtrado dinámico por período, tipos de incidentes y zonas.</li>
            <li>Capas de contexto comunitario (Comisarías, Salud, Educación, Bancos, Bomberos).</li>
            <li>Estadísticas dinámicas y gráficos de tendencia horaria e histórica.</li>
          </ul>

          <p style={{ fontSize: '11px', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
            Nota: Este sistema se encuentra preparado para operar de forma nativa como aplicación de escritorio mediante Tauri, con capacidad de integración directa con bases de datos MySQL / API REST oficiales.
          </p>
        </div>
      </div>
    </div>
  );
};