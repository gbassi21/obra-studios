// Página de produto
const params = new URLSearchParams(location.search);
const product = findProduct(params.get("id")) || PRODUCTS[0];

let color = product.colors[0];
let size = product.sizes.length === 1 ? product.sizes[0] : null;

// Tamanho recomendado pelo Provador (se a pessoa salvou as medidas)
const fit = recommendSize(product, Body.get());
const fitNote = document.getElementById("fitNote");
if (product.fit && fit.size) {
  size = size || fit.size;
  fitNote.innerHTML = `Seu tamanho: <strong>${fit.size}</strong>${fit.alt ? ` (ou ${fit.alt})` : ""} · <a href="provador.html?id=${product.id}" class="link">ver por quê</a>`;
} else if (product.fit) {
  fitNote.innerHTML = `<a href="provador.html?id=${product.id}" class="link">Descubra seu tamanho no Provador →</a>`;
} else {
  fitNote.hidden = true;
}

document.title = `${product.name} — Obra Studios`;

document.getElementById("crumbs").innerHTML =
  `<a href="index.html">Início</a> / <a href="categoria.html?g=${product.section === "masculino" ? "masculino" : "feminino"}&tipo=${encodeURIComponent(product.cat)}">${product.cat}</a>`;
document.getElementById("name").textContent = product.name;
document.getElementById("price").textContent = brl(product.price);
document.getElementById("desc").textContent = product.desc;
document.getElementById("comp").textContent = product.comp;

// Galeria — imagens empilhadas, sem espaço entre elas
document.getElementById("gallery").innerHTML = [1, 2, 3, 4]
  .map((n) => `<img src="${productImg(product.id, n, 1000, 1333)}" alt="${product.name}, foto ${n}"${n > 2 ? ' loading="lazy"' : ""}>`)
  .join("");

// Opções
function renderOptions() {
  document.getElementById("colorName").textContent = color;
  document.getElementById("colors").innerHTML = product.colors
    .map((c) => `<button class="label option${c === color ? " is-active" : ""}" data-color="${c}" aria-pressed="${c === color}">${c}</button>`)
    .join("");
  document.getElementById("sizes").innerHTML = product.sizes
    .map((s) => `<button class="label option${s === size ? " is-active" : ""}" data-size="${s}" aria-pressed="${s === size}">${s}</button>`)
    .join("");
  const btn = document.getElementById("addBtn");
  btn.textContent = size ? `Adicionar à sacola — ${brl(product.price)}` : "Selecione um tamanho";
  btn.classList.toggle("is-waiting", !size);
}

document.getElementById("pdp").addEventListener("click", (e) => {
  const c = e.target.closest("[data-color]");
  const s = e.target.closest(".options [data-size]");
  if (c) { color = c.dataset.color; renderOptions(); }
  if (s) { size = s.dataset.size; renderOptions(); }
});

document.getElementById("addBtn").addEventListener("click", () => {
  if (!size) {
    const sizes = document.getElementById("sizes");
    sizes.classList.remove("shake");
    void sizes.offsetWidth;
    sizes.classList.add("shake");
    return;
  }
  Cart.add(product.id, color, size);
  showToast(product, color, size);
});

renderOptions();

// Lista de desejos
const wishBtn = document.getElementById("wishBtn");
function renderWish() {
  const on = Account.inWish(product.id);
  wishBtn.textContent = on ? "♥ Na lista de desejos" : "♡ Adicionar à lista de desejos";
  wishBtn.setAttribute("aria-pressed", on);
}
wishBtn.addEventListener("click", () => { Account.toggleWish(product.id); renderWish(); });
renderWish();

// Relacionados — mesma seção, sem o produto atual
document.getElementById("related").innerHTML = PRODUCTS
  .filter((p) => p.id !== product.id)
  .sort((a, b) => (b.section === product.section) - (a.section === product.section))
  .slice(0, 4)
  .map(productCell)
  .join("");
