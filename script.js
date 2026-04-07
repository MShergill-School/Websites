/* =============================================
   CUSTOM CURSOR
   ============================================= */
const cursor    = document.getElementById('cursor');
const cursorDot = document.getElementById('cursorDot');

let mouseX = 0, mouseY = 0;
let curX   = 0, curY   = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursorDot.style.left = mouseX + 'px';
  cursorDot.style.top  = mouseY + 'px';
});

function animateCursor() {
  curX += (mouseX - curX) * 0.12;
  curY += (mouseY - curY) * 0.12;
  cursor.style.left = curX + 'px';
  cursor.style.top  = curY + 'px';
  requestAnimationFrame(animateCursor);
}
animateCursor();

document.querySelectorAll('a, button, .skill-card, .achieve-card, .lang-card, .hobby-tags span').forEach(el => {
  el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
  el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
});

/* =============================================
   NAVBAR SCROLL + ACTIVE LINK
   ============================================= */
const navbar   = document.getElementById('navbar');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);

  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
  });
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === '#' + current);
  });
});

/* =============================================
   HAMBURGER MENU
   ============================================= */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

/* =============================================
   REVEAL ON SCROLL
   ============================================= */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el    = entry.target;
    const delay = (parseInt(el.dataset.delay) || 0) * 100;
    setTimeout(() => {
      el.classList.add('visible');
      // Trigger skill bars
      el.querySelectorAll('.skill-fill').forEach(bar => {
        bar.style.width = bar.dataset.width + '%';
      });
    }, delay);
    revealObserver.unobserve(el);
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* =============================================
   COUNTER ANIMATION
   ============================================= */
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.querySelectorAll('.stat-num').forEach(num => {
      const target = parseInt(num.dataset.target);
      let count = 0;
      const step  = target / 40;
      const timer = setInterval(() => {
        count += step;
        if (count >= target) { count = target; clearInterval(timer); }
        num.textContent = Math.floor(count);
      }, 30);
    });
    counterObserver.unobserve(entry.target);
  });
}, { threshold: 0.5 });

const statsEl = document.querySelector('.about-stats');
if (statsEl) counterObserver.observe(statsEl);

/* =============================================
   HERO GRID CANVAS
   ============================================= */
const canvas = document.getElementById('gridCanvas');
const ctx    = canvas.getContext('2d');
const grid   = 60;
let   time   = 0;
const mouse  = { x: -999, y: -999 };

function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

document.addEventListener('mousemove', e => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

function drawGrid() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const cols = Math.ceil(canvas.width  / grid) + 1;
  const rows = Math.ceil(canvas.height / grid) + 1;

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      const x  = i * grid;
      const y  = j * grid;
      const dx = x - mouse.x;
      const dy = y - mouse.y;
      const d  = Math.sqrt(dx * dx + dy * dy);
      const wave = (Math.sin(time * 0.02 + i * 0.3 + j * 0.3) * 0.5 + 0.5) * 0.04;
      let alpha  = 0.06 + wave;
      if (d < 200) alpha += (1 - d / 200) * 0.35;

      ctx.beginPath();
      ctx.arc(x, y, 1.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,229,255,${alpha})`;
      ctx.fill();

      if (d < 160) {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.strokeStyle = `rgba(0,229,255,${(1 - d / 160) * 0.2})`;
        ctx.lineWidth   = 0.5;
        ctx.stroke();
      }
    }
  }
  time++;
  requestAnimationFrame(drawGrid);
}
drawGrid();

/* =============================================
   CONTACT FORM
   ============================================= */
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('.btn-primary');
    btn.textContent = 'Sending...';
    btn.disabled    = true;
    setTimeout(() => {
      contactForm.reset();
      formSuccess.style.display = 'block';
      btn.textContent = 'Send Message ↗';
      btn.disabled    = false;
      setTimeout(() => { formSuccess.style.display = 'none'; }, 5000);
    }, 1200);
  });
}

/* =============================================
   HERO PARALLAX
   ============================================= */
const heroContent = document.querySelector('.hero-content');
window.addEventListener('scroll', () => {
  if (!heroContent) return;
  const y = window.scrollY;
  if (y < window.innerHeight) {
    heroContent.style.transform = `translateY(${y * 0.25}px)`;
    heroContent.style.opacity   = String(1 - y / (window.innerHeight * 0.8));
  }
});
