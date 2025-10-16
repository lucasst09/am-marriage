import React from 'react';

/**
 * Componente para o cabeçalho do site
 */
export function Header({ onMenuOpen, onConfirmPresence, onNavigate }) {
  return (
    <header className="header">
      <div className="container">
        <div className="header-top">
          <button
            className="hamburger mobile-only"
            aria-label="Abrir menu"
            onClick={onMenuOpen}
          >
            ☰
          </button>
          <nav className="nav">
            <a href="#home">Início</a>
            <a href="#story">História</a>
            <a href="#info">Informações</a>
            <a href="#gallery">Galeria</a>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onNavigate && onNavigate('presentes');
              }}
            >
              Presentes
            </a>
          </nav>
        </div>

        <button className="btn" onClick={onConfirmPresence}>Confirmar presença</button>
      </div>
    </header>
  );
}
