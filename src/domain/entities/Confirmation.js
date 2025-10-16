/**
 * Entidade Confirmation - Representa uma confirmação de presença
 */
export class Confirmation {
  constructor(guestName, principal = 0, dependentes = {}, telefone = "", observacoes = "", dataConfirmacao = null) {
    this.guestName = guestName;
    this.principal = principal; // 0 = não vai, 1 = vai
    this.dependentes = dependentes; // { id: 0/1, ... }
    this.telefone = telefone;
    this.observacoes = observacoes;
    this.dataConfirmacao = dataConfirmacao || new Date().toISOString();
  }

  /**
   * Verifica se o convidado principal vai comparecer
   */
  isMainGuestAttending() {
    return this.principal === 1;
  }

  /**
   * Verifica se um dependente específico vai comparecer
   */
  isDependentAttending(dependentId) {
    return this.dependentes[dependentId] === 1;
  }

  /**
   * Conta quantos dependentes vão comparecer
   */
  getAttendingDependentsCount() {
    return Object.values(this.dependentes).filter(status => status === 1).length;
  }

  /**
   * Conta o total de pessoas que vão comparecer
   */
  getTotalAttendingCount() {
    const mainGuestCount = this.isMainGuestAttending() ? 1 : 0;
    return mainGuestCount + this.getAttendingDependentsCount();
  }

  /**
   * Verifica se há alguma confirmação (principal ou dependentes)
   */
  hasAnyConfirmation() {
    return this.isMainGuestAttending() || this.getAttendingDependentsCount() > 0;
  }

  /**
   * Obtém o total de pessoas no grupo (principal + dependentes)
   */
  getTotalCount() {
    return 1 + Object.keys(this.dependentes).length; // 1 para o principal + dependentes
  }

  /**
   * Cria uma instância de Confirmation a partir de dados brutos
   */
  static fromRawData(rawData) {
    if (!rawData || typeof rawData !== 'object') {
      throw new Error('Dados inválidos para criar Confirmation');
    }

    return new Confirmation(
      rawData.guestName || '',
      rawData.principal || 0,
      rawData.dependentes || {},
      rawData.telefone || "",
      rawData.observacoes || "",
      rawData.dataConfirmacao
    );
  }

  /**
   * Converte para objeto simples
   */
  toObject() {
    return {
      guestName: this.guestName,
      principal: this.principal,
      dependentes: this.dependentes,
      telefone: this.telefone,
      observacoes: this.observacoes,
      dataConfirmacao: this.dataConfirmacao
    };
  }
}
