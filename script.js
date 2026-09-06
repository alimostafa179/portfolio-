// ---- Avatar fallback (moved out of inline HTML for CSP compliance) ----
(function () {
  const img = document.getElementById('avatarImg');
  if (!img) return;
  img.addEventListener('error', () => {
    img.style.display = 'none';
    const fallback = img.nextElementSibling;
    if (fallback) fallback.style.display = 'flex';
  });
})();

// ---- Dark / light theme toggle ----
(function () {
  const toggle = document.getElementById('themeToggle');
  const saved = localStorage.getItem('theme');
  if (saved === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
    if (toggle) toggle.textContent = '☀️';
  }
  if (!toggle) return;
  toggle.addEventListener('click', () => {
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    if (isLight) {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'dark');
      toggle.textContent = '🌙';
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
      toggle.textContent = '☀️';
    }
  });
})();

// ---- Particle network background ----
(function () {
  const canvas = document.getElementById('particles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let w, h, particles;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }

  function makeParticles() {
    const count = Math.min(70, Math.floor((w * h) / 18000));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
    }));
  }

  function step() {
    ctx.clearRect(0, 0, w, h);
    particles.forEach((p) => {
      if (!reduceMotion) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
      }
    });
    for (let i = 0; i < particles.length; i++) {
      const a = particles[i];
      ctx.beginPath();
      ctx.arc(a.x, a.y, 1.6, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(154,151,174,0.55)';
      ctx.fill();
      for (let j = i + 1; j < particles.length; j++) {
        const b = particles[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 130) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(57,255,136,${0.12 * (1 - dist / 130)})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }
    if (!reduceMotion) requestAnimationFrame(step);
  }

  resize();
  makeParticles();
  step();
  window.addEventListener('resize', () => { resize(); makeParticles(); });
})();

// ---- Cursor spotlight (pointer devices only) ----
(function () {
  const spotlight = document.getElementById('spotlight');
  if (!spotlight || !window.matchMedia('(pointer: fine)').matches) return;
  window.addEventListener('mousemove', (e) => {
    spotlight.style.setProperty('--x', `${e.clientX}px`);
    spotlight.style.setProperty('--y', `${e.clientY}px`);
    spotlight.classList.add('active');
  });
  window.addEventListener('mouseout', (e) => {
    if (!e.relatedTarget) spotlight.classList.remove('active');
  });
})();

// ---- Magnetic buttons + 3D project tilt (pointer devices only) ----
(function () {
  if (!window.matchMedia('(pointer: fine)').matches) return;

  document.querySelectorAll('.btn').forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
      const r = btn.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      btn.style.transform = `translate(${x * 0.15}px, ${y * 0.35}px)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
  });

  document.querySelectorAll('.project').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `translateX(8px) rotateX(${py * -4}deg) rotateY(${px * 6}deg)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });
})();

// ---- Welcome splash screen ----
const splash = document.getElementById('splash');
const hero = document.getElementById('hero');
document.body.style.overflow = 'hidden';

function startTypewriter() {
  const typedEl = document.getElementById('typedRole');
  if (!typedEl) return;
  const fullText = 'Junior Frontend Developer | Computer Science Student';
  let i = 0;
  const type = () => {
    if (i <= fullText.length) {
      typedEl.textContent = fullText.slice(0, i);
      i++;
      setTimeout(type, 35);
    }
  };
  type();
}

function burstEffect() {
  const colors = ['#39FF88', '#FFD23F', '#FF2E9A'];
  for (let i = 0; i < 24; i++) {
    const dot = document.createElement('div');
    dot.className = 'burst-dot';
    const angle = (Math.PI * 2 * i) / 24;
    const dist = 120 + Math.random() * 140;
    dot.style.setProperty('--dx', `${Math.cos(angle) * dist}px`);
    dot.style.setProperty('--dy', `${Math.sin(angle) * dist}px`);
    dot.style.background = colors[i % colors.length];
    document.body.appendChild(dot);
    setTimeout(() => dot.remove(), 850);
  }
}

function hideSplash() {
  if (!splash || splash.classList.contains('hide')) return;
  burstEffect();
  splash.classList.add('hide');
  document.body.style.overflow = '';
  if (hero) hero.classList.add('play');
  startTypewriter();
  setTimeout(() => { splash.style.display = 'none'; }, 750);
}

if (splash) {
  splash.addEventListener('click', hideSplash);
  window.addEventListener('wheel', hideSplash, { once: true });
  window.addEventListener('touchstart', hideSplash, { once: true });
  setTimeout(hideSplash, 3200);
} else if (hero) {
  hero.classList.add('play');
  startTypewriter();
}

// ---- Highlights the nav link for the section currently in view ----
const sections = document.querySelectorAll('section[id], header.hero[id]');
const navLinks = document.querySelectorAll('nav a');

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinks.forEach((link) => {
        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
      });
    }
  });
}, { rootMargin: '-50% 0px -50% 0px' });

sections.forEach((section) => navObserver.observe(section));

// ---- Fades sections in as they scroll into view (once each) ----
const revealTargets = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

revealTargets.forEach((el) => revealObserver.observe(el));

// ---- Animate skill bars when scrolled into view ----
const skillFills = document.querySelectorAll('.reveal-fill');
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });
skillFills.forEach((el) => skillObserver.observe(el));

// ---- Scroll progress bar ----
const progressBar = document.getElementById('progressBar');
window.addEventListener('scroll', () => {
  const scrollTop = document.documentElement.scrollTop;
  const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  if (progressBar) progressBar.style.width = pct + '%';
});

// ---- Toast helper ----
function showToast(message) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toast._hideTimer);
  toast._hideTimer = setTimeout(() => toast.classList.remove('show'), 2600);
}

// ---- Contact form submission (Formspree) ----
(function () {
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  if (!form) return;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    status.textContent = 'Sending…';
    status.className = 'form-status';
    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      });
      if (response.ok) {
        status.textContent = 'Message sent — thanks! I\'ll get back to you soon.';
        status.className = 'form-status success';
        form.reset();
      } else {
        status.textContent = 'Something went wrong. Please try emailing me directly.';
        status.className = 'form-status error';
      }
    } catch (err) {
      status.textContent = 'Something went wrong. Please try emailing me directly.';
      status.className = 'form-status error';
    }
  });
})();

// ---- Email links: also copy the address, in case no mail app opens ----
document.querySelectorAll('a[href^="mailto:"]').forEach((link) => {
  link.addEventListener('click', () => {
    const email = link.getAttribute('href').replace('mailto:', '').split('?')[0];
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(email)
        .then(() => showToast(`Email copied: ${email}`))
        .catch(() => showToast(email));
    } else {
      showToast(email);
    }
  });
});
