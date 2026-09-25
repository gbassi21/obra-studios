// Página de categoria com filtros
const GENDERS = {
  feminino: { title: "Feminino", section: "novidades" },
  masculino: { title: "Masculino", section: "masculino" },
  todos: { title: "Todos os produtos", section: null },
};

const PRICE_RANGES = [
  { id: "ate-1000", label: "Até R$ 1.000", min: 0, max: 1000 },
  { id: "1000-3000", label: "R$ 1.000 – R$ 3.000", min: 1000, max: 3000 },
  { id: "3000-6000", label: "R$ 3.000 – R$ 6.000", min: 3000, max: 6000 },
  { id: "acima-6000", label: "Acima de R$ 6.000", min: 6000, max: Infinity },
];

const SIZE_ORDER = ["PP", "P", "M", "G", "GG", "34", "35", "36", "37", "38", "39", "40", "42", "44", "46", "Único"];

// Estado vem do endereço da página: ?g=feminino&tipo=Bolsas&tam=M&cor=Preto&preco=ate-1000&ordem=menor
const params = new URLSearchParams(location.search);
const gender = GENDERS[params.get("g")] ? params.get("g") : "todos";
const state = {
  tipo: params.getAll("tipo"),
  tam: params.getAll("tam"),
  cor: params.getAll("cor"),
  preco: params.getAll("preco"),
  ordem: params.get("ordem") || "relevancia",
};

const base = PRODUCTS.filter((p) => !GENDERS[gender].section || p.section === GENDERS[gender].section);
const $ = (id) => document.getElementById(id);
const uniq = (arr) => [...new Set(arr)];

function renderTitle() {
  const title = gender === "todos" && state.tipo.length === 1 ? state.tipo[0] : GENDERS[gender].title;
  $("title").textContent = title;
  document.title = `${title} — Obra Studios`;
}

// Filtragem — "ignore" deixa de fora um grupo para calcular as contagens dele
function matches(p, ignore) {
  const inPrice = (r) => { const range = PRICE_RANGES.find((x) => x.id === r); return p.price >= range.min && p.price < range.max; };
  return (
    (ignore === "tipo" || !state.tipo.length || state.tipo.includes(p.cat)) &&
    (ignore === "tam" || !state.tam.length || p.sizes.some((s) => state.tam.includes(s))) &&
    (ignore === "cor" || !state.cor.length || p.colors.some((c) => state.cor.includes(c))) &&
    (ignore === "preco" || !state.preco.length || state.preco.some(inPrice))
  );
}

function results() {
  const list = base.filter((p) => matches(p));
  const sorters = {
    menor: (a, b) => a.price - b.price,
    maior: (a, b) => b.price - a.price,
    az: (a, b) => a.name.localeCompare(b.name, "pt-BR"),
  };
  return sorters[state.ordem] ? list.sort(sorters[state.ordem]) : list;
}

const count = (group, test) => base.filter((p) => matches(p, group) && test(p)).length;

// Painel de filtros
function renderFilters() {
  const types = uniq(base.map((p) => p.cat));
  $("fType").innerHTML = types
    .map((t) => {
      const n = count("tipo", (p) => p.cat === t);
      return `<label class="check label${n ? "" : " is-empty"}"><input type="checkbox" data-group="tipo" value="${t}"${state.tipo.includes(t) ? " checked" : n ? "" : " disabled"}> ${t} <span class="muted">${n}</span></label>`;
    })
    .join("");

  const sizes = uniq(base.flatMap((p) => p.sizes)).sort((a, b) => SIZE_ORDER.indexOf(a) - SIZE_ORDER.indexOf(b));
  $("fSize").innerHTML = sizes
    .map((s) => {
      const on = state.tam.includes(s);
      const n = count("tam", (p) => p.sizes.includes(s));
      return `<button class="label option${on ? " is-active" : ""}${n ? "" : " is-empty"}" data-group="tam" value="${s}" aria-pressed="${on}"${on || n ? "" : " disabled"}>${s}</button>`;
    })
    .join("");

  const colors = uniq(base.flatMap((p) => p.colors)).sort((a, b) => a.localeCompare(b, "pt-BR"));
  $("fColor").innerHTML = colors
    .map((c) => {
      const n = count("cor", (p) => p.colors.includes(c));
      return `<label class="check label${n ? "" : " is-empty"}"><input type="checkbox" data-group="cor" value="${c}"${state.cor.includes(c) ? " checked" : n ? "" : " disabled"}> ${c} <span class="muted">${n}</span></label>`;
    })
    .join("");

  $("fPrice").innerHTML = PRICE_RANGES
    .map((r) => {
      const n = count("preco", (p) => p.price >= r.min && p.price < r.max);
      return `<label class="check label${n ? "" : " is-empty"}"><input type="checkbox" data-group="preco" value="${r.id}"${state.preco.includes(r.id) ? " checked" : n ? "" : " disabled"}> ${r.label} <span class="muted">${n}</span></label>`;
    })
    .join("");

  document.querySelectorAll('#fSort input').forEach((i) => (i.checked = i.value === state.ordem));
}

// Atalhos de tipo no topo
function renderTypes() {
  const types = uniq(base.map((p) => p.cat));
  const all = !state.tipo.length;
  $("types").innerHTML =
    `<button class="label${all ? " is-active" : ""}" data-type="">Ver tudo</button>` +
    types.map((t) => `<button class="label${state.tipo.length === 1 && state.tipo[0] === t ? " is-active" : ""}" data-type="${t}">${t}</button>`).join("");
}

// Filtros ativos como etiquetas removíveis
function renderChips() {
  const priceLabel = (id) => PRICE_RANGES.find((r) => r.id === id)?.label;
  const chips = [
    ...state.tipo.map((v) => ["tipo", v, v]),
    ...state.tam.map((v) => ["tam", v, `Tamanho ${v}`]),
    ...state.cor.map((v) => ["cor", v, v]),
    ...state.preco.map((v) => ["preco", v, priceLabel(v)]),
  ];
  $("chips").innerHTML = chips.length
    ? chips.map(([g, v, l]) => `<button class="label chip" data-remove-group="${g}" value="${v}" aria-label="Remover filtro ${l}">${l} ×</button>`).join("") +
      `<button class="label link" data-clear>Limpar tudo</button>`
    : "";
  const active = chips.length;
  $("filterBadge").textContent = active ? `(${active})` : "";
}

function renderGrid() {
  const list = results();
  $("plpGrid").innerHTML = list.map(productCell).join("");
  $("resultCount").textContent = `${list.length} ${list.length === 1 ? "produto" : "produtos"}`;
  $("empty").hidden = list.length > 0;
  $("filterApply").textContent = `Ver ${list.length} ${list.length === 1 ? "produto" : "produtos"}`;
}

function syncUrl() {
  const q = new URLSearchParams({ g: gender });
  ["tipo", "tam", "cor", "preco"].forEach((k) => state[k].forEach((v) => q.append(k, v)));
  if (state.ordem !== "relevancia") q.set("ordem", state.ordem);
  history.replaceState(null, "", `?${q}`);
}

function update() {
  const f = document.activeElement;
  const key = f && f.closest("#filters") && (f.dataset.group || f.name)
    ? `${f.dataset.group ? `[data-group="${f.dataset.group}"]` : `[name="${f.name}"]`}[value="${CSS.escape(f.value)}"]`
    : null;
  renderFilters();
  if (key) document.querySelector(`#filters ${key}`)?.focus();
  renderTitle();
  renderTypes();
  renderChips();
  renderGrid();
  syncUrl();
}

function toggle(group, value) {
  const list = state[group];
  const i = list.indexOf(value);
  if (i >= 0) list.splice(i, 1); else list.push(value);
  update();
}

function clearAll() {
  state.tipo = []; state.tam = []; state.cor = []; state.preco = []; state.ordem = "relevancia";
  update();
}

// Eventos
$("filters").addEventListener("change", (e) => {
  const t = e.target;
  if (t.name === "sort") { state.ordem = t.value; update(); }
  else if (t.dataset.group) toggle(t.dataset.group, t.value);
});
$("filters").addEventListener("click", (e) => {
  const b = e.target.closest("button[data-group]");
  if (b) toggle(b.dataset.group, b.value);
});
$("types").addEventListener("click", (e) => {
  const b = e.target.closest("[data-type]");
  if (!b) return;
  state.tipo = b.dataset.type ? [b.dataset.type] : [];
  update();
});
$("chips").addEventListener("click", (e) => {
  const b = e.target.closest("[data-remove-group]");
  if (b) toggle(b.dataset.removeGroup, b.value);
});
document.addEventListener("click", (e) => { if (e.target.closest("[data-clear]")) clearAll(); });

// Colunas 2 / 4
const grid = $("plpGrid");
function setCols(n) {
  grid.classList.toggle("grid--2", n === "2");
  document.querySelectorAll(".view-btn").forEach((b) => {
    const on = b.dataset.cols === n;
    b.classList.toggle("is-active", on);
    b.setAttribute("aria-pressed", on);
  });
  try { localStorage.setItem("obra-cols", n); } catch {}
}
document.querySelectorAll(".view-btn").forEach((b) => b.addEventListener("click", () => setCols(b.dataset.cols)));
try { const saved = localStorage.getItem("obra-cols"); if (saved) setCols(saved); } catch {}

// Abrir e fechar o painel
const drawer = $("filters");
function openDrawer() {
  drawer.classList.add("is-open");
  drawer.setAttribute("aria-hidden", "false");
  $("backdrop").hidden = false;
  $("filterOpen").setAttribute("aria-expanded", "true");
  document.body.style.overflow = "hidden";
  $("filterClose").focus();
}
function closeDrawer() {
  drawer.classList.remove("is-open");
  drawer.setAttribute("aria-hidden", "true");
  $("backdrop").hidden = true;
  $("filterOpen").setAttribute("aria-expanded", "false");
  document.body.style.overflow = "";
}
$("filterOpen").addEventListener("click", openDrawer);
$("filterClose").addEventListener("click", closeDrawer);
$("filterApply").addEventListener("click", closeDrawer);
$("backdrop").addEventListener("click", closeDrawer);
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeDrawer(); });

update();
