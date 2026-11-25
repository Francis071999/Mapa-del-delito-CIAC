// src/pages/Login.jsx
import React, { useState } from 'react';
import CiacLogo from '../components/CiacLogo';
import Footer from '../components/Footer';

export default function Login({ onNavigate, onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verPassword, setVerPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    setErrorMsg('');

    const correoIngresado = email.trim().toLowerCase();
    const passIngresada = password.trim();

    // Credenciales maestras del administrador
    if (
      (correoIngresado === 'admin@ciac.gob.ar' || correoIngresado === 'admin') &&
      passIngresada === 'ciac2026'
    ) {
      const sesionAdmin = {
        usuario: 'admin@ciac.gob.ar',
        nombre: 'Administrador CIAC'
      };
      
      localStorage.setItem('ciac_admin_session', JSON.stringify(sesionAdmin));
      localStorage.setItem('usuarioActivo', JSON.stringify(sesionAdmin));
      
      if (onLoginSuccess) {
        onLoginSuccess(sesionAdmin);
      }
      
      onNavigate('admin');
      return;
    }

    // Validación secundaria contra usuarios guardados
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    const usuarioEncontrado = usuarios.find(
      (u) => (u.email === email || u.usuario === email) && (u.password === password || u.pass === password)
    );

    if (usuarioEncontrado) {
      localStorage.setItem('ciac_admin_session', JSON.stringify(usuarioEncontrado));
      localStorage.setItem('usuarioActivo', JSON.stringify(usuarioEncontrado));
      
      if (onLoginSuccess) {
        onLoginSuccess(usuarioEncontrado);
      }
      
      onNavigate('admin');
    } else {
      setErrorMsg('Credenciales incorrectas. Usa: admin@ciac.gob.ar / ciac2026');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', maxHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      <div style={{
        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
        zIndex: 0, pointerEvents: 'none',
        background: 'radial-gradient(circle at 50% 50%, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 1))'
      }}>
        <div className="glow-sphere sphere-1" />
        <div className="glow-sphere sphere-2" />
        <div className="grid-overlay" />
      </div>

      <style>{`
        @keyframes moveSphere1 {
          0% { transform: translate(-10%, -10%) scale(1); }
          50% { transform: translate(20%, 30%) scale(1.3); }
          100% { transform: translate(-10%, -10%) scale(1); }
        }
        @keyframes moveSphere2 {
          0% { transform: translate(30%, 40%) scale(1.2); }
          50% { transform: translate(-20%, -10%) scale(0.9); }
          100% { transform: translate(30%, 40%) scale(1.2); }
        }
        .glow-sphere { position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.35; }
        .sphere-1 { width: 350px; height: 350px; background: #3b82f6; top: 10%; left: 15%; animation: moveSphere1 18s ease-in-out infinite; }
        .sphere-2 { width: 400px; height: 400px; background: #ef4444; bottom: 10%; right: 15%; animation: moveSphere2 22s ease-in-out infinite; }
        .grid-overlay {
          position: absolute; inset: 0;
          background-image: linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
          background-size: 40px 40px;
        }
      `}</style>

      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', zIndex: 1 }}>
        <div style={{ 
          width: '100%', maxWidth: '380px', padding: '1.25rem 1.5rem', 
          backdropFilter: 'blur(12px)', background: 'rgba(30, 41, 59, 0.85)', 
          border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.35)' 
        }}>
          <div style={{ textAlign: 'center', marginBottom: '0.8rem' }}>
            <CiacLogo size={42} />
            <h2 style={{ margin: '0.3rem 0 0.1rem', fontSize: '1.2rem', fontWeight: 'bold', color: '#fff' }}>Panel de Administración</h2>
            <p style={{ color: '#94a3b8', fontSize: '0.78rem', margin: 0 }}>
              Centro de Asistencia Ciudadana — Bella Vista
            </p>
          </div>

          {errorMsg && (
            <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', color: '#fca5a5', padding: '0.5rem', borderRadius: '8px', fontSize: '0.75rem', marginBottom: '0.6rem', textAlign: 'center' }}>
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '0.6rem' }}>
              <label style={{ fontSize: '0.75rem', marginBottom: '0.2rem', display: 'block', color: '#cbd5e1' }}>Usuario / Correo</label>
              <input
                required
                type="text"
                placeholder="admin@ciac.gob.ar"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ padding: '0.5rem 0.7rem', fontSize: '0.85rem', width: '100%', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(15,23,42,0.6)', color: '#fff', outline: 'none' }}
              />
            </div>

            <div style={{ marginBottom: '0.8rem' }}>
              <label style={{ fontSize: '0.75rem', marginBottom: '0.2rem', display: 'block', color: '#cbd5e1' }}>Contraseña</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input
                  required
                  type={verPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  style={{ width: '100%', padding: '0.5rem 2.2rem 0.5rem 0.7rem', fontSize: '0.85rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(15,23,42,0.6)', color: '#fff', outline: 'none' }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setVerPassword(!verPassword)}
                  style={{ position: 'absolute', right: '8px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.9rem' }}
                >
                  {verPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <button type="submit" style={{ width: '100%', padding: '0.55rem', fontSize: '0.85rem', fontWeight: '600', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
              Ingresar al Sistema
            </button>
          </form>

          <div style={{ marginTop: '0.8rem', display: 'flex', flexDirection: 'column', gap: '0.3rem', textAlign: 'center' }}>
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '0.5rem', marginTop: '0.3rem' }}>
              <button
                style={{ width: '100%', fontSize: '0.78rem', padding: '0.4rem', background: 'rgba(255,255,255,0.08)', color: '#fff', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', cursor: 'pointer' }}
                onClick={() => onNavigate('landing')}
              >
                Volver al Inicio
              </button>
            </div>
          </div>
        </div>
      </main>

      <div style={{ zIndex: 1, flexShrink: 0 }}>
        <Footer />
      </div>
    </div>
  );
}