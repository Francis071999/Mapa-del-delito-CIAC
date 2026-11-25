import React, { useState } from 'react';
import CiacLogo from '../components/CiacLogo';
import Footer from '../components/Footer';

export default function RecuperarPassword({ onNavigate }) {
  const [email, setEmail] = useState('');
  const [enviado, setEnviado] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setEnviado(true);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
        <div className="auth-container" style={{ width: '100%', maxWidth: '420px' }}>
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <CiacLogo size={56} />
            <h2 style={{ margin: '0.5rem 0 0.2rem' }}>Recuperar Contraseña</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0 }}>
              Ingresá tu correo administrativo registrado
            </p>
          </div>

          {!enviado ? (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Correo Electrónico</label>
                <input
                  required
                  type="email"
                  placeholder="admin@ciac.gob.ar"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <button type="submit" className="btn-principal" style={{ width: '100%', marginTop: '0.8rem' }}>
                Enviar Instrucciones
              </button>
            </form>
          ) : (
            <div style={{ textAlign: 'center', padding: '1rem 0' }}>
              <span style={{ fontSize: '2.5rem' }}>📧</span>
              <p style={{ margin: '0.8rem 0', fontSize: '0.92rem', color: 'var(--text-secondary)' }}>
                Se han enviado las instrucciones de restablecimiento a <b>{email}</b> (Simulación).
              </p>
            </div>
          )}

          <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
            <button className="btn-secundario" style={{ width: '100%' }} onClick={() => onNavigate('login')}>
              Volver al Login
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}