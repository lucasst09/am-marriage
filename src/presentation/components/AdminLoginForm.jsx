import React from 'react';

/**
 * Componente para o formulário de login administrativo
 */
export function AdminLoginForm({
  password,
  showPassword,
  loading,
  error,
  onPasswordChange,
  onShowPasswordChange,
  onSubmit
}) {
  return (
    <div className="min-h-screen" style={{color: "#2E2A27", display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ 
        background: 'white', 
        padding: '40px', 
        borderRadius: '12px', 
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        maxWidth: '400px',
        width: '100%'
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '30px', fontSize: '24px' }}>Área Administrativa</h2>
        
        {error && (
          <div style={{
            padding: '12px',
            backgroundColor: '#F8D7DA',
            border: '1px solid #F5C6CB',
            borderRadius: '8px',
            color: '#721C24',
            fontSize: '14px',
            marginBottom: '20px'
          }}>
            ❌ {error}
          </div>
        )}
        
        <form onSubmit={onSubmit}>
          <label className="lbl">
            Senha de acesso
            <input 
              type={showPassword ? "text" : "password"}
              className="inp" 
              value={password}
              onChange={(e) => onPasswordChange(e.target.value)}
              placeholder="Digite a senha"
              required 
              disabled={loading}
            />
          </label>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
              <input 
                type="checkbox"
                checked={showPassword}
                onChange={(e) => onShowPasswordChange(e.target.checked)}
                disabled={loading}
              />
              Mostrar senha
            </label>
          </div>
          <button 
            className="btn full" 
            type="submit"
            disabled={loading}
            style={{ opacity: loading ? 0.6 : 1 }}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '12px', color: '#666' }}>
          Acesso restrito aos administradores
        </p>
      </div>
    </div>
  );
}
