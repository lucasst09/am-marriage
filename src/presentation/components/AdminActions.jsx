import React from 'react';

/**
 * Componente para as ações administrativas
 */
export function AdminActions({ 
  loading, 
  error, 
  onExportPDF, 
  onRefresh, 
  onClearAll 
}) {
  return (
    <div>
      {error && (
        <div style={{
          padding: '12px',
          backgroundColor: '#F8D7DA',
          border: '1px solid #F5C6CB',
          borderRadius: '8px',
          color: '#721C24',
          fontSize: '14px',
          marginBottom: '20px',
          textAlign: 'center'
        }}>
          ❌ {error}
        </div>
      )}
      
      <div style={{ 
        display: 'flex', 
        gap: '20px', 
        justifyContent: 'center', 
        marginBottom: '40px',
        flexWrap: 'wrap'
      }}>
        <button 
          className="btn" 
          onClick={onExportPDF}
          style={{ 
            backgroundColor: '#28a745',
            opacity: loading ? 0.6 : 1
          }}
          disabled={loading}
        >
          📄 Exportar para PDF
        </button>
        
        <button 
          className="btn" 
          onClick={onRefresh}
          style={{ 
            backgroundColor: '#007bff',
            opacity: loading ? 0.6 : 1
          }}
          disabled={loading}
        >
          🔄 Atualizar Lista
        </button>
        
        <button 
          className="btn" 
          onClick={onClearAll}
          style={{ 
            backgroundColor: '#dc3545',
            opacity: loading ? 0.6 : 1
          }}
          disabled={loading}
        >
          🗑️ Limpar Todas
        </button>
      </div>
    </div>
  );
}
