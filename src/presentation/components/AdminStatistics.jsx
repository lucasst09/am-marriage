import React from 'react';

/**
 * Componente para exibir estatísticas administrativas
 */
export function AdminStatistics({ statistics, loading }) {
  if (loading) {
    return (
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '20px', 
        marginBottom: '40px' 
      }}>
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="card center" style={{ padding: '20px' }}>
            <div style={{ 
              fontSize: '36px', 
              fontWeight: 'bold', 
              color: '#ccc',
              height: '40px',
              backgroundColor: '#f0f0f0',
              borderRadius: '4px',
              marginBottom: '8px'
            }}></div>
            <div className="label" style={{ color: '#ccc' }}>Carregando...</div>
          </div>
        ))}
      </div>
    );
  }

  if (!statistics) {
    return null;
  }

  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
      gap: '20px', 
      marginBottom: '40px' 
    }}>
      <div className="card center" style={{ padding: '20px' }}>
        <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#28a745' }}>
          {statistics.totalConfirmations || 0}
        </div>
        <div className="label">Total de Confirmações</div>
      </div>
      
      <div className="card center" style={{ padding: '20px' }}>
        <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#28a745' }}>
          {statistics.totalMainGuestsGoing || 0}
        </div>
        <div className="label">Vão Comparecer</div>
      </div>
      
      <div className="card center" style={{ padding: '20px' }}>
        <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#dc3545' }}>
          {statistics.totalMainGuestsNotGoing || 0}
        </div>
        <div className="label">Não Vão Comparecer</div>
      </div>
      
      <div className="card center" style={{ padding: '20px' }}>
        <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#007bff' }}>
          {statistics.totalDependentsGoing || 0}
        </div>
        <div className="label">Acompanhantes</div>
      </div>
    </div>
  );
}
