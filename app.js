// Pelicans Perspective Script - Link fix for PDF buttons

// ----------- NAVIGATION SCROLL/HIGHLIGHT ----------- //
const nav = document.getElementById('nav');
const navLinks = document.querySelectorAll('.nav__link');
const sections = document.querySelectorAll('section');

function handleScroll() {
  if (window.scrollY > 40) nav.classList.add('scrolled');
  else nav.classList.remove('scrolled');

  sections.forEach(section => {
    const rect = section.getBoundingClientRect();
    const id = section.id;
    const link = document.querySelector(`.nav__link[href="#${id}"]`);
    if (rect.top <= 100 && rect.bottom >= 100) {
      navLinks.forEach(l => l.classList.remove('active'));
      if (link) link.classList.add('active');
    }
  });
}
window.addEventListener('scroll', handleScroll);

// Mobile nav
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
if (navToggle) navToggle.addEventListener('click', () => navMenu.classList.toggle('open'));

// Smooth scroll
function smoothScroll(e) {
  e.preventDefault();
  const id = this.getAttribute('href') ? this.getAttribute('href').substring(1) : this.dataset.scrollTo;
  const target = document.getElementById(id);
  if (target) window.scrollTo({ top: target.offsetTop - nav.offsetHeight, behavior: 'smooth' });
  navMenu.classList.remove('open');
}
navLinks.forEach(l => l.addEventListener('click', smoothScroll));
document.querySelector('[data-scroll-to="research"]').addEventListener('click', smoothScroll);

// Reveal
const io = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// Research docs
const researchGrid = document.getElementById('research-grid');
const fallback = { documents: [ { id: 'qcap_pi-1', title: 'The Participatory Universe: A Unified Field Theory of Consciousness-Mediated Reality', description: 'Unified field-theoretic framework integrating consciousness, quantum physics, and AI. Predicts coherence-modulated phenomena and proposes experimental tests.', file: 'QCAP_PI-1.pdf', type: 'pdf' }, { id: 'manifesto_2024', title: 'Pelicans Perspective Manifesto 2024', description: 'A visionary outline of radical synthesis across tech, philosophy, and consciousness, charting a path toward an AGI-human transcendental future.', file: 'manifesto_2024.pdf', type: 'pdf' } ] };

function renderDocs(data) {
  if (!data.documents) return;
  data.documents.forEach(doc => {
    const card = document.createElement('div');
    card.className = 'research__card reveal';

    const badge = document.createElement('span');
    badge.className = 'research__badge';
    badge.textContent = doc.type.toUpperCase();

    const title = document.createElement('h3');
    title.className = 'research__card-title';
    title.textContent = doc.title;

    const desc = document.createElement('p');
    desc.className = 'research__card-desc';
    desc.textContent = doc.description;

    const link = document.createElement('a');
    link.className = 'research__button';
    link.textContent = 'View PDF';
    link.href = `documents/${doc.file}`;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';

    card.append(badge, title, desc, link);
    researchGrid.appendChild(card);
    io.observe(card);
  });
}

fetch('docs.json')
  .then(r => { if (!r.ok) throw new Error('fail'); return r.json(); })
  .then(json => renderDocs(json))
  .catch(() => renderDocs(fallback));

// Particles
const canvas = document.getElementById('particles-canvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  const COUNT = 60;
  let particles = [];
  function resize() { canvas.width = innerWidth; canvas.height = innerHeight; }
  addEventListener('resize', resize); resize();
  class P { constructor() { this.reset(); }
    reset() { this.x=Math.random()*canvas.width; this.y=Math.random()*canvas.height; this.vx=(Math.random()-0.5)*0.4; this.vy=(Math.random()-0.5)*0.4; this.s=Math.random()*3+1; this.a=Math.random()*0.6+0.2; }
    u() { this.x+=this.vx; this.y+=this.vy; if(this.x<0||this.x>canvas.width||this.y<0||this.y>canvas.height) this.reset(); }
    d() { ctx.beginPath(); ctx.arc(this.x,this.y,this.s,0,Math.PI*2); ctx.fillStyle=`rgba(0,216,255,${this.a})`; ctx.fill(); }
  }
  for(let i=0;i<COUNT;i++) particles.push(new P());
  (function animate(){ ctx.clearRect(0,0,canvas.width,canvas.height); particles.forEach(p=>{p.u();p.d();}); requestAnimationFrame(animate); })();
}
