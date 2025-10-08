import { useState } from 'react';
import './App.css';
import WeddingSite from './view/WeddingSite';
import AdminPage from './view/AdminPage';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  return (
    <>
      {currentPage === 'home' && <WeddingSite />}
      {currentPage === 'admin' && <AdminPage />}
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
