import { useState, useCallback } from 'react';
import { GetGuestGroupUseCase } from '../useCases/GetGuestGroupUseCase.js';
import { GetConfirmationUseCase } from '../useCases/GetConfirmationUseCase.js';
import { SaveConfirmationUseCase } from '../useCases/SaveConfirmationUseCase.js';
import { buscarSugestoes } from '../../data/mockData.js';

/**
 * Hook customizado para gerenciar confirmação de convidados
 */
export function useGuestConfirmation() {
  const [guestGroup, setGuestGroup] = useState(null);
  const [confirmation, setConfirmation] = useState(null);
  const [guestConfirmations, setGuestConfirmations] = useState({});
  const [telefone, setTelefone] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sugestoes, setSugestoes] = useState([]);
  const [nomeDigitado, setNomeDigitado] = useState('');

  // Instâncias dos casos de uso
  const getGuestGroupUseCase = new GetGuestGroupUseCase();
  const getConfirmationUseCase = new GetConfirmationUseCase();
  const saveConfirmationUseCase = new SaveConfirmationUseCase();

  /**
   * Busca sugestões de nomes
   */
  const searchSuggestions = useCallback((termo) => {
    setNomeDigitado(termo);
    
    if (!termo || termo.trim().length < 2) {
      setSugestoes([]);
      setGuestGroup(null);
      setConfirmation(null);
      setGuestConfirmations({});
      setTelefone('');
      setObservacoes('');
      setError(null);
      return;
    }

    const sugestoesEncontradas = buscarSugestoes(termo);
    setSugestoes(sugestoesEncontradas);
    setError(null);
  }, []);

  /**
   * Seleciona uma sugestão e busca o convidado
   */
  const selectSuggestion = useCallback((sugestao) => {
    setNomeDigitado(sugestao.display);
    setSugestoes([]);
    searchGuest(sugestao.chave);
  }, []);

  /**
   * Busca o grupo de convidados pelo nome
   */
  const searchGuest = useCallback(async (guestName) => {
    if (!guestName || !guestName.trim()) {
      setGuestGroup(null);
      setConfirmation(null);
      setGuestConfirmations({});
      setTelefone('');
      setObservacoes('');
      setError(null);
      setSugestoes([]);
      setNomeDigitado('');
      return;
    }

    setLoading(true);
    setError(null);
    setSugestoes([]); // Limpa sugestões após seleção

    try {
      // Busca o grupo de convidados
      const guestResult = getGuestGroupUseCase.execute(guestName);
      
      if (!guestResult.success) {
        setError(guestResult.error);
        setGuestGroup(null);
        setConfirmation(null);
        setGuestConfirmations({});
        setTelefone('');
        setObservacoes('');
        return;
      }

      const foundGuestGroup = guestResult.data;
      setGuestGroup(foundGuestGroup);

      // Inicializa confirmações padrão
      const initialConfirmations = {};
      foundGuestGroup.guests.forEach(guest => {
        initialConfirmations[guest.id] = "Vou comparecer";
      });
      setGuestConfirmations(initialConfirmations);

      // Busca confirmação existente
      const confirmationResult = await getConfirmationUseCase.execute(guestName);
      
      if (confirmationResult.success && confirmationResult.data) {
        const existingConfirmation = confirmationResult.data;
        setConfirmation(existingConfirmation);
        setTelefone(existingConfirmation.telefone || '');
        setObservacoes(existingConfirmation.observacoes || '');

        // Carrega confirmações existentes
        const existingConfirmations = {};
        foundGuestGroup.guests.forEach(guest => {
          if (guest.isMainGuest()) {
            existingConfirmations[guest.id] = existingConfirmation.isMainGuestAttending() 
              ? "Vou comparecer" 
              : "Não poderei";
          } else {
            existingConfirmations[guest.id] = existingConfirmation.isDependentAttending(guest.id)
              ? "Vou comparecer"
              : "Não poderei";
          }
        });
        setGuestConfirmations(existingConfirmations);
      } else {
        setConfirmation(null);
        setTelefone('');
        setObservacoes('');
      }
    } catch (err) {
      setError('Erro ao buscar convidado');
      setGuestGroup(null);
      setConfirmation(null);
      setGuestConfirmations({});
      setTelefone('');
      setObservacoes('');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Atualiza a confirmação de um convidado específico
   */
  const updateGuestConfirmation = useCallback((guestId, confirmationStatus) => {
    if (confirmation) {
      // Se já existe confirmação, não permite alterar
      return;
    }

    setGuestConfirmations(prev => ({
      ...prev,
      [guestId]: confirmationStatus
    }));
  }, [confirmation]);

  /**
   * Salva a confirmação
   */
  const saveConfirmation = useCallback(async () => {
    if (!guestGroup || confirmation) {
      return { success: false, error: 'Não é possível salvar' };
    }

    setLoading(true);
    setError(null);

    try {
      const result = await saveConfirmationUseCase.execute({
        guestName: guestGroup.guestName,
        guestConfirmations,
        telefone,
        observacoes
      });

      if (result.success) {
        setConfirmation(result.data);
        return { success: true, error: null };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (err) {
      const errorMsg = 'Erro ao salvar confirmação';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, [guestGroup, confirmation, guestConfirmations, telefone, observacoes]);

  /**
   * Reseta o estado
   */
  const reset = useCallback(() => {
    setGuestGroup(null);
    setConfirmation(null);
    setGuestConfirmations({});
    setTelefone('');
    setObservacoes('');
    setError(null);
    setLoading(false);
    setSugestoes([]);
    setNomeDigitado('');
  }, []);

  return {
    // Estado
    guestGroup,
    confirmation,
    guestConfirmations,
    telefone,
    observacoes,
    loading,
    error,
    sugestoes,
    nomeDigitado,
    
    // Ações
    searchGuest,
    searchSuggestions,
    selectSuggestion,
    updateGuestConfirmation,
    saveConfirmation,
    setTelefone,
    setObservacoes,
    reset,
    
    // Computed
    isGuestFound: !!guestGroup,
    hasExistingConfirmation: !!confirmation,
    canEdit: !confirmation,
    attendingCount: Object.values(guestConfirmations).filter(status => status === "Vou comparecer").length,
    totalGuests: guestGroup ? guestGroup.getTotalCount() : 0
  };
}
