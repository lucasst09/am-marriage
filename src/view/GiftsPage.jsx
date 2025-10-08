import "../css/weddingSite/WeddingSite.css";

export default function GiftsPage({ onNavigate }) {
  const pixKey = "andre.marilene@email.com";
  const cotas = [
    { titulo: "1 noite aconchegante", valor: "R$ 250,00", descricao: "Ajude com a hospedagem" },
    { titulo: "Jantar romântico", valor: "R$ 180,00", descricao: "Um brinde ao amor!" },
    { titulo: "Passeio especial", valor: "R$ 120,00", descricao: "Momento inesquecível" },
    { titulo: "Transporte", valor: "R$ 80,00", descricao: "Para chegar aos destinos" }
  ];
  const copyText = (text) => { navigator.clipboard?.writeText(text).catch(() => {}); };

  return (
    <div className="wedding-site">
      <header className="header">
        <div className="container">
          <div className="brand">A & M</div>
          <nav className="nav">
            <a href="#" onClick={(e) => { e.preventDefault(); onNavigate && onNavigate('home'); }}>Início</a>
          </nav>
        </div>
      </header>

      <section className="gifts-section">
        <div className="container">
          <div className="gifts-header">
            <div className="leaf-decoration">🍃</div>
            <h2 className="gifts-title">Lista de Presentes</h2>
            <p className="gifts-description">Sua presença é o maior presente, mas se desejar contribuir com nossa Lua de Mel, ficaremos muito gratos!</p>
          </div>

          <div className="gifts-grid">
            <div className="gift-card">
              <h3 className="gift-card-title">Contribua via Pix</h3>
              <p className="pix-key">Chave Pix</p>
              <p className="pix-key-value">{pixKey}</p>
              <div className="gift-actions">
                <button className="btn" onClick={() => copyText(pixKey)}>Copiar chave Pix</button>
              </div>
            </div>

            <div className="gift-card">
              <h3 className="gift-card-title">QR Code Pix</h3>
              <div className="qr-placeholder">QR Code Pix</div>
              <p className="gift-hint">Abra o app do seu banco e aponte para o QR</p>
            </div>
          </div>

          <h3 className="gifts-subtitle">Escolha uma cota (opcional)</h3>
          <div className="cotas-grid">
            {cotas.map((cota, i) => (
              <div key={i} className="gift-card">
                <div className="gift-card-head">
                  <span className="gift-title">{cota.titulo}</span>
                  <span className="gift-price">{cota.valor}</span>
                </div>
                <p className="gift-description">{cota.descricao}</p>
                <div className="gift-actions">
                  <button className="btn" onClick={() => copyText(pixKey)}>Copiar chave Pix</button>
                  <button className="btn ghost" onClick={() => copyText(`${cota.titulo} - ${cota.valor} - ${cota.descricao}`)}>Copiar descrição</button>
                </div>
              </div>
            ))}
          </div>

          <p className="gifts-footnote">Sua contribuição é totalmente opcional. Obrigado pelo carinho! 💚</p>
        </div>
      </section>
    </div>
  );
}