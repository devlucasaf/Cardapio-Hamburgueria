document.addEventListener("DOMContentLoaded", function () {
  console.log("Durrr Burger JS Iniciado");

  // --- CONTROLE DO MENU MOBILE ---
  const botaoAlternarMenu = document.querySelector(".menu-toggle");
  const menuNavegacao = document.querySelector(".menu-nav");

  if (botaoAlternarMenu && menuNavegacao) {
    botaoAlternarMenu.addEventListener("click", function () {
      menuNavegacao.classList.toggle("active");
      const estaExpandido = menuNavegacao.classList.contains("active");
      this.setAttribute("aria-expanded", estaExpandido);
      this.setAttribute("aria-label", estaExpandido ? "Fechar menu" : "Abrir menu");
      const icone = this.querySelector("i");
      if (icone) {
        icone.classList.toggle("fa-bars");
        icone.classList.toggle("fa-times");
      }
    });
  }

  // --- NAVEGAÇÃO E SCROLL SPY ---
  const linksDeNavegacao = document.querySelectorAll(".nav-link");
  const secoes = document.querySelectorAll(".section");

  function redefinirLinksDeNavegacao() {
    linksDeNavegacao.forEach((link) => {
      link.classList.remove("active", "current");
      link.style.cssText = "";
    });
  }

  function ativarLink(linkParaAtivar) {
    if (!linkParaAtivar) {
      return;
    }

    redefinirLinksDeNavegacao();
    linkParaAtivar.classList.add("active", "current");
  }

  function fecharMenuMobileSeAberto() {
    if (!menuNavegacao || !botaoAlternarMenu) {
      return;
    }

    if (menuNavegacao.classList.contains("active")) {
      menuNavegacao.classList.remove("active");
      botaoAlternarMenu.setAttribute("aria-expanded", "false");
      botaoAlternarMenu.setAttribute("aria-label", "Abrir menu");
      const icone = botaoAlternarMenu.querySelector("i");
      if (icone) {
        icone.classList.add("fa-bars");
        icone.classList.remove("fa-times");
      }
    }
  }

  function rolarParaAlvo(seletorAlvo) {
    if (!seletorAlvo || !seletorAlvo.startsWith("#")) {
      return;
    }

    const elementoAlvo = document.querySelector(seletorAlvo);

    if (!elementoAlvo) {
      return;
    }

    window.scrollTo({
      top: elementoAlvo.offsetTop - 80,
      behavior: "smooth",
    });
  }

  linksDeNavegacao.forEach((link) => {
    link.addEventListener("click", function (evento) {
      evento.preventDefault();
      const alvoId = this.getAttribute("href");
      ativarLink(this);
      fecharMenuMobileSeAberto();
      rolarParaAlvo(alvoId);
    });
  });

  function destacarAoRolar() {
    let atual = "";
    const posicaoRolagem = window.scrollY + 100;

    secoes.forEach((secao) => {
      const topoSecao = secao.offsetTop;
      const alturaSecao = secao.clientHeight;
      if (posicaoRolagem >= topoSecao && posicaoRolagem < topoSecao + alturaSecao) {
        atual = secao.id;
      }
    });

    if (!atual) {
      return;
    }

    const linkAtivo = document.querySelector(`.nav-link[href="#${atual}"]`);
    if (linkAtivo) {
      ativarLink(linkAtivo);
    }
  }

  window.addEventListener("scroll", destacarAoRolar);
  destacarAoRolar();

  // --- BOTÕES DE AÇÃO ---
  const botaoVerCardapio = document.querySelector(".btn");
  if (botaoVerCardapio) {
    botaoVerCardapio.addEventListener("click", function (evento) {
      evento.preventDefault();
      const alvo = "#hamburguer-section";
      const linkBurguer = document.querySelector(`.nav-link[href="${alvo}"]`);

      if (linkBurguer) {
        ativarLink(linkBurguer);
      }

      rolarParaAlvo(alvo);
      fecharMenuMobileSeAberto();
    });
  }

  // --- ANIMAÇÕES DOS CARDS ---
  const cards = document.querySelectorAll(".card");
  if (cards.length > 0 && "IntersectionObserver" in window) {
    const observador = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((entrada) => {
          if (entrada.isIntersecting) {
            entrada.target.style.opacity = "1";
            entrada.target.style.transform = "translateY(0)";
            observador.unobserve(entrada.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    cards.forEach((card) => {
      card.style.opacity = "0";
      card.style.transform = "translateY(30px)";
      card.style.transition = "opacity 0.6s, transform 0.6s";
      observador.observe(card);

      card.addEventListener("mouseenter", function () {
        this.style.transform = "translateY(-10px)";
      });
      card.addEventListener("mouseleave", function () {
        this.style.transform = "translateY(0)";
      });
      card.addEventListener("click", function () {
        this.style.transform = "scale(0.95)";
        setTimeout(() => {
          this.style.transform = "";
        }, 200);
      });
    });
  }

  // --- AJUSTES DE RESPONSIVIDADE ---
  function ajustarTextoDoMenu() {
    const larguraTela = window.innerWidth;
    const itensDoMenu = document.querySelectorAll(".menu-nav a");

    if (larguraTela < 950 && larguraTela > 768) {
      itensDoMenu.forEach((item) => {
        const original = item.getAttribute("data-long") || item.textContent;
        let curto = original;

        if (original.includes("Combo")) {
          curto = "Combos";
        } else if (original.includes("Acompanhamentos")) {
          curto = "Acomp.";
        } else if (original.includes("Sobremesas")) {
          curto = "Sobremesas";
        } else if (original.includes("Bebidas")) {
          curto = "Bebidas";
        } else if (original.includes("Burguer")) {
          curto = "Burgers";
        } else if (original.includes("Entradas")) {
          curto = "Entradas";
        } else if (original === "Início") {
          curto = "Início";
        }

        item.textContent = curto;
      });
    } else {
      itensDoMenu.forEach((item) => {
        const original = item.getAttribute("data-long") || item.textContent;
        item.textContent = original;
      });
    }
  }

  window.addEventListener("load", ajustarTextoDoMenu);
  window.addEventListener("resize", ajustarTextoDoMenu);

  console.log("JavaScript configurado com sucesso!");

  // --- INJEÇÃO DE ESTILOS DINÂMICOS ---
  const estilo = document.createElement("style");
  estilo.innerHTML = `
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
      content: "●";
      position: absolute;
      top: 5px;
      right: 5px;
      color: #FFD600;
      font-size: 10px;
      text-shadow: 0 0 5px #FFD600;
    }
  `;
  document.head.appendChild(estilo);
});
