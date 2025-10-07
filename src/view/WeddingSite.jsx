import { useEffect, useRef, useState } from "react";
import "../css/weddingSite/WeddingSite.css";
import { obterPessoasDisponiveis, verificarConfirmacaoExistente, salvarConfirmacao } from "../data/mockData.js";
import carroImage from "../assets/img/carro.jpg";

export default function WeddingSite() {
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const [dependentesDisponiveis, setDependentesDisponiveis] = useState([]);
  const [dependentesSelecionados, setDependentesSelecionados] = useState([]);
  const [nomeConvidado, setNomeConvidado] = useState("");
  const [telefone, setTelefone] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [opcao, setOpcao] = useState("Vou comparecer");
  const [jaConfirmado, setJaConfirmado] = useState(false);
  const [dadosConfirmacaoExistente, setDadosConfirmacaoExistente] = useState(null);
  const firstFieldRef = useRef(null);

  const handleNomeChange = (nome) => {
    setNomeConvidado(nome);
    
    if (nome.trim()) {
      const pessoas = obterPessoasDisponiveis(nome.toLowerCase());
      
      if (pessoas.length > 0) {
        const dependentes = pessoas.filter(pessoa => pessoa.tipo === "dependente");
        setDependentesDisponiveis(dependentes);
        setDependentesSelecionados([]);
        
        // Verificar se já existe confirmação
        const confirmacaoExistente = verificarConfirmacaoExistente(nome.toLowerCase());
        if (confirmacaoExistente) {
          setJaConfirmado(true);
          setDadosConfirmacaoExistente(confirmacaoExistente);
          setTelefone(confirmacaoExistente.telefone || "");
          setObservacoes(confirmacaoExistente.observacoes || "");
          setOpcao(confirmacaoExistente.principal === 1 ? "Vou comparecer" : "Não poderei");
          
          // Marcar dependentes que foram confirmados
          const dependentesConfirmados = dependentes.filter(dep => 
            confirmacaoExistente.dependentes && confirmacaoExistente.dependentes[dep.id] === 1
          );
          setDependentesSelecionados(dependentesConfirmados);
        } else {
          setJaConfirmado(false);
          setDadosConfirmacaoExistente(null);
          setTelefone("");
          setObservacoes("");
          setOpcao("Vou comparecer");
        }
      } else {
        setDependentesDisponiveis([]);
        setDependentesSelecionados([]);
        setJaConfirmado(false);
        setDadosConfirmacaoExistente(null);
      }
    } else {
      setDependentesDisponiveis([]);
      setDependentesSelecionados([]);
      setJaConfirmado(false);
      setDadosConfirmacaoExistente(null);
    }
  };

  useEffect(() => {
    if (open && firstFieldRef.current) firstFieldRef.current.focus();
  }, [open]);

  const toggleDependente = (dependente) => {
    if (jaConfirmado) return; // Não permitir alterar se já confirmado
    
    setDependentesSelecionados(prev => {
      const jaSelecionado = prev.find(d => d.id === dependente.id);
      if (jaSelecionado) {
        return prev.filter(d => d.id !== dependente.id);
      } else {
        return [...prev, dependente];
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (jaConfirmado) {
      alert("Você já confirmou sua presença anteriormente!");
      return;
    }

    // Preparar dados da confirmação
    const dadosConfirmacao = {
      principal: opcao === "Vou comparecer" ? 1 : 0,
      dependentes: {},
      telefone: telefone,
      observacoes: observacoes
    };

    // Marcar dependentes selecionados como 1, não selecionados como 0
    dependentesDisponiveis.forEach(dep => {
      dadosConfirmacao.dependentes[dep.id] = dependentesSelecionados.some(d => d.id === dep.id) ? 1 : 0;
    });

    // Salvar confirmação
    const sucesso = salvarConfirmacao(nomeConvidado, dadosConfirmacao);
    
    if (sucesso) {
      setSent(true);
      setJaConfirmado(true);
      setDadosConfirmacaoExistente(dadosConfirmacao);
    }
  };

  // Função para fechar modal quando clicar fora
  const handleModalClick = (e) => {
    if (e.target === e.currentTarget) {
      setOpen(false);
    }
  };

  // Função para fechar modal com ESC
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && open) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('keydown', handleKeyDown);
      // Prevenir scroll do body quando modal estiver aberta
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  return (
    <div className="min-h-screen" style={{ background: "#F8F4EE", color: "#2E2A27" }}>
      <header className="header">
        <div className="container row between center">
          <div className="brand">A & M</div>
          <nav className="nav">
            <a href="#home">Início</a>
            <a href="#story">História</a>
            <a href="#info">Informações</a>
            <a href="#gallery">Galeria</a>
            <a href="#gifts">Presentes</a>
          </nav>
          <button className="btn" onClick={() => setOpen(true)}>Confirmar presença</button>
        </div>
      </header>
      <section id="home" className="hero full">
        <div className="container">
          <p className="kicker">CELEBRAÇÃO DO AMOR</p>
          <h1 className="title">André & Marilene</h1>
          <p className="subtitle">Depois de 29 anos de amor, vamos celebrar nossa união.</p>
          <div className="row center gap">
            <button className="btn" onClick={() => setOpen(true)}>Confirmar Presença</button>
            <a href="#info" className="btn ghost">Ver detalhes</a>
          </div>
          <div className="photo ph">
            <img src={carroImage} alt="Foto do casal"/>
          </div>
        </div>
        <svg className="floral tl" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><circle cx="30" cy="30" r="30" fill="#EBD9CF"/><path d="M10 95 C40 80,70 120,110 90" stroke="#D7B7A6" strokeWidth="8" fill="none" strokeLinecap="round"/></svg>
        <svg className="floral br" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><circle cx="30" cy="30" r="30" fill="#EBD9CF"/><path d="M10 95 C40 80,70 120,110 90" stroke="#D7B7A6" strokeWidth="8" fill="none" strokeLinecap="round"/></svg>
      </section>
      <section className="container grid4">
        {["Dias","Horas","Min","Seg"].map((l,i)=> (
          <div key={l} className="card center">
            <div className="count">{[42,12,7,19][i]}</div>
            <div className="label">{l}</div>
          </div>
        ))}
      </section>
      <section id="story" className="container two">
        <div className="ph tall" />
        <div>
          <h2 className="h2">Nossa história</h2>
          <p className="muted">Uma linha do tempo simples e elegante. Adicione marcos como o primeiro encontro, viagens e o pedido, com fotos e pequenas legendas.</p>
          <ol className="timeline">
            <li><strong>1996</strong> — Primeiro encontro</li>
            <li><strong>2010</strong> — Nova casa</li>
            <li><strong>2025</strong> — O grande dia</li>
          </ol>
        </div>
      </section>
      <section id="info" className="band">
        <div className="container three">
          <div className="icard">
            <div className="ico">📅</div>
            <h3 className="h3">Quando</h3>
            <p className="muted">Sábado, 14 de dezembro de 2025 — 17:00</p>
          </div>
          <div className="icard">
            <div className="ico">📍</div>
            <h3 className="h3">Onde</h3>
            <p className="muted">Espaço Jardim, Brasília — DF</p>
            <div className="ph map">Mapa (embed)</div>
          </div>
          <div className="icard">
            <div className="ico">✉️</div>
            <h3 className="h3">Contato</h3>
            <p className="muted">Dúvidas? Fale com os noivos pelo WhatsApp.</p>
          </div>
        </div>
      </section>
      <section id="gallery" className="container">
        <h2 className="h2 center">Galeria</h2>
        <div className="gallery">
          {Array.from({length:8}).map((_,i)=> <div key={i} className="gitem"/>) }
        </div>
      </section>
      <section id="gifts" className="band">
        <div className="container center">
          <h2 className="h2">Lista de Presentes</h2>
          <p className="muted">Adicione links para lojas, iCasei, ou chave Pix.</p>
          <div className="row center gap wrap">
            {["iCasei","Lojas","Pix"].map(t=> <a key={t} className="btn" href="#">{t}</a>)}
          </div>
        </div>
      </section>
      <footer className="container center foot muted">Feito com ♥ — Estilo Pinterest: off‑white, serif elegante, cartões arredondados e RSVP destacado.</footer>
      {open && (
        <div 
          className="modal" 
          role="dialog" 
          aria-modal="true" 
          aria-label="Confirmar Presença"
          onClick={handleModalClick}
        >
          <div className="mcard">
            {!sent ? (
              <>
                <div className="row between center">
                  <h3 className="h3">Confirmar Presença</h3>
                  <button className="x" onClick={()=>setOpen(false)} aria-label="Fechar">✕</button>
                </div>
                
                {jaConfirmado && (
                  <div style={{
                    padding: '12px',
                    backgroundColor: '#D4EDDA',
                    border: '1px solid #C3E6CB',
                    borderRadius: '8px',
                    color: '#155724',
                    fontSize: '14px',
                    marginBottom: '16px'
                  }}>
                    ✅ Você já confirmou sua presença! Os dados abaixo são apenas para visualização.
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <label className="lbl">Seu nome
                    <input 
                      ref={firstFieldRef} 
                      className="inp" 
                      placeholder="Digite seu nome (ex: André, João, Maria, Carlos)" 
                      value={nomeConvidado}
                      onChange={(e) => handleNomeChange(e.target.value)}
                      required 
                      disabled={jaConfirmado}
                    />
                  </label>
                  
                  {dependentesDisponiveis.length > 0 && (
                    <div className="lbl">
                      <label>Acompanhantes que irão comparecer ({dependentesSelecionados.length})</label>
                      <div style={{ 
                        marginTop: '8px', 
                        display: 'flex', 
                        flexDirection: 'column', 
                        gap: '12px',
                        padding: '12px',
                        backgroundColor: '#F8F4EE',
                        borderRadius: '8px',
                        border: '1px solid #EBD9CF'
                      }}>
                        {dependentesDisponiveis.map(dependente => (
                          <label key={dependente.id} style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '12px', 
                            cursor: jaConfirmado ? 'not-allowed' : 'pointer',
                            padding: '8px',
                            borderRadius: '6px',
                            backgroundColor: 'transparent',
                            transition: 'background-color 0.2s',
                            opacity: jaConfirmado ? 0.6 : 1
                          }}>
                            <input
                              type="checkbox"
                              checked={dependentesSelecionados.some(d => d.id === dependente.id)}
                              onChange={() => toggleDependente(dependente)}
                              disabled={jaConfirmado}
                              style={{ 
                                margin: 0,
                                width: '16px',
                                height: '16px',
                                accentColor: '#2E2A27'
                              }}
                            />
                            <span style={{ 
                              fontWeight: 'normal',
                              color: '#2E2A27',
                              fontSize: '14px'
                            }}>
                              {dependente.nome}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {nomeConvidado.trim() && dependentesDisponiveis.length === 0 && !jaConfirmado && (
                    <div style={{
                      padding: '12px',
                      backgroundColor: '#FFF3CD',
                      border: '1px solid #FFEAA7',
                      borderRadius: '8px',
                      color: '#856404',
                      fontSize: '14px',
                      marginTop: '8px'
                    }}>
                      Nome não encontrado na lista de convidados. Verifique se digitou corretamente.
                    </div>
                  )}
                  
                  <div className="row gap">
                    <label className="lbl">Opção
                      <select 
                        className="inp"
                        value={opcao}
                        onChange={(e) => setOpcao(e.target.value)}
                        disabled={jaConfirmado}
                      >
                        <option>Vou comparecer</option>
                        <option>Não poderei</option>
                      </select>
                    </label>
                  </div>
                  <label className="lbl">Telefone (WhatsApp)
                    <input 
                      className="inp" 
                      placeholder="(61) 9 9999-9999" 
                      value={telefone}
                      onChange={(e) => setTelefone(e.target.value)}
                      disabled={jaConfirmado}
                    />
                  </label>
                  <label className="lbl">Observações
                    <textarea 
                      className="inp" 
                      rows={3} 
                      placeholder="Restrições alimentares, etc." 
                      value={observacoes}
                      onChange={(e) => setObservacoes(e.target.value)}
                      disabled={jaConfirmado}
                    />
                  </label>
                  <button 
                    className="btn full" 
                    type="submit"
                    disabled={jaConfirmado}
                    style={{
                      opacity: jaConfirmado ? 0.5 : 1,
                      cursor: jaConfirmado ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {jaConfirmado ? 'Já confirmado' : 'Enviar confirmação'}
                  </button>
                  <p className="hint">Dica: digite seu nome para ver seus acompanhantes disponíveis.</p>
                </form>
              </>
            ) : (
              <div className="center" style={{padding: "24px 8px"}}>
                <div className="ok">✓</div>
                <h3 className="h3" style={{marginTop: 12}}>Confirmação enviada!</h3>
                <p className="muted" style={{marginTop: 6}}>Você receberá os detalhes por e‑mail/WhatsApp.</p>
                <button className="btn" style={{marginTop: 16}} onClick={()=>{ setSent(false); setOpen(false); }}>Fechar</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
