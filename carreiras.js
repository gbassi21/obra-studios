// Carreiras — vagas de exemplo, troque pelas reais
const JOBS = [
  { id: "modelista", title: "Modelista sênior", area: "Criação", place: "São Paulo — Estúdio", type: "CLT",
    about: "Desenvolver modelagens das coleções femininas e masculinas, do primeiro molde à peça-piloto, junto com a direção criativa.",
    reqs: ["Experiência de 5+ anos em modelagem de alfaiataria", "Domínio de modelagem plana e moulage", "Conhecimento de Audaces ou similar"] },
  { id: "designer-estampas", title: "Designer de estampas", area: "Criação", place: "São Paulo — Estúdio", type: "CLT",
    about: "Criar estampas, bordados e aplicações a partir das pesquisas de cada temporada.",
    reqs: ["Portfólio com estampas autorais", "Domínio de Illustrator e Photoshop", "Noções de processos de estamparia e bordado"] },
  { id: "vendedor-sp", title: "Consultor(a) de vendas", area: "Lojas", place: "São Paulo — Oscar Freire", type: "CLT",
    about: "Atender clientes, orientar sobre modelagem e cuidados, e cuidar da apresentação da loja.",
    reqs: ["Experiência com varejo de moda", "Gosto por atendimento próximo", "Disponibilidade para escala com fins de semana"] },
  { id: "vendedor-rj", title: "Consultor(a) de vendas", area: "Lojas", place: "Rio de Janeiro — Ipanema", type: "CLT",
    about: "Fazer parte da equipe de abertura da nossa loja em Ipanema.",
    reqs: ["Experiência com varejo de moda", "Inglês intermediário é um diferencial", "Disponibilidade para escala com sábados"] },
  { id: "gerente-cwb", title: "Gerente de loja", area: "Lojas", place: "Curitiba — Batel", type: "CLT",
    about: "Liderar a equipe, acompanhar metas e garantir a experiência Obra na loja de Curitiba.",
    reqs: ["Experiência de 3+ anos na gestão de lojas de moda", "Perfil de liderança próxima", "Vivência com indicadores de venda e estoque"] },
  { id: "ecommerce", title: "Analista de e-commerce", area: "Digital", place: "São Paulo — Híbrido", type: "CLT",
    about: "Cuidar do catálogo, dos lançamentos e da performance da loja online.",
    reqs: ["Experiência com plataformas de e-commerce", "Análise de dados (GA4, planilhas)", "Olhar atento para imagem e texto"] },
  { id: "estagio-conteudo", title: "Estágio em conteúdo", area: "Digital", place: "São Paulo — Híbrido", type: "Estágio",
    about: "Apoiar a produção de conteúdo para redes sociais, newsletter e site.",
    reqs: ["Cursando Moda, Comunicação ou áreas afins", "Boa escrita", "Interesse por fotografia e cultura"] },
];

const $ = (id) => document.getElementById(id);
const esc = (s = "") => String(s).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
const filters = { area: "", place: "" };
const city = (p) => p.split(" — ")[0];

$("jobCountTop").textContent = `${JOBS.length} vagas abertas`;

function chips(el, key, values) {
  const all = key === "area" ? "Todas as áreas" : "Todas as cidades";
  el.innerHTML =
    `<button class="label${filters[key] ? "" : " is-active"}" data-key="${key}" data-val="">${all}</button>` +
    values.map((v) => `<button class="label${filters[key] === v ? " is-active" : ""}" data-key="${key}" data-val="${v}">${v}</button>`).join("");
}

function render() {
  chips($("areaFilter"), "area", [...new Set(JOBS.map((j) => j.area))]);
  chips($("placeFilter"), "place", [...new Set(JOBS.map((j) => city(j.place)))]);
  const list = JOBS.filter((j) => (!filters.area || j.area === filters.area) && (!filters.place || city(j.place) === filters.place));
  $("jobCount").textContent = list.length;
  $("jobsNone").hidden = list.length > 0;
  $("jobs").innerHTML = list.map((j) => `
    <details class="order job" id="${j.id}">
      <summary class="order__row job__row">
        <span class="label">${j.title}</span>
        <span class="label muted">${j.area}</span>
        <span class="label muted">${j.place}</span>
        <span class="label muted">${j.type}</span>
      </summary>
      <div class="order__body">
        <p class="prose">${j.about}</p>
        <div>
          <p class="label muted">O que buscamos</p>
          <ul class="job__reqs">${j.reqs.map((r) => `<li class="prose">${r}</li>`).join("")}</ul>
        </div>
        <form class="acc-form job__form" data-job="${j.id}" novalidate>
          <p class="label muted">Candidatar-se</p>
          <div class="fields">
            <div class="field"><label class="label muted" for="n-${j.id}">Nome</label><input id="n-${j.id}" required autocomplete="name"><span class="field__error label"></span></div>
            <div class="field"><label class="label muted" for="e-${j.id}">E-mail</label><input id="e-${j.id}" type="email" required autocomplete="email"><span class="field__error label"></span></div>
            <div class="field field--full"><label class="label muted" for="l-${j.id}">Link do portfólio ou LinkedIn</label><input id="l-${j.id}" type="url" required placeholder="https://"><span class="field__error label"></span></div>
          </div>
          <div class="acc-form__actions"><button type="submit" class="label btn">Enviar candidatura</button></div>
          <p class="label link" data-sent hidden></p>
        </form>
      </div>
    </details>`).join("");
}

document.addEventListener("click", (e) => {
  const b = e.target.closest("[data-key]");
  if (!b) return;
  filters[b.dataset.key] = b.dataset.val;
  render();
});

// Envio da candidatura — demonstração, nada é enviado
$("jobs").addEventListener("submit", (e) => {
  e.preventDefault();
  const form = e.target;
  let ok = true;
  form.querySelectorAll("input").forEach((i) => {
    const v = i.value.trim();
    let msg = "";
    if (!v) msg = "Campo obrigatório";
    else if (i.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) msg = "E-mail inválido";
    else if (i.type === "url" && !/^https?:\/\/\S+\.\S+/.test(v)) msg = "Link inválido — comece com https://";
    i.parentElement.querySelector(".field__error").textContent = msg;
    i.classList.toggle("is-invalid", !!msg);
    if (msg && ok) { i.focus(); ok = false; }
  });
  if (!ok) return;
  const job = JOBS.find((j) => j.id === form.dataset.job);
  const name = form.querySelector("input").value.trim().split(/\s+/)[0];
  const sent = form.querySelector("[data-sent]");
  sent.textContent = `Obrigado, ${name}. Candidatura para ${job.title} registrada (demonstração — nada foi enviado).`;
  sent.hidden = false;
  form.querySelectorAll("input").forEach((i) => (i.value = ""));
});

render();
if (location.hash) document.getElementById(location.hash.slice(1))?.setAttribute("open", "");
