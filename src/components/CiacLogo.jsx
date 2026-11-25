// src/components/CiacLogo.jsx
import React from 'react';
import { Shield } from 'lucide-react';

export default function CiacLogo({ size = 36 }) {
  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '50%',
      overflow: 'hidden',
      width: `${size}px`,
      height: `${size}px`,
      border: '2px solid rgba(59, 130, 246, 0.6)',
      backgroundColor: '#0f172a',
      boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
      flexShrink: 0
    }}>
      <img 
        src="img/logo-ciac.jpg" 
        alt="Logo CIAC" 
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        onError={(e) => {
          // Fallback visual si la ruta tuviera alguna variación
          e.target.onerror = null;
          e.target.style.display = 'none';
        }}
      />
    </div>
  );
}