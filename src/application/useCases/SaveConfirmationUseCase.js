import { Confirmation } from '../../domain/entities/Confirmation.js';
import { ConfirmationRepository } from '../../infrastructure/repositories/ConfirmationRepository.js';
import { GuestRepository } from '../../infrastructure/repositories/GuestRepository.js';

/**
 * Caso de uso para salvar uma confirmação de presença
 */
export class SaveConfirmationUseCase {
  constructor(
    confirmationRepository = new ConfirmationRepository(),
    guestRepository = new GuestRepository()
  ) {
    this.confirmationRepository = confirmationRepository;
    this.guestRepository = guestRepository;
  }

  /**
   * Executa o caso de uso
   * @param {Object} params - Parâmetros da confirmação
   * @param {string} params.guestName - Nome do convidado
   * @param {Object} params.guestConfirmations - Confirmações por ID do convidado
   * @param {string} params.telefone - Telefone do convidado
   * @param {string} params.observacoes - Observações
   * @returns {Promise<Object>} Resultado da operação
   */
  async execute({ guestName, guestConfirmations, telefone, observacoes }) {
    try {
      // Validações
      if (!guestName || typeof guestName !== 'string') {
        return {
          success: false,
          error: 'Nome do convidado é obrigatório',
          data: null
        };
      }

      if (!guestConfirmations || typeof guestConfirmations !== 'object') {
        return {
          success: false,
          error: 'Confirmações dos convidados são obrigatórias',
          data: null
        };
      }

      // Verifica se o convidado existe
      const guestGroup = this.guestRepository.findGuestGroupByName(guestName);
      if (!guestGroup) {
        return {
          success: false,
          error: 'Convidado não encontrado na lista',
          data: null
        };
      }

      // Verifica se já existe confirmação
      if (await this.confirmationRepository.exists(guestName)) {
        return {
          success: false,
          error: 'Já existe uma confirmação para este convidado',
          data: null
        };
      }

      // Processa as confirmações
      const principal = this._getMainGuestConfirmation(guestGroup, guestConfirmations);
      const dependentes = this._getDependentsConfirmations(guestGroup, guestConfirmations);

      // Cria a entidade de confirmação
      const confirmation = new Confirmation(
        guestName.toLowerCase().trim(),
        principal,
        dependentes,
        telefone || '',
        observacoes || ''
      );

      // Salva a confirmação
      const saved = await this.confirmationRepository.save(confirmation);
      
      if (!saved) {
        return {
          success: false,
          error: 'Erro ao salvar confirmação',
          data: null
        };
      }

      return {
        success: true,
        error: null,
        data: confirmation
      };
    } catch (error) {
      return {
        success: false,
        error: 'Erro interno ao salvar confirmação',
        data: null
      };
    }
  }

  /**
   * Obtém a confirmação do convidado principal
   */
  _getMainGuestConfirmation(guestGroup, guestConfirmations) {
    const mainGuest = guestGroup.getMainGuest();
    if (!mainGuest) return 0;
    
    const confirmation = guestConfirmations[mainGuest.id];
    return confirmation === "Vou comparecer" ? 1 : 0;
  }

  /**
   * Obtém as confirmações dos dependentes
   */
  _getDependentsConfirmations(guestGroup, guestConfirmations) {
    const dependents = guestGroup.getDependents();
    const dependentsConfirmations = {};
    
    dependents.forEach(dependent => {
      const confirmation = guestConfirmations[dependent.id];
      dependentsConfirmations[dependent.id] = confirmation === "Vou comparecer" ? 1 : 0;
    });
    
    return dependentsConfirmations;
  }
}
