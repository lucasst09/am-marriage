import React from 'react';

/**
 * Componente para a seção hero do site
 */
export function HeroSection({ backgroundImage, onConfirmPresence, onNavigateToGifts, onNavigateToDetails }) {
  return (
    <section 
      id="home" 
      className="hero"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center top',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="hero-content">
        <p className="kicker">CELEBRAÇÃO DO AMOR</p>
        <h1 className="title">André & Marilene</h1>
        <div className="hero-buttons">
          <button className="btn" onClick={onConfirmPresence}>Confirmar Presença</button>
          <a href="#info" className="btn ghost" onClick={onNavigateToDetails}>Ver Detalhes</a>
        </div>
        <div className="hero-extra mobile-only">
          <button className="btn" onClick={onNavigateToGifts}>Presentes</button>
        </div>
      </div>
    </section>
  );
}
