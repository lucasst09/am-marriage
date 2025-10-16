import React from 'react';

/**
 * Componente para a seção da galeria de fotos
 */
export function GallerySection({ photos = [] }) {
  return (
    <section id="gallery" className="gallery-section">
      <div className="container">
        <div className="gallery-header">
          <div className="leaf-decoration">🍃</div>
          <h2 className="gallery-title">Galeria de Fotos</h2>
          <p className="gallery-description">Registros especiais da nossa caminhada.</p>
        </div>

        <div className="gallery-grid" style={{ marginTop: 16 }}>
          {photos.map((photo, idx) => (
            <div key={idx} className="gallery-photo-card" style={{ display: 'grid', gap: 8 }}>
              <img 
                src={photo.url} 
                alt={`Foto ${idx + 1}`} 
                style={{ width: '100%', borderRadius: 12 }} 
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
