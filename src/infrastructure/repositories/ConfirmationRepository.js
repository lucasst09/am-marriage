import { 
  obterConfirmacoesDoStorage, 
  salvarConfirmacoesNoStorage, 
  limparTodasConfirmacoes 
} from '../../data/mockData.js';
import { Confirmation } from '../../domain/entities/Confirmation.js';

/**
 * Repositório para gerenciar confirmações de presença
 * Implementa a interface de acesso aos dados de confirmação
 */
export class ConfirmationRepository {
  constructor() {
    this.storageKey = 'amMarriage_confirmacoes';
  }

  /**
   * Obtém uma confirmação pelo nome do convidado
   */
  findByGuestName(guestName) {
    const normalizedName = guestName.toLowerCase().trim();
    const confirmacoes = this._getAllConfirmations();
    const rawData = confirmacoes[normalizedName];
    
    if (!rawData) {
      return null;
    }
    
    return Confirmation.fromRawData({
      guestName: normalizedName,
      ...rawData
    });
  }

  /**
   * Salva uma confirmação
   */
  save(confirmation) {
    const confirmacoes = this._getAllConfirmations();
    const normalizedName = confirmation.guestName.toLowerCase().trim();
    
    confirmacoes[normalizedName] = confirmation.toObject();
    
    return this._saveAllConfirmations(confirmacoes);
  }

  /**
   * Obtém todas as confirmações
   */
  getAll() {
    try {
      const confirmacoes = this._getAllConfirmations();
      
      return Object.entries(confirmacoes).map(([guestName, rawData]) => {
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
    } catch (error) {
      console.error('Erro ao obter confirmações:', error);
      return [];
    }
  }

  /**
   * Verifica se existe confirmação para um convidado
   */
  exists(guestName) {
    const normalizedName = guestName.toLowerCase().trim();
    const confirmacoes = this._getAllConfirmations();
    return !!confirmacoes[normalizedName];
  }

  /**
   * Remove uma confirmação específica
   */
  delete(guestName) {
    const confirmacoes = this._getAllConfirmations();
    const normalizedName = guestName.toLowerCase().trim();
    
    if (confirmacoes[normalizedName]) {
      delete confirmacoes[normalizedName];
      return this._saveAllConfirmations(confirmacoes);
    }
    
    return false;
  }

  /**
   * Remove todas as confirmações
   */
  deleteAll() {
    return limparTodasConfirmacoes();
  }

  /**
   * Obtém estatísticas das confirmações
   */
  getStatistics() {
    try {
      const confirmacoes = this.getAll();
      
      const stats = {
        totalConfirmations: confirmacoes.length,
        totalAttending: 0,
        totalNotAttending: 0,
        mainGuestsAttending: 0,
        mainGuestsNotAttending: 0,
        dependentsAttending: 0,
        dependentsNotAttending: 0,
        confirmationsWithPhone: 0,
        confirmationsWithObservations: 0
      };

    confirmacoes.forEach(confirmation => {
      const attendingCount = confirmation.getTotalAttendingCount();
      const notAttendingCount = confirmation.getTotalCount() - attendingCount;
      
      stats.totalAttending += attendingCount;
      stats.totalNotAttending += notAttendingCount;
      
      if (confirmation.isMainGuestAttending()) {
        stats.mainGuestsAttending++;
      } else {
        stats.mainGuestsNotAttending++;
      }
      
      stats.dependentsAttending += confirmation.getAttendingDependentsCount();
      stats.dependentsNotAttending += confirmation.getDependents().length - confirmation.getAttendingDependentsCount();
      
      if (confirmation.telefone && confirmation.telefone.trim()) {
        stats.confirmationsWithPhone++;
      }
      
      if (confirmation.observacoes && confirmation.observacoes.trim()) {
        stats.confirmationsWithObservations++;
      }
    });

    return stats;
    } catch (error) {
      console.error('Erro ao calcular estatísticas:', error);
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

  /**
   * Método privado para obter todas as confirmações do storage
   */
  _getAllConfirmations() {
    try {
      const confirmacoes = localStorage.getItem(this.storageKey);
      return confirmacoes ? JSON.parse(confirmacoes) : {};
    } catch (error) {
      console.error('Erro ao ler confirmações do localStorage:', error);
      return {};
    }
  }

  /**
   * Método privado para salvar todas as confirmações no storage
   */
  _saveAllConfirmations(confirmacoes) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(confirmacoes));
      return true;
    } catch (error) {
      console.error('Erro ao salvar confirmações no localStorage:', error);
      return false;
    }
  }
}
