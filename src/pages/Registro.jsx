import React, { useState } from 'react';
import CiacLogo from '../components/CiacLogo';
import Footer from '../components/Footer';

export default function Registro({ onNavigate }) {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    usuario: '',
    password: '',
    rol: 'ciudadano',
    fotoPerfil: ''
  });

  const [verPassword, setVerPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

    const existe = usuarios.some((u) => u.email === formData.email || u.usuario === formData.usuario);
    if (existe) {
      alert('El usuario o correo electrónico ya se encuentra registrado.');
      return;
    }

    const foto = formData.fotoPerfil || `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.nombre)}&background=3b82f6&color=fff`;
    const nuevoUsuario = { ...formData, pass: formData.password, fotoPerfil: foto };

    usuarios.push(nuevoUsuario);
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
    alert('Cuenta registrada con éxito. Ya podés iniciar sesión.');
    onNavigate('login');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
        <div className="auth-container">
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <CiacLogo size={56} />
            <h2 style={{ margin: '0.5rem 0 0.2rem' }}>Crear Cuenta CIAC</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0 }}>
              Portal de Asistencia Ciudadana de Bella Vista
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Nombre Completo</label>
              <input
                required
                type="text"
                placeholder="Ej: Juan Pérez"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Nombre de Usuario</label>
              <input
                required
                type="text"
                placeholder="juanperez"
                value={formData.usuario}
                onChange={(e) => setFormData({ ...formData, usuario: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Correo Electrónico</label>
              <input
                required
                type="email"
                placeholder="usuario@ejemplo.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Contraseña</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input
                  required
                  type={verPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  style={{ width: '100%', paddingRight: '40px' }}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setVerPassword(!verPassword)}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '1.1rem',
                    color: 'var(--text-secondary)'
                  }}
                >
                  {verPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <button type="submit" className="btn-principal" style={{ width: '100%', marginTop: '0.5rem' }}>
              Registrarse
            </button>
          </form>

          <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
            <button className="btn-secundario" style={{ width: '100%' }} onClick={() => onNavigate('login')}>
              ¿Ya tenés cuenta? Iniciar Sesión
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}