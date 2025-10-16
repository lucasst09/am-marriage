import { GuestRepository } from '../../infrastructure/repositories/GuestRepository.js';

/**
 * Caso de uso para obter um grupo de convidados
 */
export class GetGuestGroupUseCase {
  constructor(guestRepository = new GuestRepository()) {
    this.guestRepository = guestRepository;
  }

  /**
   * Executa o caso de uso
   * @param {string} guestName - Nome do convidado
   * @returns {Object} Resultado da operação
   */
  execute(guestName) {
    try {
      if (!guestName || typeof guestName !== 'string') {
        return {
          success: false,
          error: 'Nome do convidado é obrigatório',
          data: null
        };
      }

      const guestGroup = this.guestRepository.findGuestGroupByName(guestName);
      
      if (!guestGroup) {
        return {
          success: false,
          error: 'Convidado não encontrado',
          data: null
        };
      }

      return {
        success: true,
        error: null,
        data: guestGroup
      };
    } catch (error) {
      return {
        success: false,
        error: 'Erro interno ao buscar convidado',
        data: null
      };
    }
  }
}
