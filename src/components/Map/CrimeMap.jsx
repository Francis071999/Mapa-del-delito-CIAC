// src/components/Map/CrimeMap.jsx
import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { NEIGHBORHOODS } from '../../data/neighborhoodData';
import { CRIME_CATEGORIES, CRIME_TYPES } from '../../data/crimeData';
import { StatsPanel } from '../Navigation/StatsPanel';

export function CrimeMap({ incidents, onSelectNeighborhood, onSelectIncident, contextualLayers, mapCenter, selectedCrimes, selectedBarrio, selectedSubcategory }) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markersLayerRef = useRef(null);
  const neighborhoodsLayerRef = useRef(null);
  const tempMarkerRef = useRef(null);
  
  const [clickCoord, setClickCoord] = useState(null);
  const [categoriaSel, setCategoriaSel] = useState(Object.keys(CRIME_CATEGORIES)[0]);
  const [subtipoSel, setSubtipoSel] = useState(CRIME_CATEGORIES[Object.keys(CRIME_CATEGORIES)[0]].subcategories[0]);
  const [descripcion, setDescripcion] = useState('');
  const [enviadoExito, setEnviadoExito] = useState(false);
  const [isStatsOpen, setIsStatsOpen] = useState(false);

  // Inicializar base limpia en 0 la primera vez
  useEffect(() => {
    if (!localStorage.getItem('reportes_ciac_iniciado')) {
      localStorage.setItem('reportes_ciac', JSON.stringify([]));
      localStorage.setItem('ciac_crime_data_v2', JSON.stringify([]));
      localStorage.setItem('reportes_ciac_iniciado', 'true');
    }
  }, []);

  // Inicializar el mapa Leaflet
  useEffect(() => {
    if (mapRef.current && !mapInstance.current) {
      const map = L.map(mapRef.current, { zoomControl: false }).setView([-27.0342, -65.3019], 14);
      L.control.zoom({ position: 'bottomright' }).addTo(map);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap'
      }).addTo(map);

      const neighborhoodsGroup = L.layerGroup().addTo(map);
      neighborhoodsLayerRef.current = neighborhoodsGroup;

      const markersGroup = L.layerGroup().addTo(map);
      markersLayerRef.current = markersGroup;

      map.on('click', (e) => {
        const { lat, lng } = e.latlng;
        setClickCoord({ lat: lat.toFixed(5), lng: lng.toFixed(5) });
        setEnviadoExito(false);
        setDescripcion('');

        if (tempMarkerRef.current) {
          tempMarkerRef.current.setLatLng([lat, lng]);
        } else {
          tempMarkerRef.current = L.marker([lat, lng], {
            draggable: true
          }).addTo(map);
        }
      });

      mapInstance.current = map;
      setTimeout(() => map.invalidateSize(), 250);
    }
  }, []);

  // Sincronización en tiempo real: contorno por barrio sin fondo verde y pelotitas con su color exacto
  useEffect(() => {
    if (mapInstance.current && neighborhoodsLayerRef.current && markersLayerRef.current) {
      neighborhoodsLayerRef.current.clearLayers();
      markersLayerRef.current.clearLayers();

      // 1. Dibujar el polígono del barrio seleccionado (SOLO CONTORNO, SIN RELLENO)
      NEIGHBORHOODS.forEach(n => {
        const coincide = selectedBarrio && selectedBarrio !== 'todos' && n.name.toLowerCase() === selectedBarrio.toLowerCase();

        if (coincide && n.coordinates && n.coordinates.length > 0) {
          const reportesCiudadanos = JSON.parse(localStorage.getItem('reportes_ciac')) || [];
          
          const incidentesEnBarrio = reportesCiudadanos.filter(inc => {
            const nombreBarrioInc = (inc.barrio || '').toLowerCase();
            return nombreBarrioInc.includes(n.name.toLowerCase());
          });

          const totalDelitos = incidentesEnBarrio.length;

          const polygon = L.polygon(n.coordinates, {
            color: n.color || '#3b82f6',
            weight: 3,
            fill: false,
            fillOpacity: 0
          });

          polygon.bindPopup(`
            <div style="font-family: sans-serif; font-size: 0.85rem; min-width: 170px; padding: 2px;">
              <strong style="color: ${n.color}; font-size: 0.92rem;">${n.name}</strong><br>
              <div style="margin-top: 6px; border-top: 1px solid rgba(0,0,0,0.1); padding-top: 4px;">
                <b>Total de Delitos:</b> <span style="color: #dc2626; font-weight: bold;">${totalDelitos}</span><br>
                <span style="font-size: 0.72rem; color: #64748b;">Sector Seleccionado</span>
              </div>
            </div>
          `);

          polygon.on('click', () => {
            if (onSelectNeighborhood) onSelectNeighborhood(n);
          });

          neighborhoodsLayerRef.current.addLayer(polygon);

          if (n.coordinates[0]) {
            mapInstance.current.setView(n.coordinates[0], 15);
          }
        }
      });

      // 2. Filtrar y renderizar las pelotitas con sus colores correctos según las casillas del panel lateral
      const reportesCiudadanos = JSON.parse(localStorage.getItem('reportes_ciac')) || [];

      reportesCiudadanos.forEach(inc => {
        const lat = inc.latitud || inc.lat;
        const lng = inc.longitud || inc.lng;

        if (lat && lng) {
          const tipoInc = (inc.tipo || '').toLowerCase();
          
          const matchCategory = !selectedCrimes || selectedCrimes.length === 0 || selectedCrimes.some(cId => {
            const cObj = CRIME_TYPES.find(ct => ct.id === cId);
            return cObj && (cObj.id.toLowerCase() === tipoInc || cObj.label.toLowerCase() === tipoInc);
          });

          const matchSubcategory = !selectedSubcategory || selectedSubcategory === 'ALL' || inc.subtipo?.toLowerCase() === selectedSubcategory.toLowerCase();

          if (matchCategory && matchSubcategory) {
            const catObj = CRIME_TYPES.find(c => c.id.toLowerCase() === tipoInc || c.label.toLowerCase() === tipoInc) || 
                           Object.values(CRIME_CATEGORIES).find(c => c.label.toLowerCase() === tipoInc || c.id.toLowerCase() === tipoInc) || 
                           { color: '#38bdf8' };
            
            const circleIcon = L.divIcon({
              className: 'custom-crime-marker',
              html: `<div style="background-color: ${catObj.color}; width: 14px; height: 14px; border-radius: 50%; border: 2px solid #ffffff; box-shadow: 0 0 6px rgba(0,0,0,0.4);"></div>`,
              iconSize: [14, 14],
              iconAnchor: [7, 7]
            });

            const marker = L.marker([lat, lng], { icon: circleIcon });
            marker.bindPopup(`
              <div style="font-family: sans-serif; font-size: 0.82rem;">
                <strong style="color: ${catObj.color}">${inc.tipo} (${inc.subtipo || 'Reporte'})</strong><br>
                <b>Ubicación:</b> ${inc.barrio || 'Bella Vista'}<br>
                <b>Fecha:</b> ${inc.fecha} ${inc.hora || ''}<br>
                <b>Estado:</b> ${inc.estadoVerificacion || 'En revisión'}<br>
                <p style="margin: 4px 0 0;">${inc.descripcion || ''}</p>
              </div>
            `);

            marker.on('click', () => {
              if (onSelectIncident) onSelectIncident(inc);
            });

            markersLayerRef.current.addLayer(marker);
          }
        }
      });
    }
  }, [selectedBarrio, selectedCrimes, selectedSubcategory]);

  useEffect(() => {
    if (mapInstance.current && mapCenter) {
      mapInstance.current.setView(mapCenter, 15);
    }
  }, [mapCenter]);

  const handleCategoriaChange = (e) => {
    const nuevaCatKey = e.target.value;
    setCategoriaSel(nuevaCatKey);
    const catData = CRIME_CATEGORIES[nuevaCatKey];
    if (catData && catData.subcategories && catData.subcategories.length > 0) {
      setSubtipoSel(catData.subcategories[0]);
    }
  };

  const handleEnviarReporteMapa = (e) => {
    e.preventDefault();
    if (!clickCoord) return;

    const catInfo = CRIME_CATEGORIES[categoriaSel];
    const reportesExistentes = JSON.parse(localStorage.getItem('reportes_ciac')) || [];

    const nuevoReporte = {
      id: `REP-${Date.now().toString().slice(-6)}`,
      tipo: catInfo ? catInfo.label : categoriaSel,
      subtipo: subtipoSel,
      categoria: catInfo ? catInfo.id : categoriaSel,
      descripcion: descripcion,
      fecha: new Date().toISOString().split('T')[0],
      hora: new Date().toTimeString().substring(0, 5),
      barrio: selectedBarrio && selectedBarrio !== 'todos' ? selectedBarrio : 'Bella Vista (Reporte Ciudadano)',
      direccion: `Lat: ${clickCoord.lat}, Lng: ${clickCoord.lng}`,
      latitud: parseFloat(clickCoord.lat),
      longitud: parseFloat(clickCoord.lng),
      lat: parseFloat(clickCoord.lat),
      lng: parseFloat(clickCoord.lng),
      estadoVerificacion: 'En revisión',
      estado: 'Pendiente de revisión',
      fuente: 'Reporte Interactivo Mapa',
      esDemo: false,
      fechaRegistro: new Date().toLocaleString()
    };

    const actualizados = [nuevoReporte, ...reportesExistentes];
    localStorage.setItem('reportes_ciac', JSON.stringify(actualizados));
    localStorage.setItem('ciac_crime_data_v2', JSON.stringify(actualizados));

    setEnviadoExito(true);

    const tipoInc = nuevoReporte.tipo.toLowerCase();
    const estaTildado = !selectedCrimes || selectedCrimes.length === 0 || selectedCrimes.some(cId => {
      const cObj = CRIME_TYPES.find(ct => ct.id === cId);
      return cObj && (cObj.id.toLowerCase() === tipoInc || cObj.label.toLowerCase() === tipoInc);
    });

    if (estaTildado && markersLayerRef.current && mapInstance.current) {
      const catObj = CRIME_TYPES.find(c => c.label.toLowerCase() === tipoInc) || 
                     Object.values(CRIME_CATEGORIES).find(c => c.label.toLowerCase() === tipoInc) || 
                     { color: '#38bdf8' };

      const circleIcon = L.divIcon({
        className: 'custom-crime-marker',
        html: `<div style="background-color: ${catObj.color}; width: 14px; height: 14px; border-radius: 50%; border: 2px solid #ffffff; box-shadow: 0 0 6px rgba(0,0,0,0.4);"></div>`,
        iconSize: [14, 14],
        iconAnchor: [7, 7]
      });

      const marker = L.marker([nuevoReporte.lat, nuevoReporte.lng], { icon: circleIcon });
      marker.bindPopup(`
        <div style="font-family: sans-serif; font-size: 0.82rem;">
          <strong style="color: ${catObj.color}">${nuevoReporte.tipo} (${nuevoReporte.subtipo})</strong><br>
          <b>Ubicación:</b> ${nuevoReporte.barrio}<br>
          <b>Fecha:</b> ${nuevoReporte.fecha} ${nuevoReporte.hora}<br>
          <b>Estado:</b> En revisión<br>
          <p style="margin: 4px 0 0;">${nuevoReporte.descripcion}</p>
        </div>
      `);
      markersLayerRef.current.addLayer(marker);
    }

    setTimeout(() => {
      setClickCoord(null);
      if (tempMarkerRef.current && mapInstance.current) {
        mapInstance.current.removeLayer(tempMarkerRef.current);
        tempMarkerRef.current = null;
      }
    }, 1200);
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: '500px' }}>
      <div ref={mapRef} style={{ width: '100%', height: '100%', minHeight: '500px', zIndex: 1 }} />

      <button
        onClick={() => setIsStatsOpen(true)}
        style={{
          position: 'absolute', top: '15px', right: '20px', zIndex: 1000,
          background: '#2563eb', color: '#fff', border: 'none',
          padding: '0.45rem 1rem', borderRadius: '8px', fontWeight: 'bold',
          cursor: 'pointer', fontSize: '0.8rem', boxShadow: '0 4px 15px rgba(37, 99, 235, 0.4)'
        }}
      >
        📊 Mas detallado
      </button>

      <StatsPanel
        isOpen={isStatsOpen}
        onClose={() => setIsStatsOpen(false)}
        selectedCategory={selectedCrimes}
        selectedBarrio={selectedBarrio}
      />

      {clickCoord && (
        <div style={{
          position: 'absolute', top: '20px', right: '20px', zIndex: 1000,
          width: '350px', background: 'rgba(15, 23, 42, 0.95)', backdropFilter: 'blur(12px)',
          border: '1px solid rgba(59, 130, 246, 0.35)', borderRadius: '16px', padding: '1.2rem',
          boxShadow: '0 12px 32px rgba(0,0,0,0.6)', color: '#f8fafc'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.8rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.6rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', overflow: 'hidden', border: '1px solid #3b82f6', background: '#0f172a' }}>
                <img src="img/logo-ciac.jpg" alt="CIAC" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.style.display = 'none'; }} />
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: '0.88rem', color: '#fff' }}>CIAC — Asistencia Ciudadana</h4>
                <span style={{ fontSize: '0.65rem', color: '#94a3b8' }}>Reporte Anónimo Georreferenciado</span>
              </div>
            </div>
            <button 
              onClick={() => {
                setClickCoord(null);
                if (tempMarkerRef.current && mapInstance.current) {
                  mapInstance.current.removeLayer(tempMarkerRef.current);
                  tempMarkerRef.current = null;
                }
              }}
              style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '1.1rem', cursor: 'pointer' }}
            >
              ✕
            </button>
          </div>

          {enviadoExito ? (
            <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>✅</div>
              <h5 style={{ color: '#34d399', margin: '0 0 0.3rem', fontSize: '1rem' }}>Reporte Registrado</h5>
              <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: 0 }}>Gestionado correctamente en el mapa.</p>
            </div>
          ) : (
            <form onSubmit={handleEnviarReporteMapa}>
              <div style={{ fontSize: '0.72rem', color: '#38bdf8', marginBottom: '0.6rem', background: 'rgba(56, 189, 248, 0.1)', padding: '0.3rem 0.6rem', borderRadius: '6px' }}>
                📍 Coordenadas: {clickCoord.lat}, {clickCoord.lng}
              </div>

              <div style={{ marginBottom: '0.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.72rem', color: '#cbd5e1', marginBottom: '0.2rem' }}>Categoría Delictiva</label>
                <select
                  value={categoriaSel}
                  onChange={handleCategoriaChange}
                  style={{ width: '100%', padding: '0.4rem', background: '#1e293b', border: '1px solid #475569', borderRadius: '6px', color: '#fff', fontSize: '0.78rem' }}
                >
                  {Object.entries(CRIME_CATEGORIES).map(([key, cat]) => (
                    <option key={key} value={key}>{cat.label}</option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: '0.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.72rem', color: '#cbd5e1', marginBottom: '0.2rem' }}>Subcategoría Específica</label>
                <select
                  value={subtipoSel}
                  onChange={(e) => setSubtipoSel(e.target.value)}
                  style={{ width: '100%', padding: '0.4rem', background: '#1e293b', border: '1px solid #475569', borderRadius: '6px', color: '#fff', fontSize: '0.78rem' }}
                >
                  {CRIME_CATEGORIES[categoriaSel]?.subcategories.map((sub, idx) => (
                    <option key={idx} value={sub}>{sub}</option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: '0.8rem' }}>
                <label style={{ display: 'block', fontSize: '0.72rem', color: '#cbd5e1', marginBottom: '0.2rem' }}>Descripción de los Hechos</label>
                <textarea
                  rows="2"
                  required
                  placeholder="Detalles breves de la situación..."
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  style={{ width: '100%', padding: '0.4rem', background: '#1e293b', border: '1px solid #475569', borderRadius: '6px', color: '#fff', fontSize: '0.78rem', resize: 'none' }}
                />
              </div>

              <button
                type="submit"
                style={{ width: '100%', padding: '0.5rem', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 'bold', fontSize: '0.8rem', cursor: 'pointer' }}
              >
                📩 Enviar Reporte al CIAC
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}