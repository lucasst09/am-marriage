import { useState, useEffect, useRef } from 'react';
import './App.css';
import WeddingSite from './view/WeddingSite';
import AdminPage from './view/AdminPage';
import GiftsPage from './view/GiftsPage';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [storyPhotos, setStoryPhotos] = useState([]);
  const addPhotos = (files) => {
    const arr = Array.from(files || []);
    const photos = arr.map(f => ({ url: URL.createObjectURL(f) }));
    setStoryPhotos(prev => [...prev, ...photos]);
  };

  const removePhotoAt = (index) => {
    setStoryPhotos(prev => prev.filter((_, i) => i !== index));
  };
  const audioRef = useRef(null);
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    a.loop = true;
    a.muted = true;
    a.volume = 0.25;
    const play = () => a.play().catch(() => {});
    play();

    // Desmutar no primeiro gesto do usuário, em qualquer página
    const events = ['click', 'touchstart', 'pointerdown', 'keydown'];
    const handleFirstInteraction = () => {
      a.muted = false;
      play();
    };
    events.forEach(evName => window.addEventListener(evName, handleFirstInteraction, { once: true }));

    return () => {
      events.forEach(evName => window.removeEventListener(evName, handleFirstInteraction));
    };
  }, []);
  return (
    <>
      <audio ref={audioRef} src="/ceu-de-santo-amaro.mp3" autoPlay preload="auto" loop playsInline muted />
      {currentPage === 'home' && (
        <WeddingSite onNavigate={setCurrentPage} storyPhotos={storyPhotos} />
      )}
      {currentPage === 'presentes' && <GiftsPage onNavigate={setCurrentPage} />}
      {currentPage === 'admin' && (
        <AdminPage onAddPhotos={addPhotos} onRemovePhoto={removePhotoAt} storyPhotos={storyPhotos} />
      )}
      {currentPage === 'home' && (
        <button
          onClick={() => setCurrentPage('admin')}
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            backgroundColor: '#2E2A27',
            color: 'white',
            border: 'none',
            fontSize: '20px',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          title="Acessar área administrativa"
        >
          ⚙️
        </button>
      )}
      {currentPage === 'admin' && (
        <button
          onClick={() => setCurrentPage('home')}
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            backgroundColor: '#2E2A27',
            color: 'white',
            border: 'none',
            fontSize: '20px',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          title="Voltar ao site"
        >
          🏠
        </button>
      )}
    </>
  );
}
