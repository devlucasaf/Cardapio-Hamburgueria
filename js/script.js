<<<<<<< HEAD
=======
// Espero o DOM carregar completamente antes de rodar qualquer coisa
>>>>>>> ba07704307128ed2eb4694d723978b715552c179
document.addEventListener('DOMContentLoaded', function () {
  // Check de sanidade pra ver se o script carregou
  console.log('✅ Durrr Burger JS Iniciado');

<<<<<<< HEAD
  /* ==========================================================================
      CONTROLE DO MENU MOBILE
     ========================================================================== */
  const menuToggle = document.querySelector('.menu-toggle');
  const menuNav = document.querySelector('.menu-nav');

  // Só adiciona os listeners se os elementos existirem no DOM pra evitar erro no console
  if (menuToggle && menuNav) {
    menuToggle.addEventListener('click', function () {
      menuNav.classList.toggle('active');
      
      // Alterna o ícone entre 'hambúrguer' e 'X' (fechar)
=======
  // Pego os elementos do menu (botão e navegação)
  const menuToggle = document.querySelector('.menu-toggle');
  const menuNav = document.querySelector('.menu-nav');

  // Se existir o botão e o menu, adiciono o clique para abrir/fechar
  if (menuToggle && menuNav) {
    menuToggle.addEventListener('click', function () {
      menuNav.classList.toggle('active'); // alterna o menu aberto/fechado
>>>>>>> ba07704307128ed2eb4694d723978b715552c179
      const icon = this.querySelector('i');
      if (icon) {
        // alterna o ícone entre "hamburger" e "X"
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
      }
    });
  }

<<<<<<< HEAD
  /* ==========================================================================
      NAVEGAÇÃO E SCROLL SPY
     ========================================================================== */
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('.section');

  // Limpa o estado 'active' de todos os links antes de setar o novo
=======
  // Links de navegação e seções da página
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('.section');

  // Função para resetar os estilos dos links
>>>>>>> ba07704307128ed2eb4694d723978b715552c179
  function resetNavLinks() {
    navLinks.forEach((link) => {
      link.classList.remove('active', 'current');
      link.style.cssText = ''; // Reseta estilos inline injetados
    });
  }

  // Ativa o link clicado ou correspondente à seção atual
  function activateLink(linkToActivate) {
    if (!linkToActivate) return;
    resetNavLinks();
    linkToActivate.classList.add('active', 'current');
  }

<<<<<<< HEAD
  // UX: Fecha o menu mobile automaticamente se o usuário clicar em um link
=======
  // Fecha o menu mobile se estiver aberto
>>>>>>> ba07704307128ed2eb4694d723978b715552c179
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

<<<<<<< HEAD
  // Scroll manual com offset pra não ficar escondido atrás do header fixo (-80px)
=======
  // Faz o scroll suave até a seção desejada
>>>>>>> ba07704307128ed2eb4694d723978b715552c179
  function scrollToTarget(targetSelector) {
    if (!targetSelector || !targetSelector.startsWith('#')) return;
    const targetElement = document.querySelector(targetSelector);
    if (!targetElement) return;

    window.scrollTo({
<<<<<<< HEAD
      top: targetElement.offsetTop - 80, 
=======
      top: targetElement.offsetTop - 80, // ajusto o offset por causa do header
>>>>>>> ba07704307128ed2eb4694d723978b715552c179
      behavior: 'smooth',
    });
  }

<<<<<<< HEAD
  // Configura os cliques nos links do menu principal
  navLinks.forEach((link) => {
    link.addEventListener('click', function (e) {
      e.preventDefault(); // Mata o comportamento padrão da âncora
=======
  // Quando clico em um link do menu
  navLinks.forEach((link) => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
>>>>>>> ba07704307128ed2eb4694d723978b715552c179
      const targetId = this.getAttribute('href');
      activateLink(this);
      closeMobileMenuIfOpen();
      scrollToTarget(targetId);
    });
  });

<<<<<<< HEAD
  // Lógica do Scroll Spy: Detecta qual seção está visível e acende o link correspondente
=======
  // Destaca o link conforme a rolagem da página
>>>>>>> ba07704307128ed2eb4694d723978b715552c179
  function highlightOnScroll() {
    let current = '';
    // Offset de +100 ajuda a ativar a seção um pouco antes dela chegar no topo exato
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

  // Listener no scroll global (pode impactar performance se tiver muita coisa, mas ok pra LP simples)
  window.addEventListener('scroll', highlightOnScroll);
<<<<<<< HEAD
  
  // Roda uma vez no load pra garantir que o link certo já comece ativo
  highlightOnScroll(); 

  /* ==========================================================================
      BOTÕES DE AÇÃO (CTA)
     ========================================================================== */
=======
  highlightOnScroll(); // já chama uma vez pra iniciar

  // Botão "Ver Cardápio" que leva direto para a seção de hambúrgueres
>>>>>>> ba07704307128ed2eb4694d723978b715552c179
  const btnVerCardapio = document.querySelector('.btn');
  if (btnVerCardapio) {
    btnVerCardapio.addEventListener('click', function (e) {
      e.preventDefault();
      const target = '#hamburguer-section';
<<<<<<< HEAD

      // Sincroniza o menu lá em cima também, não só o scroll
=======
>>>>>>> ba07704307128ed2eb4694d723978b715552c179
      const linkBurguer = document.querySelector(`.nav-link[href="${target}"]`);
      if (linkBurguer) activateLink(linkBurguer);
      scrollToTarget(target);
      closeMobileMenuIfOpen();
    });
  }

<<<<<<< HEAD
  /* ==========================================================================
      ANIMAÇÕES DOS CARDS (Intersection Observer)
     ========================================================================== */
  const cards = document.querySelectorAll('.card');

  // Verifica suporte ao Observer antes de rodar (browsers muito antigos fallbackam sem animação)
=======
  // Animação dos cards com IntersectionObserver
  const cards = document.querySelectorAll('.card');
>>>>>>> ba07704307128ed2eb4694d723978b715552c179
  if (cards.length > 0 && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Elemento entrou na tela: mostra e para de observar (performance)
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 } // Dispara quando 10% do card estiver visível
    );

    cards.forEach((card) => {
<<<<<<< HEAD
      // Estado inicial (invisível e deslocado para baixo)
=======
      // estado inicial dos cards
>>>>>>> ba07704307128ed2eb4694d723978b715552c179
      card.style.opacity = '0';
      card.style.transform = 'translateY(30px)';
      card.style.transition = 'opacity 0.6s, transform 0.6s';
      observer.observe(card);

<<<<<<< HEAD
      // Micro-interações de mouse
=======
      // animações extras ao passar o mouse
>>>>>>> ba07704307128ed2eb4694d723978b715552c179
      card.addEventListener('mouseenter', function () {
        this.style.transform = 'translateY(-10px)';
      });
      card.addEventListener('mouseleave', function () {
        this.style.transform = 'translateY(0)';
      });
<<<<<<< HEAD

      // Efeito de "click press"
=======
>>>>>>> ba07704307128ed2eb4694d723978b715552c179
      card.addEventListener('click', function () {
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
          this.style.transform = ''; // Reseta após 200ms
        }, 200);
      });
    });
  }

<<<<<<< HEAD
  /* ==========================================================================
      AJUSTES DE RESPONSIVIDADE (TEXTO DO MENU)
     ========================================================================== */
  // Hack para telas intermediárias (entre 768px e 950px):
  // Encurta os textos do menu para não quebrar o layout (ex: "Acompanhamentos" -> "Acomp.")
=======
  // Ajusta o texto do menu dependendo da largura da tela
>>>>>>> ba07704307128ed2eb4694d723978b715552c179
  function adjustMenuText() {
    const screenWidth = window.innerWidth;
    const navItems = document.querySelectorAll('.menu-nav a');

    if (screenWidth < 950 && screenWidth > 768) {
      navItems.forEach((item) => {
        // Pega o texto original de um atributo data (se tiver) ou do content atual
        const original = item.getAttribute('data-long') || item.textContent;
        let short = original;

        // Mapeamento de strings longas para curtas
        if (original.includes('Combo')) short = 'Combos';
        else if (original.includes('Acompanhamentos')) short = 'Acomp.';
        else if (original.includes('Sobremesas')) short = 'Sobremesas'; // Redundante mas mantém padrão
        else if (original.includes('Bebidas')) short = 'Bebidas';
        else if (original.includes('Burguer')) short = 'Burgers';
        else if (original.includes('Entradas')) short = 'Entradas';
        else if (original === 'Início') short = 'Início';

        item.textContent = short;
      });
    } else {
      // Restaura texto original em telas grandes ou mobile puro
      navItems.forEach((item) => {
        const original = item.getAttribute('data-long') || item.textContent;
        item.textContent = original;
      });
    }
  }

  // Monitora load e resize para ajustar os textos dinamicamente
  window.addEventListener('load', adjustMenuText);
  window.addEventListener('resize', adjustMenuText);

  console.log('✅ JavaScript configurado com sucesso!');

<<<<<<< HEAD
  /* ==========================================================================
      INJEÇÃO DE ESTILOS DINÂMICOS
     ========================================================================== */
  // Injetando CSS via JS pro highlight do menu ativo.
  // Nota: Idealmente isso iria pro style.css, mas foi colocado aqui pra garantir 
  // que o highlight "neon" só exista se o JS estiver rodando.
=======
  // Estilos extras para destacar o link ativo com animação
>>>>>>> ba07704307128ed2eb4694d723978b715552c179
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
      0% { box-shadow: 0 0 15px rgba(255, 107, 0, 0.7); }
      50% { box-shadow: 0 0 30px rgba(255, 107, 0, 0.9); }
      100% { box-shadow: 0 0 15px rgba(255, 107, 0, 0.7); }
    }

    .menu-nav a.current {
      animation: pulseGlow 2s infinite !important;
    }

    /* Bolinha amarela indicadora */
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
