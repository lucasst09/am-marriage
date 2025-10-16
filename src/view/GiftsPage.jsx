import "../css/weddingSite/WeddingSite.css";

export default function GiftsPage({ onNavigate }) {
  const pixKey = "(61)99868-5446";
  const PIX_CODIGO_CINEMA_BRINDE = "00020126360014br.gov.bcb.pix0114+55619986854465204000053039865406100.005802BR5924Marilene Sebastiao de Ol6009Sao Paulo610901227-20062230519daqr2562604928207276304A5C1";
  const PIX_CODIGO_CAFE = "00020126360014br.gov.bcb.pix0114+55619986854465204000053039865406120.005802BR5924Marilene Sebastiao de Ol6009Sao Paulo610901227-20062230519daqr2562604922558566304DA8E";
  const PIX_CODIGO_PIQUENIQUE = "00020126360014br.gov.bcb.pix0114+55619986854465204000053039865406150.005802BR5924Marilene Sebastiao de Ol6009Sao Paulo610901227-20062230519daqr2562604925133936304DA7D";
  const PIX_CODIGO_SPA = "00020126360014br.gov.bcb.pix0114+55619986854465204000053039865406180.005802BR5924Marilene Sebastiao de Ol6009Sao Paulo610901227-20062230519daqr2562604927230756304FC28";
  const PIX_CODIGO_JANTAR = "00020126360014br.gov.bcb.pix0114+55619986854465204000053039865406200.005802BR5924Marilene Sebastiao de Ol6009Sao Paulo610901227-20062230519daqr25626049249771063049A47";
  const PIX_CODIGO_ENSAIO = "00020126360014br.gov.bcb.pix0114+55619986854465204000053039865406250.005802BR5924Marilene Sebastiao de Ol6009Sao Paulo610901227-20062230519daqr2562604925319096304DCD1";
  const PIX_CODIGO_RESORT = "00020126360014br.gov.bcb.pix0114+55619986854465204000053039865406300.005802BR5924Marilene Sebastiao de Ol6009Sao Paulo610901227-20062230519daqr2562604925656936304273B";
  const cotas = [
    { titulo: "Uma noite no resort", valor: "R$ 300", descricao: "Contribua para uma noite de descanso e amor à beira-mar.", imagem: "/resort.png" },
    { titulo: "Ensaio fotográfico", valor: "R$ 250", descricao: "Ajude-nos a eternizar nossos melhores momentos nesta viagem.", imagem: "/ensaio.png" },
    { titulo: "Um jantar romântico", valor: "R$ 200", descricao: "Ajude a criar um momento de celebração sob as estrelas.", imagem: "/jantar.png" },
    { titulo: "Dia de Spa a dois", valor: "R$ 180", descricao: "Ajude-nos a viver um momento simples e especial, celebrando o amor com a natureza ao redor.", imagem: "/spa-a-dois.png" },
    { titulo: "Piquenique ao pôr do sol", valor: "R$ 150", descricao: "Ajude-nos a viver um momento simples e especial, celebrando o amor com a natureza ao redor.", imagem: "/piquenique.png" },
    { titulo: "Café da manhã a dois", valor: "R$ 120", descricao: "Contribua para que o casal desfrute de uma manhã tranquila, com boas risadas e muito carinho.", imagem: "/cafe-da-manha.png" },
    { titulo: "Brinde ao amor", valor: "R$ 100", descricao: "Participe deste momento simbólico e ajude-nos a brindar ao início de uma nova etapa da nossa história.", imagem: "/brinde-ao-amor.png" },
    { titulo: "Sessão de cinema a dois", valor: "R$ 100", descricao: "Ajude-nos a viver uma noite especial de filmes, pipoca e muitos abraços — um momento simples, mas cheio de amor.", imagem: "/cinema.png" }
  ];
  // Substitua a função de copiar por esta versão com fallback
  const copyText = async (text) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return;
      }
    } catch (_) {}
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    try { document.execCommand('copy'); } catch (_) {}
    document.body.removeChild(textarea);
  };

  return (
    <div className="wedding-site">
      <header className="header">
        <div className="container">
          <button
            className="mobile-home-btn mobile-only"
            aria-label="Ir para Início"
            onClick={() => onNavigate && onNavigate('home')}
          >
            Início
          </button>
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
            <h2 className="gifts-title">Presenteie com Amor</h2>
            <p className="gifts-description">
              Nossa maior alegria é celebrar este momento ao lado das pessoas que amamos. Mais do que presentes, desejamos compartilhar sorrisos, abraços e a presença de quem faz parte da nossa história.
              Mas, se desejar nos abençoar com algo especial, você pode contribuir com uma experiência inesquecível: nossa viagem de celebração em Ilhéus, na Bahia.
            </p>
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
              <img src="/pix-qr.png" alt="QR Code Pix" className="qr-image" />
              <p className="gift-hint">Abra o app do seu banco e aponte para o QR</p>
            </div>
          </div>

          <h3 className="gifts-subtitle">✨ Cotas de Amor</h3>
          <p className="gifts-note">(cada contribuição ajuda a tornar este momento ainda mais especial)</p>
          <div className="cotas-grid">
            {cotas.map((cota, i) => (
              <div key={i} className="gift-card">
                <div className="gift-image">
                  {cota.imagem ? (
                    <img src={cota.imagem} alt={`Imagem: ${cota.titulo}`} />
                  ) : null}
                </div>
                <div className="gift-card-head">
                  <span className="gift-title">{cota.titulo}</span>
                  <span className="gift-price">{cota.valor}</span>
                </div>
                <p className="gift-description">{cota.descricao}</p>
                <div className="gift-actions">
                  <button
                    className="btn"
                    onClick={() =>
                      copyText(
                        cota.titulo === "Café da manhã a dois"
                          ? PIX_CODIGO_CAFE
                          : (cota.titulo === "Sessão de cinema a dois" || cota.titulo === "Brinde ao amor")
                            ? PIX_CODIGO_CINEMA_BRINDE
                            : (cota.titulo === "Piquenique ao pôr do sol")
                              ? PIX_CODIGO_PIQUENIQUE
                              : (cota.titulo === "Dia de Spa a dois" || cota.titulo === "Dia de spa a dois" || cota.titulo === "Dia de SPA a dois")
                                ? PIX_CODIGO_SPA
                                : (cota.titulo === "Um jantar romântico")
                                  ? PIX_CODIGO_JANTAR
                                  : (cota.titulo === "Ensaio fotográfico")
                                    ? PIX_CODIGO_ENSAIO
                                    : (cota.titulo === "Uma noite no resort")
                                      ? PIX_CODIGO_RESORT
                                      : pixKey
                      )
                    }
                  >
                    Copiar chave Pix
                  </button>
                  <button className="btn ghost" onClick={() => copyText(cota.descricao)}>Copiar descrição</button>
                </div>
              </div>
            ))}
          </div>

          <p className="gifts-footnote">Sua presença é ver você conosco neste dia tão importante. Obrigado!</p>
        </div>
      </section>
    </div>
  );
}