import { mockData } from '../../data/mockData.js';
import { GuestGroup } from '../../domain/entities/GuestGroup.js';

/**
 * Repositório para gerenciar dados de convidados
 * Implementa a interface de acesso aos dados dos convidados
 */
export class GuestRepository {
  constructor() {
    this.data = mockData;
  }

  /**
   * Busca um grupo de convidados pelo nome
   */
  findGuestGroupByName(name) {
    const normalizedName = name.toLowerCase().trim();
    const rawData = this.data[normalizedName];
    
    if (!rawData) {
      return null;
    }
    
    return GuestGroup.fromRawData(normalizedName, rawData);
  }

  /**
   * Verifica se um convidado existe
   */
  exists(name) {
    const normalizedName = name.toLowerCase().trim();
    return !!this.data[normalizedName];
  }

  /**
   * Obtém todos os grupos de convidados
   */
  getAllGuestGroups() {
    return Object.entries(this.data).map(([name, rawData]) => 
      GuestGroup.fromRawData(name, rawData)
    );
  }

  /**
   * Obtém estatísticas dos convidados
   */
  getGuestStatistics() {
    const groups = this.getAllGuestGroups();
    
    return {
      totalGroups: groups.length,
      totalGuests: groups.reduce((total, group) => total + group.getTotalCount(), 0),
      groupsWithDependents: groups.filter(group => group.hasDependents()).length,
      totalDependents: groups.reduce((total, group) => total + group.getDependents().length, 0)
    };
  }
}
