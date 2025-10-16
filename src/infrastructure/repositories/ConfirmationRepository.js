import { Confirmation } from '../../domain/entities/Confirmation.js';

/**
 * Repositório para gerenciar confirmações de presença
 * Implementa a interface de acesso aos dados de confirmação via API
 */
export class ConfirmationRepository {
  constructor() {
    // Usa a URL da API baseada no ambiente
    this.apiBaseUrl = process.env.NODE_ENV === 'production' 
      ? '/api'  // Em produção, usa a mesma origem
      : 'http://localhost:3001/api';  // Em desenvolvimento, usa localhost
  }

  /**
   * Obtém uma confirmação pelo nome do convidado
   */
  async findByGuestName(guestName) {
    try {
      const normalizedName = guestName.toLowerCase().trim();
      const response = await fetch(`${this.apiBaseUrl}/confirmations/${encodeURIComponent(normalizedName)}`);
      const result = await response.json();
      
      if (result.success && result.data) {
        return Confirmation.fromRawData(result.data);
      }
      
      return null;
    } catch (error) {
      console.error('Erro ao buscar confirmação:', error);
      return null;
    }
  }

  /**
   * Salva uma confirmação
   */
  async save(confirmation) {
    try {
      const response = await fetch(`${this.apiBaseUrl}/confirmations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(confirmation.toObject())
      });
      
      const result = await response.json();
      return result.success;
    } catch (error) {
      console.error('Erro ao salvar confirmação:', error);
      return false;
    }
  }

  /**
   * Obtém todas as confirmações
   */
  async getAll() {
    try {
      const response = await fetch(`${this.apiBaseUrl}/confirmations`);
      const result = await response.json();
      
      if (result.success && result.data) {
        return Object.entries(result.data).map(([guestName, rawData]) => {
          try {
            return Confirmation.fromRawData({
              guestName,
              ...rawData
            });
          } catch (error) {
            console.error(`Erro ao processar confirmação para ${guestName}:`, error);
            return null;
          }
        }).filter(confirmation => confirmation !== null);
      }
      
      return [];
    } catch (error) {
      console.error('Erro ao obter confirmações:', error);
      return [];
    }
  }

  /**
   * Verifica se existe confirmação para um convidado
   */
  async exists(guestName) {
    try {
      const normalizedName = guestName.toLowerCase().trim();
      const response = await fetch(`${this.apiBaseUrl}/confirmations/${encodeURIComponent(normalizedName)}/exists`);
      const result = await response.json();
      
      return result.success && result.exists;
    } catch (error) {
      console.error('Erro ao verificar existência da confirmação:', error);
      return false;
    }
  }

  /**
   * Remove uma confirmação específica
   */
  async delete(guestName) {
    try {
      const normalizedName = guestName.toLowerCase().trim();
      const response = await fetch(`${this.apiBaseUrl}/confirmations/${encodeURIComponent(normalizedName)}`, {
        method: 'DELETE'
      });
      
      const result = await response.json();
      return result.success;
    } catch (error) {
      console.error('Erro ao deletar confirmação:', error);
      return false;
    }
  }

  /**
   * Remove todas as confirmações
   */
  async deleteAll() {
    try {
      const response = await fetch(`${this.apiBaseUrl}/confirmations`, {
        method: 'DELETE'
      });
      
      const result = await response.json();
      return result.success;
    } catch (error) {
      console.error('Erro ao limpar confirmações:', error);
      return false;
    }
  }

  /**
   * Obtém estatísticas das confirmações
   */
  async getStatistics() {
    try {
      const response = await fetch(`${this.apiBaseUrl}/confirmations/stats`);
      const result = await response.json();
      
      if (result.success && result.data) {
        return result.data;
      }
      
      return {
        totalConfirmations: 0,
        totalAttending: 0,
        totalNotAttending: 0,
        mainGuestsAttending: 0,
        mainGuestsNotAttending: 0,
        dependentsAttending: 0,
        dependentsNotAttending: 0,
        confirmationsWithPhone: 0,
        confirmationsWithObservations: 0
      };
    } catch (error) {
      console.error('Erro ao obter estatísticas:', error);
      return {
        totalConfirmations: 0,
        totalAttending: 0,
        totalNotAttending: 0,
        mainGuestsAttending: 0,
        mainGuestsNotAttending: 0,
        dependentsAttending: 0,
        dependentsNotAttending: 0,
        confirmationsWithPhone: 0,
        confirmationsWithObservations: 0
      };
    }
  }

}
