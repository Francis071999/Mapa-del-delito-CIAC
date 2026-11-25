// src/App.jsx
import React, { useState, useMemo, useEffect } from 'react';
import { Header } from './components/Header/Header';
import { CrimeMap } from './components/Map/CrimeMap';
import { SearchBar } from './components/UI/SearchBar';
import { IncidentTable } from './components/Panels/IncidentTable';
import { NeighborhoodModal } from './components/Panels/NeighborhoodModal';
import { IncidentDetailsModal } from './components/Panels/IncidentDetailsModal';
import { GeneralStats } from './components/Dashboard/GeneralStats';
import { InfoModal } from './components/Panels/InfoModal';
import { DrawerMenu } from './components/Navigation/DrawerMenu';

import { BarriosPanel } from './components/Panels/BarriosPanel';
import { ContextualPanel } from './components/Panels/ContextualPanel';

import Landing from './pages/Landing.jsx';
import Login from './pages/Login.jsx';
import Admin from './pages/Admin.jsx';
import RecuperarPassword from './pages/RecuperarPassword.jsx';
import SoporteTecnico from './pages/SoporteTecnico.jsx';

import { INITIAL_CRIME_DATA, CRIME_TYPES } from './data/crimeData';

export function App() {
  const [currentRoute, setCurrentRoute] = useState('landing');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Limpieza preventiva de localStorage corrupto
  useEffect(() => {
    const saved = localStorage.getItem('ciac_crime_data_v2');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (!Array.isArray(parsed) || parsed.length === 0) {
          localStorage.removeItem('reportes_ciac');
          localStorage.removeItem('ciac_crime_data_v2');
        }
      } catch (e) {
        localStorage.removeItem('reportes_ciac');
        localStorage.removeItem('ciac_crime_data_v2');
      }
    }
  }, []);

  const [crimeData, setCrimeData] = useState(() => {
    const saved = localStorage.getItem('ciac_crime_data_v2');
    return saved ? JSON.parse(saved) : INITIAL_CRIME_DATA;
  });

  // Filtros de navegación y mapa
  const [selectedMonth, setSelectedMonth] = useState('all');
  const [selectedCrimes, setSelectedCrimes] = useState(CRIME_TYPES.map(c => c.id));
  const [selectedSubcategory, setSelectedSubcategory] = useState('ALL');
  const [selectedCrimeCategory, setSelectedCrimeCategory] = useState('ALL');
  const [isAllYear, setIsAllYear] = useState(true);

  // ESTADO PARA EL BARRIO SELECCIONADO EN EL PANEL IZQUIERDO
  const [selectedBarrio, setSelectedBarrio] = useState('todos');

  // Capas Contextuales
  const [contextualLayers, setContextualLayers] = useState({
    comisarias: true,
    motorizada: true,
    casaCultura: true,
    salud: false,
    bomberos: false
  });

  // Modales y Selección
  const [selectedNeighborhood, setSelectedNeighborhood] = useState(null);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [mapCenter, setMapCenter] = useState(null);

  // Sesión de Administrador
  const [adminUser, setAdminUser] = useState(() => {
    const saved = localStorage.getItem('ciac_admin_session');
    return saved ? JSON.parse(saved) : null;
  });

  // Filtrado de Datos
  const filteredIncidents = useMemo(() => {
    return crimeData.filter(item => {
      const matchesCrime = selectedCrimes.includes(item.tipo);
      
      let matchesSubcat = true;
      if (selectedSubcategory !== 'ALL') {
        matchesSubcat = item.subtipo === selectedSubcategory;
      }

      let matchesMonth = true;
      if (!isAllYear && selectedMonth !== 'all') {
        const itemMonth = item.fecha.split('-')[1];
        matchesMonth = itemMonth === selectedMonth;
      }

      return matchesCrime && matchesSubcat && matchesMonth;
    });
  }, [crimeData, selectedMonth, selectedCrimes, selectedSubcategory, isAllYear]);

  const handleResetFilters = () => {
    setSelectedCrimes(CRIME_TYPES.map(c => c.id));
    setSelectedSubcategory('ALL');
    setSelectedMonth('all');
    setIsAllYear(true);
    setSelectedCrimeCategory('ALL');
    setSelectedBarrio('todos');
  };

  const handleSelectNeighborhoodFromSearch = (neighborhood) => {
    setSelectedNeighborhood(neighborhood);
    setSelectedBarrio(neighborhood.name); // Sincroniza con el selector
    if (neighborhood.coordinates && neighborhood.coordinates[0]) {
      setMapCenter(neighborhood.coordinates[0]);
    }
    if (currentRoute !== 'mapa') {
      setCurrentRoute('mapa');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('ciac_admin_session');
    setAdminUser(null);
    setCurrentRoute('login');
  };

  return (
    <div className="app-container">
      {/* Menú lateral desplegable con el selector de barrio y filtros */}
      <DrawerMenu 
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
        selectedCrimes={selectedCrimes}
        setSelectedCrimes={setSelectedCrimes}
        selectedSubcategory={selectedSubcategory}
        setSelectedSubcategory={setSelectedSubcategory}
        contextualLayers={contextualLayers}
        setContextualLayers={setContextualLayers}
        isAllYear={isAllYear}
        setIsAllYear={setIsAllYear}
        selectedBarrio={selectedBarrio}
        setSelectedBarrio={setSelectedBarrio}
        onResetFilters={handleResetFilters}
      />

      {/* RENDERIZADO DE RUTAS Y VISTAS */}
      {currentRoute === 'landing' && <Landing onNavigate={setCurrentRoute} />}

      {currentRoute === 'mapa' && (
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100vh' }}>
          {/* Header visible ÚNICAMENTE en el mapa interactivo */}
          <Header 
            onOpenStats={() => setShowStatsModal(true)}
            onOpenInfo={() => setShowInfoModal(true)}
            onOpenMenu={() => setIsMenuOpen(true)}
            onNavigate={setCurrentRoute}
            currentRoute={currentRoute}
          />
          <div className="main-layout" style={{ display: 'flex', flexDirection: 'column', width: '100%', height: 'calc(100vh - 60px)' }}>
            <main className="map-section" style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', width: '100%', height: '100%' }}>
              <SearchBar onSelectNeighborhood={handleSelectNeighborhoodFromSearch} />

              <div style={{ flex: 1, position: 'relative', width: '100%', height: '100%' }}>
                <CrimeMap 
                  incidents={filteredIncidents}
                  onSelectNeighborhood={(n) => setSelectedNeighborhood(n)}
                  onSelectIncident={(inc) => setSelectedIncident(inc)}
                  contextualLayers={contextualLayers}
                  mapCenter={mapCenter}
                  selectedCrimes={selectedCrimes}
                  selectedBarrio={selectedBarrio} 
                />
              </div>

              <IncidentTable 
                incidents={filteredIncidents}
                onSelectIncident={(inc) => setSelectedIncident(inc)}
              />
            </main>
          </div>
        </div>
      )}

      {currentRoute === 'barrios' && (
        <BarriosPanel 
          incidents={crimeData} 
          onSelectNeighborhood={(n) => {
            setSelectedNeighborhood(n);
            setSelectedBarrio(n.name);
            setCurrentRoute('mapa');
          }}
        />
      )}

      {currentRoute === 'contextual' && (
        <ContextualPanel 
          onFocusMapLocation={(coords) => {
            setMapCenter(coords);
            setCurrentRoute('mapa');
          }}
        />
      )}

      {currentRoute === 'estadisticas' && (
        <div className="section-page-container">
          <GeneralStats incidents={filteredIncidents} onClose={() => setCurrentRoute('mapa')} isModal={false} />
        </div>
      )}

      {currentRoute === 'admin' && (
        adminUser ? (
          <Admin 
            onNavigate={setCurrentRoute} 
            crimeData={crimeData} 
            setCrimeData={setCrimeData} 
            onLogout={handleLogout}
          />
        ) : (
          <Login 
            onNavigate={setCurrentRoute} 
            onLoginSuccess={(user) => setAdminUser(user)} 
          />
        )
      )}

      {currentRoute === 'login' && (
        <Login 
          onNavigate={setCurrentRoute} 
          onLoginSuccess={(user) => setAdminUser(user)} 
        />
      )}

      {currentRoute === 'recuperar' && <RecuperarPassword onNavigate={setCurrentRoute} />}
      {currentRoute === 'soporte' && <SoporteTecnico onNavigate={setCurrentRoute} />}

      {/* MODALES GLOBALMENTE DISPONIBLES */}
      {selectedNeighborhood && (
        <NeighborhoodModal 
          neighborhood={selectedNeighborhood}
          incidents={filteredIncidents}
          onClose={() => setSelectedNeighborhood(null)}
        />
      )}

      {selectedIncident && (
        <IncidentDetailsModal 
          incident={selectedIncident}
          onClose={() => setSelectedIncident(null)}
        />
      )}

      {showStatsModal && (
        <GeneralStats 
          incidents={filteredIncidents}
          onClose={() => setShowStatsModal(false)}
          isModal={true}
        />
      )}

      {showInfoModal && (
        <InfoModal 
          onClose={() => setShowInfoModal(false)}
        />
      )}
    </div>
  );
}

export default App;