import { useEffect, useRef, useState } from "react";
import "../css/weddingSite/WeddingSite.css";
import { obterPessoasDisponiveis, verificarConfirmacaoExistente, salvarConfirmacao } from "../data/mockData.js";
import img1 from "../assets/img/image1.jpg";
import WeddingMenu from "../components/WeddingMenu.jsx";

export default function WeddingSite({ onNavigate, storyPhotos }) {
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const [dependentesDisponiveis, setDependentesDisponiveis] = useState([]);
  const [pessoasConfirmacao, setPessoasConfirmacao] = useState({});
  const [nomeConvidado, setNomeConvidado] = useState("");
  const [telefone, setTelefone] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [jaConfirmado, setJaConfirmado] = useState(false);
  const [dadosConfirmacaoExistente, setDadosConfirmacaoExistente] = useState(null);
  const [nomeValido, setNomeValido] = useState(false);
  const [tempoRestante, setTempoRestante] = useState({ dias: 590, horas: 0, minutos: 8, segundos: 46 });
  const firstFieldRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const pixKey = "(61)99868-5446";
  const cotas = [
    { titulo: "1 noite aconchegante", valor: "R$ 250,00", descricao: "Ajude com a hospedagem" },
    { titulo: "Jantar romântico", valor: "R$ 180,00", descricao: "Um brinde ao amor!" },
    { titulo: "Passeio especial", valor: "R$ 120,00", descricao: "Momento inesquecível" },
    { titulo: "Transporte", valor: "R$ 80,00", descricao: "Para chegar aos destinos" }
  ];
  const copyText = (text) => { navigator.clipboard?.writeText(text).catch(() => {}); };


  const calcularTempoRestante = () => {
    const agora = new Date();
    const casamento = new Date('2025-12-06T19:00:00');
    
    const diferenca = casamento.getTime() - agora.getTime();
    
    if (diferenca > 0) {
      const dias = Math.floor(diferenca / (1000 * 60 * 60 * 24));
      const horas = Math.floor((diferenca % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutos = Math.floor((diferenca % (1000 * 60 * 60)) / (1000 * 60));
      const segundos = Math.floor((diferenca % (1000 * 60)) / 1000);
      
      setTempoRestante({ dias, horas, minutos, segundos });
    } else {
      setTempoRestante({ dias: 0, horas: 0, minutos: 0, segundos: 0 });
    }
  };

  useEffect(() => {
    calcularTempoRestante();
    const interval = setInterval(calcularTempoRestante, 1000);
    
    return () => clearInterval(interval);
  }, []);

  const handleNomeChange = (nome) => {
    setNomeConvidado(nome);
    
    if (nome.trim()) {
      const pessoas = obterPessoasDisponiveis(nome.toLowerCase());
      
      if (pessoas.length > 0) {
        setDependentesDisponiveis(pessoas);
        setNomeValido(true);
        
        const confirmacaoExistente = verificarConfirmacaoExistente(nome.toLowerCase());
        if (confirmacaoExistente) {
          setJaConfirmado(true);
          setDadosConfirmacaoExistente(confirmacaoExistente);
          setTelefone(confirmacaoExistente.telefone || "");
          setObservacoes(confirmacaoExistente.observacoes || "");
          
          // Carregar confirmações individuais de cada pessoa
          const confirmacoesPessoas = {};
          pessoas.forEach(pessoa => {
            if (pessoa.tipo === "convidado") {
              // Para o convidado principal, usar o campo 'principal'
              confirmacoesPessoas[pessoa.id] = confirmacaoExistente.principal === 1 ? "Vou comparecer" : "Não poderei";
            } else {
              // Para dependentes, usar o campo 'dependentes'
              confirmacoesPessoas[pessoa.id] = (confirmacaoExistente.dependentes && confirmacaoExistente.dependentes[pessoa.id] === 1) ? "Vou comparecer" : "Não poderei";
            }
          });
          setPessoasConfirmacao(confirmacoesPessoas);
        } else {
          setJaConfirmado(false);
          setDadosConfirmacaoExistente(null);
          setTelefone("");
          setObservacoes("");
          
          // Inicializar todas as pessoas como "Vou comparecer"
          const confirmacoesIniciais = {};
          pessoas.forEach(pessoa => {
            confirmacoesIniciais[pessoa.id] = "Vou comparecer";
          });
          setPessoasConfirmacao(confirmacoesIniciais);
        }
      } else {
        setDependentesDisponiveis([]);
        setPessoasConfirmacao({});
        setJaConfirmado(false);
        setDadosConfirmacaoExistente(null);
        setNomeValido(false);
      }
    } else {
      setDependentesDisponiveis([]);
      setPessoasConfirmacao({});
      setJaConfirmado(false);
      setDadosConfirmacaoExistente(null);
      setNomeValido(false);
    }
  };

  useEffect(() => {
    if (open && firstFieldRef.current) firstFieldRef.current.focus();
  }, [open]);

  const handlePessoaConfirmacaoChange = (pessoaId, opcao) => {
    if (jaConfirmado) return;
    
    setPessoasConfirmacao(prev => ({
      ...prev,
      [pessoaId]: opcao
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (jaConfirmado) {
      alert("Você já confirmou sua presença anteriormente!");
      return;
    }

    if (!nomeValido) {
      alert("Nome não encontrado na lista de convidados. Verifique se digitou corretamente ou entre em contato com os noivos.");
      return;
    }

    const dadosConfirmacao = {
      principal: 0, // Será definido baseado na confirmação do convidado principal
      dependentes: {},
      telefone: telefone,
      observacoes: observacoes
    };

    // Processar confirmações de cada pessoa
    dependentesDisponiveis.forEach(pessoa => {
      const opcaoPessoa = pessoasConfirmacao[pessoa.id] || "Vou comparecer";
      const vaiComparecer = opcaoPessoa === "Vou comparecer" ? 1 : 0;
      
      if (pessoa.tipo === "convidado") {
        // Para o convidado principal
        dadosConfirmacao.principal = vaiComparecer;
      } else {
        // Para dependentes
        dadosConfirmacao.dependentes[pessoa.id] = vaiComparecer;
      }
    });

    const sucesso = salvarConfirmacao(nomeConvidado, dadosConfirmacao);
    
    if (sucesso) {
      setSent(true);
      setJaConfirmado(true);
      setDadosConfirmacaoExistente(dadosConfirmacao);
    }
  };

  const handleModalClick = (e) => {
    if (e.target === e.currentTarget) {
      setOpen(false);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && open) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('keydown', handleKeyDown);
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
    <div className="wedding-site">
      <header className="header">
        <div className="container">
          <div className="header-top">
            <button
              className="hamburger mobile-only"
              aria-label="Abrir menu"
              onClick={() => setMenuOpen(true)}
            >
              ☰
            </button>
            <nav className="nav">
              <a href="#home">Início</a>
              <a href="#story">História</a>
              <a href="#info">Informações</a>
              <a href="#gallery">Galeria</a>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate && onNavigate('presentes');
                }}
              >
                Presentes
              </a>
            </nav>
          </div>

          <button className="btn" onClick={() => setOpen(true)}>Confirmar presença</button>
        </div>
      </header>
      <WeddingMenu 
        open={menuOpen} 
        onClose={() => setMenuOpen(false)}
        onNavigate={onNavigate}
        onConfirmPresence={() => setOpen(true)}
      />

      {/* Hero Section */}
      <section 
        id="home" 
        className="hero"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${img1})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="hero-content">
          <p className="kicker">CELEBRAÇÃO DO AMOR</p>
          <h1 className="title">André & Marilene</h1>
          <div className="hero-buttons">
            <button className="btn" onClick={() => setOpen(true)}>Confirmar Presença</button>
            <a href="#info" className="btn ghost">Ver Detalhes</a>
          </div>
          <div className="hero-extra mobile-only">
            <button className="btn" onClick={(e) => { e.preventDefault(); onNavigate && onNavigate('presentes'); }}>Presentes</button>
          </div>
        </div>
      </section>

      {/* Countdown Section */}
      <section className="countdown-section">
        <div className="container">
          <div className="countdown-grid">
            <div className="countdown-item">
              <div className="countdown-number">{tempoRestante.dias}</div>
              <div className="countdown-label">Dias</div>
            </div>
            <div className="countdown-item">
              <div className="countdown-number">{tempoRestante.horas}</div>
              <div className="countdown-label">Horas</div>
            </div>
            <div className="countdown-item">
              <div className="countdown-number">{tempoRestante.minutos}</div>
              <div className="countdown-label">Minutos</div>
            </div>
            <div className="countdown-item">
              <div className="countdown-number">{tempoRestante.segundos}</div>
              <div className="countdown-label">Segundos</div>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section id="story" className="story-section">
        <div className="container">
          <div className="story-content">
            <div className="leaf-decoration leaf-left">🍃</div>
            <div className="leaf-decoration leaf-right">🍃</div>
            <h2 className="story-title">Nossa História</h2>
            <p className="story-text">
              Há vinte e nove anos, o destino uniu André e Marilene em um cenário cheio de significado: uma escola. O que começou como uma amizade sincera floresceu em um amor profundo — 
              um amor que se fez companheirismo, respeito e sonhos compartilhados.
              Desde então, caminharam lado a lado, transformando cada desafio em aprendizado e cada conquista em motivo de gratidão. Juntos, construíram uma linda família: Victor Hugo e 
              Maria Eduarda, frutos desse amor que cresceu e se fortaleceu com o tempo, tornando-se o maior presente que a vida poderia oferecer.
              Em 2006, oficializaram no papel aquilo que já vivia em seus corações. Hoje, com quatro netos e uma história marcada pela fé, cumplicidade e ternura, André e Marilene se preparam para um novo e inesquecível capítulo.
              No dia <strong>06 de dezembro de 2025</strong>, diante de Deus, vão celebrar uma vida inteira de amor — um amor que floresceu, criou raízes e continua a crescer, forte e sereno, como um jardim eterno cultivado com carinho e esperança. 💚
            </p>
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section id="info" className="info-section">
        <div className="container">
          <h2 className="info-title">Informações</h2>
          <div className="info-cards">
            <div className="info-card">
              <div className="info-icon">📅</div>
              <h3 className="info-card-title">Data & Horário</h3>
              <p className="info-card-text">06/12/2025</p>
              <p className="info-card-text">18h30</p>
            </div>
            <div className="info-card">
              <div className="info-icon">⛪</div>
              <h3 className="info-card-title">Cerimônia</h3>
              <p className="info-card-text">Paróquia São Bento — QS 305 Conj. 1 Lote 1/4, Samambaia, Brasília - DF</p>
              <a className="info-card-text" href="https://maps.app.goo.gl/Gfyn22DaurCgcMMUA" target="_blank" rel="noopener noreferrer">Ver no mapa</a>
            </div>
            <div className="info-card">
              <div className="info-icon">🎉</div>
              <h3 className="info-card-title">Recepção</h3>
              <p className="info-card-text">Salão de Festas – Residencial Rio Paranã — Qd. 301 Conj. 01 Lote 06</p>
              <a className="info-card-text" href="https://maps.app.goo.gl/wYcSvJMxzDG1p2ca6" target="_blank" rel="noopener noreferrer">Ver no mapa</a>
            </div>
          </div>
        </div>
      </section>

      {/* Galeria Section */}
      <section id="gallery" className="gallery-section">
        <div className="container">
          <div className="gallery-header">
            <div className="leaf-decoration">🍃</div>
            <h2 className="gallery-title">Galeria de Fotos</h2>
            <p className="gallery-description">Registros especiais da nossa caminhada.</p>
          </div>

          <div className="gallery-grid" style={{ marginTop: 16 }}>
            {storyPhotos.map((p, idx) => (
              <div key={idx} className="gallery-photo-card" style={{ display: 'grid', gap: 8 }}>
                <img src={p.url} alt={`Foto ${idx + 1}`} style={{ width: '100%', borderRadius: 12 }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Rodapé */}
      <footer id="footer" className="footer">
        <div className="container">
          <div className="footer-brand">André & Marilene</div>
          <p className="footer-text">Com carinho, agradecemos sua presença.</p>
          {/* Removidos os botões do rodapé */}
          <div className="footer-links"></div>
        </div>
      </footer>

      {/* Modal */}
      {open && (
        <div className="modal" onClick={handleModalClick}>
          <div className="mcard">
            {!sent ? (
              <>
                <div className="modal-header">
                  <h3 className="modal-title">Confirmar Presença</h3>
                  <button className="close-btn" onClick={() => setOpen(false)}>✕</button>
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
                    ✅ Você já confirmou sua presença anteriormente! Os dados abaixo são apenas para visualização.
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label className="form-label">Seu nome</label>
                    <input 
                      ref={firstFieldRef} 
                      className="form-input" 
                      placeholder="Digite seu nome (ex: André, João, Maria, Carlos)" 
                      value={nomeConvidado}
                      onChange={(e) => handleNomeChange(e.target.value)}
                      required 
                      disabled={jaConfirmado}
                      style={{
                        borderColor: nomeConvidado.trim() && !nomeValido ? '#dc3545' : undefined
                      }}
                    />
                  </div>
                  
                  {nomeConvidado.trim() && !nomeValido && (
                    <div style={{
                      padding: '12px',
                      backgroundColor: '#F8D7DA',
                      border: '1px solid #F5C6CB',
                      borderRadius: '8px',
                      color: '#721C24',
                      fontSize: '14px',
                      marginBottom: '16px'
                    }}>
                      ❌ Nome não encontrado na lista de convidados. Verifique se digitou corretamente ou entre em contato com os noivos.
                    </div>
                  )}

                  {nomeValido && (
                    <div style={{
                      padding: '12px',
                      backgroundColor: '#D4EDDA',
                      border: '1px solid #C3E6CB',
                      borderRadius: '8px',
                      color: '#155724',
                      fontSize: '14px',
                      marginBottom: '16px'
                    }}>
                      ✅ Nome encontrado! {dependentesDisponiveis.length > 0 ? 'Confirme a presença de cada pessoa abaixo.' : 'Você pode confirmar sua presença.'}
                    </div>
                  )}
                  
                  {dependentesDisponiveis.length > 0 && (
                    <div className="form-group">
                      <label className="form-label">
                        Confirmação de presença ({Object.values(pessoasConfirmacao).filter(opcao => opcao === "Vou comparecer").length} de {dependentesDisponiveis.length} confirmados)
                      </label>
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
                        {dependentesDisponiveis.map(pessoa => (
                          <div key={pessoa.id} style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '12px', 
                            padding: '8px',
                            borderRadius: '6px',
                            backgroundColor: 'transparent',
                            opacity: jaConfirmado ? 0.6 : 1
                          }}>
                            <span style={{ 
                              fontWeight: 'normal',
                              color: '#2E2A27',
                              fontSize: '14px',
                              minWidth: '120px'
                            }}>
                              {pessoa.nome}
                            </span>
                            <select
                              value={pessoasConfirmacao[pessoa.id] || "Vou comparecer"}
                              onChange={(e) => handlePessoaConfirmacaoChange(pessoa.id, e.target.value)}
                              disabled={jaConfirmado}
                              style={{ 
                                padding: '6px 8px',
                                borderRadius: '4px',
                                border: '1px solid #EBD9CF',
                                backgroundColor: 'white',
                                fontSize: '14px',
                                color: '#2E2A27',
                                minWidth: '140px'
                              }}
                            >
                              <option value="Vou comparecer">Vou comparecer</option>
                              <option value="Não poderei">Não poderei</option>
                            </select>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="form-group">
                    <label className="form-label">Telefone (WhatsApp)</label>
                    <input 
                      className="form-input" 
                      placeholder="(61) 9 9999-9999" 
                      value={telefone}
                      onChange={(e) => setTelefone(e.target.value)}
                      disabled={jaConfirmado || !nomeValido}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Observações</label>
                    <textarea 
                      className="form-textarea" 
                      placeholder="Restrições alimentares, etc." 
                      value={observacoes}
                      onChange={(e) => setObservacoes(e.target.value)}
                      disabled={jaConfirmado || !nomeValido}
                    />
                  </div>
                  
                  <button 
                    className="submit-btn" 
                    type="submit"
                    disabled={jaConfirmado || !nomeValido}
                    style={{
                      opacity: (jaConfirmado || !nomeValido) ? 0.5 : 1,
                      cursor: (jaConfirmado || !nomeValido) ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {jaConfirmado ? 'Já confirmado' : !nomeValido ? 'Nome não encontrado' : 'Enviar confirmação'}
                  </button>
                  
                  <p style={{
                    fontSize: '12px',
                    color: '#8C857E',
                    marginTop: '8px',
                    textAlign: 'center'
                  }}>
                    Dica: digite seu nome para ver todas as pessoas do seu grupo.
                  </p>
                </form>
              </>
            ) : (
              <div style={{textAlign: 'center', padding: '24px 8px'}}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: '#E8F8EE',
                  border: '1px solid #BFE8CB',
                  display: 'grid',
                  placeItems: 'center',
                  fontSize: '28px',
                  color: '#2b8a3e',
                  margin: '0 auto'
                }}>✓</div>
                <h3 style={{marginTop: '12px', color: '#2D5016'}}>Confirmação enviada!</h3>
                <p style={{marginTop: '6px', color: '#8C857E'}}>Você receberá os detalhes por e‑mail/WhatsApp.</p>
                <button 
                  className="btn" 
                  style={{marginTop: '16px'}} 
                  onClick={() => { setSent(false); setOpen(false); }}
                >
                  Fechar
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
