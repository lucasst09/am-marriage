import React from 'react';

/**
 * Componente para o modal de sucesso da confirmação
 */
export function ConfirmationSuccessModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="mcard">
        <div style={{textAlign: 'center', padding: '24px 8px'}}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: '#E8F8EE',
            border: '1px solid #BFE8CB',
            display: 'grid',
            placeItems: 'center',
            fontSize: '28px',
            color: '#2b8a3e',
            margin: '0 auto'
          }}>✓</div>
          <h3 style={{marginTop: '12px', color: '#2D5016'}}>Confirmação enviada!</h3>
          <button 
            className="btn" 
            style={{marginTop: '16px'}} 
            onClick={onClose}
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
