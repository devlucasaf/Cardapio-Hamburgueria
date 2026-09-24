document.addEventListener("DOMContentLoaded", function () {
  console.log("Durrr Burger JS Iniciado");

  // --- REFERÊNCIAS E UTILITÁRIOS ---
  const cabecalho = document.querySelector(".site-header");
  const botaoAlternarMenu = document.querySelector(".menu-toggle");
  const menuNavegacao = document.querySelector(".menu-nav");
  const linksDeNavegacao = document.querySelectorAll(".nav-link");
  const secoes = document.querySelectorAll(".section");
  const cards = document.querySelectorAll(".card");
  const categoriasBebida = document.querySelectorAll(".bebida-categoria");

  const campoBusca = document.querySelector(".search-input");
  const botaoLimparBusca = document.querySelector(".search-clear");
  const avisoBuscaVazia = document.querySelector(".search-empty");
  const termoBuscaVazia = document.querySelector(".search-empty-term");
  const botaoResetBusca = document.querySelector(".search-empty-reset");

  const botaoPedido = document.querySelector(".cart-toggle");
  const contadorPedido = document.querySelector(".cart-count");
  const gavetaPedido = document.querySelector(".cart-drawer");
  const fundoPedido = document.querySelector(".cart-overlay");
  const botaoFecharPedido = document.querySelector(".cart-close");
  const listaPedido = document.querySelector(".cart-list");
  const pedidoVazio = document.querySelector(".cart-empty");
  const rodapePedido = document.querySelector(".cart-foot");
  const totalPedido = document.querySelector(".cart-total-value");
  const botaoContinuar = document.querySelector(".cart-continue");
  const botaoLimparPedido = document.querySelector(".cart-clear");

  const toast = document.querySelector(".toast");
  const textoToast = document.querySelector(".toast-text");
  const botaoTopo = document.querySelector(".back-to-top");

  const prefereMenosMovimento = window.matchMedia("(prefers-reduced-motion: reduce)");
  const comportamentoRolagem = () => (prefereMenosMovimento.matches ? "auto" : "smooth");
  const formatarMoeda = (valor) => valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  const converterPreco = (texto) => Number(texto.replace(/[^\d,]/g, "").replace(",", ".")) || 0;
  const normalizar = (texto) => texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  function alturaCabecalho() {
    return cabecalho ? cabecalho.offsetHeight : 0;
  }

  function atualizarAlturaCabecalho() {
    document.documentElement.style.setProperty("--header-h", `${alturaCabecalho()}px`);
  }

  atualizarAlturaCabecalho();

  // --- CONTROLE DO MENU MOBILE ---
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

  function fecharMenuMobileSeAberto() {
    if (!menuNavegacao || !botaoAlternarMenu || !menuNavegacao.classList.contains("active")) {
      return;
    }

    menuNavegacao.classList.remove("active");
    botaoAlternarMenu.setAttribute("aria-expanded", "false");
    botaoAlternarMenu.setAttribute("aria-label", "Abrir menu");
    const icone = botaoAlternarMenu.querySelector("i");
    if (icone) {
      icone.classList.add("fa-bars");
      icone.classList.remove("fa-times");
    }
  }

  // Fecha o menu mobile ao tocar fora dele
  document.addEventListener("click", function (evento) {
    if (
      menuNavegacao &&
      menuNavegacao.classList.contains("active") &&
      !menuNavegacao.contains(evento.target) &&
      !botaoAlternarMenu.contains(evento.target)
    ) {
      fecharMenuMobileSeAberto();
    }
  });

  // --- NAVEGAÇÃO E SCROLL SPY ---
  let rolagemProgramada = false;
  let temporizadorRolagem;

  function liberarScrollSpyAposRolagem() {
    clearTimeout(temporizadorRolagem);
    temporizadorRolagem = setTimeout(() => {
      rolagemProgramada = false;
      atualizarAoRolar();
    }, 180);
  }

  function ativarLink(linkParaAtivar) {
    if (!linkParaAtivar || linkParaAtivar.classList.contains("active")) {
      return;
    }

    linksDeNavegacao.forEach((link) => {
      link.classList.remove("active");
      link.removeAttribute("aria-current");
    });
    linkParaAtivar.classList.add("active");
    linkParaAtivar.setAttribute("aria-current", "true");

    // Mantém a categoria ativa visível na barra horizontal de categorias
    if (menuNavegacao && menuNavegacao.scrollWidth > menuNavegacao.clientWidth) {
      const destino = linkParaAtivar.offsetLeft - (menuNavegacao.clientWidth - linkParaAtivar.offsetWidth) / 2;
      menuNavegacao.scrollTo({ left: destino, behavior: comportamentoRolagem() });
    }
  }

  function linkDaSecao(elemento) {
    const secao = elemento ? elemento.closest(".section") : null;
    return secao ? document.querySelector(`.nav-link[href="#${secao.id}"]`) : null;
  }

  function rolarParaAlvo(seletorAlvo) {
    if (!seletorAlvo || !seletorAlvo.startsWith("#") || seletorAlvo.length < 2) {
      return;
    }

    const elementoAlvo = document.getElementById(seletorAlvo.slice(1));
    if (!elementoAlvo) {
      return;
    }

    ativarLink(linkDaSecao(elementoAlvo));
    rolagemProgramada = true;
    liberarScrollSpyAposRolagem();

    // scroll-margin-top já compensa a altura do cabeçalho fixo
    elementoAlvo.scrollIntoView({ behavior: comportamentoRolagem(), block: "start" });
  }

  // Menu, logo, botões do banner, chips de bebidas e links do rodapé
  document.querySelectorAll(".nav-link, .js-scroll").forEach((link) => {
    link.addEventListener("click", function (evento) {
      const alvo = this.getAttribute("href");
      if (!alvo || !alvo.startsWith("#")) {
        return;
      }

      evento.preventDefault();

      if (campoBusca && campoBusca.value) {
        limparBusca(false);
      }

      fecharMenuMobileSeAberto();
      rolarParaAlvo(alvo);
    });
  });

  function secaoVisivelAtual() {
    const visiveis = Array.from(secoes).filter((secao) => !secao.hidden);
    if (visiveis.length === 0) {
      return null;
    }

    const fimDaPagina = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
    if (fimDaPagina) {
      return visiveis[visiveis.length - 1];
    }

    const linhaDeLeitura = alturaCabecalho() + window.innerHeight * 0.2;
    let atual = visiveis[0];
    visiveis.forEach((secao) => {
      if (secao.getBoundingClientRect().top <= linhaDeLeitura) {
        atual = secao;
      }
    });
    return atual;
  }

  function atualizarAoRolar() {
    const rolagem = window.scrollY;

    if (cabecalho) {
      cabecalho.classList.toggle("is-scrolled", rolagem > 8);
    }

    if (botaoTopo) {
      botaoTopo.classList.toggle("visible", rolagem > 600);
    }

    if (!rolagemProgramada) {
      const secao = secaoVisivelAtual();
      if (secao) {
        ativarLink(document.querySelector(`.nav-link[href="#${secao.id}"]`));
      }
    }
  }

  let quadroPendente = false;
  window.addEventListener(
    "scroll",
    function () {
      if (rolagemProgramada) {
        liberarScrollSpyAposRolagem();
      }

      if (!quadroPendente) {
        quadroPendente = true;
        requestAnimationFrame(() => {
          quadroPendente = false;
          atualizarAoRolar();
        });
      }
    },
    { passive: true }
  );

  atualizarAoRolar();

  if (botaoTopo) {
    botaoTopo.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: comportamentoRolagem() });
    });
  }

  // --- IMAGENS, PREÇOS E BOTÃO DE PEDIDO ---
  function textoDe(elemento) {
    return elemento ? elemento.textContent.trim() : "";
  }

  // Índice de busca montado antes de alterar os cards (título, descrição, volume e categoria)
  const indiceBusca = Array.from(cards).map((card) => {
    const secao = card.closest(".section");
    const categoria = card.closest(".bebida-categoria");
    const partes = [
      textoDe(card.querySelector(".card-title")),
      textoDe(card.querySelector(".card-description")),
      Array.from(card.querySelectorAll(".card-volume")).map(textoDe).join(" "),
      categoria ? textoDe(categoria.querySelector(".categoria-title")) : "",
      secao ? textoDe(secao.querySelector(".section-title")) : "",
    ];
    return { card, texto: normalizar(partes.join(" ")) };
  });

  function criarBotaoAdicionar(nome, preco, somenteIcone) {
    const botao = document.createElement("button");
    botao.type = "button";
    botao.className = somenteIcone ? "btn-add btn-add--icon" : "btn-add";
    botao.dataset.nome = nome;
    botao.dataset.preco = String(preco);
    botao.setAttribute("aria-label", `Adicionar ${nome} ao pedido`);

    const icone = document.createElement("i");
    icone.className = "fas fa-plus";
    icone.setAttribute("aria-hidden", "true");
    botao.append(icone);

    if (!somenteIcone) {
      const rotulo = document.createElement("span");
      rotulo.className = "btn-add-label";
      rotulo.textContent = "Adicionar";
      botao.append(rotulo);
    }

    return botao;
  }

  function criarInfoDePreco(preco, volume) {
    const info = document.createElement("div");
    info.className = "card-price-info";
    info.append(preco);
    if (volume) {
      info.append(volume);
    }
    return info;
  }

  function montarRodapeDoCard(card) {
    const conteudo = card.querySelector(".card-content");
    const nome = textoDe(card.querySelector(".card-title"));
    if (!conteudo || !nome) {
      return;
    }

    const precos = Array.from(conteudo.querySelectorAll(":scope > .card-price"));
    if (precos.length === 0) {
      return;
    }

    const ehBebida = card.classList.contains("bebida-item");
    const rodape = document.createElement("div");
    rodape.className = "card-footer";

    if (precos.length > 1) {
      rodape.classList.add("card-footer--options");
      precos.forEach((preco) => {
        const vizinho = preco.nextElementSibling;
        const volume = vizinho && vizinho.classList.contains("card-volume") ? vizinho : null;
        const nomeDaOpcao = volume ? `${nome} (${textoDe(volume)})` : nome;

        const opcao = document.createElement("div");
        opcao.className = "price-option";
        opcao.append(
          criarInfoDePreco(preco, volume),
          criarBotaoAdicionar(nomeDaOpcao, converterPreco(preco.textContent), true)
        );
        rodape.append(opcao);
      });
    } else {
      const preco = precos[0];
      const volume = conteudo.querySelector(":scope > .card-volume");
      const nomeDoItem = volume ? `${nome} (${textoDe(volume)})` : nome;
      rodape.append(
        criarInfoDePreco(preco, volume),
        criarBotaoAdicionar(nomeDoItem, converterPreco(preco.textContent), ehBebida)
      );
    }

    conteudo.append(rodape);
  }

  // Carrega a foto do card
  function verificarImagem(elemento) {
    const fundo = getComputedStyle(elemento).backgroundImage;
    const resultado = /url\(["']?(.*?)["']?\)/.exec(fundo);

    function tratarFalha() {
      const reserva = elemento.dataset.fallback;
      if (reserva) {
        delete elemento.dataset.fallback;
        elemento.className = `card-img ${reserva}`;
        verificarImagem(elemento);
        return;
      }
      elemento.classList.remove("loading");
      elemento.classList.add("is-missing");
    }

    if (!resultado) {
      tratarFalha();
      return;
    }

    elemento.classList.add("loading");
    const imagem = new Image();
    imagem.onload = () => elemento.classList.remove("loading");
    imagem.onerror = tratarFalha;
    imagem.src = resultado[1];
  }

  cards.forEach((card) => {
    const imagem = card.querySelector(".card-img");
    if (imagem) {
      imagem.setAttribute("role", "img");
      imagem.setAttribute("aria-label", textoDe(card.querySelector(".card-title")));
      verificarImagem(imagem);
    }
    montarRodapeDoCard(card);
  });

  // Entrada suave dos cards ao aparecerem na tela 
  if ("IntersectionObserver" in window && !prefereMenosMovimento.matches) {
    const observadorCards = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((entrada) => {
          if (entrada.isIntersecting) {
            entrada.target.classList.add("is-visible");
            observadorCards.unobserve(entrada.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    document.querySelectorAll(".cards-container").forEach((container) => {
      Array.from(container.querySelectorAll(".card")).forEach((card, indice) => {
        card.style.setProperty("--reveal-delay", `${(indice % 4) * 70}ms`);
        card.classList.add("reveal");
        observadorCards.observe(card);
      });
    });
  }

  // --- BUSCA NO CARDÁPIO ---
  function filtrarCardapio(termoDigitado) {
    const termo = normalizar(termoDigitado.trim());
    const buscando = termo.length > 0;
    let encontrados = 0;

    indiceBusca.forEach(({ card, texto }) => {
      const corresponde = !buscando || texto.includes(termo);
      card.hidden = !corresponde;
      if (corresponde) {
        encontrados++;
      }
    });

    categoriasBebida.forEach((categoria) => {
      categoria.hidden = buscando && !categoria.querySelector(".card:not([hidden])");
    });

    secoes.forEach((secao) => {
      if (secao.classList.contains("hero")) {
        secao.hidden = buscando;
      } else {
        secao.hidden = buscando && !secao.querySelector(".card:not([hidden])");
      }
    });

    document.querySelectorAll(".subcategorias").forEach((subcategorias) => {
      subcategorias.hidden = buscando;
    });

    if (botaoLimparBusca) {
      botaoLimparBusca.hidden = termoDigitado.length === 0;
    }

    if (avisoBuscaVazia) {
      avisoBuscaVazia.hidden = !(buscando && encontrados === 0);
      if (termoBuscaVazia) {
        termoBuscaVazia.textContent = termoDigitado.trim();
      }
    }

    if (buscando && window.scrollY > 0) {
      window.scrollTo({ top: 0, behavior: "auto" });
    }

    atualizarAoRolar();
  }

  function limparBusca(devolverFoco = true) {
    if (!campoBusca) {
      return;
    }

    campoBusca.value = "";
    filtrarCardapio("");
    if (devolverFoco) {
      campoBusca.focus();
    }
  }

  if (campoBusca) {
    let temporizadorBusca;

    campoBusca.addEventListener("input", function () {
      clearTimeout(temporizadorBusca);
      temporizadorBusca = setTimeout(() => filtrarCardapio(this.value), 120);
    });

    campoBusca.addEventListener("keydown", function (evento) {
      if (evento.key === "Escape" && this.value) {
        evento.stopPropagation();
        limparBusca();
      } else if (evento.key === "Enter") {
        this.blur();
      }
    });
  }

  if (botaoLimparBusca) {
    botaoLimparBusca.addEventListener("click", () => limparBusca());
  }

  if (botaoResetBusca) {
    botaoResetBusca.addEventListener("click", () => limparBusca());
  }

  // --- MEU PEDIDO ---
  const itensPedido = new Map();
  let ultimoFocoAntesDoPedido = null;
  let temporizadorToast;

  function mostrarToast(mensagem) {
    if (!toast || !textoToast) {
      return;
    }

    textoToast.textContent = mensagem;
    toast.classList.add("is-visible");
    clearTimeout(temporizadorToast);
    temporizadorToast = setTimeout(() => toast.classList.remove("is-visible"), 2200);
  }

  function animarContador() {
    if (!contadorPedido) {
      return;
    }

    contadorPedido.classList.remove("bump");
    void contadorPedido.offsetWidth;
    contadorPedido.classList.add("bump");
  }

  function criarElemento(tag, classe, texto) {
    const elemento = document.createElement(tag);
    elemento.className = classe;
    if (texto !== undefined) {
      elemento.textContent = texto;
    }
    return elemento;
  }

  function criarBotaoQuantidade(acao, nome) {
    const botao = document.createElement("button");
    botao.type = "button";
    botao.dataset.acao = acao;
    botao.dataset.nome = nome;
    botao.setAttribute("aria-label", `${acao === "mais" ? "Adicionar mais um" : "Remover um"}: ${nome}`);

    const icone = document.createElement("i");
    icone.className = acao === "mais" ? "fas fa-plus" : "fas fa-minus";
    icone.setAttribute("aria-hidden", "true");
    botao.append(icone);
    return botao;
  }

  function renderizarPedido() {
    let quantidadeTotal = 0;
    let valorTotal = 0;

    if (listaPedido) {
      listaPedido.replaceChildren();
    }

    itensPedido.forEach((item) => {
      const subtotal = item.preco * item.quantidade;
      quantidadeTotal += item.quantidade;
      valorTotal += subtotal;

      if (!listaPedido) {
        return;
      }

      const linha = criarElemento("li", "cart-item");
      const controles = criarElemento("div", "cart-qty");
      controles.setAttribute("role", "group");
      controles.setAttribute("aria-label", `Quantidade de ${item.nome}`);
      controles.append(
        criarBotaoQuantidade("menos", item.nome),
        criarElemento("span", "cart-qty-value", String(item.quantidade)),
        criarBotaoQuantidade("mais", item.nome)
      );

      linha.append(
        criarElemento("span", "cart-item-name", item.nome),
        criarElemento("strong", "cart-item-subtotal", formatarMoeda(subtotal)),
        criarElemento("span", "cart-item-unit", `${formatarMoeda(item.preco)} cada`),
        controles
      );
      listaPedido.append(linha);
    });

    const temItens = quantidadeTotal > 0;

    if (contadorPedido) {
      contadorPedido.textContent = String(quantidadeTotal);
      contadorPedido.hidden = !temItens;
    }

    if (botaoPedido) {
      const rotulo = temItens
        ? `Abrir meu pedido: ${quantidadeTotal} ${quantidadeTotal === 1 ? "item" : "itens"}, ${formatarMoeda(valorTotal)}`
        : "Abrir meu pedido";
      botaoPedido.setAttribute("aria-label", rotulo);
    }

    if (pedidoVazio) {
      pedidoVazio.hidden = temItens;
    }

    if (rodapePedido) {
      rodapePedido.hidden = !temItens;
    }

    if (totalPedido) {
      totalPedido.textContent = formatarMoeda(valorTotal);
    }
  }

  function darFeedbackNoBotao(botao) {
    const icone = botao.querySelector("i");
    const rotulo = botao.querySelector(".btn-add-label");

    botao.classList.add("is-added");
    if (icone) {
      icone.className = "fas fa-check";
    }
    if (rotulo) {
      rotulo.textContent = "Adicionado";
    }

    clearTimeout(botao._temporizador);
    botao._temporizador = setTimeout(() => {
      botao.classList.remove("is-added");
      if (icone) {
        icone.className = "fas fa-plus";
      }
      if (rotulo) {
        rotulo.textContent = "Adicionar";
      }
    }, 1400);
  }

  function adicionarAoPedido(nome, preco) {
    const item = itensPedido.get(nome) || { nome, preco, quantidade: 0 };
    item.quantidade++;
    itensPedido.set(nome, item);
    renderizarPedido();
  }

  document.addEventListener("click", function (evento) {
    const botao = evento.target.closest(".btn-add");
    if (!botao) {
      return;
    }

    const nome = botao.dataset.nome;
    const preco = Number(botao.dataset.preco);
    if (!nome || !Number.isFinite(preco)) {
      return;
    }

    adicionarAoPedido(nome, preco);
    darFeedbackNoBotao(botao);
    animarContador();
    mostrarToast(`${nome} adicionado ao pedido`);
  });

  if (listaPedido) {
    listaPedido.addEventListener("click", function (evento) {
      const botao = evento.target.closest("button[data-acao]");
      if (!botao) {
        return;
      }

      const { acao, nome } = botao.dataset;
      const item = itensPedido.get(nome);
      if (!item) {
        return;
      }

      item.quantidade += acao === "mais" ? 1 : -1;
      if (item.quantidade <= 0) {
        itensPedido.delete(nome);
      }

      renderizarPedido();

      // Devolve o foco ao mesmo controle após a atualização da lista
      const mesmoBotao = Array.from(listaPedido.querySelectorAll("button[data-acao]")).find(
        (candidato) => candidato.dataset.acao === acao && candidato.dataset.nome === nome
      );
      const proximoFoco = mesmoBotao || listaPedido.querySelector("button[data-acao]") || botaoFecharPedido;
      if (proximoFoco) {
        proximoFoco.focus();
      }
    });
  }

  function pedidoEstaAberto() {
    return gavetaPedido ? gavetaPedido.classList.contains("is-open") : false;
  }

  function abrirPedido() {
    if (!gavetaPedido) {
      return;
    }

    ultimoFocoAntesDoPedido = document.activeElement;
    fecharMenuMobileSeAberto();

    gavetaPedido.removeAttribute("inert");
    gavetaPedido.setAttribute("aria-hidden", "false");
    gavetaPedido.classList.add("is-open");
    if (fundoPedido) {
      fundoPedido.classList.add("is-open");
    }
    if (botaoPedido) {
      botaoPedido.setAttribute("aria-expanded", "true");
    }
    document.body.classList.add("no-scroll");

    requestAnimationFrame(() => {
      if (botaoFecharPedido) {
        botaoFecharPedido.focus();
      }
    });
  }

  function fecharPedido() {
    if (!gavetaPedido || !pedidoEstaAberto()) {
      return;
    }

    gavetaPedido.classList.remove("is-open");
    gavetaPedido.setAttribute("aria-hidden", "true");
    gavetaPedido.setAttribute("inert", "");
    if (fundoPedido) {
      fundoPedido.classList.remove("is-open");
    }
    if (botaoPedido) {
      botaoPedido.setAttribute("aria-expanded", "false");
    }
    document.body.classList.remove("no-scroll");

    if (ultimoFocoAntesDoPedido && document.contains(ultimoFocoAntesDoPedido)) {
      ultimoFocoAntesDoPedido.focus();
    }
  }

  if (botaoPedido) {
    botaoPedido.addEventListener("click", abrirPedido);
  }

  [botaoFecharPedido, fundoPedido, botaoContinuar].forEach((elemento) => {
    if (elemento) {
      elemento.addEventListener("click", fecharPedido);
    }
  });

  if (botaoLimparPedido) {
    botaoLimparPedido.addEventListener("click", function () {
      itensPedido.clear();
      renderizarPedido();
      mostrarToast("Pedido limpo");
      if (botaoFecharPedido) {
        botaoFecharPedido.focus();
      }
    });
  }

  // Mantém o foco do teclado dentro da gaveta enquanto ela estiver aberta
  if (gavetaPedido) {
    gavetaPedido.addEventListener("keydown", function (evento) {
      if (evento.key !== "Tab") {
        return;
      }

      const focaveis = Array.from(gavetaPedido.querySelectorAll("button, [href], input")).filter(
        (elemento) => !elemento.disabled && elemento.offsetParent !== null
      );
      if (focaveis.length === 0) {
        return;
      }

      const primeiro = focaveis[0];
      const ultimo = focaveis[focaveis.length - 1];

      if (evento.shiftKey && document.activeElement === primeiro) {
        evento.preventDefault();
        ultimo.focus();
      } else if (!evento.shiftKey && document.activeElement === ultimo) {
        evento.preventDefault();
        primeiro.focus();
      }
    });
  }

  document.addEventListener("keydown", function (evento) {
    if (evento.key !== "Escape") {
      return;
    }

    if (pedidoEstaAberto()) {
      fecharPedido();
    } else if (menuNavegacao && menuNavegacao.classList.contains("active")) {
      fecharMenuMobileSeAberto();
      botaoAlternarMenu.focus();
    }
  });

  renderizarPedido();

  // --- AJUSTES DE RESPONSIVIDADE ---
  const rotulosCurtos = {
    "Burguer's": "Burgers",
    "Combo Burguer's": "Combos",
    Acompanhamentos: "Acomp.",
  };

  function ajustarTextoDoMenu() {
    const compacto = window.innerWidth > 768 && window.innerWidth < 1000;

    linksDeNavegacao.forEach((link) => {
      const rotulo = link.querySelector(".nav-label");
      if (!rotulo) {
        return;
      }

      const longo = link.dataset.long || rotulo.textContent;
      const curto = rotulosCurtos[longo];
      rotulo.textContent = compacto && curto ? curto : longo;

      if (compacto && curto) {
        link.setAttribute("title", longo);
      } else {
        link.removeAttribute("title");
      }
    });
  }

  let temporizadorResize;
  window.addEventListener("resize", function () {
    clearTimeout(temporizadorResize);
    temporizadorResize = setTimeout(() => {
      ajustarTextoDoMenu();
      atualizarAlturaCabecalho();
      if (window.innerWidth > 768) {
        fecharMenuMobileSeAberto();
      }
    }, 100);
  });

  window.addEventListener("load", atualizarAlturaCabecalho);
  ajustarTextoDoMenu();
  atualizarAlturaCabecalho();

  // --- RODAPÉ ---
  const anoRodape = document.querySelector(".footer-year");
  if (anoRodape) {
    anoRodape.textContent = String(new Date().getFullYear());
  }

  console.log("JavaScript configurado com sucesso!");
});
