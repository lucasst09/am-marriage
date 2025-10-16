import React from 'react';

/**
 * Componente para o cabeçalho do painel administrativo
 */
export function AdminHeader({ onLogout }) {
  return (
    <header className="header">
      <div className="container row between center">
        <div className="brand">A & M - Admin</div>
        <button 
          className="btn" 
          onClick={onLogout}
          style={{ backgroundColor: '#dc3545' }}
        >
          Sair
        </button>
      </div>
    </header>
  );
}
