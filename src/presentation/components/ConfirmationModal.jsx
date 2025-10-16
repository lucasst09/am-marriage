import React from 'react';

/**
 * Componente para o modal de confirmação de presença
 */
export function ConfirmationModal({
  isOpen,
  onClose,
  guestGroup,
  confirmation,
  guestConfirmations,
  telefone,
  observacoes,
  error,
  loading,
  canEdit,
  attendingCount,
  totalGuests,
  onGuestConfirmationChange,
  onTelefoneChange,
  onObservacoesChange,
  onSave,
  onGuestSearch
}) {
  if (!isOpen) return null;

  const handleModalClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave();
  };

  return (
    <div className="modal" onClick={handleModalClick}>
      <div className="mcard">
        <div className="modal-header">
          <h3 className="modal-title">Confirmar Presença</h3>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>
        
        {confirmation && (
          <div style={{
            padding: '12px',
            backgroundColor: '#D4EDDA',
            border: '1px solid #C3E6CB',
            borderRadius: '8px',
            color: '#155724',
            fontSize: '14px',
            marginBottom: '16px'
          }}>
            ✅ Você já confirmou sua presença anteriormente! Os dados abaixo são apenas para visualização.
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Seu nome</label>
            <input 
              className="form-input" 
              placeholder="Digite seu nome (ex: André, João, Maria, Carlos)" 
              onChange={(e) => onGuestSearch(e.target.value)}
              required 
              disabled={confirmation}
              style={{
                borderColor: error ? '#dc3545' : undefined
              }}
            />
          </div>
          
          {error && (
            <div style={{
              padding: '12px',
              backgroundColor: '#F8D7DA',
              border: '1px solid #F5C6CB',
              borderRadius: '8px',
              color: '#721C24',
              fontSize: '14px',
              marginBottom: '16px'
            }}>
              ❌ {error}
            </div>
          )}

          {guestGroup && !error && (
            <div style={{
              padding: '12px',
              backgroundColor: '#D4EDDA',
              border: '1px solid #C3E6CB',
              borderRadius: '8px',
              color: '#155724',
              fontSize: '14px',
              marginBottom: '16px'
            }}>
              ✅ Nome encontrado! {guestGroup.hasDependents() ? 'Confirme a presença de cada pessoa abaixo.' : 'Você pode confirmar sua presença.'}
            </div>
          )}
          
          {guestGroup && guestGroup.hasDependents() && (
            <div className="form-group">
              <label className="form-label">
                Confirmação de presença ({attendingCount} de {totalGuests} confirmados)
              </label>
              <div style={{ 
                marginTop: '8px', 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '12px',
                padding: '12px',
                backgroundColor: '#F8F4EE',
                borderRadius: '8px',
                border: '1px solid #EBD9CF'
              }}>
                {guestGroup.guests.map(guest => (
                  <div key={guest.id} style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '12px', 
                    padding: '8px',
                    borderRadius: '6px',
                    backgroundColor: 'transparent',
                    opacity: !canEdit ? 0.6 : 1
                  }}>
                    <span style={{ 
                      fontWeight: 'normal',
                      color: '#2E2A27',
                      fontSize: '14px',
                      minWidth: '120px'
                    }}>
                      {guest.nome}
                    </span>
                    <select
                      value={guestConfirmations[guest.id] || "Vou comparecer"}
                      onChange={(e) => onGuestConfirmationChange(guest.id, e.target.value)}
                      disabled={!canEdit}
                      style={{ 
                        padding: '6px 8px',
                        borderRadius: '4px',
                        border: '1px solid #EBD9CF',
                        backgroundColor: 'white',
                        fontSize: '14px',
                        color: '#2E2A27',
                        minWidth: '140px'
                      }}
                    >
                      <option value="Vou comparecer">Vou comparecer</option>
                      <option value="Não poderei">Não poderei</option>
                    </select>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="form-group">
            <label className="form-label">Telefone (WhatsApp)</label>
            <input 
              className="form-input" 
              placeholder="(61) 9 9999-9999" 
              value={telefone}
              onChange={(e) => onTelefoneChange(e.target.value)}
              disabled={!canEdit}
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Observações</label>
            <textarea 
              className="form-textarea" 
              placeholder="Restrições alimentares, etc." 
              value={observacoes}
              onChange={(e) => onObservacoesChange(e.target.value)}
              disabled={!canEdit}
            />
          </div>
          
          <button 
            className="submit-btn" 
            type="submit"
            disabled={!canEdit || loading}
            style={{
              opacity: (!canEdit || loading) ? 0.5 : 1,
              cursor: (!canEdit || loading) ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Salvando...' : 
             confirmation ? 'Já confirmado' : 
             !guestGroup ? 'Nome não encontrado' : 
             'Enviar confirmação'}
          </button>
          
          <p style={{
            fontSize: '12px',
            color: '#8C857E',
            marginTop: '8px',
            textAlign: 'center'
          }}>
            Dica: digite seu nome para ver todas as pessoas do seu grupo.
          </p>
        </form>
      </div>
    </div>
  );
}
