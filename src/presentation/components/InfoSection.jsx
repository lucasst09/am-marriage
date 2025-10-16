import React from 'react';

/**
 * Componente para a seção de informações do casamento
 */
export function InfoSection() {
  return (
    <section id="info" className="info-section">
      <div className="container">
        <h2 className="info-title">Informações</h2>
        <div className="info-cards">
          <div className="info-card">
            <div className="info-icon">📅</div>
            <h3 className="info-card-title">Data & Horário</h3>
            <p className="info-card-text">06/12/2025</p>
            <p className="info-card-text">18h30</p>
          </div>
          <div className="info-card">
            <div className="info-icon">⛪</div>
            <h3 className="info-card-title">Cerimônia</h3>
            <p className="info-card-text">Paróquia São Bento — QS 305 Conj. 1 Lote 1/4, Samambaia, Brasília - DF</p>
            <a className="info-card-text" href="https://maps.app.goo.gl/Gfyn22DaurCgcMMUA" target="_blank" rel="noopener noreferrer">Ver no mapa</a>
          </div>
          <div className="info-card">
            <div className="info-icon">🎉</div>
            <h3 className="info-card-title">Recepção</h3>
            <p className="info-card-text">Salão de Festas – Residencial Rio Paranã — Qd. 301 Conj. 01 Lote 06</p>
            <a className="info-card-text" href="https://maps.app.goo.gl/wYcSvJMxzDG1p2ca6" target="_blank" rel="noopener noreferrer">Ver no mapa</a>
          </div>
        </div>
      </div>
    </section>
  );
}
