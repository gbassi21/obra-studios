// Página de ajuda — ajuste as respostas às políticas reais da sua loja
const FAQ = [
  { id: "pedidos", title: "Pedidos", items: [
    { q: "Como acompanho meu pedido?", a: "Use o rastreio no topo desta página com o número do pedido e o e-mail da compra, ou veja em Minha conta → Pedidos. Quando o pedido sai do estoque, enviamos o código de rastreio por e-mail." },
    { q: "Posso alterar ou cancelar um pedido?", a: "Enquanto o status for “Em preparação”, fale com a gente pelo WhatsApp que alteramos ou cancelamos. Depois do envio, não é mais possível — mas você pode devolver gratuitamente quando receber." },
    { q: "Recebi um produto com defeito ou errado.", a: "Sentimos muito. Envie fotos pelo WhatsApp ou e-mail em até 90 dias após o recebimento. A coleta e a troca são por nossa conta." },
    { q: "Vocês fazem embrulho para presente?", a: "Todos os pedidos vão na nossa embalagem rosa. Para presente, avise na mensagem e retiramos preços e notas fiscais impressas da caixa." },
  ]},
  { id: "envios", title: "Envios e prazos", items: [
    { q: "Quanto custa o frete?", a: "O envio padrão é grátis para compras acima de R$ 1.000. Abaixo disso, custa R$ 45. O envio expresso custa R$ 90." },
    { q: "Qual o prazo de entrega?", a: "Padrão: 5 a 7 dias úteis. Expressa: 1 a 2 dias úteis para capitais do Sudeste e 2 a 4 dias úteis para as demais regiões. O prazo começa a contar após a confirmação do pagamento." },
    { q: "Posso retirar na loja?", a: "Sim. Escolha “Retirar na loja” no checkout. Avisamos por e-mail quando o pedido estiver pronto — normalmente em 2 horas úteis. Leve um documento com foto." },
    { q: "Vocês entregam fora do Brasil?", a: "Por enquanto, entregamos só no Brasil." },
  ]},
  { id: "trocas", title: "Trocas e devoluções", items: [
    { q: "Qual o prazo para trocar ou devolver?", a: "Até 30 dias após o recebimento, com as etiquetas originais e sem sinais de uso. A primeira troca e a devolução são gratuitas." },
    { q: "Como faço uma troca?", a: "Fale com a gente pelo WhatsApp ou pelo formulário abaixo informando o número do pedido e o tamanho ou peça desejada. Enviamos um código de postagem gratuita para os Correios. Na loja física, a troca é na hora." },
    { q: "Quando recebo o reembolso?", a: "Assim que o produto chega ao nosso estoque e é conferido — em até 5 dias úteis. No cartão, o estorno aparece em 1 ou 2 faturas. No Pix e no boleto, devolvemos na conta indicada por você." },
    { q: "Algum produto não pode ser trocado?", a: "Brincos, roupas íntimas e peças personalizadas não podem ser trocados por questões de higiene, exceto em caso de defeito." },
  ]},
  { id: "pagamento", title: "Pagamento", items: [
    { q: "Quais formas de pagamento vocês aceitam?", a: "Cartão de crédito (Visa, Mastercard, Elo, American Express), Pix e boleto." },
    { q: "Posso parcelar?", a: "Sim, em até 10x sem juros no cartão, com parcela mínima de R$ 100." },
    { q: "Tem desconto no Pix?", a: "Sim, 5% de desconto no total. O QR Code vale por 30 minutos após a confirmação do pedido." },
    { q: "Como funcionam os cupons?", a: "Digite o código no campo “Cupom de desconto” no resumo do checkout. Cupons não são cumulativos, mas funcionam junto com o desconto do Pix." },
    { q: "Meu pagamento foi recusado. E agora?", a: "Confira os dados do cartão e o limite disponível. Se o problema continuar, tente outro cartão ou pague com Pix." },
  ]},
  { id: "produtos", title: "Produtos e cuidados", items: [
    { q: "Como escolho meu tamanho?", a: "Use o <a href=\"provador.html\" class=\"link\">Provador</a>: informe suas medidas e ele recomenda o tamanho de cada peça. Você também pode consultar o guia de medidas nesta página ou falar com a gente pelo WhatsApp." },
    { q: "Um tamanho esgotado vai voltar?", a: "Muitas peças voltam ao estoque ao longo da temporada. Adicione à sua lista de desejos para encontrar a peça rapidamente." },
    { q: "Como cuidar das peças de lã e cashmere?", a: "Lave à mão em água fria com sabão neutro, sem torcer, e seque na horizontal, à sombra. Guarde dobradas — nunca em cabide." },
    { q: "Como cuidar do denim?", a: "Lave pouco, do avesso, em água fria. Isso preserva a cor e o caimento por mais tempo. Não use secadora." },
  ]},
  { id: "conta", title: "Conta e privacidade", items: [
    { q: "Preciso de conta para comprar?", a: "Não. Mas com conta você acompanha pedidos, salva endereços e usa a lista de desejos." },
    { q: "Esqueci minha senha.", a: "Na página Conta, clique em “Esqueci minha senha” e informe seu e-mail. Enviamos um link para criar uma nova." },
    { q: "Como apago minha conta e meus dados?", a: "Em Minha conta → Dados pessoais → Apagar minha conta, ou pelo e-mail de atendimento. Veja a <a href=\"privacidade.html\" class=\"link\">Política de privacidade</a>." },
  ]},
];


const $ = (id) => document.getElementById(id);
const esc = (s = "") => String(s).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
const norm = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

/* ---------- Perguntas frequentes ---------- */

$("faq").innerHTML = FAQ.map((sec) => `
  <section class="help-section" id="${sec.id}" data-faq-section>
    <h2 class="label co__title">${sec.title}</h2>
    <div class="accordion">
      ${sec.items.map((it, i) => `
        <details id="${sec.id}-${i + 1}" data-q="${esc(norm(it.q + " " + it.a))}">
          <summary class="label">${it.q}</summary>
          <p class="label pdp__text">${it.a}</p>
        </details>`).join("")}
    </div>
  </section>`).join("");

// Menu lateral de temas
$("helpNav").innerHTML = [
  ["rastrear", "Rastrear pedido"],
  ...FAQ.map((s) => [s.id, s.title]),
  ["medidas", "Guia de medidas"],
  ["contato", "Fale conosco"],
].map(([id, t]) => `<a href="#${id}" class="label" data-nav="${id}">${t}</a>`).join("");

// Destaca o tema visível
const navLinks = [...document.querySelectorAll("[data-nav]")];
const spy = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (!e.isIntersecting) return;
    navLinks.forEach((a) => a.classList.toggle("is-active", a.dataset.nav === e.target.id));
  });
}, { rootMargin: "-20% 0px -70% 0px" });
document.querySelectorAll(".help-section").forEach((s) => spy.observe(s));

// Busca
$("helpSearch").addEventListener("input", (e) => {
  const words = norm(e.target.value.trim()).split(/\s+/).filter(Boolean);
  let hits = 0;
  document.querySelectorAll("#faq details").forEach((d) => {
    const ok = words.every((w) => d.dataset.q.includes(w));
    d.hidden = !ok;
    d.open = words.length > 0 && ok;
    if (ok) hits++;
  });
  document.querySelectorAll("[data-faq-section]").forEach((s) => {
    s.hidden = !s.querySelector("details:not([hidden])");
  });
  const searching = words.length > 0;
  ["rastrear", "medidas", "contato"].forEach((id) => ($(id).hidden = searching && id !== "contato"));
  $("noResult").hidden = !searching || hits > 0;
  $("searchInfo").textContent = searching ? `${hits} ${hits === 1 ? "resposta" : "respostas"}` : "";
});

// Link direto para uma pergunta (#envios-1) abre ela
function openFromHash() {
  const el = document.getElementById(location.hash.slice(1));
  if (el?.tagName === "DETAILS") { el.open = true; el.scrollIntoView({ block: "center" }); }
}
window.addEventListener("hashchange", openFromHash);
openFromHash();

/* ---------- Rastreio ---------- */

function check(input) {
  const v = input.value.trim();
  let msg = "";
  if (input.required && !v) msg = "Campo obrigatório";
  else if (input.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) msg = "E-mail inválido";
  else if (input.minLength > 0 && v.length < input.minLength) msg = `Mínimo de ${input.minLength} caracteres`;
  const slot = input.parentElement.querySelector(".field__error");
  if (slot) slot.textContent = msg;
  input.classList.toggle("is-invalid", !!msg);
  return !msg;
}
const validForm = (form) => {
  const bad = [...form.querySelectorAll("[required]")].filter((i) => !check(i));
  bad[0]?.focus();
  return !bad.length;
};

const STEPS = ["Pedido recebido", "Em preparação", "Enviado", "Entregue"];
function stepOf(order) {
  const days = (Date.now() - new Date(order.date)) / 864e5;
  return days > 5 ? 3 : days > 1 ? 2 : 1;
}

$("trackForm").addEventListener("submit", (e) => {
  e.preventDefault();
  if (!validForm(e.target)) return;
  const id = $("trackId").value.trim().toUpperCase();
  const email = $("trackEmail").value.trim().toLowerCase();
  const order = Account.orders().find((o) => o.id === id && (o.email || "").toLowerCase() === email);

  if (!order) {
    $("trackResult").innerHTML = `<p class="label muted help-track__msg">Não encontramos um pedido com esses dados. Confira o número no e-mail de confirmação ou <a href="#contato" class="link">fale com a gente</a>.</p>`;
    return;
  }
  const step = stepOf(order);
  const eta = new Date(new Date(order.date).getTime() + (order.shippingMethod === "expressa" ? 2 : 7) * 864e5);
  $("trackResult").innerHTML = `
    <div class="track">
      <div class="track__head">
        <span class="label">${esc(order.id)}</span>
        <span class="label muted">${order.shippingMethod === "retirada" ? "Retirada na loja" : `Previsão: ${eta.toLocaleDateString("pt-BR", { day: "2-digit", month: "long" })}`}</span>
      </div>
      <ol class="track__steps">
        ${STEPS.map((s, i) => `<li class="label${i <= step ? " is-done" : ""}${i === step ? " is-current" : ""}">${s}</li>`).join("")}
      </ol>
      <a href="conta.html#pedidos" class="label link">Ver detalhes do pedido</a>
    </div>`;
});

/* ---------- Guia de medidas ---------- */

let table = "feminino";
let unit = "cm";
function renderSizes() {
  const t = SIZE_TABLES[table];
  const conv = (v, col) => {
    if (typeof v !== "number" || unit === "cm" || t.noConvert?.includes(col)) return v;
    return (v / 2.54).toFixed(1).replace(".", ",");
  };
  $("sizeTable").innerHTML = `
    <table>
      <thead><tr>${t.head.map((h, i) => `<th class="label muted">${h}${i > 0 && !t.noConvert?.includes(i) ? ` (${unit === "cm" ? "cm" : "pol"})` : ""}</th>`).join("")}</tr></thead>
      <tbody>${t.rows.map((r) => `<tr>${r.map((c, i) => `<td class="label">${conv(c, i)}</td>`).join("")}</tr>`).join("")}</tbody>
    </table>`;
}
$("sizeTabs").addEventListener("click", (e) => {
  const b = e.target.closest("[data-table]");
  if (!b) return;
  table = b.dataset.table;
  document.querySelectorAll("[data-table]").forEach((x) => {
    x.classList.toggle("is-active", x === b);
    x.setAttribute("aria-selected", x === b);
  });
  renderSizes();
});
document.querySelectorAll("[data-unit]").forEach((b) => b.addEventListener("click", () => {
  unit = b.dataset.unit;
  document.querySelectorAll("[data-unit]").forEach((x) => {
    x.classList.toggle("is-active", x === b);
    x.setAttribute("aria-pressed", x === b);
  });
  renderSizes();
}));
renderSizes();

/* ---------- Contato ---------- */

// Preenche com a conta, se houver
const user = Account.user();
if (user) { $("cName").value = user.name || ""; $("cEmail").value = user.email || ""; $("trackEmail").value = user.email || ""; }

$("contactForm").addEventListener("submit", (e) => {
  e.preventDefault();
  if (!validForm(e.target)) return;
  // Demonstração: nada é enviado. Ligue aqui um serviço de formulário ou de atendimento.
  const name = $("cName").value.trim().split(/\s+/)[0];
  $("contactSent").textContent = `Obrigado, ${name}. Mensagem registrada (demonstração — nada foi enviado).`;
  $("contactSent").hidden = false;
  $("cMsg").value = "";
});
