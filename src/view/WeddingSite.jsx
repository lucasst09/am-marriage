import { useEffect, useRef, useState } from "react";
import "../css/weddingSite/WeddingSite.css";

export default function WeddingSite() {
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const firstFieldRef = useRef(null);

  useEffect(() => {
    if (open && firstFieldRef.current) firstFieldRef.current.focus();
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
          <div className="photo ph">Foto do casal (1920×1080)</div>
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
        <div className="modal" role="dialog" aria-modal="true" aria-label="Confirmar Presença">
          <div className="mcard">
            {!sent ? (
              <>
                <div className="row between center">
                  <h3 className="h3">Confirmar Presença</h3>
                  <button className="x" onClick={()=>setOpen(false)} aria-label="Fechar">✕</button>
                </div>
                <form onSubmit={(e)=>{e.preventDefault(); setSent(true);}}>
                  <label className="lbl">Seu nome
                    <input ref={firstFieldRef} className="inp" placeholder="Nome completo" required />
                  </label>
                  <div className="row gap">
                    <label className="lbl">Acompanhantes
                      <select className="inp"><option>0</option><option>1</option><option>2</option><option>3</option><option>4</option></select>
                    </label>
                    <label className="lbl">Opção
                      <select className="inp"><option>Vou comparecer</option><option>Não poderei</option></select>
                    </label>
                  </div>
                  <label className="lbl">Telefone (WhatsApp)
                    <input className="inp" placeholder="(61) 9 9999-9999" />
                  </label>
                  <label className="lbl">Observações
                    <textarea className="inp" rows={3} placeholder="Restrições alimentares, etc." />
                  </label>
                  <button className="btn full" type="submit">Enviar confirmação</button>
                  <p className="hint">Dica: dá para limitar por lista de convidados/código ou integrar com Google Forms.</p>
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
