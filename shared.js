// Formatação
const brl = (n) => {
  const cents = Number.isInteger(Math.round(n * 100) / 100) ? 0 : 2;
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: cents, maximumFractionDigits: cents });
};

// Frete
const FREE_SHIPPING = 1000;
const SHIPPING = 45;
const shippingFor = (subtotal) => (subtotal >= FREE_SHIPPING || subtotal === 0 ? 0 : SHIPPING);

// Sacola — guardada no navegador
const Cart = {
  key: "obra-cart",
  read() {
    try { return JSON.parse(localStorage.getItem(this.key)) || []; } catch { return []; }
  },
  write(items) {
    try { localStorage.setItem(this.key, JSON.stringify(items)); } catch {}
    updateCartCount();
    document.dispatchEvent(new CustomEvent("cart:change"));
  },
  add(id, color, size, qty = 1) {
    const items = this.read();
    const hit = items.find((i) => i.id === id && i.color === color && i.size === size);
    if (hit) hit.qty += qty; else items.push({ id, color, size, qty });
    this.write(items);
  },
  setQty(index, qty) {
    const items = this.read();
    if (qty <= 0) items.splice(index, 1); else items[index].qty = qty;
    this.write(items);
  },
  count() { return this.read().reduce((s, i) => s + i.qty, 0); },
  subtotal() {
    return this.read().reduce((s, i) => s + (findProduct(i.id)?.price || 0) * i.qty, 0);
  },
};

// Armazenamento local (demonstração — um site real guarda isso num servidor)
const Store = {
  get(key, fallback) {
    try { const v = JSON.parse(localStorage.getItem(key)); return v ?? fallback; } catch { return fallback; }
  },
  set(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
  },
};

// Conta — nunca guarda senha
const Account = {
  profile: () => Store.get("obra-profile", null),
  user() { return Store.get("obra-session", false) ? this.profile() : null; },
  login(profile) { Store.set("obra-profile", profile); Store.set("obra-session", true); },
  logout() { Store.set("obra-session", false); },
  update(fields) { Store.set("obra-profile", { ...this.profile(), ...fields }); },

  orders: () => Store.get("obra-orders", []),
  addOrder(order) { Store.set("obra-orders", [order, ...this.orders()]); },

  addresses: () => Store.get("obra-addresses", []),
  setAddresses(list) { Store.set("obra-addresses", list); },
  defaultAddress() { const a = this.addresses(); return a.find((x) => x.default) || a[0] || null; },

  wishlist: () => Store.get("obra-wishlist", []),
  inWish(id) { return this.wishlist().includes(id); },
  toggleWish(id) {
    const list = this.wishlist();
    const i = list.indexOf(id);
    if (i >= 0) list.splice(i, 1); else list.unshift(id);
    Store.set("obra-wishlist", list);
    return i < 0;
  },
};

// Medidas do corpo salvas pelo Provador
const Body = {
  get: () => Store.get("obra-body", {}),
  set(body) { Store.set("obra-body", body); },
};

function updateCartCount() {
  const el = document.getElementById("cartCount");
  if (el) el.textContent = String(Cart.count()).padStart(2, "0");
}

// Cabeçalho, busca e rodapé comuns a todas as páginas
function renderChrome() {
  const page = document.body.dataset.page;
  const isHome = page === "home";

  // Checkout: cabeçalho mínimo, sem distrações
  if (page === "checkout") {
    document.getElementById("site-header").outerHTML = `
    <header class="nav is-scrolled nav--checkout">
      <a href="sacola.html" class="label">← Voltar à sacola</a>
      <a href="index.html" class="nav__logo">Obra Studios</a>
      <span class="label muted nav__secure">Compra segura</span>
    </header>`;
    document.getElementById("site-footer").outerHTML = `
    <footer class="footer footer--min">
      <div class="footer__bottom">
        <span class="label">© 2026 Obra Studios</span>
        <span class="label"><a href="privacidade.html" target="_blank" rel="noopener">Privacidade</a> · <a href="termos.html" target="_blank" rel="noopener">Termos</a></span>
      </div>
    </footer>`;
    return;
  }

  document.getElementById("site-header").outerHTML = `
  <header class="nav${isHome ? "" : " is-scrolled"}" id="nav">
    <button class="nav__toggle label" id="menuToggle" aria-expanded="false" aria-controls="menu">Menu</button>
    <nav class="nav__group nav__group--left" id="menu" aria-label="Categorias">
      <a href="categoria.html?g=feminino" class="label">Feminino</a>
      <a href="categoria.html?g=masculino" class="label">Masculino</a>
      <a href="categoria.html?g=todos&tipo=Bolsas" class="label">Bolsas</a>
      <a href="desfile.html" class="label">Desfile</a>
      <a href="provador.html" class="label">Provador</a>
      <a href="conta.html" class="label show-sm">Conta</a>
      <a href="ajuda.html" class="label show-sm">Ajuda</a>
    </nav>
    <a href="index.html" class="nav__logo" aria-label="Obra Studios — início">Obra Studios</a>
    <div class="nav__group nav__group--right">
      <button class="label nav__search" id="searchOpen">Buscar</button>
      <a href="ajuda.html" class="label hide-sm">Ajuda</a>
      <a href="conta.html" class="label hide-sm">${Account.user() ? "Minha conta" : "Conta"}</a>
      <a href="sacola.html" class="label">Sacola (<span id="cartCount">00</span>)</a>
    </div>
  </header>
  <div class="search" id="search" hidden>
    <form class="search__form" role="search" onsubmit="return false">
      <input class="search__input" id="searchInput" type="search" placeholder="Buscar" aria-label="Buscar produtos" autocomplete="off">
      <button type="button" class="label" id="searchClose">Fechar</button>
    </form>
    <ul class="search__results" id="searchResults"></ul>
  </div>
  <div class="toast" id="toast" hidden>
    <img id="toastImg" alt="">
    <div class="toast__body">
      <p class="label">Adicionado à sacola</p>
      <p class="label muted" id="toastText"></p>
      <a href="sacola.html" class="label link">Ver sacola</a>
    </div>
  </div>`;

  document.getElementById("site-footer").outerHTML = `
  <footer class="footer">
    <div class="footer__cols">
      <div>
        <p class="label muted">Atendimento</p>
        <a href="ajuda.html#contato" class="label">Contato</a>
        <a href="ajuda.html#envios" class="label">Envios</a>
        <a href="ajuda.html#trocas" class="label">Trocas e devoluções</a>
        <a href="ajuda.html#medidas" class="label">Guia de medidas</a>
      </div>
      <div>
        <p class="label muted">Empresa</p>
        <a href="sobre.html" class="label">Sobre</a>
        <a href="lojas.html" class="label">Lojas</a>
        <a href="carreiras.html" class="label">Carreiras</a>
        <a href="sustentabilidade.html" class="label">Sustentabilidade</a>
      </div>
      <div>
        <p class="label muted">Siga</p>
        <a href="#" class="label">Instagram</a>
        <a href="#" class="label">Pinterest</a>
        <a href="#" class="label">Spotify</a>
      </div>
      <form class="newsletter" onsubmit="return false">
        <label class="label muted" for="email">Newsletter</label>
        <div class="newsletter__row">
          <input id="email" type="email" class="label" placeholder="Seu e-mail">
          <button type="submit" class="label link">Inscrever</button>
        </div>
      </form>
    </div>
    <div class="footer__bottom">
      <span class="label">© 2026 Obra Studios · <a href="https://unsplash.com" target="_blank" rel="noopener">Fotos: Unsplash</a></span>
      <span class="label footer__legal"><a href="privacidade.html">Privacidade</a> · <a href="termos.html">Termos</a> · Brasil / BRL</span>
    </div>
  </footer>`;

  updateCartCount();

  // Menu mobile
  const nav = document.getElementById("nav");
  const toggle = document.getElementById("menuToggle");
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", open);
    toggle.textContent = open ? "Fechar" : "Menu";
  });

  // Busca com resultados ao digitar
  const search = document.getElementById("search");
  const input = document.getElementById("searchInput");
  const results = document.getElementById("searchResults");
  const showResults = () => {
    const q = input.value.trim().toLowerCase();
    const list = q
      ? PRODUCTS.filter((p) => (p.name + " " + p.cat).toLowerCase().includes(q))
      : PRODUCTS.slice(0, 4);
    results.innerHTML = list.length
      ? list.map((p) => `<li><a href="produto.html?id=${p.id}" class="label">${p.name}</a><span class="label muted">${brl(p.price)}</span></li>`).join("")
      : `<li><span class="label muted">Nenhum resultado para “${input.value}”</span></li>`;
  };
  input.addEventListener("input", showResults);
  document.getElementById("searchOpen").addEventListener("click", () => {
    search.hidden = false;
    showResults();
    input.focus();
  });
  const close = () => (search.hidden = true);
  document.getElementById("searchClose").addEventListener("click", close);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });

  // Sincroniza entre abas
  window.addEventListener("storage", (e) => {
    if (e.key === Cart.key) { updateCartCount(); document.dispatchEvent(new CustomEvent("cart:change")); }
  });
}

// Aviso de "adicionado"
let toastTimer;
function showToast(product, color, size) {
  const toast = document.getElementById("toast");
  document.getElementById("toastImg").src = productImg(product.id, 1, 200, 266);
  document.getElementById("toastText").textContent = `${product.name} — ${color} — ${size}`;
  toast.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => (toast.hidden = true), 3500);
}

// Célula de produto usada nas grades
function productCell(p) {
  const sizes = p.sizes
    .map((s) => `<button class="label" data-add="${p.id}" data-size="${s}">${s}</button>`)
    .join("");
  return `
  <article class="cell">
    <a href="produto.html?id=${p.id}" class="cell__caption"><span class="label">${p.cat}</span></a>
    <div class="cell__media">
      <a href="produto.html?id=${p.id}" aria-label="${p.name}">
        <img src="${productImg(p.id, 1)}" alt="${p.name}" loading="lazy">
        <img src="${productImg(p.id, 2)}" alt="" loading="lazy" aria-hidden="true">
      </a>
      <div class="cell__sizes" aria-label="Adicionar rápido">${sizes}</div>
    </div>
    <a href="produto.html?id=${p.id}" class="cell__caption cell__caption--below">
      <span class="label">${p.name}</span>
      <span class="label cell__price">${brl(p.price)}</span>
    </a>
  </article>`;
}

// Adição rápida pelos tamanhos da grade
document.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-add]");
  if (!btn) return;
  const p = findProduct(btn.dataset.add);
  Cart.add(p.id, p.colors[0], btn.dataset.size);
  showToast(p, p.colors[0], btn.dataset.size);
});

renderChrome();
