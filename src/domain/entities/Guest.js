/**
 * Entidade Guest - Representa um convidado do casamento
 */
export class Guest {
  constructor(id, nome, tipo = "convidado") {
    this.id = id;
    this.nome = nome;
    this.tipo = tipo; // "convidado" ou "dependente"
  }

  /**
   * Verifica se é o convidado principal
   */
  isMainGuest() {
    return this.tipo === "convidado";
  }

  /**
   * Verifica se é um dependente
   */
  isDependent() {
    return this.tipo === "dependente";
  }

  /**
   * Cria uma instância de Guest a partir de dados brutos
   */
  static fromRawData(rawData) {
    return new Guest(rawData.id, rawData.nome, rawData.tipo);
  }

  /**
   * Converte para objeto simples
   */
  toObject() {
    return {
      id: this.id,
      nome: this.nome,
      tipo: this.tipo
    };
  }
}
