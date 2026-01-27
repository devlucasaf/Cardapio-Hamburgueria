document.addEventListener('DOMContentLoaded', function () {
  console.log('✅ Durrr Burger JS Iniciado');

  /* ========================================================================== 
      CONTROLE DO MENU MOBILE 
  ========================================================================== */
  const menuToggle = document.querySelector('.menu-toggle');
  const menuNav = document.querySelector('.menu-nav');

  if (menuToggle && menuNav) {
    menuToggle.addEventListener('click', function () {
      menuNav.classList.toggle('active');
      const icon = this.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
      }
    });
  }

  /* ========================================================================== 
      NAVEGAÇÃO E SCROLL SPY 
  ========================================================================== */
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('.section');

  function resetNavLinks() {
    navLinks.forEach((link) => {
      link.classList.remove('active', 'current');
      link.style.cssText = '';
    });
  }

  function activateLink(linkToActivate) {
    if (!linkToActivate) return;
    resetNavLinks();
    linkToActivate.classList.add('active', 'current');
  }

  function closeMobileMenuIfOpen() {
    if (!menuNav || !menuToggle) return;
    if (menuNav.classList.contains('active')) {
      menuNav.classList.remove('active');
      const icon = menuToggle.querySelector('i');
      if (icon) {
        icon.classList.add('fa-bars');
        icon.classList.remove('fa-times');
      }
    }
  }

  function scrollToTarget(targetSelector) {
    if (!targetSelector || !targetSelector.startsWith('#')) return;
    const targetElement = document.querySelector(targetSelector);
    if (!targetElement) return;

    window.scrollTo({
      top: targetElement.offsetTop - 80,
      behavior: 'smooth',
    });
  }

  navLinks.forEach((link) => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      activateLink(this);
      closeMobileMenuIfOpen();
      scrollToTarget(targetId);
    });
  });

  function highlightOnScroll() {
    let current = '';
    const scrollPos = window.scrollY + 100;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        current = section.id;
      }
    });

    if (!current) return;
    const active = document.querySelector(`.nav-link[href="#${current}"]`);
    if (active) activateLink(active);
  }

  window.addEventListener('scroll', highlightOnScroll);
  highlightOnScroll();

  /* ========================================================================== 
      BOTÕES DE AÇÃO (CTA) 
  ========================================================================== */
  const btnVerCardapio = document.querySelector('.btn');
  if (btnVerCardapio) {
    btnVerCardapio.addEventListener('click', function (e) {
      e.preventDefault();
      const target = '#hamburguer-section';
      const linkBurguer = document.querySelector(`.nav-link[href="${target}"]`);
      if (linkBurguer) activateLink(linkBurguer);
      scrollToTarget(target);
      closeMobileMenuIfOpen();
    });
  }

  /* ========================================================================== 
      ANIMAÇÕES DOS CARDS (Intersection Observer) 
  ========================================================================== */
  const cards = document.querySelectorAll('.card');
  if (cards.length > 0 && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    cards.forEach((card) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(30px)';
      card.style.transition = 'opacity 0.6s, transform 0.6s';
      observer.observe(card);

      card.addEventListener('mouseenter', function () {
        this.style.transform = 'translateY(-10px)';
      });
      card.addEventListener('mouseleave', function () {
        this.style.transform = 'translateY(0)';
      });
      card.addEventListener('click', function () {
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
          this.style.transform = '';
        }, 200);
      });
    });
  }

  /* ========================================================================== 
      AJUSTES DE RESPONSIVIDADE (TEXTO DO MENU) 
  ========================================================================== */
  function adjustMenuText() {
    const screenWidth = window.innerWidth;
    const navItems = document.querySelectorAll('.menu-nav a');

    if (screenWidth < 950 && screenWidth > 768) {
      navItems.forEach((item) => {
        const original = item.getAttribute('data-long') || item.textContent;
        let short = original;

        if (original.includes('Combo')) short = 'Combos';
        else if (original.includes('Acompanhamentos')) short = 'Acomp.';
        else if (original.includes('Sobremesas')) short = 'Sobremesas';
        else if (original.includes('Bebidas')) short = 'Bebidas';
        else if (original.includes('Burguer')) short = 'Burgers';
        else if (original.includes('Entradas')) short = 'Entradas';
        else if (original === 'Início') short = 'Início';

        item.textContent = short;
      });
    } else {
      navItems.forEach((item) => {
        const original = item.getAttribute('data-long') || item.textContent;
        item.textContent = original;
      });
    }
  }

  window.addEventListener('load', adjustMenuText);
  window.addEventListener('resize', adjustMenuText);

  console.log('✅ JavaScript configurado com sucesso!');

  /* ========================================================================== 
      INJEÇÃO DE ESTILOS DINÂMICOS 
  ========================================================================== */
  const style = document.createElement('style');
  style.innerHTML = `
    .menu-nav a.current,
    .menu-nav a.active.current,
    .menu-nav a.current.active {
      background: linear-gradient(135deg, #FF6B00, #E65100) !important;
      color: white !important;
      box-shadow:
        0 0 20px rgba(255, 107, 0, 0.8),
        0 0 40px rgba(255, 107, 0, 0.4),
        inset 0 0 10px rgba(255, 255, 255, 0.2) !important;
      transform: translateY(-2px) !important;
      border: 2px solid #FFD600 !important;
      position: relative;
      z-index: 10;
    }

    @keyframes pulseGlow {
      0% { 
        box-shadow: 0 0 15px rgba(255, 107, 0, 0.7); 
      }
      50% { 
        box-shadow: 0 0 30px rgba(255, 107, 0, 0.9); 
      }
      100% {
        box-shadow: 0 0 15px rgba(255, 107, 0, 0.7); 
      }
    }

    .menu-nav a.current {
      animation: pulseGlow 2s infinite !important;
    }

    .menu-nav a.current::after {
      content: '●';
      position: absolute;
      top: 5px;
      right: 5px;
      color: #FFD600;
      font-size: 10px;
      text-shadow: 0 0 5px #FFD600;
    }
  `;
  document.head.appendChild(style);
});
