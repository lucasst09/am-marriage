import { useState } from 'react';
import './App.css';
import WeddingSite from './view/WeddingSite';
import AdminPage from './view/AdminPage';
import GiftsPage from './view/GiftsPage';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [storyPhotos, setStoryPhotos] = useState([]);
  const addPhotos = (files) => {
    const arr = Array.from(files || []);
    const photos = arr.map(f => ({ url: URL.createObjectURL(f) }));
    setStoryPhotos(prev => [...prev, ...photos]);
  };

  return (
    <>
      {currentPage === 'home' && (
        <WeddingSite onNavigate={setCurrentPage} storyPhotos={storyPhotos} />
      )}
      {currentPage === 'presentes' && <GiftsPage onNavigate={setCurrentPage} />}
      {currentPage === 'admin' && (
        <AdminPage onAddPhotos={addPhotos} storyPhotos={storyPhotos} />
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

export default App;
