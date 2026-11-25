// src/data/crimeData.js

export const CRIME_CATEGORIES = {
  HOMICIDIOS: {
    id: 'Homicidios',
    label: 'Homicidios',
    color: '#dc2626',
    subcategories: ['Homicidios dolosos']
  },
  LESIONES: {
    id: 'Lesiones',
    label: 'Lesiones',
    color: '#ea580c',
    subcategories: ['Lesiones dolosas']
  },
  ROBOS: {
    id: 'Robos',
    label: 'Robos',
    color: '#b91c1c',
    subcategories: ['Robo total', 'Robo con arma', 'Robo sin arma']
  },
  ROBO_AUTOMOTOR: {
    id: 'Robo automotor',
    label: 'Robo automotor',
    color: '#c2410c',
    subcategories: ['Robo automotor total', 'Robo automotor con arma']
  },
  HURTOS: {
    id: 'Hurtos',
    label: 'Hurtos',
    color: '#d97706',
    subcategories: ['Hurto total', 'Hurto automotor']
  },
  VIALIDAD: {
    id: 'Vialidad',
    label: 'Vialidad',
    color: '#2563eb',
    subcategories: ['Muertes por siniestros viales', 'Lesiones en siniestros viales']
  },
  AMENAZAS: {
    id: 'Amenazas',
    label: 'Amenazas',
    color: '#7c3aed',
    subcategories: ['Amenazas']
  },
  DROGAS: {
    id: 'Drogas',
    label: 'Drogas',
    color: '#059669',
    subcategories: ['Venta de estupefacientes', 'Narcomenudeo']
  }
};

export const CRIME_TYPES = Object.values(CRIME_CATEGORIES).map(c => ({
  id: c.id,
  label: c.label,
  color: c.color,
  subcategories: c.subcategories
}));

// Generador controlado de 2 o 3 incidentes demostrativos por categoría para evitar saturación
const generateDemoIncidents = () => {
  const categoriesList = Object.values(CRIME_CATEGORIES);
  const neighborhoods = ['Centro', 'San Cayetano', 'Barrio Talleres', 'Barrio San Martín', 'Barrio La Esperanza'];
  const streets = ['Av. Manuel Belgrano', 'San Martín', 'Entre Ríos', 'Av. Independencia', 'Av. Mitre'];
  
  const incidents = [];
  let idCounter = 1;

  categoriesList.forEach(catObj => {
    // Creamos exactamente 3 registros demostrativos por cada categoría
    for (let i = 0; i < 3; i++) {
      const barrio = neighborhoods[Math.floor(Math.random() * neighborhoods.length)];
      const calle = streets[Math.floor(Math.random() * streets.length)];
      const subtipo = catObj.subcategories[Math.floor(Math.random() * catObj.subcategories.length)];

      // Coordenadas exactas alrededor del centro de Bella Vista, Tucumán (-27.0342, -65.3019)
      const lat = -27.0342 + (Math.random() - 0.5) * 0.015;
      const lng = -65.3019 + (Math.random() - 0.5) * 0.015;

      incidents.push({
        id: `INC-2026-${String(idCounter++).padStart(4, '0')}`,
        tipo: catObj.id,
        subtipo: subtipo,
        fecha: '2026-09-15',
        hora: '14:30',
        barrio: barrio,
        direccion: `${calle} ${Math.floor(Math.random() * 800) + 100}`,
        latitud: parseFloat(lat.toFixed(6)),
        longitud: parseFloat(lng.toFixed(6)),
        descripcion: `Registro demostrativo de ${catObj.label.toLowerCase()} (${subtipo}).`,
        estadoVerificacion: 'Verificado',
        estado: 'Verificado',
        fuente: 'Central CIAC Monitoreo',
        esDemo: true
      });
    }
  });

  return incidents;
};

export const INITIAL_CRIME_DATA = generateDemoIncidents();