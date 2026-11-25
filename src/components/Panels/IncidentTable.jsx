import React, { useState } from 'react';

export const IncidentTable = ({ incidents, onSelectIncident }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const filtered = incidents.filter(i => 
    i.barrio.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.tipo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div style={{
      backgroundColor: 'var(--bg-surface)',
      borderTop: '1px solid var(--border-color)',
      padding: '12px 16px',
      height: '220px',
      overflowY: 'auto'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <h4 style={{ fontSize: '13px', fontWeight: '700' }}>Incidentes Registrados ({filtered.length})</h4>
        <input 
          type="text" 
          placeholder="Filtrar por barrio o tipo..."
          value={searchTerm}
          onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
          style={{
            padding: '4px 8px',
            fontSize: '12px',
            borderRadius: '4px',
            border: '1px solid var(--border-color)',
            backgroundColor: 'var(--bg-primary)',
            color: 'var(--text-primary)'
          }}
        />
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left', color: 'var(--text-secondary)' }}>
            <th style={thStyle}>Fecha</th>
            <th style={thStyle}>Hora</th>
            <th style={thStyle}>Tipo</th>
            <th style={thStyle}>Barrio</th>
            <th style={thStyle}>Ubicación</th>
            <th style={thStyle}>Acción</th>
          </tr>
        </thead>
        <tbody>
          {paginated.map(inc => (
            <tr key={inc.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
              <td style={tdStyle}>{inc.fecha}</td>
              <td style={tdStyle}>{inc.hora}</td>
              <td style={tdStyle}>{inc.tipo}</td>
              <td style={tdStyle}>{inc.barrio}</td>
              <td style={tdStyle}>{inc.direccion}</td>
              <td style={tdStyle}>
                <button 
                  onClick={() => onSelectIncident(inc)}
                  style={{
                    padding: '2px 6px',
                    fontSize: '11px',
                    backgroundColor: 'var(--accent-blue)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Detalle
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Paginación */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '8px', alignItems: 'center', fontSize: '12px' }}>
        <button disabled={page === 1} onClick={() => setPage(page - 1)}>Anterior</button>
        <span>Página {page} de {totalPages}</span>
        <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>Siguiente</button>
      </div>
    </div>
  );
};

const thStyle = { padding: '6px' };
const tdStyle = { padding: '6px' };