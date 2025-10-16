import { ConfirmationRepository } from '../../infrastructure/repositories/ConfirmationRepository.js';

/**
 * Caso de uso para obter todas as confirmações
 */
export class GetAllConfirmationsUseCase {
  constructor(confirmationRepository = new ConfirmationRepository()) {
    this.confirmationRepository = confirmationRepository;
  }

  /**
   * Executa o caso de uso
   * @returns {Promise<Object>} Resultado da operação
   */
  async execute() {
    try {
      const confirmations = await this.confirmationRepository.getAll();
      const statistics = await this.confirmationRepository.getStatistics();

      return {
        success: true,
        error: null,
        data: {
          confirmations,
          statistics
        }
      };
    } catch (error) {
      return {
        success: false,
        error: 'Erro interno ao buscar confirmações',
        data: null
      };
    }
  }
}
