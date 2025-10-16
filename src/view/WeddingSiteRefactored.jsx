import React, { useState, useEffect, useRef } from 'react';
import "../css/weddingSite/WeddingSite.css";
import img1 from "../assets/img/image1.jpg";
import WeddingMenu from "../components/WeddingMenu.jsx";

// Importações da nova arquitetura
import { useGuestConfirmation } from '../application/hooks/useGuestConfirmation.js';
import { useCountdown } from '../application/hooks/useCountdown.js';

// Componentes de UI
import { Header } from '../presentation/components/Header.jsx';
import { HeroSection } from '../presentation/components/HeroSection.jsx';
import { CountdownSection } from '../presentation/components/CountdownSection.jsx';
import { StorySection } from '../presentation/components/StorySection.jsx';
import { InfoSection } from '../presentation/components/InfoSection.jsx';
import { GallerySection } from '../presentation/components/GallerySection.jsx';
import { Footer } from '../presentation/components/Footer.jsx';
import { ConfirmationModal } from '../presentation/components/ConfirmationModal.jsx';
import { ConfirmationSuccessModal } from '../presentation/components/ConfirmationSuccessModal.jsx';

/**
 * Componente principal do site de casamento refatorado com Clean Architecture
 */
export default function WeddingSiteRefactored({ onNavigate, storyPhotos }) {
  // Estados locais
  const [modalOpen, setModalOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentGuestName, setCurrentGuestName] = useState('');

  // Custom hooks
  const {
    guestGroup,
    confirmation,
    guestConfirmations,
    telefone,
    observacoes,
    loading,
    error,
    sugestoes,
    nomeDigitado,
    searchGuest,
    searchSuggestions,
    selectSuggestion,
    updateGuestConfirmation,
    saveConfirmation,
    setTelefone,
    setObservacoes,
    reset,
    isGuestFound,
    hasExistingConfirmation,
    canEdit,
    attendingCount,
    totalGuests
  } = useGuestConfirmation();

  const { timeLeft, isExpired, isNearEvent } = useCountdown();

  // Refs
  const firstFieldRef = useRef(null);

  // Efeitos
  useEffect(() => {
    if (modalOpen && firstFieldRef.current) {
      firstFieldRef.current.focus();
    }
  }, [modalOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && modalOpen) {
        setModalOpen(false);
      }
    };

    if (modalOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [modalOpen]);

  // Handlers
  const handleOpenModal = () => {
    setModalOpen(true);
    reset();
    setCurrentGuestName('');
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    reset();
    setCurrentGuestName('');
  };

  const handleGuestSearch = (guestName) => {
    setCurrentGuestName(guestName);
    searchSuggestions(guestName);
  };

  const handleSaveConfirmation = async () => {
    const result = await saveConfirmation();
    
    if (result.success) {
      setModalOpen(false);
      setSuccessModalOpen(true);
    }
  };

  const handleCloseSuccessModal = () => {
    setSuccessModalOpen(false);
    reset();
    setCurrentGuestName('');
  };

  const handleNavigateToGifts = (e) => {
    e.preventDefault();
    onNavigate && onNavigate('presentes');
  };

  const handleNavigateToDetails = (e) => {
    e.preventDefault();
    // Scroll suave para a seção de informações
    const infoSection = document.getElementById('info');
    if (infoSection) {
      infoSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="wedding-site">
      <Header 
        onMenuOpen={() => setMenuOpen(true)}
        onConfirmPresence={handleOpenModal}
        onNavigate={onNavigate}
      />

      <WeddingMenu 
        open={menuOpen} 
        onClose={() => setMenuOpen(false)}
        onNavigate={onNavigate}
        onConfirmPresence={handleOpenModal}
      />

      <HeroSection 
        backgroundImage={img1}
        onConfirmPresence={handleOpenModal}
        onNavigateToGifts={handleNavigateToGifts}
        onNavigateToDetails={handleNavigateToDetails}
      />

      <CountdownSection 
        timeLeft={timeLeft}
        isExpired={isExpired}
        isNearEvent={isNearEvent}
      />

      <StorySection />

      <InfoSection />

      <GallerySection photos={storyPhotos} />

      <Footer />

      <ConfirmationModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        guestGroup={guestGroup}
        confirmation={confirmation}
        guestConfirmations={guestConfirmations}
        telefone={telefone}
        observacoes={observacoes}
        error={error}
        loading={loading}
        canEdit={canEdit}
        attendingCount={attendingCount}
        totalGuests={totalGuests}
        onGuestConfirmationChange={updateGuestConfirmation}
        onTelefoneChange={setTelefone}
        onObservacoesChange={setObservacoes}
        onSave={handleSaveConfirmation}
        onGuestSearch={handleGuestSearch}
        sugestoes={sugestoes}
        onSugestaoSelecionada={selectSuggestion}
        nomeDigitado={nomeDigitado}
      />

      <ConfirmationSuccessModal
        isOpen={successModalOpen}
        onClose={handleCloseSuccessModal}
      />
    </div>
  );
}
