import { useState, useCallback } from 'react';
import { GetGuestGroupUseCase } from '../useCases/GetGuestGroupUseCase.js';
import { GetConfirmationUseCase } from '../useCases/GetConfirmationUseCase.js';
import { SaveConfirmationUseCase } from '../useCases/SaveConfirmationUseCase.js';

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

  // Instâncias dos casos de uso
  const getGuestGroupUseCase = new GetGuestGroupUseCase();
  const getConfirmationUseCase = new GetConfirmationUseCase();
  const saveConfirmationUseCase = new SaveConfirmationUseCase();

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
      return;
    }

    setLoading(true);
    setError(null);

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
      const confirmationResult = getConfirmationUseCase.execute(guestName);
      
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
      const result = saveConfirmationUseCase.execute({
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
    
    // Ações
    searchGuest,
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
