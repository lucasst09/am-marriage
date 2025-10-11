import { useState, useEffect } from "react";
import { obterTodasConfirmacoes, limparTodasConfirmacoes, mockData } from "../data/mockData.js";
import "../css/weddingSite/WeddingSite.css";

export default function AdminPage({ onAddPhotos, storyPhotos, onRemovePhoto }) {
  const [confirmacoes, setConfirmacoes] = useState({});
  const [senha, setSenha] = useState("");
  const [autenticado, setAutenticado] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const SENHA_ADMIN = "admin123";

  useEffect(() => {
    if (autenticado) {
      carregarConfirmacoes();
    }
  }, [autenticado]);

  const carregarConfirmacoes = () => {
    const todasConfirmacoes = obterTodasConfirmacoes();
    setConfirmacoes(todasConfirmacoes);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (senha === SENHA_ADMIN) {
      setAutenticado(true);
      setSenha("");
    } else {
      alert("Senha incorreta!");
    }
  };

  const exportarParaPDF = async () => {
    try {
      const { jsPDF } = await import('jspdf');
      
      const doc = new jsPDF();
      
      doc.setFontSize(20);
      doc.text('Lista de Confirmações - Casamento A & M', 20, 20);
      
      doc.setFontSize(12);
      doc.text(`Data de geração: ${new Date().toLocaleDateString('pt-BR')}`, 20, 30);
      doc.text(`Total de confirmações: ${Object.keys(confirmacoes).length}`, 20, 35);
      
      let y = 50;
      let contador = 1;
      
      // Cabeçalho da tabela
      doc.setFontSize(10);
      doc.text('Nº', 20, y);
      doc.text('Nome', 30, y);
      doc.text('Status', 80, y);
      doc.text('Telefone', 120, y);
      doc.text('Acompanhantes', 160, y);
      doc.text('Observações', 20, y + 5);
      
      doc.line(20, y + 8, 190, y + 8);
      y += 15;
      
      Object.entries(confirmacoes).forEach(([nome, dados]) => {
        if (y > 270) { // Nova página se necessário
          doc.addPage();
          y = 20;
        }
        
        const dadosPessoa = mockData[nome.toLowerCase()];
        const nomeCompleto = dadosPessoa ? dadosPessoa.nome : nome;
        const status = dados.principal === 1 ? 'Vai comparecer' : 'Não vai comparecer';
        
        // Nome e status na primeira linha
        doc.setFontSize(9);
        doc.text(contador.toString(), 20, y);
        doc.text(nomeCompleto, 30, y);
        doc.text(status, 80, y);
        doc.text(dados.telefone || '-', 120, y);
        
        // Acompanhantes
        if (dadosPessoa && dadosPessoa.dependentes.length > 0) {
          const acompanhantes = dadosPessoa.dependentes
            .filter(dep => dados.dependentes[dep.id] === 1)
            .map(dep => dep.nome)
            .join(', ');
          doc.text(acompanhantes || 'Nenhum', 160, y);
        } else {
          doc.text('Nenhum', 160, y);
        }
        
        y += 5;
        
        // Observações na segunda linha
        if (dados.observacoes) {
          doc.text(`Obs: ${dados.observacoes}`, 20, y);
          y += 5;
        }
        
        // Data da confirmação
        const dataConfirmacao = new Date(dados.dataConfirmacao).toLocaleDateString('pt-BR');
        doc.text(`Confirmado em: ${dataConfirmacao}`, 20, y);
        
        y += 10;
        contador++;
      });
      
      // Estatísticas no final
      const totalVao = Object.values(confirmacoes).filter(c => c.principal === 1).length;
      const totalNaoVao = Object.values(confirmacoes).filter(c => c.principal === 0).length;
      const totalAcompanhantes = Object.values(confirmacoes).reduce((total, c) => {
        return total + Object.values(c.dependentes || {}).filter(v => v === 1).length;
      }, 0);
      
      y += 10;
      doc.setFontSize(12);
      doc.text('RESUMO:', 20, y);
      y += 8;
      doc.setFontSize(10);
      doc.text(`• Total de convidados que vão: ${totalVao}`, 20, y);
      y += 5;
      doc.text(`• Total de convidados que não vão: ${totalNaoVao}`, 20, y);
      y += 5;
      doc.text(`• Total de acompanhantes: ${totalAcompanhantes}`, 20, y);
      y += 5;
      doc.text(`• Total de pessoas no evento: ${totalVao + totalAcompanhantes}`, 20, y);
      
      // Salvar o PDF
      doc.save(`confirmacoes-casamento-${new Date().toISOString().split('T')[0]}.pdf`);
      
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      alert('Erro ao gerar PDF. Verifique se a biblioteca jsPDF está instalada.');
    }
  };

  const limparConfirmacoes = () => {
    if (window.confirm('Tem certeza que deseja limpar todas as confirmações? Esta ação não pode ser desfeita!')) {
      limparTodasConfirmacoes();
      setConfirmacoes({});
      alert('Todas as confirmações foram limpas!');
    }
  };

  if (!autenticado) {
    return (
      <div className="min-h-screen" style={{ background: "#F8F4EE", color: "#2E2A27", display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ 
          background: 'white', 
          padding: '40px', 
          borderRadius: '12px', 
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          maxWidth: '400px',
          width: '100%'
        }}>
          <h2 style={{ textAlign: 'center', marginBottom: '30px', fontSize: '24px' }}>Área Administrativa</h2>
          <form onSubmit={handleLogin}>
            <label className="lbl">
              Senha de acesso
              <input 
                type={mostrarSenha ? "text" : "password"}
                className="inp" 
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="Digite a senha"
                required 
              />
            </label>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                <input 
                  type="checkbox"
                  checked={mostrarSenha}
                  onChange={(e) => setMostrarSenha(e.target.checked)}
                />
                Mostrar senha
              </label>
            </div>
            <button className="btn full" type="submit">Entrar</button>
          </form>
          <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '12px', color: '#666' }}>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "#F8F4EE", color: "#2E2A27" }}>
      <header className="header">
        <div className="container row between center">
          <div className="brand">A & M - Admin</div>
          <button 
            className="btn" 
            onClick={() => setAutenticado(false)}
            style={{ backgroundColor: '#dc3545' }}
          >
            Sair
          </button>
        </div>
      </header>

      <div className="container" style={{ padding: '40px 20px' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '40px', fontSize: '32px' }}>
          Painel Administrativo
        </h1>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '20px', 
          marginBottom: '40px' 
        }}>
          <div className="card center" style={{ padding: '20px' }}>
            <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#28a745' }}>
              {Object.keys(confirmacoes).length}
            </div>
            <div className="label">Total de Confirmações</div>
          </div>
          
          <div className="card center" style={{ padding: '20px' }}>
            <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#28a745' }}>
              {Object.values(confirmacoes).filter(c => c.principal === 1).length}
            </div>
            <div className="label">Vão Comparecer</div>
          </div>
          
          <div className="card center" style={{ padding: '20px' }}>
            <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#dc3545' }}>
              {Object.values(confirmacoes).filter(c => c.principal === 0).length}
            </div>
            <div className="label">Não Vão Comparecer</div>
          </div>
          
          <div className="card center" style={{ padding: '20px' }}>
            <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#007bff' }}>
              {Object.values(confirmacoes).reduce((total, c) => {
                return total + Object.values(c.dependentes || {}).filter(v => v === 1).length;
              }, 0)}
            </div>
            <div className="label">Acompanhantes</div>
          </div>
        </div>

        <div style={{ 
          display: 'flex', 
          gap: '20px', 
          justifyContent: 'center', 
          marginBottom: '40px',
          flexWrap: 'wrap'
        }}>
          <button 
            className="btn" 
            onClick={exportarParaPDF}
            style={{ backgroundColor: '#28a745' }}
          >
            📄 Exportar para PDF
          </button>
          
          <button 
            className="btn" 
            onClick={carregarConfirmacoes}
            style={{ backgroundColor: '#007bff' }}
          >
            🔄 Atualizar Lista
          </button>
          
          <button 
            className="btn" 
            onClick={limparConfirmacoes}
            style={{ backgroundColor: '#dc3545' }}
          >
            🗑️ Limpar Todas
          </button>
        </div>

        {/* Novo: gestão da galeria */}
        <div className="card" style={{ padding: '20px', marginBottom: '40px' }}>
          <h3 style={{ marginBottom: '16px', textAlign: 'center' }}>Galeria de Fotos</h3>
          <label className="btn">
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
            {storyPhotos.map((p, idx) => (
              <div key={idx} className="gallery-photo-card" style={{ position: 'relative' }}>
                <img src={p.url} alt={`Foto ${idx + 1}`} />
                <button
                  className="btn"
                  onClick={() => onRemovePhoto && onRemovePhoto(idx)}
                  style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    backgroundColor: '#dc3545',
                    padding: '6px 10px',
                    fontSize: '12px'
                  }}
                  title="Remover esta foto"
                >
                  Remover
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="card" style={{ padding: '20px' }}>
          <h3 style={{ marginBottom: '20px', textAlign: 'center' }}>Lista de Confirmações</h3>
          
          {Object.keys(confirmacoes).length === 0 ? (
            <p style={{ textAlign: 'center', color: '#666', fontStyle: 'italic' }}>
              Nenhuma confirmação encontrada.
            </p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ 
                width: '100%', 
                borderCollapse: 'collapse',
                fontSize: '14px'
              }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8f9fa' }}>
                    <th style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'left' }}>Nome</th>
                    <th style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'left' }}>Status</th>
                    <th style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'left' }}>Telefone</th>
                    <th style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'left' }}>Acompanhantes</th>
                    <th style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'left' }}>Observações</th>
                    <th style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'left' }}>Data</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(confirmacoes).map(([nome, dados]) => {
                    const dadosPessoa = mockData[nome.toLowerCase()];
                    const nomeCompleto = dadosPessoa ? dadosPessoa.nome : nome;
                    const status = dados.principal === 1 ? 'Vai comparecer' : 'Não vai comparecer';
                    const acompanhantes = dadosPessoa && dadosPessoa.dependentes.length > 0 
                      ? dadosPessoa.dependentes
                          .filter(dep => dados.dependentes[dep.id] === 1)
                          .map(dep => dep.nome)
                          .join(', ') || 'Nenhum'
                      : 'Nenhum';
                    
                    return (
                      <tr key={nome} style={{ borderBottom: '1px solid #dee2e6' }}>
                        <td style={{ padding: '12px', border: '1px solid #dee2e6' }}>{nomeCompleto}</td>
                        <td style={{ 
                          padding: '12px', 
                          border: '1px solid #dee2e6',
                          color: dados.principal === 1 ? '#28a745' : '#dc3545',
                          fontWeight: 'bold'
                        }}>
                          {status}
                        </td>
                        <td style={{ padding: '12px', border: '1px solid #dee2e6' }}>{dados.telefone || '-'}</td>
                        <td style={{ padding: '12px', border: '1px solid #dee2e6' }}>{acompanhantes}</td>
                        <td style={{ padding: '12px', border: '1px solid #dee2e6' }}>{dados.observacoes || '-'}</td>
                        <td style={{ padding: '12px', border: '1px solid #dee2e6' }}>
                          {new Date(dados.dataConfirmacao).toLocaleDateString('pt-BR')}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
