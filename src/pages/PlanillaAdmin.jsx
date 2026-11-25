import React, { useState, useEffect } from 'react';

export default function PlanillaAdmin({ onVerEnMapa }) {
  const [filas, setFilas] = useState([]);
  const [columnasExtra, setColumnasExtra] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  
  const [mostrarModalCrear, setMostrarModalCrear] = useState(false);
  const [mostrarModalColumna, setMostrarModalColumna] = useState(false);
  const [nombreNuevaColumna, setNombreNuevaColumna] = useState('');

  const [nuevoRegistro, setNuevoRegistro] = useState({
    nombre: '',
    apellido: '',
    dni: '',
    fecha: new Date().toISOString().split('T')[0],
    hora: new Date().toTimeString().substring(0, 5),
    direccion: 'Bella Vista, Tucumán',
    lat: '-27.0342',
    lng: '-65.3019',
    tipo: 'Inspección Municipal'
  });

  useEffect(() => {
    const guardados = JSON.parse(localStorage.getItem('ciac_excel_admin')) || [
      {
        id: 1,
        nombre: 'Carlos',
        apellido: 'Gómez',
        dni: '38123456',
        fecha: '2026-09-10',
        hora: '10:30',
        direccion: 'Av. Manuel Belgrano 450',
        lat: '-27.0310',
        lng: '-65.3050',
        tipo: 'Patrullaje Preventivo'
      },
      {
        id: 2,
        nombre: 'María',
        apellido: 'López',
        dni: '40987654',
        fecha: '2026-09-12',
        hora: '14:15',
        direccion: 'Calle Rivadavia 120',
        lat: '-27.0355',
        lng: '-65.2990',
        tipo: 'Revisión de Alumbrado'
      }
    ];
    setFilas(guardados);

    const cols = JSON.parse(localStorage.getItem('ciac_excel_cols')) || [];
    setColumnasExtra(cols);
  }, []);

  const guardarFilas = (nuevas) => {
    setFilas(nuevas);
    localStorage.setItem('ciac_excel_admin', JSON.stringify(nuevas));
  };

  const handleCrearRegistro = (e) => {
    e.preventDefault();
    const itemFinal = {
      id: Date.now(),
      ...nuevoRegistro
    };
    const actualizadas = [itemFinal, ...filas];
    guardarFilas(actualizadas);
    setMostrarModalCrear(false);
  };

  const handleEliminar = (id) => {
    if (window.confirm('¿Eliminar este registro de la planilla?')) {
      const actualizadas = filas.filter(f => f.id !== id);
      guardarFilas(actualizadas);
    }
  };

  const handleAgregarColumna = (e) => {
    e.preventDefault();
    if (!nombreNuevaColumna) return;
    const actualizadasCols = [...columnasExtra, nombreNuevaColumna];
    setColumnasExtra(actualizadasCols);
    localStorage.setItem('ciac_excel_cols', JSON.stringify(actualizadasCols));
    setNombreNuevaColumna('');
    setMostrarModalColumna(false);
  };

  const filasFiltradas = filas.filter(f => {
    const txt = `${f.nombre} ${f.apellido} ${f.dni} ${f.tipo} ${f.direccion}`.toLowerCase();
    return txt.includes(busqueda.toLowerCase());
  });

  return (
    <div className="panel">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <span style={{ background: 'rgba(59, 130, 246, 0.15)', color: 'var(--accent)', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold' }}>
            HERRAMIENTA INTERNA
          </span>
          <h2 style={{ margin: '0.3rem 0 0' }}>📑 Planilla de Datos Administrativa (Excel)</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0 }}>
            Registro georreferenciado independiente gestionado exclusivamente por el administrador.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button className="btn-principal" style={{ fontSize: '0.85rem' }} onClick={() => setMostrarModalCrear(true)}>
            ➕ Agregar Fila
          </button>
          <button className="btn-secundario" style={{ fontSize: '0.85rem' }} onClick={() => setMostrarModalColumna(true)}>
            📊 Nueva Columna
          </button>
        </div>
      </div>

      <div style={{ marginBottom: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <input
          type="text"
          placeholder="🔍 Buscar por Nombre, DNI, Dirección o Tipo..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          style={{ flex: 1 }}
        />
      </div>

      <div className="excel-table-container">
        <table className="excel-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>DNI</th>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Dirección</th>
              <th>Latitud</th>
              <th>Longitud</th>
              <th>Tipo</th>
              {columnasExtra.map((col, i) => (
                <th key={i} style={{ color: '#60a5fa' }}>{col}</th>
              ))}
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filasFiltradas.length === 0 ? (
              <tr>
                <td colSpan={11 + columnasExtra.length} style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem' }}>
                  No existen registros cargados en la planilla.
                </td>
              </tr>
            ) : (
              filasFiltradas.map((f) => (
                <tr key={f.id}>
                  <td style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>#{f.id}</td>
                  <td>{f.nombre}</td>
                  <td>{f.apellido}</td>
                  <td>{f.dni}</td>
                  <td>{f.fecha}</td>
                  <td>{f.hora}</td>
                  <td>{f.direccion}</td>
                  <td style={{ color: '#60a5fa' }}>{f.lat}</td>
                  <td style={{ color: '#60a5fa' }}>{f.lng}</td>
                  <td><strong>{f.tipo}</strong></td>
                  {columnasExtra.map((col, i) => (
                    <td key={i}>—</td>
                  ))}
                  <td>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <button
                        className="btn-principal"
                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                        onClick={() => onVerEnMapa && onVerEnMapa(f)}
                      >
                        📍 Ver en Mapa
                      </button>
                      <button
                        className="btn-secundario"
                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', color: '#ef4444' }}
                        onClick={() => handleEliminar(f.id)}
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {mostrarModalCrear && (
        <div className="drawer-overlay" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="panel" style={{ maxWidth: '500px', width: '100%' }}>
            <h3>➕ Agregar Nuevo Registro a la Planilla</h3>
            <form onSubmit={handleCrearRegistro}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <div className="form-group">
                  <label>Nombre</label>
                  <input required type="text" value={nuevoRegistro.nombre} onChange={e => setNuevoRegistro({...nuevoRegistro, nombre: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Apellido</label>
                  <input required type="text" value={nuevoRegistro.apellido} onChange={e => setNuevoRegistro({...nuevoRegistro, apellido: e.target.value})} />
                </div>
              </div>
              <div className="form-group">
                <label>DNI</label>
                <input required type="text" value={nuevoRegistro.dni} onChange={e => setNuevoRegistro({...nuevoRegistro, dni: e.target.value})} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <div className="form-group">
                  <label>Latitud</label>
                  <input required type="text" value={nuevoRegistro.lat} onChange={e => setNuevoRegistro({...nuevoRegistro, lat: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Longitud</label>
                  <input required type="text" value={nuevoRegistro.lng} onChange={e => setNuevoRegistro({...nuevoRegistro, lng: e.target.value})} />
                </div>
              </div>
              <div className="form-group">
                <label>Tipo de Gestión</label>
                <input required type="text" value={nuevoRegistro.tipo} onChange={e => setNuevoRegistro({...nuevoRegistro, tipo: e.target.value})} />
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                <button type="submit" className="btn-principal" style={{ flex: 1 }}>Guardar Fila</button>
                <button type="button" className="btn-secundario" style={{ flex: 1 }} onClick={() => setMostrarModalCrear(false)}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {mostrarModalColumna && (
        <div className="drawer-overlay" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="panel" style={{ maxWidth: '400px', width: '100%' }}>
            <h3>📊 Agregar Columna Personalizada</h3>
            <form onSubmit={handleAgregarColumna}>
              <div className="form-group">
                <label>Nombre de la Nueva Columna</label>
                <input
                  required
                  type="text"
                  placeholder="Ej: Observaciones, Responsable..."
                  value={nombreNuevaColumna}
                  onChange={e => setNombreNuevaColumna(e.target.value)}
                />
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                <button type="submit" className="btn-principal" style={{ flex: 1 }}>Agregar Columna</button>
                <button type="button" className="btn-secundario" style={{ flex: 1 }} onClick={() => setMostrarModalColumna(false)}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}