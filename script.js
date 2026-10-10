/* ADARSH ENTERPRISE — interactive festival website
   Brand colour: #85B8BC
   Note: contact form opens WhatsApp; no backend is configured. */

(() => {
  "use strict";

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  // Scroll animation library (graceful fallback if CDN is unavailable)
  if (window.AOS) AOS.init({ duration: 750, easing: "ease-out-cubic", once: true, offset: 55 });

  // Sticky navbar
  const navbar = $("#navbar");
  const onScroll = () => {
    if (navbar) navbar.classList.toggle("scrolled", window.scrollY > 35);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Mobile menu
  const hamburger = $("#hamburger");
  const navLinks = $("#navLinks");
  if (hamburger && navLinks) {
    hamburger.addEventListener("click", () => {
      const open = navLinks.classList.toggle("open");
      hamburger.classList.toggle("active", open);
      hamburger.setAttribute("aria-expanded", String(open));
    });
    $$("a", navLinks).forEach(link => link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      hamburger.classList.remove("active");
      hamburger.setAttribute("aria-expanded", "false");
    }));
  }

  // Typing tagline
  const phrases = [
    "All Festival & Party Items Available",
    "Diwali • Holi • Eid • Independence Day",
    "Wholesale & Retail — Celebration Essentials",
    "Your One-Stop Celebration Shop 🎊"
  ];
  const typedEl = $("#typed-text");
  if (typedEl) {
    let phraseIndex = 0, charIndex = 0, deleting = false;
    const type = () => {
      const phrase = phrases[phraseIndex];
      charIndex += deleting ? -1 : 1;
      typedEl.textContent = phrase.slice(0, Math.max(0, charIndex));
      let delay = deleting ? 32 : 58;
      if (!deleting && charIndex >= phrase.length) { deleting = true; delay = 1900; }
      else if (deleting && charIndex <= 0) { deleting = false; phraseIndex = (phraseIndex + 1) % phrases.length; delay = 300; }
      window.setTimeout(type, delay);
    };
    window.setTimeout(type, 700);
  }

  // Advanced floating particles: glow dots + sparkles; theme-aware colours
  const particleContainer = $("#particles");
  if (particleContainer) {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const makeParticles = () => {
      particleContainer.replaceChildren();
      const theme = document.body.dataset.theme || "default";
      const palette = theme === "diwali" ? ["#ffe6a0", "#e7b95d", "#fff7d6"]
        : theme === "holi" ? ["#ff70b7", "#70e1ff", "#ffe36e", "#a8ff9e", "#c9a4ff"]
        : theme === "eid" ? ["#c7f4d8", "#e6d7a5", "#8ed8bd"]
        : ["#85B8BC", "#d9ffff", "#e7d6a2"];
      const count = reducedMotion ? 8 : 48;
      for (let i = 0; i < count; i++) {
        const particle = document.createElement("span");
        const sparkle = i % 3 === 0;
        particle.className = `particle${sparkle ? " sparkle" : ""}`;
        const size = sparkle ? 3 : 5 + Math.random() * 13;
        const color = palette[Math.floor(Math.random() * palette.length)];
        particle.style.cssText = `
          position:absolute; left:${Math.random() * 100}%; top:${Math.random() * 100}%;
          width:${size}px; height:${size}px; color:${color}; background:${color};
          border-radius:50%; opacity:${sparkle ? .8 : .2 + Math.random() * .28};
          box-shadow:0 0 ${sparkle ? 12 : 18}px ${color};
          animation:${reducedMotion ? "none" : `particleFloat ${12 + Math.random() * 22}s ${Math.random() * -20}s ease-in-out infinite alternate`};
          pointer-events:none;
        `;
        particleContainer.appendChild(particle);
      }
    };
    const style = document.createElement("style");
    style.textContent = `@keyframes particleFloat{0%{transform:translate3d(0,0,0) scale(.75)}50%{transform:translate3d(22px,-42px,0) scale(1.2)}100%{transform:translate3d(-18px,-80px,0) scale(.85)}}`;
    document.head.appendChild(style);
    makeParticles();
    window.addEventListener("festival-theme-change", makeParticles);
  }

  // Festival theme switcher
  $$(".theme-btn").forEach(button => {
    button.addEventListener("click", () => {
      const theme = button.dataset.theme || "default";
      document.body.dataset.theme = theme;
      $$(".theme-btn").forEach(btn => {
        const active = btn === button;
        btn.classList.toggle("active", active);
        btn.setAttribute("aria-pressed", String(active));
      });
      window.dispatchEvent(new Event("festival-theme-change"));
    });
  });

  // 3D card tilt on pointer devices
  const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (canHover && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    $$(".festival-card, .product-card, .why-card").forEach(card => {
      card.addEventListener("pointermove", event => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;
        card.style.transform = `perspective(900px) rotateX(${(0.5 - y) * 5}deg) rotateY(${(x - 0.5) * 5}deg) translateY(-5px)`;
      });
      card.addEventListener("pointerleave", () => { card.style.transform = ""; });
    });
  }

  // Active navigation highlight
  const sections = $$("section[id]");
  const navAnchors = $$(".nav-links a");
  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navAnchors.forEach(a => {
            const active = a.getAttribute("href") === `#${entry.target.id}`;
            a.classList.toggle("current", active);
            if (active) a.setAttribute("aria-current", "location");
            else a.removeAttribute("aria-current");
          });
        }
      });
    }, { rootMargin: "-25% 0px -65% 0px" });
    sections.forEach(section => sectionObserver.observe(section));
  }

  // Product search + category filter
  const searchInput = $("#productSearch");
  const productCards = $$(".product-card");
  const filterButtons = $$(".filter-btn");
  let activeFilter = "all";
  const filterProducts = () => {
    const query = (searchInput?.value || "").trim().toLowerCase();
    let visible = 0;
    productCards.forEach(card => {
      const matchesCategory = activeFilter === "all" || card.dataset.category === activeFilter;
      const matchesSearch = `${card.dataset.name || ""} ${card.textContent}`.toLowerCase().includes(query);
      const show = matchesCategory && matchesSearch;
      card.hidden = !show;
      if (show) visible++;
    });
    const empty = $("#noProducts");
    if (empty) empty.hidden = visible !== 0;
  };
  searchInput?.addEventListener("input", filterProducts);
  filterButtons.forEach(button => button.addEventListener("click", () => {
    activeFilter = button.dataset.filter || "all";
    filterButtons.forEach(btn => btn.classList.toggle("active", btn === button));
    filterProducts();
  }));

  // WhatsApp enquiry helper. Existing contact number is used.
  const whatsappNumber = "917607173905";
  const openWhatsApp = message => {
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };
  $$(".product-enquire").forEach(button => button.addEventListener("click", () => {
    const product = button.dataset.product || "a product";
    const festival = $("#festival")?.value || "Not specified";
    openWhatsApp(`Hello Adarsh Enterprise, I would like to enquire about: ${product}. Festival/Event: ${festival}. Please share availability and price.`);
  }));
  $$(".festival-card .card-btn").forEach(button => button.addEventListener("click", () => {
    const card = button.closest(".festival-card");
    if (!card) return;
    const festival = $("h3", card)?.textContent.trim() || "festival products";
    const select = $("#festival");
    if (select) {
      const option = [...select.options].find(o => o.text.toLowerCase().includes(festival.toLowerCase().split(" ")[0]));
      if (option) select.value = option.value || option.text;
    }
  }));

  // Gallery lightbox
  const lightbox = $("#lightbox");
  const lightboxImage = $("#lightboxImage");
  const closeLightbox = () => { if (lightbox) lightbox.hidden = true; document.body.style.overflow = ""; };
  $$(".gallery-item").forEach(item => item.addEventListener("click", () => {
    if (!lightbox || !lightboxImage) return;
    lightboxImage.src = item.dataset.full || $("img", item)?.src || "";
    lightboxImage.alt = $("img", item)?.alt || "Gallery image";
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
    $("#lightboxClose")?.focus();
  }));
  $("#lightboxClose")?.addEventListener("click", closeLightbox);
  lightbox?.addEventListener("click", event => { if (event.target === lightbox) closeLightbox(); });
  document.addEventListener("keydown", event => { if (event.key === "Escape") closeLightbox(); });

  // Contact form: validates fields and opens a prefilled WhatsApp enquiry.
  const form = $("#contactForm");
  if (form) {
    form.addEventListener("submit", event => {
      event.preventDefault();
      const name = $("#name")?.value.trim() || "";
      const phone = $("#phone")?.value.trim() || "";
      const festival = $("#festival")?.value || "Not specified";
      const message = $("#message")?.value.trim() || "";
      if (!name || !message) {
        form.reportValidity();
        return;
      }
      const formSuccess = $("#formSuccess");
      if (formSuccess) {
        formSuccess.textContent = "Opening WhatsApp with your enquiry…";
        formSuccess.style.display = "block";
      }
      openWhatsApp(`Hello Adarsh Enterprise,\nName: ${name}\nPhone: ${phone || "Not provided"}\nFestival/Event: ${festival}\nEnquiry: ${message}`);
    });
  }

  // Smooth anchor scrolling with fixed navbar offset
  $$('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", event => {
      const id = anchor.getAttribute("href");
      if (!id || id === "#") return;
      const target = $(id);
      if (target) {
        event.preventDefault();
        window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 82, behavior: "smooth" });
      }
    });
  });

  // Festive click effects: limited particles, short animations.
  const motionReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const lowPowerMode = window.matchMedia("(max-width: 600px)").matches ||
    (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4);
  const burstPalette = {
    default: ["#85B8BC", "#BCE8E9", "#E7D6A2", "#F8FFFF"],
    diwali: ["#E7D6A2", "#F8E7B6", "#BCE8E9", "#FFFFFF"],
    holi: ["#85B8BC", "#E7D6A2", "#BCE8E9", "#D8C6E8"],
    eid: ["#85B8BC", "#BCE8E9", "#E7D6A2", "#F8FFFF"]
  };
  const getBurstColors = () => burstPalette[document.body.dataset.theme] || burstPalette.default;
  let lastBurstAt = 0;

  function createFestiveBurst(x, y, count = 14) {
    if (motionReduced || Date.now() - lastBurstAt < 240) return;
    lastBurstAt = Date.now();
    const colors = getBurstColors();
    const symbols = ["✦", "✧", "✨", "·", "♥", "🎊"];
    const amount = lowPowerMode ? Math.min(7, count) : Math.min(18, count);
    for (let i = 0; i < amount; i++) {
      const particle = document.createElement("span");
      particle.className = "festive-burst-particle";
      particle.textContent = symbols[Math.floor(Math.random() * symbols.length)];
      particle.style.left = `${x}px`;
      particle.style.top = `${y}px`;
      particle.style.color = colors[Math.floor(Math.random() * colors.length)];
      particle.style.fontSize = `${11 + Math.random() * 10}px`;
      particle.style.setProperty("--dx", `${Math.round((Math.random() - 0.5) * 150)}px`);
      particle.style.setProperty("--dy", `${Math.round((Math.random() - 0.5) * 130 - 16)}px`);
      particle.style.setProperty("--rot", `${Math.round(Math.random() * 240 - 120)}deg`);
      document.body.appendChild(particle);
      window.setTimeout(() => particle.remove(), 950);
    }
  }

  // Festive controls trigger a brief burst; empty hero background gets a few sparkles.
  document.addEventListener("click", event => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const control = target.closest(".btn, .theme-btn, .filter-btn, .product-enquire, .card-btn, #celebrateBtn");
    if (control) {
      createFestiveBurst(event.clientX, event.clientY, control.id === "celebrateBtn" ? 18 : 12);
      return;
    }
    if (target === document.body || target.id === "home" || target.classList.contains("hero-bg-pattern")) {
      createFestiveBurst(event.clientX, event.clientY, 8);
    }
  });

  // Celebrate button: short message, confetti and cooldown.
  const celebrateBtn = document.querySelector("#celebrateBtn");
  const celebrateMessage = document.querySelector("#celebrateMessage");
  let celebrateCooldown = false;
  let celebrateMessageTimer = 0;
  celebrateBtn?.addEventListener("click", event => {
    if (celebrateCooldown) return;
    celebrateCooldown = true;
    createFestiveBurst(event.clientX, event.clientY, 18);
    if (celebrateMessage) {
      celebrateMessage.textContent = "Let Every Celebration Shine! ✨";
      celebrateMessage.classList.add("show");
      window.clearTimeout(celebrateMessageTimer);
      celebrateMessageTimer = window.setTimeout(() => celebrateMessage.classList.remove("show"), 2400);
    }
    window.setTimeout(() => { celebrateCooldown = false; }, 900);
  });

  // Scroll progress and back-to-top button.
  const scrollProgress = document.querySelector("#scrollProgress");
  const backToTop = document.querySelector("#backToTop");
  let scrollUpdatePending = false;
  function updateScrollDecor() {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    if (scrollProgress) scrollProgress.style.width = `${maxScroll > 0 ? window.scrollY / maxScroll * 100 : 0}%`;
    if (backToTop) backToTop.classList.toggle("visible", window.scrollY > 450);
    scrollUpdatePending = false;
  }
  window.addEventListener("scroll", () => {
    if (!scrollUpdatePending) {
      scrollUpdatePending = true;
      window.requestAnimationFrame(updateScrollDecor);
    }
  }, { passive: true });
  updateScrollDecor();
  backToTop?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: motionReduced ? "auto" : "smooth" }));

})();
