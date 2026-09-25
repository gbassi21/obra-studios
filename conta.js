// Página de conta
const $ = (id) => document.getElementById(id);
const esc = (s = "") => String(s).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
const digits = (v) => v.replace(/\D/g, "");
const fmtDate = (iso) => new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
const firstName = (name = "") => name.trim().split(/\s+/)[0] || "";

const masks = {
  cpf: (v) => digits(v).slice(0, 11).replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d{1,2})$/, "$1-$2"),
  cep: (v) => digits(v).slice(0, 8).replace(/(\d{5})(\d)/, "$1-$2"),
  phone: (v) => {
    const d = digits(v).slice(0, 11);
    if (d.length <= 2) return d.length ? `(${d}` : "";
    if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
    if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
    return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  },
  date: (v) => digits(v).slice(0, 8).replace(/(\d{2})(\d)/, "$1/$2").replace(/(\d{2})\/(\d{2})(\d)/, "$1/$2/$3"),
};
document.addEventListener("input", (e) => {
  const m = e.target.dataset?.mask;
  if (m) e.target.value = masks[m](e.target.value);
});

// Validação simples de formulário
function check(input) {
  const v = input.value.trim();
  let msg = "";
  if (input.required && !v) msg = "Campo obrigatório";
  else if (input.type === "email" && v && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) msg = "E-mail inválido";
  else if (input.minLength > 0 && v && v.length < input.minLength) msg = input.type === "password" ? `Mínimo de ${input.minLength} caracteres` : "Incompleto";
  const slot = input.parentElement.querySelector(".field__error");
  if (slot) slot.textContent = msg;
  input.classList.toggle("is-invalid", !!msg);
  return !msg;
}
function validForm(form) {
  const bad = [...form.querySelectorAll("input[required], input[minlength]")].filter((i) => !check(i));
  bad[0]?.focus();
  return !bad.length;
}

/* ---------- Visitante ---------- */

$("loginForm").addEventListener("submit", (e) => {
  e.preventDefault();
  if (!validForm(e.target)) return;
  const email = $("loginEmail").value.trim().toLowerCase();
  const saved = Account.profile();
  // Demonstração: qualquer senha com 6+ caracteres entra
  const profile = saved && saved.email === email
    ? saved
    : { name: email.split("@")[0].replace(/[._-]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()), email, news: false };
  Account.login(profile);
  e.target.reset();
  start();
});

$("signupForm").addEventListener("submit", (e) => {
  e.preventDefault();
  if (!validForm(e.target)) return;
  Account.login({
    name: $("signName").value.trim(),
    email: $("signEmail").value.trim().toLowerCase(),
    news: $("signNews").checked,
    since: new Date().toISOString(),
  });
  e.target.reset();
  start();
});

$("forgot").addEventListener("click", (e) => {
  e.preventDefault();
  $("forgotMsg").hidden = false;
});

/* ---------- Conta aberta ---------- */

const TABS = ["visao-geral", "pedidos", "desejos", "enderecos", "dados"];
let editingAddress = null; // id do endereço em edição, "new" para novo

function statusOf(order) {
  // Avança o status com o tempo, só para a demonstração
  const days = (Date.now() - new Date(order.date)) / 864e5;
  if (order.shippingMethod === "retirada") return days > 2 ? "Retirado" : days > 0.02 ? "Pronto para retirada" : "Em preparação";
  return days > 5 ? "Entregue" : days > 1 ? "Enviado" : "Em preparação";
}

function orderRow(o, open = false) {
  const count = o.items.reduce((s, i) => s + i.qty, 0);
  const addr = o.address
    ? `${esc(o.address.name)}<br>${esc(o.address.street)}, ${esc(o.address.number)}${o.address.complement ? " — " + esc(o.address.complement) : ""}<br>${esc(o.address.district)} — ${esc(o.address.city)}<br>${esc(o.address.cep)}`
    : "Retirada na loja — São Paulo, Oscar Freire";
  return `
  <details class="order"${open ? " open" : ""}>
    <summary class="order__row">
      <span class="label">${esc(o.id)}</span>
      <span class="label muted">${fmtDate(o.date)}</span>
      <span class="label">${statusOf(o)}</span>
      <span class="label">${count} ${count === 1 ? "item" : "itens"} — ${brl(o.total)}</span>
    </summary>
    <div class="order__body">
      <ul class="order__items">
        ${o.items.map((i) => {
          const p = findProduct(i.id);
          if (!p) return "";
          return `<li class="co__item">
            <a href="produto.html?id=${p.id}" class="co__thumb"><img src="${productImg(p.id, 1, 200, 266)}" alt="${esc(p.name)}"></a>
            <div><a href="produto.html?id=${p.id}" class="label">${esc(p.name)}</a><p class="label muted">${esc(i.color)} — ${esc(i.size)} — ${i.qty}x</p></div>
            <span class="label">${brl(i.price * i.qty)}</span>
          </li>`;
        }).join("")}
      </ul>
      <div class="order__meta">
        <div><p class="label muted">Entrega</p><p class="label">${addr}</p></div>
        <div><p class="label muted">Pagamento</p><p class="label">${esc(o.payment)}</p></div>
        <div>
          <p class="label muted">Resumo</p>
          <p class="label">Subtotal ${brl(o.subtotal)}</p>
          ${o.discount ? `<p class="label">Desconto − ${brl(o.discount)}</p>` : ""}
          <p class="label">Envio ${o.shipping ? brl(o.shipping) : "grátis"}</p>
          <p class="label">Total ${brl(o.total)}</p>
        </div>
      </div>
      <button class="label link" data-reorder="${esc(o.id)}">Comprar de novo</button>
    </div>
  </details>`;
}

const views = {
  "visao-geral"() {
    const user = Account.user();
    const orders = Account.orders();
    const wish = Account.wishlist();
    const addr = Account.defaultAddress();
    return `
      <div class="acc-stats">
        <a href="#pedidos" class="acc-stat"><span class="acc-stat__num">${orders.length}</span><span class="label muted">Pedidos</span></a>
        <a href="#desejos" class="acc-stat"><span class="acc-stat__num">${wish.length}</span><span class="label muted">Lista de desejos</span></a>
        <a href="#enderecos" class="acc-stat"><span class="acc-stat__num">${Account.addresses().length}</span><span class="label muted">Endereços</span></a>
      </div>
      <h2 class="label co__title">Último pedido</h2>
      ${orders.length ? orderRow(orders[0]) : `<p class="label muted acc-empty">Você ainda não fez pedidos. <a href="categoria.html?g=todos" class="link">Ver produtos</a></p>`}
      <div class="acc-cards">
        <div>
          <h2 class="label co__title">Dados pessoais</h2>
          <p class="label">${esc(user.name)}</p>
          <p class="label muted">${esc(user.email)}</p>
          ${user.phone ? `<p class="label muted">${esc(user.phone)}</p>` : ""}
          <a href="#dados" class="label link">Editar</a>
        </div>
        <div>
          <h2 class="label co__title">Endereço padrão</h2>
          ${addr
            ? `<p class="label">${esc(addr.street)}, ${esc(addr.number)}</p><p class="label muted">${esc(addr.district)} — ${esc(addr.city)}</p><p class="label muted">${esc(addr.cep)}</p>`
            : `<p class="label muted">Nenhum endereço salvo.</p>`}
          <a href="#enderecos" class="label link">${addr ? "Gerenciar" : "Adicionar"}</a>
        </div>
      </div>`;
  },

  pedidos() {
    const orders = Account.orders();
    return `
      <h2 class="label co__title">Pedidos (${orders.length})</h2>
      ${orders.length
        ? `<div class="orders">${orders.map((o, i) => orderRow(o, i === 0)).join("")}</div>`
        : `<p class="label muted acc-empty">Você ainda não fez pedidos. <a href="categoria.html?g=todos" class="link">Ver produtos</a></p>`}`;
  },

  desejos() {
    const list = Account.wishlist().map(findProduct).filter(Boolean);
    return `
      <h2 class="label co__title">Lista de desejos (${list.length})</h2>
      ${list.length
        ? `<div class="grid acc-wish">${list.map((p) => productCell(p).replace("</article>", `<button class="label acc-wish__remove" data-unwish="${p.id}">Remover</button></article>`)).join("")}</div>`
        : `<p class="label muted acc-empty">Sua lista está vazia. Use “Adicionar à lista de desejos” na página de um produto.</p>`}`;
  },

  enderecos() {
    const list = Account.addresses();
    const form = (a = {}) => `
      <form class="acc-form acc-address-form" id="addressForm" novalidate>
        <h3 class="label co__title">${a.id ? "Editar endereço" : "Novo endereço"}</h3>
        <div class="fields">
          <div class="field field--full"><label class="label muted" for="aName">Nome de quem recebe</label><input id="aName" required value="${esc(a.name)}"><span class="field__error label"></span></div>
          <div class="field"><label class="label muted" for="aCep">CEP</label><input id="aCep" data-mask="cep" inputmode="numeric" required minlength="9" value="${esc(a.cep)}"><span class="field__error label"></span><span class="field__hint label muted" id="aCepHint"></span></div>
          <div class="field"><label class="label muted" for="aCity">Cidade / UF</label><input id="aCity" required value="${esc(a.city)}"><span class="field__error label"></span></div>
          <div class="field field--full"><label class="label muted" for="aStreet">Rua</label><input id="aStreet" required value="${esc(a.street)}"><span class="field__error label"></span></div>
          <div class="field"><label class="label muted" for="aNumber">Número</label><input id="aNumber" required value="${esc(a.number)}"><span class="field__error label"></span></div>
          <div class="field"><label class="label muted" for="aComplement">Complemento <span class="opt">(opcional)</span></label><input id="aComplement" value="${esc(a.complement)}"></div>
          <div class="field field--full"><label class="label muted" for="aDistrict">Bairro</label><input id="aDistrict" required value="${esc(a.district)}"><span class="field__error label"></span></div>
        </div>
        <label class="check label"><input type="checkbox" id="aDefault"${a.default || !list.length ? " checked" : ""}> Usar como endereço padrão</label>
        <div class="acc-form__actions">
          <button type="submit" class="label btn">Salvar endereço</button>
          <button type="button" class="label btn btn--ghost" data-cancel-address>Cancelar</button>
        </div>
      </form>`;

    return `
      <h2 class="label co__title">Endereços (${list.length})</h2>
      <div class="addresses">
        ${list.map((a) => editingAddress === a.id ? form(a) : `
          <div class="address">
            ${a.default ? `<p class="label link">Padrão</p>` : ""}
            <p class="label">${esc(a.name)}</p>
            <p class="label muted">${esc(a.street)}, ${esc(a.number)}${a.complement ? " — " + esc(a.complement) : ""}</p>
            <p class="label muted">${esc(a.district)} — ${esc(a.city)}</p>
            <p class="label muted">${esc(a.cep)}</p>
            <div class="address__actions">
              <button class="label" data-edit-address="${a.id}">Editar</button>
              ${a.default ? "" : `<button class="label" data-default-address="${a.id}">Tornar padrão</button>`}
              <button class="label muted" data-remove-address="${a.id}">Remover</button>
            </div>
          </div>`).join("")}
      </div>
      ${editingAddress === "new" ? form() : `<button class="label btn btn--ghost acc-add" data-new-address>+ Adicionar endereço</button>`}`;
  },

  dados() {
    const u = Account.user();
    return `
      <form class="acc-form" id="profileForm" novalidate>
        <h2 class="label co__title">Dados pessoais</h2>
        <div class="fields">
          <div class="field field--full"><label class="label muted" for="pName">Nome completo</label><input id="pName" required value="${esc(u.name)}"><span class="field__error label"></span></div>
          <div class="field field--full"><label class="label muted" for="pEmail">E-mail</label><input id="pEmail" type="email" required value="${esc(u.email)}"><span class="field__error label"></span></div>
          <div class="field"><label class="label muted" for="pPhone">Celular</label><input id="pPhone" data-mask="phone" inputmode="numeric" minlength="14" value="${esc(u.phone)}"><span class="field__error label"></span></div>
          <div class="field"><label class="label muted" for="pCpf">CPF</label><input id="pCpf" data-mask="cpf" inputmode="numeric" minlength="14" value="${esc(u.cpf)}"><span class="field__error label"></span></div>
          <div class="field"><label class="label muted" for="pBirth">Data de nascimento</label><input id="pBirth" data-mask="date" inputmode="numeric" placeholder="DD/MM/AAAA" minlength="10" value="${esc(u.birth)}"><span class="field__error label"></span></div>
        </div>

        <h2 class="label co__title">Preferências</h2>
        <label class="check label"><input type="checkbox" id="pNews"${u.news ? " checked" : ""}> Novidades e lançamentos por e-mail</label>
        <label class="check label"><input type="checkbox" id="pSms"${u.sms ? " checked" : ""}> Avisos de pedido por SMS</label>
        <fieldset class="pdp__field">
          <legend class="label muted">Tenho mais interesse em</legend>
          <div class="options">
            ${["Feminino", "Masculino", "Ambos"].map((o) => `<button type="button" class="label option${(u.pref || "Ambos") === o ? " is-active" : ""}" data-pref="${o}" aria-pressed="${(u.pref || "Ambos") === o}">${o}</button>`).join("")}
          </div>
        </fieldset>

        <div class="acc-form__actions">
          <button type="submit" class="label btn">Salvar alterações</button>
        </div>
        <p class="label link" id="profileSaved" hidden>Alterações salvas.</p>

        <h2 class="label co__title acc-danger">Privacidade</h2>
        <p class="label muted acc-text">Você pode pedir uma cópia dos seus dados ou apagar a conta a qualquer momento, conforme a LGPD.</p>
        <button type="button" class="label muted acc-delete" id="deleteAccount">Apagar minha conta</button>
      </form>`;
  },
};

function currentTab() {
  const h = location.hash.slice(1);
  return TABS.includes(h) ? h : "visao-geral";
}

function renderAccount() {
  const user = Account.user();
  $("hello").textContent = `Olá, ${firstName(user.name)}.`;
  const tab = currentTab();
  document.querySelectorAll("[data-tab]").forEach((a) => {
    const on = a.dataset.tab === tab;
    a.classList.toggle("is-active", on);
    if (on) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
  });
  $("panel").innerHTML = views[tab]();
  document.title = `${document.querySelector(`[data-tab="${tab}"]`).textContent} — Obra Studios`;
}

window.addEventListener("hashchange", () => { editingAddress = null; renderAccount(); });

// Ações dentro do painel
$("panel").addEventListener("click", (e) => {
  const t = e.target.closest("button, a");
  if (!t) return;
  const d = t.dataset;

  if (d.unwish) { Account.toggleWish(d.unwish); renderAccount(); }

  if (d.reorder) {
    const o = Account.orders().find((x) => x.id === d.reorder);
    o.items.forEach((i) => findProduct(i.id) && Cart.add(i.id, i.color, i.size, i.qty));
    location.href = "sacola.html";
  }

  if ("newAddress" in d) { editingAddress = "new"; renderAccount(); $("aName").focus(); }
  if (d.editAddress) { editingAddress = d.editAddress; renderAccount(); $("aName").focus(); }
  if ("cancelAddress" in d) { editingAddress = null; renderAccount(); }
  if (d.removeAddress) {
    let list = Account.addresses().filter((a) => a.id !== d.removeAddress);
    if (list.length && !list.some((a) => a.default)) list[0].default = true;
    Account.setAddresses(list);
    renderAccount();
  }
  if (d.defaultAddress) {
    Account.setAddresses(Account.addresses().map((a) => ({ ...a, default: a.id === d.defaultAddress })));
    renderAccount();
  }

  if (d.pref) {
    document.querySelectorAll("[data-pref]").forEach((b) => {
      const on = b === t;
      b.classList.toggle("is-active", on);
      b.setAttribute("aria-pressed", on);
    });
  }

  if (t.id === "deleteAccount") {
    if (!confirm("Apagar sua conta, pedidos, endereços e lista de desejos deste navegador?")) return;
    ["obra-profile", "obra-session", "obra-orders", "obra-addresses", "obra-wishlist"].forEach((k) => {
      try { localStorage.removeItem(k); } catch {}
    });
    location.hash = "";
    start();
  }
});

$("panel").addEventListener("submit", (e) => {
  e.preventDefault();
  const form = e.target;
  if (!validForm(form)) return;

  if (form.id === "addressForm") {
    const v = (id) => $(id).value.trim();
    const entry = {
      id: editingAddress === "new" ? Date.now().toString(36) : editingAddress,
      name: v("aName"), cep: v("aCep"), city: v("aCity"), street: v("aStreet"),
      number: v("aNumber"), complement: v("aComplement"), district: v("aDistrict"),
      default: $("aDefault").checked,
    };
    let list = Account.addresses();
    if (entry.default) list = list.map((a) => ({ ...a, default: false }));
    const i = list.findIndex((a) => a.id === entry.id);
    if (i >= 0) list[i] = entry; else list.push(entry);
    if (!list.some((a) => a.default)) list[0].default = true;
    Account.setAddresses(list);
    editingAddress = null;
    renderAccount();
  }

  if (form.id === "profileForm") {
    Account.update({
      name: $("pName").value.trim(),
      email: $("pEmail").value.trim().toLowerCase(),
      phone: $("pPhone").value.trim(),
      cpf: $("pCpf").value.trim(),
      birth: $("pBirth").value.trim(),
      news: $("pNews").checked,
      sms: $("pSms").checked,
      pref: document.querySelector("[data-pref].is-active")?.dataset.pref || "Ambos",
    });
    $("hello").textContent = `Olá, ${firstName($("pName").value)}.`;
    $("profileSaved").hidden = false;
    setTimeout(() => { const m = $("profileSaved"); if (m) m.hidden = true; }, 2500);
  }
});

// Busca de endereço pelo CEP no formulário de endereço (ViaCEP)
$("panel").addEventListener("input", async (e) => {
  if (e.target.id !== "aCep") return;
  const cep = digits(e.target.value);
  const hint = $("aCepHint");
  if (cep.length !== 8) { hint.textContent = ""; return; }
  hint.textContent = "Buscando endereço…";
  try {
    const data = await (await fetch(`https://viacep.com.br/ws/${cep}/json/`)).json();
    if (data.erro) throw new Error();
    $("aStreet").value = data.logradouro || "";
    $("aDistrict").value = data.bairro || "";
    $("aCity").value = `${data.localidade} / ${data.uf}`;
    hint.textContent = "";
    $(data.logradouro ? "aNumber" : "aStreet").focus();
  } catch {
    hint.textContent = "CEP não encontrado — preencha o endereço.";
  }
});

$("logout").addEventListener("click", () => {
  Account.logout();
  history.replaceState(null, "", location.pathname);
  start();
});

/* ---------- Início ---------- */

function start() {
  const user = Account.user();
  $("guestView").hidden = !!user;
  $("accountView").hidden = !user;
  // atualiza o texto do link no menu
  document.querySelectorAll('.nav a[href="conta.html"].hide-sm').forEach((a) => (a.textContent = user ? "Minha conta" : "Conta"));
  if (user) renderAccount();
  else document.title = "Conta — Obra Studios";
  window.scrollTo(0, 0);
}

start();
