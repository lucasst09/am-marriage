import React from 'react';

/**
 * Componente para gerenciar a galeria de fotos
 */
export function GalleryManager({ storyPhotos, onAddPhotos, onRemovePhoto }) {
  return (
    <div className="card" style={{ padding: '20px', marginBottom: '40px' }}>
      <h3 style={{ marginBottom: '16px', textAlign: 'center' }}>Galeria de Fotos</h3>
      
      <label className="btn" style={{ marginBottom: '16px' }}>
        Adicionar fotos
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => onAddPhotos && onAddPhotos(e.target.files)}
          style={{ display: 'none' }}
        />
      </label>

      <div className="gallery-grid" style={{ marginTop: 16 }}>
        {storyPhotos.map((photo, idx) => (
          <div key={idx} className="gallery-photo-card" style={{ position: 'relative' }}>
            <img 
              src={photo.url} 
              alt={`Foto ${idx + 1}`} 
              style={{ width: '100%', borderRadius: '8px' }}
              loading="lazy"
            />
            <button
              className="btn"
              onClick={() => onRemovePhoto && onRemovePhoto(idx)}
              style={{
                position: 'absolute',
                top: '8px',
                right: '8px',
                backgroundColor: '#dc3545',
                padding: '6px 10px',
                fontSize: '12px',
                border: 'none',
                borderRadius: '4px',
                color: 'white',
                cursor: 'pointer'
              }}
              title="Remover esta foto"
            >
              Remover
            </button>
          </div>
        ))}
      </div>
      
      {storyPhotos.length === 0 && (
        <p style={{ 
          textAlign: 'center', 
          color: '#666', 
          fontStyle: 'italic',
          marginTop: '20px'
        }}>
          Nenhuma foto adicionada ainda.
        </p>
      )}
    </div>
  );
}
