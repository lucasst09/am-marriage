import { useState, useEffect, useCallback, useMemo } from 'react';
import { AdminLoginUseCase } from '../useCases/AdminLoginUseCase.js';
import { GetAllConfirmationsUseCase } from '../useCases/GetAllConfirmationsUseCase.js';
import { GetAdminStatisticsUseCase } from '../useCases/GetAdminStatisticsUseCase.js';
import { ExportToPDFUseCase } from '../useCases/ExportToPDFUseCase.js';
import { ConfirmationRepository } from '../../infrastructure/repositories/ConfirmationRepository.js';

/**
 * Hook customizado para gerenciar o painel administrativo
 */
export function useAdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [confirmations, setConfirmations] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Instâncias dos casos de uso (criadas uma vez)
  const adminLoginUseCase = useMemo(() => new AdminLoginUseCase(), []);
  const getAllConfirmationsUseCase = useMemo(() => new GetAllConfirmationsUseCase(), []);
  const getAdminStatisticsUseCase = useMemo(() => new GetAdminStatisticsUseCase(), []);
  const confirmationRepository = useMemo(() => new ConfirmationRepository(), []);

  /**
   * Carrega confirmações e estatísticas quando autenticado
   */
  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  /**
   * Carrega dados administrativos
   */
  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Carregar confirmações
      const confirmationsResult = getAllConfirmationsUseCase.execute();
      
      if (confirmationsResult.success) {
        setConfirmations(confirmationsResult.data.confirmations);
        setStatistics(confirmationsResult.data.statistics);
      } else {
        setError(confirmationsResult.error);
      }

      // Carregar estatísticas detalhadas
      const statsResult = getAdminStatisticsUseCase.execute();
      if (statsResult.success) {
        setStatistics(statsResult.data);
      }
    } catch (err) {
      setError('Erro ao carregar dados administrativos');
    } finally {
      setLoading(false);
    }
  }, [getAllConfirmationsUseCase, getAdminStatisticsUseCase]);

  /**
   * Executa login administrativo
   */
  const handleLogin = useCallback(async (e) => {
    e.preventDefault();
    
    setLoading(true);
    setError(null);

    try {
      const result = adminLoginUseCase.execute(password);
      
      if (result.success) {
        setIsAuthenticated(true);
        setPassword('');
        setShowPassword(false);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Erro no login');
    } finally {
      setLoading(false);
    }
  }, [password]);

  /**
   * Executa logout
   */
  const handleLogout = useCallback(() => {
    setIsAuthenticated(false);
    setPassword('');
    setShowPassword(false);
    setConfirmations([]);
    setStatistics(null);
    setError(null);
  }, []);

  /**
   * Exporta dados para PDF
   */
  const exportToPDF = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const exportUseCase = new ExportToPDFUseCase(confirmationRepository);
      const result = await exportUseCase.execute();
      
      if (!result.success) {
        setError(result.error);
      }
    } catch (err) {
      setError('Erro ao exportar PDF');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Limpa todas as confirmações
   */
  const clearAllConfirmations = useCallback(() => {
    if (window.confirm('Tem certeza que deseja limpar todas as confirmações? Esta ação não pode ser desfeita!')) {
      const success = confirmationRepository.deleteAll();
      
      if (success) {
        setConfirmations([]);
        setStatistics(null);
        alert('Todas as confirmações foram limpas!');
      } else {
        setError('Erro ao limpar confirmações');
      }
    }
  }, []);

  /**
   * Atualiza a lista de confirmações
   */
  const refreshData = useCallback(() => {
    loadData();
  }, [loadData]);

  return {
    // Estado
    isAuthenticated,
    password,
    showPassword,
    confirmations,
    statistics,
    loading,
    error,
    
    // Ações
    setPassword,
    setShowPassword,
    handleLogin,
    handleLogout,
    exportToPDF,
    clearAllConfirmations,
    refreshData,
    
    // Computed
    hasConfirmations: confirmations.length > 0,
    totalConfirmations: confirmations.length,
    totalGoing: statistics?.totalAttending || 0,
    totalNotGoing: statistics?.totalNotAttending || 0,
    totalDependents: statistics?.dependentsAttending || 0
  };
}
