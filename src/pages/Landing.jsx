// src/pages/Landing.jsx
import React, { useState, useEffect } from 'react';

export default function Landing({ onNavigate }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeInfoIndex, setActiveInfoIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingTarget, setLoadingTarget] = useState('');

  const images = [
    'img/logo-ciac.jpg',
    'img/carrusel-1.jpg',
    'img/carrusel-3.jpg',
    'img/carrusel-4.jpg'
  ];

  // Tarjetas informativas para el carrusel moderno interactivo
  const infoSlides = [
    {
      icon: '📍',
      title: 'Georreferenciación Activa',
      description: 'Permite ubicar de forma exacta los incidentes reportados en cada barrio y sector de Bella Vista (240 Viviendas, Santa Rita, Centro, etc.).'
    },
    {
      icon: '🔒',
      title: 'Reportes Anónimos Seguros',
      description: 'Cualquier vecino puede hacer clic en el mapa y enviar un reporte de asistencia o alerta ciudadana de forma confidencial y directa al CIAC.'
    },
    {
      icon: '📊',
      title: 'Estadísticas y Grilla Horaria',
      description: 'Analiza gráficos de barras por sectores, densidad delictiva por KM2 y una grilla horaria detallada de los delitos para optimizar el patrullaje preventivo.'
    },
    {
      icon: '📋',
      title: 'Padrón Institucional y Excel',
      description: 'Módulo exclusivo para administradores que vincula bases de datos de ciudadanos con marcadores directos en la cartografía municipal.'
    }
  ];

  // Rotación automática del carrusel de imágenes
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [images.length]);

  // Rotación automática o manual del carrusel interactivo de información
  useEffect(() => {
    const infoTimer = setInterval(() => {
      setActiveInfoIndex((prev) => (prev + 1) % infoSlides.length);
    }, 5000);
    return () => clearInterval(infoTimer);
  }, [infoSlides.length]);

  const handleNavigationWithLoader = (targetRoute) => {
    setLoadingTarget(targetRoute === 'mapa' ? 'Cargando el Mapa Interactivo...' : 'Abriendo Soporte Técnico...');
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onNavigate(targetRoute);
    }, 1200);
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#090d16',
      color: '#f8fafc',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      position: 'relative',
      overflowX: 'hidden',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* PANTALLA DE CARGA ANIMADA */}
      {isLoading && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(5, 7, 12, 0.95)',
          backdropFilter: 'blur(16px)',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '20px',
          animation: 'fadeIn 0.3s ease-in-out'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            overflow: 'hidden',
            border: '3px solid #38bdf8',
            boxShadow: '0 0 25px rgba(56, 189, 248, 0.6)',
            animation: 'pulseLogo 1.5s infinite ease-in-out',
            background: '#0f172a'
          }}>
            <img src="img/logo-ciac.jpg" alt="CIAC Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.style.display = 'none'; }} />
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '36px',
              height: '36px',
              border: '4px solid rgba(56, 189, 248, 0.2)',
              borderTop: '4px solid #38bdf8',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
              margin: '0 auto 12px'
            }} />
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#fff', fontWeight: '700' }}>{loadingTarget}</h3>
            <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Centro de Integración y Atención Ciudadana</span>
          </div>
        </div>
      )}

      {/* Fondo animado minimalista */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '700px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(37, 99, 235, 0.15) 0%, rgba(9, 13, 22, 0) 70% )',
        zIndex: 0,
        pointerEvents: 'none'
      }} />

      {/* Navbar Superior */}
      <nav style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1.2rem 2.5rem',
        backgroundColor: 'rgba(15, 23, 42, 0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(59, 130, 246, 0.2)',
        position: 'sticky',
        top: 0,
        zIndex: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', overflow: 'hidden', border: '2px solid #3b82f6', background: '#0f172a' }}>
            <img src="img/logo-ciac.jpg" alt="CIAC" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.style.display = 'none'; }} />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '1rem', fontWeight: '700', color: '#fff' }}>CIAC — Bella Vista</h1>
            <span style={{ fontSize: '0.65rem', color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Centro de Integración y Atención Ciudadana</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button
            onClick={() => handleNavigationWithLoader('soporte')}
            style={{
              background: 'rgba(59, 130, 246, 0.1)',
              border: '1px solid rgba(59, 130, 246, 0.4)',
              color: '#38bdf8',
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              fontWeight: '600',
              fontSize: '0.82rem',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            🛠️ Soporte Técnico
          </button>
        </div>
      </nav>

      {/* Contenido Principal con buen margen inferior para evitar solapamientos */}
      <main style={{ flex: 1, zIndex: 1, padding: '3.5rem 1.5rem 5rem 1.5rem', maxWidth: '1200px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
        
        {/* Sección Hero con Carrusel de 4 Imágenes */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem', alignItems: 'center', marginBottom: '4rem' }}>
          
          <div>
            <span style={{ background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
              🛡️ Seguridad Inteligente Municipal
            </span>
            <h2 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#fff', margin: '1rem 0', lineHeight: '1.2' }}>
              Mapa del Delito <span style={{ color: '#38bdf8' }}>Bella Vista</span>
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '1.8rem' }}>
              Sistema operativo y analítico para la prevención, georreferenciación de incidentes y control estratégico desplegado por unidades móviles del CIAC en Tucumán.
            </p>
            <div style={{ display: 'flex', gap: '15px' }}>
              <button
                onClick={() => handleNavigationWithLoader('mapa')}
                style={{
                  background: '#2563eb',
                  color: '#fff',
                  border: 'none',
                  padding: '0.75rem 1.6rem',
                  borderRadius: '10px',
                  fontWeight: 'bold',
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  boxShadow: '0 4px 20px rgba(37, 99, 235, 0.5)',
                  transition: 'background 0.2s'
                }}
              >
                🗺️ Ingresar al Mapa Interactivo
              </button>
            </div>
          </div>

          {/* Carrusel de 4 Imágenes Dinámico */}
          <div style={{
            position: 'relative',
            height: '320px',
            borderRadius: '16px',
            overflow: 'hidden',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
            background: '#0f172a'
          }}>
            {images.map((img, idx) => (
              <div
                key={idx}
                style={{
                  position: 'absolute',
                  inset: 0,
                  opacity: currentImageIndex === idx ? 1 : 0,
                  transition: 'opacity 0.8s ease-in-out',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <img
                  src={img}
                  alt={`Slide ${idx + 1}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background: 'linear-gradient(to top, rgba(9,13,22,0.9), transparent)',
                  padding: '1rem',
                  textAlign: 'center'
                }}>
                  <span style={{ fontSize: '0.8rem', color: '#38bdf8', fontWeight: '600' }}>
                    Registro Institucional CIAC — Imagen {idx + 1} de 4
                  </span>
                </div>
              </div>
            ))}

            <div style={{ position: 'absolute', bottom: '12px', right: '15px', display: 'flex', gap: '6px', zIndex: 3 }}>
              {images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  style={{
                    width: currentImageIndex === idx ? '20px' : '8px',
                    height: '8px',
                    borderRadius: '4px',
                    background: currentImageIndex === idx ? '#38bdf8' : 'rgba(255,255,255,0.3)',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.3s'
                  }}
                />
              ))}
            </div>
          </div>

        </div>

        {/* ========================================================= */}
        {/* NUEVO: CARRUSEL MODERNO INTERACTIVO (¿De qué trata el sistema?) */}
        {/* ========================================================= */}
        <div style={{
          background: 'rgba(30, 41, 59, 0.45)',
          border: '1px solid rgba(56, 189, 248, 0.3)',
          borderRadius: '24px',
          padding: '3rem 2rem',
          backdropFilter: 'blur(16px)',
          marginBottom: '3rem',
          boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
          position: 'relative'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <span style={{ background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', padding: '0.3rem 0.9rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
              MÓDULO INFORMATIVO INTERACTIVO
            </span>
            <h3 style={{ fontSize: '1.8rem', color: '#fff', margin: '0.8rem 0 0.5rem', fontWeight: '800' }}>
              ¿De qué trata el Sistema del Mapa del Delito?
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', maxWidth: '650px', margin: '0 auto' }}>
              Desliza o interactúa con las tarjetas para conocer las capacidades tácticas y operativas de la plataforma.
            </p>
          </div>

          {/* Tarjetas con efecto de realce (Cuadritos resaltados) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            {infoSlides.map((slide, idx) => {
              const isActive = activeInfoIndex === idx;
              return (
                <div
                  key={idx}
                  onClick={() => setActiveInfoIndex(idx)}
                  style={{
                    background: isActive ? 'linear-gradient(135deg, rgba(37, 99, 235, 0.25) 0%, rgba(15, 23, 42, 0.9) 100%)' : 'rgba(15, 23, 42, 0.6)',
                    border: isActive ? '2px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '16px',
                    padding: '1.8rem 1.5rem',
                    cursor: 'pointer',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    transform: isActive ? 'translateY(-6px)' : 'translateY(0)',
                    boxShadow: isActive ? '0 15px 35px rgba(56, 189, 248, 0.25)' : '0 5px 15px rgba(0,0,0,0.3)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  {isActive && (
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: '#38bdf8' }} />
                  )}
                  <div style={{ fontSize: '2rem', marginBottom: '12px' }}>{slide.icon}</div>
                  <h4 style={{ color: isActive ? '#38bdf8' : '#fff', fontSize: '1.05rem', margin: '0 0 8px', fontWeight: '700' }}>
                    {slide.title}
                  </h4>
                  <p style={{ color: '#94a3b8', fontSize: '0.82rem', lineHeight: '1.5', margin: 0 }}>
                    {slide.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Botones de navegación manual del carrusel */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', alignItems: 'center' }}>
            {infoSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveInfoIndex(idx)}
                style={{
                  width: activeInfoIndex === idx ? '28px' : '10px',
                  height: '10px',
                  borderRadius: '5px',
                  background: activeInfoIndex === idx ? '#38bdf8' : 'rgba(255,255,255,0.2)',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
              />
            ))}
          </div>
        </div>

      </main>

      {/* FOOTER PERFECTAMENTE VISIBLE Y CORREGIDO */}
      <footer style={{
        textAlign: 'center',
        padding: '2.5rem 1.5rem',
        borderTop: '2px solid rgba(56, 189, 248, 0.4)',
        color: '#f8fafc',
        fontSize: '0.88rem',
        backgroundColor: '#05070c',
        zIndex: 50,
        boxShadow: '0 -15px 40px rgba(0,0,0,0.9)',
        position: 'relative'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
          <span style={{ fontWeight: '600', color: '#cbd5e1', letterSpacing: '0.3px' }}>
            © 2026 Centro de Integración y Atención Ciudadana (CIAC) — Bella Vista, Tucumán, Argentina. Todos los derechos reservados.
          </span>
          <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
            Desarrollado con excelencia por <strong style={{ color: '#38bdf8', fontWeight: '800', textShadow: '0 0 12px rgba(56,189,248,0.6)' }}>Franco Osores Vergara</strong> y <strong style={{ color: '#34d399', fontWeight: '800', textShadow: '0 0 12px rgba(52,211,153,0.6)' }}>Walter Santillán</strong>.
          </span>
        </div>
      </footer>

      {/* Animaciones CSS */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes pulseLogo {
          0% { transform: scale(0.95); box-shadow: 0 0 15px rgba(56, 189, 248, 0.4); }
          50% { transform: scale(1.05); box-shadow: 0 0 30px rgba(56, 189, 248, 0.8); }
          100% { transform: scale(0.95); box-shadow: 0 0 15px rgba(56, 189, 248, 0.4); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}