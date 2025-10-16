import { ConfirmationRepository } from '../../infrastructure/repositories/ConfirmationRepository.js';
import { GuestRepository } from '../../infrastructure/repositories/GuestRepository.js';

/**
 * Caso de uso para obter estatísticas administrativas
 */
export class GetAdminStatisticsUseCase {
  constructor(
    confirmationRepository = new ConfirmationRepository(),
    guestRepository = new GuestRepository()
  ) {
    this.confirmationRepository = confirmationRepository;
    this.guestRepository = guestRepository;
  }

  /**
   * Executa o caso de uso
   * @returns {Object} Resultado da operação
   */
  execute() {
    try {
      const confirmations = this.confirmationRepository.getAll();
      const confirmationStats = this.confirmationRepository.getStatistics();
      const guestStats = this.guestRepository.getGuestStatistics();

      // Calcular estatísticas detalhadas
      const detailedStats = this._calculateDetailedStatistics(confirmations);

      return {
        success: true,
        error: null,
        data: {
          ...confirmationStats,
          ...guestStats,
          ...detailedStats,
          totalConfirmations: confirmations.length
        }
      };
    } catch (error) {
      return {
        success: false,
        error: 'Erro ao calcular estatísticas',
        data: null
      };
    }
  }

  /**
   * Calcula estatísticas detalhadas
   */
  _calculateDetailedStatistics(confirmations) {
    let totalPeopleGoing = 0;
    let totalPeopleNotGoing = 0;
    let totalMainGuestsGoing = 0;
    let totalMainGuestsNotGoing = 0;
    let totalDependentsGoing = 0;
    let totalDependentsNotGoing = 0;

    confirmations.forEach(confirmation => {
      const guestGroup = this.guestRepository.findGuestGroupByName(confirmation.guestName);
      
      if (!guestGroup) return;

      // Contar principal
      if (confirmation.isMainGuestAttending()) {
        totalMainGuestsGoing++;
        totalPeopleGoing++;
      } else {
        totalMainGuestsNotGoing++;
        totalPeopleNotGoing++;
      }

      // Contar dependentes
      const dependents = guestGroup.getDependents();
      dependents.forEach(dependent => {
        if (confirmation.isDependentAttending(dependent.id)) {
          totalDependentsGoing++;
          totalPeopleGoing++;
        } else {
          totalDependentsNotGoing++;
          totalPeopleNotGoing++;
        }
      });
    });

    return {
      totalPeopleGoing,
      totalPeopleNotGoing,
      totalMainGuestsGoing,
      totalMainGuestsNotGoing,
      totalDependentsGoing,
      totalDependentsNotGoing
    };
  }
}
