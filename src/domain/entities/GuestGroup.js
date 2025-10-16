import { Guest } from './Guest.js';

/**
 * Entidade GuestGroup - Representa um grupo de convidados (convidado principal + dependentes)
 */
export class GuestGroup {
  constructor(guestName, guests = []) {
    this.guestName = guestName;
    this.guests = guests; // Array de Guest objects
  }

  /**
   * Obtém o convidado principal
   */
  getMainGuest() {
    return this.guests.find(guest => guest.isMainGuest());
  }

  /**
   * Obtém todos os dependentes
   */
  getDependents() {
    return this.guests.filter(guest => guest.isDependent());
  }

  /**
   * Obtém um convidado específico por ID
   */
  getGuestById(id) {
    return this.guests.find(guest => guest.id === id);
  }

  /**
   * Verifica se o grupo tem dependentes
   */
  hasDependents() {
    return this.getDependents().length > 0;
  }

  /**
   * Obtém o total de pessoas no grupo
   */
  getTotalCount() {
    return this.guests.length;
  }

  /**
   * Cria uma instância de GuestGroup a partir de dados brutos
   */
  static fromRawData(guestName, rawData) {
    const guests = [];
    
    // Adiciona o convidado principal
    guests.push(new Guest(0, rawData.nome, "convidado"));
    
    // Adiciona os dependentes
    if (rawData.dependentes && Array.isArray(rawData.dependentes)) {
      rawData.dependentes.forEach(dependente => {
        guests.push(Guest.fromRawData(dependente));
      });
    }
    
    return new GuestGroup(guestName, guests);
  }

  /**
   * Converte para objeto simples
   */
  toObject() {
    return {
      guestName: this.guestName,
      guests: this.guests.map(guest => guest.toObject())
    };
  }
}
