import { useState, useCallback } from 'react';
import { GetAllConfirmationsUseCase } from '../useCases/GetAllConfirmationsUseCase.js';
import { ConfirmationRepository } from '../../infrastructure/repositories/ConfirmationRepository.js';

/**
 * Hook customizado para gerenciar o painel administrativo
 */
export function useAdminPanel() {
  const [confirmacoes, setConfirmacoes] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Instância do caso de uso
  const getAllConfirmationsUseCase = new GetAllConfirmationsUseCase();

  /**
   * Carrega todas as confirmações do servidor
   */
  const carregarConfirmacoes = useCallback(async () => {
    console.log('Iniciando carregamento de confirmações...');
    setLoading(true);
    setError(null);

    try {
      const result = await getAllConfirmationsUseCase.execute();
      console.log('Resultado da API:', result);
      
      if (result.success && result.data) {
        // Converte as confirmações para o formato esperado pelo admin
        const confirmacoesFormatadas = {};
        result.data.confirmations.forEach(confirmation => {
          confirmacoesFormatadas[confirmation.guestName] = {
            principal: confirmation.principal,
            dependentes: confirmation.dependentes,
            telefone: confirmation.telefone,
            observacoes: confirmation.observacoes,
            dataConfirmacao: confirmation.dataConfirmacao
          };
        });
        
        console.log('Confirmações formatadas:', confirmacoesFormatadas);
        setConfirmacoes(confirmacoesFormatadas);
      } else {
        console.error('Erro na resposta da API:', result.error);
        setError(result.error || 'Erro ao carregar confirmações');
      }
    } catch (err) {
      console.error('Erro ao carregar confirmações:', err);
      setError('Erro de conexão com o servidor');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Limpa todas as confirmações
   */
  const limparConfirmacoes = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const confirmationRepository = new ConfirmationRepository();
      const success = await confirmationRepository.deleteAll();
      
      if (success) {
        setConfirmacoes({});
        return { success: true, message: 'Todas as confirmações foram removidas' };
      } else {
        setError('Erro ao limpar confirmações');
        return { success: false, error: 'Erro ao limpar confirmações' };
      }
    } catch (err) {
      const errorMsg = 'Erro de conexão com o servidor';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    // Estado
    confirmacoes,
    loading,
    error,
    
    // Ações
    carregarConfirmacoes,
    limparConfirmacoes,
    
    // Computed
    totalConfirmacoes: Object.keys(confirmacoes).length
  };
}