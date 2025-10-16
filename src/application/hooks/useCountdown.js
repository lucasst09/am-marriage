import { useState, useEffect, useCallback } from 'react';

/**
 * Hook customizado para gerenciar countdown do casamento
 */
export function useCountdown(targetDate = '2025-12-06T19:00:00') {
  const [timeLeft, setTimeLeft] = useState({
    dias: 0,
    horas: 0,
    minutos: 0,
    segundos: 0
  });

  const [isExpired, setIsExpired] = useState(false);

  /**
   * Calcula o tempo restante até a data alvo
   */
  const calculateTimeLeft = useCallback(() => {
    const now = new Date();
    const target = new Date(targetDate);
    const difference = target.getTime() - now.getTime();

    if (difference > 0) {
      const dias = Math.floor(difference / (1000 * 60 * 60 * 24));
      const horas = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutos = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const segundos = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ dias, horas, minutos, segundos });
      setIsExpired(false);
    } else {
      setTimeLeft({ dias: 0, horas: 0, minutos: 0, segundos: 0 });
      setIsExpired(true);
    }
  }, [targetDate]);

  /**
   * Inicia o countdown
   */
  useEffect(() => {
    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, [calculateTimeLeft]);

  /**
   * Formata o tempo restante em string
   */
  const getFormattedTime = useCallback(() => {
    if (isExpired) {
      return 'O casamento já aconteceu!';
    }

    const { dias, horas, minutos, segundos } = timeLeft;
    
    if (dias > 0) {
      return `${dias} dias, ${horas}h ${minutos}m ${segundos}s`;
    } else if (horas > 0) {
      return `${horas}h ${minutos}m ${segundos}s`;
    } else if (minutos > 0) {
      return `${minutos}m ${segundos}s`;
    } else {
      return `${segundos}s`;
    }
  }, [timeLeft, isExpired]);

  /**
   * Verifica se está próximo do evento (menos de 24 horas)
   */
  const isNearEvent = timeLeft.dias === 0 && timeLeft.horas < 24;

  /**
   * Verifica se é o dia do evento
   */
  const isEventDay = timeLeft.dias === 0 && timeLeft.horas < 24;

  return {
    timeLeft,
    isExpired,
    isNearEvent,
    isEventDay,
    getFormattedTime,
    refresh: calculateTimeLeft
  };
}
