/* =============================================
   ADARSH ENTERPRISE – script.js
   Festival & Party Promotional Website
   ============================================= */

// ---- AOS (Animate On Scroll) Init ----
AOS.init({
  duration: 700,
  easing: 'ease-out-cubic',
  once: true,
  offset: 60,
});

// ---- Sticky Navbar ----
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// ---- Hamburger Menu ----
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinks.classList.toggle('open');
});

// Close menu when a nav link is clicked
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navLinks.classList.remove('open');
  });
});

// ---- Typing Effect ----
const phrases = [
  'All Festival & Party Items Available',
  'Diwali • Holi • Eid • Independence Day',
  'Wholesale & Retail — Best Prices',
  'Your One-Stop Celebration Shop 🎊',
];
let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typedEl = document.getElementById('typed-text');

function type() {
  const current = phrases[phraseIndex];
  if (isDeleting) {
    typedEl.textContent = current.substring(0, charIndex - 1);
    charIndex--;
  } else {
    typedEl.textContent = current.substring(0, charIndex + 1);
    charIndex++;
  }

  let delay = isDeleting ? 40 : 65;

  if (!isDeleting && charIndex === current.length) {
    delay = 2200; // Pause at end
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
    delay = 400;
  }
  setTimeout(type, delay);
}
setTimeout(type, 800);

// ---- Animated Particles Background ----
(function createParticles() {
  const container = document.getElementById('particles');
  const colors = ['#ff6b1a', '#ffd93d', '#4ec9ff', '#ff4d9e', '#b47aff', '#00e676'];
  const count = 22;

  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.classList.add('particle');
    const size = Math.random() * 120 + 30;
    const color = colors[Math.floor(Math.random() * colors.length)];
    const left = Math.random() * 100;
    const duration = Math.random() * 18 + 12;
    const delay = Math.random() * 10;

    p.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${left}%;
      bottom: -${size}px;
      background: radial-gradient(circle, ${color}22, transparent 70%);
      animation-duration: ${duration}s;
      animation-delay: ${delay}s;
    `;
    container.appendChild(p);
  }
})();

// ---- Smooth Scroll for all anchor links ----
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ---- Active Nav Link Highlight on Scroll ----
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 120;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });
  navAnchors.forEach(a => {
    a.style.color = '';
    if (a.getAttribute('href') === `#${current}`) {
      a.style.color = 'var(--orange)';
    }
  });
});

// ---- Contact Form ----
const form = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

form.addEventListener('submit', function (e) {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const message = document.getElementById('message').value.trim();

  if (!name || !message) {
    // Shake animation on empty fields
    [document.getElementById('name'), document.getElementById('message')].forEach(el => {
      if (!el.value.trim()) {
        el.style.borderColor = '#ff4d9e';
        el.style.animation = 'shake 0.4s ease';
        setTimeout(() => {
          el.style.animation = '';
          el.style.borderColor = '';
        }, 500);
      }
    });
    return;
  }

  // Show success (no backend needed – this is a static promo site)
  const btn = form.querySelector('button[type="submit"]');
  btn.innerHTML = '<span>Sending...</span> <i class="fas fa-spinner fa-spin"></i>';
  btn.disabled = true;

  setTimeout(() => {
    formSuccess.style.display = 'block';
    form.reset();
    btn.innerHTML = '<span>Send Message</span> <i class="fas fa-paper-plane"></i>';
    btn.disabled = false;
    setTimeout(() => { formSuccess.style.display = 'none'; }, 5000);
  }, 1200);
});

// ---- Shake keyframe (inject via JS for simplicity) ----
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    20% { transform: translateX(-6px); }
    40% { transform: translateX(6px); }
    60% { transform: translateX(-4px); }
    80% { transform: translateX(4px); }
  }
`;
document.head.appendChild(shakeStyle);

// ---- Counter Animation for Hero Stats ----
function animateCounter(el, target, duration = 1800) {
  let start = 0;
  const step = target / (duration / 16);
  const timer = setInterval(() => {
    start += step;
    if (start >= target) {
      el.textContent = target + '+';
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(start) + '+';
    }
  }, 16);
}

// Trigger counter when hero is visible
const statNums = document.querySelectorAll('.stat-num');
const targets = [7, 500, 10];
let countersStarted = false;

const heroObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !countersStarted) {
      countersStarted = true;
      statNums.forEach((el, i) => {
        setTimeout(() => animateCounter(el, targets[i]), i * 200);
      });
    }
  });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) heroObserver.observe(heroStats);

// ---- Scroll-triggered glow on festival cards ----
const cardObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.festival-card').forEach(card => {
  cardObserver.observe(card);
});