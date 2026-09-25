// Página de desfile — troque textos, datas e fotos pelos da sua coleção
const SEASONS = [
  { id: "oi26", hero: "1762430815576-6b69de7a1f5f", title: "Outono Inverno 26", place: "São Paulo — Pinacoteca", date: "28.02.2026", looks: 30,
    text: "Uma coleção sobre o que fica. Alfaiataria desmontada e remontada, lãs lavadas até perderem a rigidez, couro envelhecido à mão. Silhuetas longas convivem com volumes curtos e cortes cirúrgicos — a roupa como uma obra em processo, nunca terminada." },
  { id: "pv26", hero: "1762430816003-f3b9e00ea7c4", title: "Primavera Verão 26", place: "Rio de Janeiro — MAM", date: "04.10.2025", looks: 28,
    text: "Transparências, algodões crus e cores tiradas do concreto molhado. Uma temporada leve, pensada para o calor e para o movimento, com peças que se sobrepõem e se desfazem ao longo do dia." },
  { id: "oi25", hero: "1788976783507-79442507bd7c", title: "Outono Inverno 25", place: "São Paulo — Galpão Barra Funda", date: "01.03.2025", looks: 26,
    text: "Referências de uniformes de trabalho reinterpretadas em lã, feltro e denim pesado. Proporções exageradas, bolsos utilitários e uma paleta de cinzas, marrons e um único azul elétrico." },
  { id: "pv25", hero: "1784833170317-982391e74129", title: "Primavera Verão 25", place: "Salvador — Solar do Unhão", date: "05.10.2024", looks: 24,
    text: "Linho, crochê e seda lavada. Uma coleção sobre o mar visto de dentro de casa, com estampas desbotadas pelo sol e modelagens que respiram." },
];

const params = new URLSearchParams(location.search);
const season = SEASONS.find((s) => s.id === params.get("s")) || SEASONS[0];
const $ = (id) => document.getElementById(id);
// Fotos dos looks (Unsplash) — cada temporada começa num ponto diferente da lista
const LOOKS = [
  "1776273920158-510b171e936f", "1771092358890-0db24db44e56", "1780566758417-22c8f59db792", "1780566759997-6a4eabceaa10",
  "1621784562807-cb450c2f5efc", "1715541448446-3369e1cc0ee9", "1625503336205-fba8025fa0f1", "1780566760434-5f42a317b0a9",
  "1780566759977-ff8b5d53731c", "1780566758193-cd5c36e2373f", "1780566759959-73ce2af09f7c", "1765930863446-7ec401d9748d",
  "1779153617416-8d4729084fcc", "1780566758158-86894dcae8e8", "1785088601313-57321a8e1d51", "1780566758212-d401fdeffbfe",
  "1775704847874-1f9f403e4edb", "1759496942279-239f2b7279c0", "1684225358843-54b1132537b6", "1759771716338-424add0f9799",
  "1701844778533-f46d8092ebe1", "1617182397327-a05d5c3e2abb", "1635761331499-e52ad78980a7", "1743588464176-f8247f2a551f",
  "1617183089075-7455d92806c1", "1666979564523-7a4cc1f9f1d0", "1779400205156-e21b3d8d1e4f", "1779400202112-f1661a4c8637",
  "1784817552041-5f7d793a92d3", "1780566036289-2ee30453f560",
];
const BACKSTAGE = ["1719613959577-434f93b266d7", "1784833066652-e2809e77b0e4", "1760720350998-1bbc55885ccf", "1764593605450-15d6fc79a2fa", "1784833170317-982391e74129"];
const offset = SEASONS.indexOf(season) * 7;
const lookImg = (n) => photo(LOOKS[(n - 1 + offset) % LOOKS.length]);
const pad = (n) => String(n).padStart(2, "0");

// Cada look aponta para 1 a 3 peças do catálogo
function lookProducts(n) {
  const k = (n % 3) + 1;
  return Array.from({ length: k }, (_, i) => PRODUCTS[(n * 5 + i * 7) % PRODUCTS.length]);
}

// Capa e texto
document.title = `Desfile ${season.title} — Obra Studios`;
$("heroImg").src = photo(season.hero);
$("heroImg").alt = `Desfile ${season.title}`;
$("heroTitle").textContent = season.title;
$("heroPlace").textContent = season.place;
$("heroDate").textContent = season.date;
$("introLabel").textContent = `Desfile — ${season.looks} looks`;
$("introText").textContent = season.text;

// Grade de looks
$("lookGrid").innerHTML = Array.from({ length: season.looks }, (_, i) => {
  const n = i + 1;
  return `
  <button class="look" data-look="${n}" aria-label="Abrir look ${pad(n)}">
    <img src="${lookImg(n)}" alt="Look ${pad(n)}" loading="lazy">
    <span class="label look__num">Look ${pad(n)}</span>
  </button>`;
}).join("");

// Bastidores
$("backstage").innerHTML = [1, 2, 3, 4, 5]
  .map((n) => `<figure class="tile"><img src="${photo(BACKSTAGE[(n - 1 + SEASONS.indexOf(season)) % BACKSTAGE.length])}" alt="Bastidores ${n}" loading="lazy"></figure>`)
  .join("");

// Arquivo de temporadas
$("archive").innerHTML = SEASONS.map((s) => `
  <li>
    <a href="desfile.html?s=${s.id}" class="rw-archive__row${s.id === season.id ? " is-current" : ""}"${s.id === season.id ? ' aria-current="page"' : ""}>
      <span class="label">${s.title}</span>
      <span class="label muted">${s.place.split(" — ")[0]}</span>
      <span class="label muted">${s.date}</span>
    </a>
  </li>`).join("");

// Colunas 2 / 4
function setCols(n) {
  $("lookGrid").classList.toggle("rw-grid--2", n === "2");
  document.querySelectorAll(".view-btn").forEach((b) => {
    const on = b.dataset.cols === n;
    b.classList.toggle("is-active", on);
    b.setAttribute("aria-pressed", on);
  });
}
document.querySelectorAll(".view-btn").forEach((b) => b.addEventListener("click", () => setCols(b.dataset.cols)));

// Tela cheia
const lb = $("lightbox");
let current = 1;

function showLook(n) {
  current = ((n - 1 + season.looks) % season.looks) + 1;
  $("lbImg").src = lookImg(current);
  $("lbImg").alt = `Look ${pad(current)}`;
  $("lbCount").textContent = `Look ${pad(current)} / ${season.looks}`;
  $("lbProducts").innerHTML = lookProducts(current)
    .map((p) => `
    <li>
      <a href="produto.html?id=${p.id}" class="lb-item">
        <img src="${productImg(p.id, 1, 200, 266)}" alt="">
        <span>
          <span class="label">${p.name}</span>
          <span class="label muted">${brl(p.price)}</span>
        </span>
      </a>
    </li>`)
    .join("");
  // pré-carrega os vizinhos
  [current + 1, current - 1].forEach((k) => { new Image().src = lookImg(((k - 1 + season.looks) % season.looks) + 1); });
}

$("lookGrid").addEventListener("click", (e) => {
  const b = e.target.closest("[data-look]");
  if (!b) return;
  showLook(+b.dataset.look);
  lb.showModal();
  document.body.style.overflow = "hidden";
});
$("lbPrev").addEventListener("click", () => showLook(current - 1));
$("lbNext").addEventListener("click", () => showLook(current + 1));
$("lbClose").addEventListener("click", () => lb.close());
lb.addEventListener("close", () => {
  document.body.style.overflow = "";
  document.querySelector(`[data-look="${current}"]`)?.focus();
});
lb.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") showLook(current - 1);
  if (e.key === "ArrowRight") showLook(current + 1);
});

// Deslizar no celular
let touchX = null;
lb.addEventListener("touchstart", (e) => (touchX = e.touches[0].clientX), { passive: true });
lb.addEventListener("touchend", (e) => {
  if (touchX === null) return;
  const dx = e.changedTouches[0].clientX - touchX;
  if (Math.abs(dx) > 50) showLook(current + (dx < 0 ? 1 : -1));
  touchX = null;
});
