/**
 * Caso de uso para autenticação administrativa
 */
export class AdminLoginUseCase {
  constructor() {
    this.validPassword = "004Rg~";
  }

  /**
   * Executa o caso de uso de login
   * @param {string} password - Senha fornecida
   * @returns {Object} Resultado da operação
   */
  execute(password) {
    try {
      if (!password || typeof password !== 'string') {
        return {
          success: false,
          error: 'Senha é obrigatória',
          data: null
        };
      }

      if (password === this.validPassword) {
        return {
          success: true,
          error: null,
          data: { authenticated: true }
        };
      } else {
        return {
          success: false,
          error: 'Senha incorreta',
          data: null
        };
      }
    } catch (error) {
      return {
        success: false,
        error: 'Erro interno na autenticação',
        data: null
      };
    }
  }
}
