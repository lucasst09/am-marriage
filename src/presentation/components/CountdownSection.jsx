import React from 'react';

/**
 * Componente para a seção de countdown
 */
export function CountdownSection({ timeLeft, isExpired, isNearEvent }) {
  return (
    <section className="countdown-section">
      <div className="container">
        <div className="countdown-grid">
          <div className="countdown-item">
            <div className="countdown-number">{timeLeft.dias}</div>
            <div className="countdown-label">Dias</div>
          </div>
          <div className="countdown-item">
            <div className="countdown-number">{timeLeft.horas}</div>
            <div className="countdown-label">Horas</div>
          </div>
          <div className="countdown-item">
            <div className="countdown-number">{timeLeft.minutos}</div>
            <div className="countdown-label">Minutos</div>
          </div>
          <div className="countdown-item">
            <div className="countdown-number">{timeLeft.segundos}</div>
            <div className="countdown-label">Segundos</div>
          </div>
        </div>
        
        {isExpired && (
          <div style={{
            textAlign: 'center',
            marginTop: '20px',
            padding: '16px',
            backgroundColor: '#E8F8EE',
            borderRadius: '8px',
            color: '#2b8a3e'
          }}>
            🎉 O casamento já aconteceu! Obrigado por fazer parte deste momento especial!
          </div>
        )}
        
        {isNearEvent && !isExpired && (
          <div style={{
            textAlign: 'center',
            marginTop: '20px',
            padding: '16px',
            backgroundColor: '#FFF3CD',
            borderRadius: '8px',
            color: '#856404'
          }}>
            ⏰ Estamos quase lá! O grande dia está chegando!
          </div>
        )}
      </div>
    </section>
  );
}
