import React from 'react';
import { GuestRepository } from '../../infrastructure/repositories/GuestRepository.js';

/**
 * Componente para exibir a tabela de confirmações
 */
export function ConfirmationsTable({ confirmations, loading }) {
  const guestRepository = new GuestRepository();

  if (loading) {
    return (
      <div className="card" style={{ padding: '20px', marginBottom: '40px' }}>
        <h3 style={{ marginBottom: '20px', textAlign: 'center' }}>Lista de Confirmações</h3>
        <div style={{ textAlign: 'center', color: '#666' }}>
          Carregando confirmações...
        </div>
      </div>
    );
  }

  if (confirmations.length === 0) {
    return (
      <div className="card" style={{ padding: '20px', marginBottom: '40px' }}>
        <h3 style={{ marginBottom: '20px', textAlign: 'center' }}>Lista de Confirmações</h3>
        <p style={{ textAlign: 'center', color: '#666', fontStyle: 'italic' }}>
          Nenhuma confirmação encontrada.
        </p>
      </div>
    );
  }

  // Processar confirmações para exibição
  const processedConfirmations = confirmations.flatMap(confirmation => {
    const guestGroup = guestRepository.findGuestGroupByName(confirmation.guestName);
    
    if (!guestGroup) return [];

    const allPeople = [];
    
    // Adicionar o convidado principal
    const mainGuest = guestGroup.getMainGuest();
    if (mainGuest) {
      allPeople.push({
        nome: mainGuest.nome,
        status: confirmation.isMainGuestAttending() ? 'Vai comparecer' : 'Não vai comparecer',
        tipo: 'Principal',
        telefone: confirmation.telefone || '-',
        observacoes: confirmation.observacoes || '-',
        data: new Date(confirmation.dataConfirmacao).toLocaleDateString('pt-BR')
      });
    }
    
    // Adicionar dependentes
    const dependents = guestGroup.getDependents();
    dependents.forEach(dependent => {
      allPeople.push({
        nome: dependent.nome,
        status: confirmation.isDependentAttending(dependent.id) ? 'Vai comparecer' : 'Não vai comparecer',
        tipo: 'Acompanhante',
        telefone: '-',
        observacoes: '-',
        data: '-'
      });
    });
    
    return allPeople;
  });

  return (
    <div className="card" style={{ padding: '20px', marginBottom: '40px' }}>
      <h3 style={{ marginBottom: '20px', textAlign: 'center' }}>Lista de Confirmações</h3>
      
      <div style={{ overflowX: 'auto' }}>
        <table style={{ 
          width: '100%', 
          borderCollapse: 'collapse',
          fontSize: '14px'
        }}>
          <thead>
            <tr style={{ backgroundColor: '#f8f9fa' }}>
              <th style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'left' }}>Nome</th>
              <th style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'left' }}>Status</th>
              <th style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'left' }}>Tipo</th>
              <th style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'left' }}>Telefone</th>
              <th style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'left' }}>Observações</th>
              <th style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'left' }}>Data</th>
            </tr>
          </thead>
          <tbody>
            {processedConfirmations.map((person, index) => (
              <tr key={index} style={{ borderBottom: '1px solid #dee2e6' }}>
                <td style={{ padding: '12px', border: '1px solid #dee2e6' }}>{person.nome}</td>
                <td style={{ 
                  padding: '12px', 
                  border: '1px solid #dee2e6',
                  color: person.status === 'Vai comparecer' ? '#28a745' : '#dc3545',
                  fontWeight: 'bold'
                }}>
                  {person.status}
                </td>
                <td style={{ padding: '12px', border: '1px solid #dee2e6' }}>{person.tipo}</td>
                <td style={{ padding: '12px', border: '1px solid #dee2e6' }}>{person.telefone}</td>
                <td style={{ padding: '12px', border: '1px solid #dee2e6' }}>{person.observacoes}</td>
                <td style={{ padding: '12px', border: '1px solid #dee2e6' }}>{person.data}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
