// src/pages/RegistroAnonimo.jsx
import React, { useState, useEffect, useRef } from 'react';
import CiacLogo from '../components/CiacLogo';
import Footer from '../components/Footer';

// Puntos clave de referencia en Bella Vista, Tucumán
const PUNTOS_BELLA_VISTA = [
  { nombre: 'Centro (Plaza / Comisaría)', lat: -27.0342, lng: -65.3019 },
  { nombre: 'Barrio Rivadavia', lat: -27.0330, lng: -65.3100 },
  { nombre: 'Barrio 240', lat: -27.0280, lng: -65.3090 },
  { nombre: 'Barrio Matienzo', lat: -27.0280, lng: -65.3050 },
  { nombre: 'Barrio La Esperanza', lat: -27.0330, lng: -65.3060 },
  { nombre: 'Barrio Talleres', lat: -27.0330, lng: -65.2970 },
  { nombre: 'Barrio Independiente', lat: -27.0410, lng: -65.2830 }
];

export default function RegistroAnonimo({ onNavigate }) {
  const [formData, setFormData] = useState({
    tipo: 'Robo / Hurto',
    categoria: 'Seguridad',
    descripcion: '',
    fecha: new Date().toISOString().split('T')[0],
    hora: new Date().toTimeString().substring(0, 5),
    barrioSeleccionado: 'Centro (Plaza / Comisaría)',
    lat: -27.0342,
    lng: -65.3019
  });

  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    if (window.L && mapRef.current && !mapInstance.current) {
      try {
        const map = window.L.map(mapRef.current).setView([-27.0342, -65.3019], 14);

        window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap'
        }).addTo(map);

        const marker = window.L.marker([-27.0342, -65.3019], { draggable: true }).addTo(map);
        markerRef.current = marker;

        marker.on('dragend', (e) => {
          const coords = e.target.getLatLng();
          setFormData((prev) => ({ 
            ...prev, 
            lat: parseFloat(coords.lat.toFixed(6)), 
            lng: parseFloat(coords.lng.toFixed(6)),
            barrioSeleccionado: 'Ubicación personalizada en mapa'
          }));
        });

        map.on('click', (e) => {
          const { lat, lng } = e.latlng;
          marker.setLatLng([lat, lng]);
          setFormData((prev) => ({ 
            ...prev, 
            lat: parseFloat(lat.toFixed(6)), 
            lng: parseFloat(lng.toFixed(6)),
            barrioSeleccionado: 'Ubicación personalizada en mapa'
          }));
        });

        mapInstance.current = map;
        setTimeout(() => map.invalidateSize(), 300);
      } catch (err) {
        console.error('Error al inicializar mapa Leaflet:', err);
      }
    }
  }, []);

  const seleccionarPuntoRapido = (punto) => {
    setFormData(prev => ({
      ...prev,
      lat: punto.lat,
      lng: punto.lng,
      barrioSeleccionado: punto.nombre
    }));

    if (mapInstance.current && markerRef.current) {
      mapInstance.current.setView([punto.lat, punto.lng], 15);
      markerRef.current.setLatLng([punto.lat, punto.lng]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const reportesExistentes = JSON.parse(localStorage.getItem('reportes_ciac')) || 
                              JSON.parse(localStorage.getItem('ciac_crime_data_v2')) || [];

    const nuevoReporte = {
      id: `REP-${Date.now().toString().slice(-6)}`,
      tipo: formData.tipo,
      categoria: formData.categoria,
      subtipo: formData.tipo,
      descripcion: formData.descripcion,
      fecha: formData.fecha,
      hora: formData.hora,
      barrio: formData.barrioSeleccionado,
      direccion: `Zona: ${formData.barrioSeleccionado}`,
      latitud: formData.lat,
      longitud: formData.lng,
      lat: formData.lat,
      lng: formData.lng,
      estadoVerificacion: 'En revisión',
      estado: 'Pendiente de revisión',
      fuente: 'Reporte Anónimo Ciudadano',
      esDemo: false,
      fechaRegistro: new Date().toLocaleString()
    };

    const actualizados = [nuevoReporte, ...reportesExistentes];
    localStorage.setItem('reportes_ciac', JSON.stringify(actualizados));
    localStorage.setItem('ciac_crime_data_v2', JSON.stringify(actualizados));

    alert(`✓ Reporte anónimo registrado con éxito.\nGuarda tu código de seguimiento: ${nuevoReporte.id}`);
    onNavigate('landing');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#0f172a', color: '#f8fafc' }}>
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.8rem 1.5rem', background: 'rgba(15, 23, 42, 0.9)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => onNavigate('landing')}>
          <CiacLogo size={38} />
          <div>
            <strong style={{ fontSize: '1.05rem', color: '#fff' }}>CIAC — Reporte Anónimo</strong>
          </div>
        </div>
        <button onClick={() => onNavigate('landing')} style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '6px', cursor: 'pointer' }}>Volver</button>
      </nav>

      <main style={{ flex: 1, padding: '2rem 1rem', maxWidth: '850px', margin: '0 auto', width: '100%' }}>
        <div style={{ background: 'rgba(30, 41, 59, 0.7)', padding: '2rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}>
          <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '1rem' }}>
            <span style={{ background: 'rgba(34, 197, 94, 0.15)', color: '#34d399', padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 'bold' }}>
              🔒 Anonimato Garantizado — Sin Registro ni Contraseña
            </span>
            <h2 style={{ margin: '0.6rem 0 0.3rem', color: '#fff' }}>Marcar Situación o Incidente</h2>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: 0 }}>
              Selecciona un punto rápido de Bella Vista o haz clic/arrastra el marcador en el mapa.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* BOTONES DE SELECCIÓN RÁPIDA (GARANTIZAN UBICACIÓN EXACTA) */}
            <div style={{ marginBottom: '1.2rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '0.5rem' }}>
                📍 Selección Rápida de Zona en Bella Vista:
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {PUNTOS_BELLA_VISTA.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => seleccionarPuntoRapido(p)}
                    style={{
                      padding: '0.4rem 0.8rem',
                      borderRadius: '8px',
                      border: formData.barrioSeleccionado === p.nombre ? '1px solid #3b82f6' : '1px solid rgba(255,255,255,0.15)',
                      background: formData.barrioSeleccionado === p.nombre ? 'rgba(59, 130, 246, 0.25)' : 'rgba(15, 23, 42, 0.6)',
                      color: '#fff',
                      fontSize: '0.78rem',
                      cursor: 'pointer',
                      fontWeight: formData.barrioSeleccionado === p.nombre ? 'bold' : 'normal'
                    }}
                  >
                    {p.nombre}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '1.2rem' }}>
              <div 
                ref={mapRef} 
                style={{ height: '260px', width: '100%', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.15)', zIndex: 1 }} 
              />
              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                <input 
                  type="text" 
                  readOnly 
                  value={`Zona: ${formData.barrioSeleccionado}`} 
                  style={{ flex: 1, padding: '0.4rem', background: '#1e293b', border: '1px solid #475569', borderRadius: '6px', color: '#38bdf8', fontSize: '0.8rem' }} 
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '0.4rem' }}>Categoría</label>
                <select
                  value={formData.categoria}
                  onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem', background: '#1e293b', border: '1px solid #475569', borderRadius: '6px', color: '#fff' }}
                >
                  <option value="Seguridad">Seguridad / Delito</option>
                  <option value="Violencia">Violencia Urbana</option>
                  <option value="Tránsito">Tránsito / Vialidad</option>
                  <option value="Prevención">Alerta Preventiva</option>
                  <option value="Otros">Otros</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '0.4rem' }}>Tipo de Situación</label>
                <input
                  required
                  type="text"
                  placeholder="Ej: Robo, disturbio, luminaria rota"
                  value={formData.tipo}
                  onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem', background: '#1e293b', border: '1px solid #475569', borderRadius: '6px', color: '#fff' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '0.4rem' }}>Fecha</label>
                <input
                  type="date"
                  required
                  value={formData.fecha}
                  onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem', background: '#1e293b', border: '1px solid #475569', borderRadius: '6px', color: '#fff' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '0.4rem' }}>Hora</label>
                <input
                  type="time"
                  required
                  value={formData.hora}
                  onChange={(e) => setFormData({ ...formData, hora: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem', background: '#1e293b', border: '1px solid #475569', borderRadius: '6px', color: '#fff' }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '0.4rem' }}>Descripción de los Hechos</label>
              <textarea
                rows="3"
                required
                placeholder="Detalla lo sucedido de forma breve y sin datos personales..."
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                style={{ width: '100%', padding: '0.6rem', background: '#1e293b', border: '1px solid #475569', borderRadius: '6px', color: '#fff' }}
              />
            </div>

            <button type="submit" style={{ width: '100%', padding: '0.75rem', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '0.9rem', cursor: 'pointer' }}>
              🚀 Enviar Reporte Anónimo
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}