import { ConfirmationRepository } from '../../infrastructure/repositories/ConfirmationRepository.js';

/**
 * Caso de uso para obter uma confirmação de presença
 */
export class GetConfirmationUseCase {
  constructor(confirmationRepository = new ConfirmationRepository()) {
    this.confirmationRepository = confirmationRepository;
  }

  /**
   * Executa o caso de uso
   * @param {string} guestName - Nome do convidado
   * @returns {Promise<Object>} Resultado da operação
   */
  async execute(guestName) {
    try {
      if (!guestName || typeof guestName !== 'string') {
        return {
          success: false,
          error: 'Nome do convidado é obrigatório',
          data: null
        };
      }

      const confirmation = await this.confirmationRepository.findByGuestName(guestName);
      
      return {
        success: true,
        error: null,
        data: confirmation // Pode ser null se não existir
      };
    } catch (error) {
      return {
        success: false,
        error: 'Erro interno ao buscar confirmação',
        data: null
      };
    }
  }
}
