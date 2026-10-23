import { useState } from 'react';
import IntroOverlay from './IntroOverlay';
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  ChevronRight,
  CircleHelp,
  Cog,
  Droplets,
  Gauge,
  MapPin,
  Menu,
  MessageCircle,
  Phone,
  ShieldCheck,
  ShoppingBag,
  Truck,
  Wrench,
  X,
  Zap,
} from 'lucide-react';

const services = [
  { icon: Cog, title: 'Câmbio', description: 'Revisão e manutenção de câmbios manuais e automatizados.', whatsappText: 'Olá! Preciso de serviço de CÂMBIO para meu caminhão. Pode me passar mais informações?' },
  { icon: Gauge, title: 'Diferencial', description: 'Diagnóstico preciso, revisão e reparo de diferenciais.', whatsappText: 'Olá! Preciso de serviço de DIFERENCIAL para meu caminhão. Pode me ajudar?' },
  { icon: Droplets, title: 'Válvulas de ar', description: 'Manutenção e reparos completos no sistema pneumático.', whatsappText: 'Olá! Preciso de manutenção nas VÁLVULAS DE AR do meu caminhão. Pode me atender?' },
  { icon: Zap, title: 'Elétrica', description: 'Serviços de manutenção elétrica para caminhões.', whatsappText: 'Olá! Preciso de serviço de ELÉTRICA para meu caminhão. Pode me passar os detalhes?' },
  { icon: ShieldCheck, title: 'Freios', description: 'Revisão e manutenção do sistema de freios.', whatsappText: 'Olá! Preciso de revisão nos FREIOS do meu caminhão. Pode me ajudar?' },
  { icon: Wrench, title: 'Embreagem', description: 'Troca, regulagem e manutenção de embreagens.', whatsappText: 'Olá! Preciso de serviço de EMBREAGEM para meu caminhão. Pode me orientar?' },
  { icon: Cog, title: 'Motores diesel', description: 'Manutenção completa ou parcial de motores diesel.', whatsappText: 'Olá! Preciso de manutenção no MOTOR DIESEL do meu caminhão. Pode me passar informações?' },
  { icon: ShoppingBag, title: 'Venda de peças', description: 'Peças novas e usadas para caminhões multimarcas.', whatsappText: 'Olá! Estou procurando PEÇAS para meu caminhão. Pode me mostrar o que vocês têm disponível?' },
];

const reasons = [
  'Diagnóstico transparente antes de qualquer serviço',
  'Equipe especializada em veículos pesados',
  'Peças novas e usadas com procedência',
  'Atendimento com horário marcado',
];

const galleryItems = [
  { image: '/5.jpeg', title: 'Válvula três posição câmbio MB', category: 'Peças e componentes' },
  { image: '/1.jpeg', title: 'Motor FH', category: 'Motores diesel' },
  { image: '/2.jpeg', title: 'Câmbios à base de troca', category: 'Transmissões' },
  { image: '/4.jpeg', title: 'Teste de servo ECA', category: 'Diagnóstico e testes' },
  { image: '/3.jpeg', title: 'Caixa GRS 905', category: 'Transmissões' },
  { image: '/7.jpeg', title: 'Revisão de motor 1519', category: 'Manutenção diesel' },
  { image: '/6.jpeg', title: 'Revisão de tampa de câmbio FH', category: 'Transmissões' },
];

function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  const waUrl = (message: string) => 'https://wa.me/5547996733021?text=' + encodeURIComponent(message);
  const whatsappUrl = waUrl('Olá! Gostaria de agendar um atendimento para meu caminhão.');

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <div className="site-shell">
      <IntroOverlay />
      <header className="site-header">
        <div className="container header-inner">
          <a className="brand" href="#inicio" aria-label="Mecânica Diesel e Auto Peças">
            <span className="brand-mark"><span /></span>
            <span className="brand-copy"><strong>MECÂNICA</strong><b>DIESEL</b><strong>E AUTO PEÇAS</strong></span>
          </a>
          <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}>
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <nav className={`main-nav ${menuOpen ? 'is-open' : ''}`}>
            <a href="#servicos" onClick={closeMenu}>Serviços</a>
            <a href="#sobre" onClick={closeMenu}>A oficina</a>
            <a href="#pecas" onClick={closeMenu}>Peças</a>
            <a href="#galeria" onClick={closeMenu}>Galeria</a>
            <a href="#contato" onClick={closeMenu}>Contato</a>
            <a className="nav-cta" href={whatsappUrl} target="_blank" rel="noopener noreferrer" onClick={closeMenu}><MessageCircle size={16} /> Falar no WhatsApp</a>
          </nav>
        </div>
      </header>

      <main>
        <section className="hero" id="inicio">
          <div className="hero-photo" />
          <div className="hero-overlay" />
          <div className="container hero-content">
            <div className="hero-eyebrow"><span /> ESPECIALISTAS EM VEÍCULOS PESADOS</div>
            <h1>Seu caminhão<br /><em>não pode parar.</em></h1>
            <p>Manutenção de confiança para manter sua estrada em movimento, com técnica, transparência e agilidade.</p>
            <div className="hero-actions">
              <a className="button button-primary" href={whatsappUrl} target="_blank" rel="noopener noreferrer">Falar no WhatsApp <ArrowRight size={18} /></a>
              <a className="button button-ghost" href="tel:+5547996733021"><Phone size={17} /> Falar com a oficina</a>
            </div>
            <div className="hero-proof"><BadgeCheck size={19} /><span>Atendimento profissional para caminhões multimarcas</span></div>
          </div>
          <div className="hero-stat"><strong>+25</strong><span>anos na área<br />5 de oficina própria</span></div>
        </section>

        <section className="trust-bar">
          <div className="container trust-inner">
            <span className="trust-label">SOLUÇÕES PARA O SEU CAMINHÃO</span>
            <div className="trust-items"><span><CheckCircle2 size={16} /> Serviço especializado</span><span><CheckCircle2 size={16} /> Diagnóstico confiável</span><span><CheckCircle2 size={16} /> Atendimento humano</span></div>
          </div>
        </section>

        <section className="section services-section" id="servicos">
          <div className="container">
            <div className="section-heading"><div><span className="section-kicker">O QUE FAZEMOS</span><h2>Conheça nossos<br /><em>serviços</em></h2></div><p>Da transmissão ao motor, a gente entende o que mantém seu caminhão rodando&nbsp; e resolve com responsabilidade.</p></div>
            <div className="service-grid">{services.map(({ icon: Icon, title, description, whatsappText }) => <a className="service-card" href={waUrl(whatsappText)} target="_blank" rel="noopener noreferrer" key={title}><span className="service-icon"><Icon size={22} /></span><h3>{title}</h3><p>{description}</p><span className="card-arrow"><ChevronRight size={17} /></span></a>)}</div>
          </div>
        </section>

        <section className="about-section" id="sobre">
          <div className="about-image"><div className="image-tag"><Truck size={18} /> FOCO EM VEÍCULOS PESADOS</div></div>
          <div className="about-content"><span className="section-kicker">A OFICINA</span><h2>Experiência que<br /><em>vira confiança.</em></h2><p>Na GV Mecânica Diesel, cada caminhão é tratado como parte do seu negócio. Nosso trabalho é entregar segurança, clareza e o cuidado que a sua operação precisa.</p><ul>{reasons.map((reason) => <li key={reason}><CheckCircle2 size={18} /> {reason}</li>)}</ul><a className="text-link" href="#contato">Conheça a oficina <ArrowRight size={17} /></a></div>
        </section>

        <section className="gallery-section" id="galeria"><div className="container"><div className="section-heading gallery-heading"><div><span className="section-kicker">POR DENTRO DA OFICINA</span><h2>Trabalho que<br /><em>fala por si.</em></h2></div><p>Alguns registros da nossa rotina, dos caminhões que passam por aqui e das peças que fazem tudo voltar a funcionar.</p></div><div className="gallery-grid">{galleryItems.map((item, index) => <figure className={`gallery-card gallery-card-${index + 1}`} key={item.image}><img src={item.image} alt={item.title} /><figcaption><span>{item.category}</span><strong>{item.title}</strong></figcaption></figure>)}</div></div></section>

        <section className="parts-section" id="pecas"><div className="container parts-inner"><div><span className="section-kicker light">AUTO PEÇAS</span><h2>Peça certa.<br /><em>Estrada tranquila.</em></h2><p>Encontre peças novas e usadas para caminhões, com orientação de quem conhece mecânica de verdade.</p><a className="button button-light" href="#contato">Consultar uma peça <ArrowRight size={17} /></a></div><div className="parts-art"><Cog className="gear gear-large" /><Cog className="gear gear-small" /></div></div></section>

        <section className="booking-section" id="agendamento"><div className="container booking-layout"><div className="booking-intro"><span className="section-kicker">HORA DE CUIDAR</span><h2>Fale com a<br /><em>oficina agora.</em></h2><p>Conte pra gente o que seu caminhão precisa. É só mandar uma mensagem no WhatsApp e a gente responde.</p><div className="booking-contact"><div className="contact-icon"><MessageCircle size={20} /></div><div><strong>Atendimento direto</strong><span>Resposta rápida pelo WhatsApp.</span></div></div></div><div className="booking-card whatsapp-card"><MessageCircle size={56} /><h3>Vamos conversar</h3><p>Mande uma mensagem no WhatsApp e marque o atendimento com a nossa equipe.</p><a className="button button-primary form-submit" href={whatsappUrl} target="_blank" rel="noopener noreferrer">Chamar no WhatsApp <ArrowRight size={17} /></a></div></div></section>

        <section className="emergency-section"><div className="container emergency-inner"><div className="emergency-icon"><CircleHelp size={27} /></div><div><span>PRECISOU DE AJUDA?</span><h3>Socorro e atendimento na oficina</h3></div><p>Com dia marcado, a gente se organiza para atender seu caminhão com mais rapidez.</p><a className="button button-dark" href={whatsappUrl} target="_blank" rel="noopener noreferrer">Falar no WhatsApp <ArrowRight size={17} /></a></div></section>

        <section className="location-section" id="localizacao"><div className="container"><div className="section-heading"><div><span className="section-kicker">ONDE ESTAMOS</span><h2>Venha nos<br /><em>visitar.</em></h2></div><div className="location-info"><div className="location-address"><MapPin size={20} /> <span>BR 280 - KM 31<br />Araquari, SC</span></div><a className="button button-primary" href="https://www.google.com/maps/search/?api=1&query=GV+Mecanica+Diesel+e+Auto+Pecas+BR+280+KM+31+Araquari+SC" target="_blank" rel="noopener noreferrer">Como chegar <ArrowRight size={17} /></a></div></div></div></section>
      </main>

      <footer className="site-footer" id="contato"><div className="container footer-top"><div className="brand footer-brand"><span className="brand-mark"><span /></span><span className="brand-copy"><strong>MECÂNICA</strong><b>DIESEL</b><strong>E AUTO PEÇAS</strong></span></div><div className="footer-column"><span>FALE COM A GENTE</span><a href="tel:+5547996733021"><Phone size={15} /> (47) 99673-3021</a><a href="https://wa.me/5547996733021"><MessageCircle size={15} /> WhatsApp</a></div><div className="footer-column"><span>ONDE ESTAMOS</span><p><MapPin size={15} /> BR 280 - KM 31<br />Araquari, SC</p></div><div className="footer-column"><span>HORÁRIO DE ATENDIMENTO</span><p>Segunda a sexta<br />07:40 às 12:00<br />13:30 às 18:00</p></div></div><div className="container footer-bottom"><span>© 2026 Mecânica Diesel e Auto Peças</span><span>Confiança para seguir em frente.</span></div></footer>
      <a className="whatsapp-float" href={whatsappUrl} target="_blank" rel="noopener noreferrer" aria-label="Falar no WhatsApp"><MessageCircle size={28} /></a>
    </div>
  );
}

export default App;
