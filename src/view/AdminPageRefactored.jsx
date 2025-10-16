import React from 'react';
import "../css/weddingSite/WeddingSite.css";

// Importações da nova arquitetura
import { useAdminPanel } from '../application/hooks/useAdminPanel.js';

// Componentes de UI
import { AdminLoginForm } from '../presentation/components/AdminLoginForm.jsx';
import { AdminHeader } from '../presentation/components/AdminHeader.jsx';
import { AdminStatistics } from '../presentation/components/AdminStatistics.jsx';
import { AdminActions } from '../presentation/components/AdminActions.jsx';
import { ConfirmationsTable } from '../presentation/components/ConfirmationsTable.jsx';
import { GalleryManager } from '../presentation/components/GalleryManager.jsx';

/**
 * Componente principal do painel administrativo refatorado com Clean Architecture
 */
export default function AdminPageRefactored({ onAddPhotos, storyPhotos, onRemovePhoto }) {
  const {
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
    refreshData
  } = useAdminPanel();

  // Se não estiver autenticado, mostrar formulário de login
  if (!isAuthenticated) {
    return (
      <AdminLoginForm
        password={password}
        showPassword={showPassword}
        loading={loading}
        error={error}
        onPasswordChange={setPassword}
        onShowPasswordChange={setShowPassword}
        onSubmit={handleLogin}
      />
    );
  }

  // Painel administrativo autenticado
  return (
    <div className="min-h-screen" style={{ background: "#F8F4EE", color: "#2E2A27" }}>
      <AdminHeader onLogout={handleLogout} />

      <div className="container" style={{ padding: '40px 20px' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '40px', fontSize: '32px' }}>
          Painel Administrativo
        </h1>

        <AdminStatistics 
          statistics={statistics} 
          loading={loading} 
        />

        <AdminActions
          loading={loading}
          error={error}
          onExportPDF={exportToPDF}
          onRefresh={refreshData}
          onClearAll={clearAllConfirmations}
        />

        <ConfirmationsTable 
          confirmations={confirmations} 
          loading={loading} 
        />

        <GalleryManager
          storyPhotos={storyPhotos}
          onAddPhotos={onAddPhotos}
          onRemovePhoto={onRemovePhoto}
        />
      </div>
    </div>
  );
}
