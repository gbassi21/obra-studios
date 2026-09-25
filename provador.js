// Provador: recomendação de tamanho + montagem de looks
const $ = (id) => document.getElementById(id);
const params = new URLSearchParams(location.search);
const focusId = params.get("id"); // vindo da página de produto

/* ---------- Seu tamanho ---------- */

const FIELDS = { busto: "bBusto", cintura: "bCintura", quadril: "bQuadril", pe: "bPe" };
let body = { pref: "regular", ...Body.get() };
let sizeGender = "";

// Preenche o formulário com o que já foi salvo
Object.entries(FIELDS).forEach(([k, id]) => { if (body[k]) $(id).value = body[k]; });
setPref(body.pref || "regular");

function readBody() {
  const b = { pref: body.pref };
  Object.entries(FIELDS).forEach(([k, id]) => {
    const v = parseFloat($(id).value.replace(",", "."));
    const el = $(id);
    if (!isNaN(v) && (v < +el.min || v > +el.max)) el.classList.add("is-invalid");
    else el.classList.remove("is-invalid");
    if (!isNaN(v) && v >= +el.min && v <= +el.max) b[k] = v;
  });
  return b;
}

function setPref(p) {
  body.pref = p;
  document.querySelectorAll("[data-pref]").forEach((b) => {
    const on = b.dataset.pref === p;
    b.classList.toggle("is-active", on);
    b.setAttribute("aria-pressed", on);
  });
}

const STATUS = {
  ideal: "Caimento ideal",
  entre: "Entre dois tamanhos",
  unico: "Tamanho único",
  falta: "Faltam medidas",
  fora: "Fora da grade",
};

function renderFit() {
  body = readBody();
  const list = PRODUCTS
    .filter((p) => !sizeGender || p.section === sizeGender)
    .sort((a, b) => (b.id === focusId) - (a.id === focusId));
  $("fitList").innerHTML = list.map((p) => {
    const r = recommendSize(p, body);
    const big = r.size ? r.size : "—";
    const action = r.size
      ? `<button class="label link" data-add="${p.id}" data-size="${r.size}">Adicionar ${r.size} à sacola</button>`
      : "";
    return `
    <li class="fit-row${p.id === focusId ? " is-focus" : ""}" data-status="${r.status}">
      <a href="produto.html?id=${p.id}" class="fit-row__img"><img src="${productImg(p.id, 1, 160, 213)}" alt="" loading="lazy"></a>
      <div class="fit-row__info">
        <a href="produto.html?id=${p.id}" class="label">${p.name}</a>
        <p class="label muted">${p.cat}${p.cut ? ` — modelagem ${p.cut}` : ""}</p>
        <p class="fit-row__why">${r.text}</p>
        ${action}
      </div>
      <div class="fit-row__size">
        <span class="fit-row__big">${big}</span>
        <span class="label fit-badge fit-badge--${r.status}">${STATUS[r.status]}${r.alt ? ` · ou ${r.alt}` : ""}</span>
      </div>
    </li>`;
  }).join("");
}

$("bodyForm").addEventListener("input", renderFit);
$("prefOptions").addEventListener("click", (e) => {
  const b = e.target.closest("[data-pref]");
  if (b) { setPref(b.dataset.pref); renderFit(); }
});
$("bodyForm").addEventListener("submit", (e) => {
  e.preventDefault();
  Body.set(readBody());
  $("bodySaved").hidden = false;
  renderLook(); // tamanhos do look passam a usar as medidas
});
$("bodyClear").addEventListener("click", () => {
  Object.values(FIELDS).forEach((id) => { $(id).value = ""; $(id).classList.remove("is-invalid"); });
  setPref("regular");
  Body.set({});
  $("bodySaved").hidden = true;
  renderFit();
  renderLook();
});
$("sizeFilter").addEventListener("click", (e) => {
  const b = e.target.closest("[data-g]");
  if (!b) return;
  sizeGender = b.dataset.g;
  $("sizeFilter").querySelectorAll("button").forEach((x) => x.classList.toggle("is-active", x === b));
  renderFit();
});

/* ---------- Monte o look ---------- */

const SLOTS = [
  { key: "cima", label: "Parte de cima" },
  { key: "baixo", label: "Parte de baixo" },
  { key: "calcado", label: "Calçado" },
  { key: "acessorio", label: "Acessório" },
];
let lookGender = "";
const look = {}; // slot -> índice na lista de opções (-1 = vazio)
const chosenSize = {}; // id -> tamanho escolhido à mão

const options = (slot) => PRODUCTS.filter((p) => p.slot === slot && (!lookGender || p.section === lookGender || p.slot === "calcado" || p.slot === "acessorio"));
const current = (slot) => options(slot)[look[slot]] || null;

// Look inicial: vindo do link (?look=id,id) ou o primeiro de cada categoria
const shared = (params.get("look") || "").split(",").filter(Boolean);
SLOTS.forEach(({ key }) => {
  const opts = options(key);
  const fromLink = opts.findIndex((p) => shared.includes(p.id));
  look[key] = shared.length ? fromLink : focusId && opts.some((p) => p.id === focusId) ? opts.findIndex((p) => p.id === focusId) : 0;
});

function sizeFor(p) {
  if (chosenSize[p.id]) return chosenSize[p.id];
  const r = recommendSize(p, Body.get());
  return r.size || null;
}

function renderBoard(changed, dir = 1) {
  $("board").innerHTML = SLOTS.map(({ key, label }) => {
    const p = current(key);
    const n = options(key).length;
    return `
    <div class="board__slot board__slot--${key}${p ? "" : " is-empty"}" data-slot="${key}">
      <div class="board__img${changed === key || changed === "all" ? ` is-changing dir-${dir > 0 ? "next" : "prev"}` : ""}">
        ${p ? `<img src="${productImg(p.id, 1, 700, 933)}" alt="${p.name}">` : `<span class="label muted">Sem ${label.toLowerCase()}</span>`}
      </div>
      <div class="board__bar">
        <button class="label board__nav" data-step="-1" data-slot="${key}" aria-label="${label}: anterior">←</button>
        <span class="label board__label">${label}${p ? ` · ${look[key] + 1}/${n}` : ""}</span>
        <button class="label board__nav" data-step="1" data-slot="${key}" aria-label="${label}: próxima">→</button>
      </div>
      ${key !== "cima" && key !== "baixo" ? `<button class="label board__toggle" data-toggle="${key}">${p ? "Remover" : "Incluir"}</button>` : ""}
    </div>`;
  }).join("");
}

function renderItems() {
  const items = SLOTS.map(({ key }) => current(key)).filter(Boolean);
  $("lookItems").innerHTML = items.map((p) => {
    const s = sizeFor(p);
    const rec = recommendSize(p, Body.get());
    return `
    <li class="fit-look__item">
      <img src="${productImg(p.id, 1, 120, 160)}" alt="">
      <div>
        <a href="produto.html?id=${p.id}" class="label">${p.name}</a>
        <p class="label muted">${brl(p.price)}</p>
      </div>
      <label class="fit-look__size">
        <span class="label muted">${rec.size && !chosenSize[p.id] && rec.status !== "unico" ? "Seu tamanho" : "Tamanho"}</span>
        <select class="label" data-size-for="${p.id}" aria-label="Tamanho de ${p.name}">
          ${s ? "" : `<option value="">Escolha</option>`}
          ${p.sizes.map((x) => `<option${x === s ? " selected" : ""}>${x}</option>`).join("")}
        </select>
      </label>
    </li>`;
  }).join("");
  $("lookTotal").textContent = brl(items.reduce((t, p) => t + p.price, 0));
}

function renderLook(changed, dir) {
  renderBoard(changed, dir);
  renderItems();
  $("lookMsg").textContent = "";
}

function step(slot, d) {
  const n = options(slot).length;
  look[slot] = look[slot] < 0 ? 0 : (look[slot] + d + n) % n;
  renderLook(slot, d);
}

$("board").addEventListener("click", (e) => {
  const nav = e.target.closest("[data-step]");
  const tog = e.target.closest("[data-toggle]");
  if (nav) step(nav.dataset.slot, +nav.dataset.step);
  if (tog) {
    const k = tog.dataset.toggle;
    look[k] = look[k] < 0 ? 0 : -1;
    renderLook(k, 1);
  }
});

// Setas do teclado trocam a peça do slot focado
$("board").addEventListener("keydown", (e) => {
  const slot = e.target.closest("[data-slot]")?.dataset.slot;
  if (!slot || !["ArrowLeft", "ArrowRight"].includes(e.key)) return;
  step(slot, e.key === "ArrowRight" ? 1 : -1);
  $("board").querySelector(`[data-slot="${slot}"] [data-step="${e.key === "ArrowRight" ? 1 : -1}"]`)?.focus();
});

$("lookItems").addEventListener("change", (e) => {
  const sel = e.target.closest("[data-size-for]");
  if (sel) { chosenSize[sel.dataset.sizeFor] = sel.value; renderItems(); }
});

$("shuffle").addEventListener("click", () => {
  SLOTS.forEach(({ key }) => {
    const n = options(key).length;
    look[key] = key === "acessorio" && Math.random() < 0.25 ? -1 : Math.floor(Math.random() * n);
  });
  renderBoard("all");
  renderItems();
  $("lookMsg").textContent = "";
});

$("lookFilter").addEventListener("click", (e) => {
  const b = e.target.closest("[data-g]");
  if (!b) return;
  lookGender = b.dataset.g;
  $("lookFilter").querySelectorAll("button").forEach((x) => x.classList.toggle("is-active", x === b));
  SLOTS.forEach(({ key }) => { if (look[key] >= options(key).length) look[key] = 0; if (look[key] >= 0 && !current(key)) look[key] = 0; });
  renderLook();
});

$("addLook").addEventListener("click", () => {
  const items = SLOTS.map(({ key }) => current(key)).filter(Boolean);
  const noSize = items.filter((p) => !sizeFor(p));
  if (noSize.length) {
    $("lookMsg").textContent = `Escolha o tamanho de: ${noSize.map((p) => p.name).join(", ")}.`;
    $("lookItems").querySelector(`[data-size-for="${noSize[0].id}"]`)?.focus();
    return;
  }
  items.forEach((p) => Cart.add(p.id, p.colors[0], sizeFor(p)));
  showToast(items[0], items[0].colors[0], sizeFor(items[0]));
  $("lookMsg").innerHTML = `${items.length} peças adicionadas. <a href="sacola.html" class="link">Ver sacola</a>`;
});

$("shareLook").addEventListener("click", async () => {
  const ids = SLOTS.map(({ key }) => current(key)?.id).filter(Boolean);
  const url = `${location.origin}${location.pathname}?look=${ids.join(",")}#look`;
  try {
    await navigator.clipboard.writeText(url);
    $("lookMsg").textContent = "Link copiado. Mande para quem você quiser.";
  } catch {
    $("lookMsg").textContent = url;
  }
});

renderFit();
renderLook();
if (focusId && !location.hash) $("tamanho").scrollIntoView();
