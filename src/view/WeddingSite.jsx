import { useEffect, useRef, useState } from "react";
import "../css/weddingSite/WeddingSite.css";
import { obterPessoasDisponiveis, verificarConfirmacaoExistente, salvarConfirmacao } from "../data/mockData.js";
import carroImage from "../assets/img/carro.jpg";
import img1 from "../assets/img/image1.jpg";

export default function WeddingSite({ onNavigate, storyPhotos }) {
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
  const [nomeValido, setNomeValido] = useState(false);
  const [tempoRestante, setTempoRestante] = useState({ dias: 590, horas: 0, minutos: 8, segundos: 46 });
  const firstFieldRef = useRef(null);
  const audioRef = useRef(null);
  const pixKey = "andre.marilene@email.com";
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
        const dependentes = pessoas.filter(pessoa => pessoa.tipo === "dependente");
        setDependentesDisponiveis(dependentes);
        setDependentesSelecionados([]);
        setNomeValido(true);
        
        const confirmacaoExistente = verificarConfirmacaoExistente(nome.toLowerCase());
        if (confirmacaoExistente) {
          setJaConfirmado(true);
          setDadosConfirmacaoExistente(confirmacaoExistente);
          setTelefone(confirmacaoExistente.telefone || "");
          setObservacoes(confirmacaoExistente.observacoes || "");
          setOpcao(confirmacaoExistente.principal === 1 ? "Vou comparecer" : "Não poderei");
          
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
        setNomeValido(false);
      }
    } else {
      setDependentesDisponiveis([]);
      setDependentesSelecionados([]);
      setJaConfirmado(false);
      setDadosConfirmacaoExistente(null);
      setNomeValido(false);
    }
  };

  useEffect(() => {
    if (open && firstFieldRef.current) firstFieldRef.current.focus();
  }, [open]);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    a.loop = true;
    a.muted = true;
    a.volume = 0.25;
    const play = () => a.play().catch(() => {});
    const unmuteAndPlay = () => { a.muted = false; play(); };
    play();
    const events = ['click','touchstart','pointerdown','keydown'];
    events.forEach(ev => window.addEventListener(ev, unmuteAndPlay, { once: true }));
    return () => { events.forEach(ev => window.removeEventListener(ev, unmuteAndPlay)); };
  }, []);

  const toggleDependente = (dependente) => {
    if (jaConfirmado) return;
    
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

    if (!nomeValido) {
      alert("Nome não encontrado na lista de convidados. Verifique se digitou corretamente ou entre em contato com os noivos.");
      return;
    }

    const dadosConfirmacao = {
      principal: opcao === "Vou comparecer" ? 1 : 0,
      dependentes: {},
      telefone: telefone,
      observacoes: observacoes
    };

    dependentesDisponiveis.forEach(dep => {
      dadosConfirmacao.dependentes[dep.id] = dependentesSelecionados.some(d => d.id === dep.id) ? 1 : 0;
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
      <audio ref={audioRef} src="/ceu-de-santo-amaro.mp3" autoPlay preload="auto" loop playsInline muted />
      {/* Header */}
      <header className="header">
        <div className="container">
          <div className="brand">A & M</div>
          <nav className="nav">
            <a href="#home">Início</a>
            <a href="#story">História</a>
            <a href="#info">Informações</a>
            <a href="#gallery">Galeria</a>
            <a href="#" onClick={(e) => { e.preventDefault(); onNavigate && onNavigate('presentes'); }}>Presentes</a>
          </nav>
          <button className="btn" onClick={() => setOpen(true)}>Confirmar presença</button>
        </div>
      </header>

      {/* Hero Section */}
      <section 
        id="home" 
        className="hero"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${img1})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
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
              Há 29 anos, André e Marilene se encontraram em um lugar especial: uma escola. Foi ali que nasceu uma amizade sincera, que com o tempo floresceu em amor, companheirismo e sonhos compartilhados.
              Desde então, viveram juntos inúmeras histórias, superaram desafios e construíram uma linda família. Victor Hugo e Maria Eduarda são parte desse amor que cresceu e se fortaleceu ao longo dos anos 
              — o maior presente que a vida poderia lhes dar.
              Em 2006, oficializaram a união no civil, celebrando o que já existia no coração. Hoje, com quatro netos e uma trajetória marcada por fé, cumplicidade e carinho, 
              André e Marilene se preparam para viver um novo capítulo: no dia 06 de dezembro de 2025, vão celebrar diante de Deus tudo o que construíram juntos.
              Uma história de amor que floresceu e continua a crescer, com raízes firmes e eternas. 💚
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
          <div className="footer-links">
            <a href="#home">Início</a>
            <a href="#gallery">Galeria</a>
            <a href="#info">Informações</a>
          </div>
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
                      ✅ Nome encontrado! {dependentesDisponiveis.length > 0 ? 'Selecione seus acompanhantes abaixo.' : 'Você pode confirmar sua presença.'}
                    </div>
                  )}
                  
                  {dependentesDisponiveis.length > 0 && (
                    <div className="form-group">
                      <label className="form-label">Acompanhantes que irão comparecer ({dependentesSelecionados.length})</label>
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
                                accentColor: '#2D5016'
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
                  
                  <div className="form-group">
                    <label className="form-label">Opção</label>
                    <select 
                      className="form-select"
                      value={opcao}
                      onChange={(e) => setOpcao(e.target.value)}
                      disabled={jaConfirmado || !nomeValido}
                    >
                      <option>Vou comparecer</option>
                      <option>Não poderei</option>
                    </select>
                  </div>
                  
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
                    Dica: digite seu nome para ver seus acompanhantes disponíveis.
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
