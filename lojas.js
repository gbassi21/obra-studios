// Lojas — endereços e horários de exemplo, troque pelos reais
// hours: [domingo, segunda, ..., sábado] em [abre, fecha] (horas); null = fechado
const STORES = [
  { id: "sp-oscar-freire", img: "1769107805412-90d9191d53e9", city: "São Paulo", name: "Oscar Freire", tag: "Flagship",
    address: "Rua Oscar Freire, 000 — Jardins", cep: "01426-000", phone: "(11) 0000-0000",
    hours: [[12, 20], [10, 22], [10, 22], [10, 22], [10, 22], [10, 22], [10, 22]],
    services: ["Retirada de pedidos", "Trocas", "Reparo", "Revenda", "Stylist"] },
  { id: "sp-iguatemi", img: "1766934587214-86e21b3ae093", city: "São Paulo", name: "Shopping Iguatemi", tag: "",
    address: "Av. Brigadeiro Faria Lima, 0000 — Piso 1", cep: "01489-900", phone: "(11) 0000-0001",
    hours: [[14, 20], [10, 22], [10, 22], [10, 22], [10, 22], [10, 22], [10, 22]],
    services: ["Retirada de pedidos", "Trocas"] },
  { id: "rj-ipanema", img: "1781967651630-e680c7bad016", city: "Rio de Janeiro", name: "Ipanema", tag: "Nova",
    address: "Rua Garcia d'Ávila, 000 — Ipanema", cep: "22421-010", phone: "(21) 0000-0000",
    hours: [null, [10, 20], [10, 20], [10, 20], [10, 20], [10, 20], [10, 18]],
    services: ["Retirada de pedidos", "Trocas", "Reparo"] },
  { id: "cwb-batel", img: "1769107805465-bfd41863f1a0", city: "Curitiba", name: "Batel", tag: "Nova",
    address: "Av. do Batel, 0000 — Batel", cep: "80420-090", phone: "(41) 0000-0000",
    hours: [null, [10, 20], [10, 20], [10, 20], [10, 20], [10, 20], [10, 18]],
    services: ["Retirada de pedidos", "Trocas"] },
];

const DAYS = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
const $ = (id) => document.getElementById(id);
let city = new URLSearchParams(location.search).get("cidade") || "";

function openNow(s) {
  const now = new Date();
  const h = s.hours[now.getDay()];
  const t = now.getHours() + now.getMinutes() / 60;
  if (h && t >= h[0] && t < h[1]) return { open: true, text: `Aberta agora — fecha às ${h[1]}h` };
  // próxima abertura
  for (let i = 0; i < 7; i++) {
    const d = (now.getDay() + i) % 7;
    const nh = s.hours[d];
    if (nh && (i > 0 || t < nh[0])) return { open: false, text: `Fechada — abre ${i === 0 ? "hoje" : i === 1 ? "amanhã" : DAYS[d].toLowerCase()} às ${nh[0]}h` };
  }
  return { open: false, text: "Fechada" };
}

function hoursTable(s) {
  // Agrupa dias seguidos com o mesmo horário, começando na segunda
  const order = [1, 2, 3, 4, 5, 6, 0];
  const fmt = (h) => (h ? `${h[0]}h – ${h[1]}h` : "Fechada");
  const groups = [];
  order.forEach((d) => {
    const last = groups[groups.length - 1];
    if (last && fmt(s.hours[d]) === last.text) last.to = d;
    else groups.push({ from: d, to: d, text: fmt(s.hours[d]) });
  });
  const today = new Date().getDay();
  return groups.map((g) => {
    const label = g.from === g.to ? DAYS[g.from] : `${DAYS[g.from]} a ${DAYS[g.to]}`;
    const days = order.slice(order.indexOf(g.from), order.indexOf(g.to) + 1);
    return `<div class="store__hour${days.includes(today) ? " is-today" : ""}"><span class="label">${label}</span><span class="label">${g.text}</span></div>`;
  }).join("");
}

function render() {
  const cities = [...new Set(STORES.map((s) => s.city))];
  $("cityFilter").innerHTML =
    `<button class="label${city ? "" : " is-active"}" data-city="">Todas (${STORES.length})</button>` +
    cities.map((c) => `<button class="label${city === c ? " is-active" : ""}" data-city="${c}">${c} (${STORES.filter((s) => s.city === c).length})</button>`).join("");

  $("stores").innerHTML = STORES.filter((s) => !city || s.city === city).map((s) => {
    const st = openNow(s);
    const maps = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${s.address}, ${s.city}`)}`;
    return `
    <article class="store" id="${s.id}">
      <figure class="store__img"><img src="${photo(s.img)}" alt="Loja ${s.name}" loading="lazy"></figure>
      <div class="store__info">
        <div class="store__title">
          <p class="label muted">${s.city}${s.tag ? ` — ${s.tag}` : ""}</p>
          <h2 class="page-h2">${s.name}</h2>
          <p class="label ${st.open ? "link" : "muted"}">${st.text}</p>
        </div>
        <div class="store__cols">
          <div>
            <p class="label muted">Endereço</p>
            <p class="label">${s.address}</p>
            <p class="label">${s.city} — CEP ${s.cep}</p>
            <a href="tel:${s.phone.replace(/\D/g, "")}" class="label">${s.phone}</a>
            <a href="${maps}" target="_blank" rel="noopener" class="label link">Como chegar ↗</a>
          </div>
          <div>
            <p class="label muted">Horário</p>
            ${hoursTable(s)}
          </div>
        </div>
        <div>
          <p class="label muted">Serviços</p>
          <ul class="store__services">${s.services.map((x) => `<li class="label">${x}</li>`).join("")}</ul>
        </div>
      </div>
    </article>`;
  }).join("");
}

$("cityFilter").addEventListener("click", (e) => {
  const b = e.target.closest("[data-city]");
  if (!b) return;
  city = b.dataset.city;
  history.replaceState(null, "", city ? `?cidade=${encodeURIComponent(city)}` : location.pathname);
  render();
});

render();
