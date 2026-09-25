// Finalizar compra — demonstração. Nada é enviado ou guardado, exceto limpar a sacola no fim.
const items = Cart.read().filter((i) => findProduct(i.id));
if (!items.length) location.replace("sacola.html");

const COUPONS = { OBRA10: 0.1 }; // cupom de exemplo
const EXPRESS = 90;
const PIX_OFF = 0.05;
const MAX_INSTALLMENTS = 10;
const MIN_INSTALLMENT = 100;

const state = { shipping: "padrao", pay: "cartao", coupon: null };
const $ = (id) => document.getElementById(id);

// Totais
function totals() {
  const subtotal = Cart.subtotal();
  const couponOff = state.coupon ? Math.round(subtotal * COUPONS[state.coupon]) : 0;
  const pixOff = state.pay === "pix" ? Math.round((subtotal - couponOff) * PIX_OFF) : 0;
  const shipping =
    state.shipping === "expressa" ? EXPRESS :
    state.shipping === "retirada" ? 0 : shippingFor(subtotal);
  const discount = couponOff + pixOff;
  return { subtotal, discount, shipping, total: subtotal - discount + shipping };
}

function renderSummary() {
  const t = totals();
  $("sumCount").textContent = items.reduce((s, i) => s + i.qty, 0);
  $("sumItems").innerHTML = items
    .map((i) => {
      const p = findProduct(i.id);
      return `
      <li class="co__item">
        <div class="co__thumb"><img src="${productImg(p.id, 1, 200, 266)}" alt="${p.name}"><span class="label">${i.qty}</span></div>
        <div>
          <p class="label">${p.name}</p>
          <p class="label muted">${i.color} — ${i.size}</p>
        </div>
        <span class="label">${brl(p.price * i.qty)}</span>
      </li>`;
    })
    .join("");
  $("sumSubtotal").textContent = brl(t.subtotal);
  $("discountRow").hidden = !t.discount;
  $("sumDiscount").textContent = "− " + brl(t.discount);
  $("sumShipping").textContent = t.shipping ? brl(t.shipping) : "Grátis";
  $("sumTotal").textContent = brl(t.total);
  $("standardPrice").textContent = shippingFor(t.subtotal) ? brl(SHIPPING) : "Grátis";

  // Parcelas
  const max = Math.max(1, Math.min(MAX_INSTALLMENTS, Math.floor(t.total / MIN_INSTALLMENT)));
  const sel = $("installments");
  const current = +sel.value || 1;
  sel.innerHTML = Array.from({ length: max }, (_, k) => {
    const n = k + 1;
    return `<option value="${n}"${n === Math.min(current, max) ? " selected" : ""}>${n}x de ${brl(t.total / n)} sem juros</option>`;
  }).join("");
  $("sumInstallments").textContent =
    state.pay === "cartao" ? `ou até ${max}x de ${brl(t.total / max)} sem juros` :
    state.pay === "pix" ? "5% de desconto no Pix aplicado" : "";
}

// Envio
$("shippingChoices").addEventListener("change", (e) => {
  state.shipping = e.target.value;
  renderSummary();
});

// Forma de pagamento
document.querySelectorAll(".tab").forEach((tab) =>
  tab.addEventListener("click", () => {
    state.pay = tab.dataset.pay;
    document.querySelectorAll(".tab").forEach((t) => {
      const on = t === tab;
      t.classList.toggle("is-active", on);
      t.setAttribute("aria-selected", on);
    });
    document.querySelectorAll(".pay").forEach((p) => (p.hidden = p.dataset.panel !== state.pay));
    renderSummary();
  })
);

// Cupom
$("applyCoupon").addEventListener("click", () => {
  const code = $("coupon").value.trim().toUpperCase();
  if (COUPONS[code]) {
    state.coupon = code;
    $("couponMsg").textContent = `Cupom ${code} aplicado — ${COUPONS[code] * 100}% de desconto.`;
  } else {
    state.coupon = null;
    $("couponMsg").textContent = code ? "Cupom inválido." : "";
  }
  renderSummary();
});

// Máscaras
const digits = (v) => v.replace(/\D/g, "");
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
  card: (v) => digits(v).slice(0, 16).replace(/(\d{4})(?=\d)/g, "$1 "),
  exp: (v) => digits(v).slice(0, 4).replace(/(\d{2})(\d)/, "$1/$2"),
  cvv: (v) => digits(v).slice(0, 4),
};
document.querySelectorAll("[data-mask]").forEach((input) =>
  input.addEventListener("input", () => (input.value = masks[input.dataset.mask](input.value)))
);

// Busca de endereço pelo CEP (ViaCEP)
$("cep").addEventListener("input", async (e) => {
  const cep = digits(e.target.value);
  if (cep.length !== 8) { $("cepHint").textContent = ""; return; }
  $("cepHint").textContent = "Buscando endereço…";
  try {
    const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    const data = await res.json();
    if (data.erro) throw new Error();
    $("street").value = data.logradouro || "";
    $("district").value = data.bairro || "";
    $("city").value = `${data.localidade} / ${data.uf}`;
    $("cepHint").textContent = "";
    ["street", "district", "city"].forEach((id) => validate($(id)));
    $(data.logradouro ? "number" : "street").focus();
  } catch {
    $("cepHint").textContent = "CEP não encontrado — preencha o endereço.";
  }
});

// Validação
function validCPF(v) {
  const d = digits(v);
  if (d.length !== 11 || /^(\d)\1+$/.test(d)) return false;
  const check = (len) => {
    let sum = 0;
    for (let i = 0; i < len; i++) sum += +d[i] * (len + 1 - i);
    const r = (sum * 10) % 11;
    return (r === 10 ? 0 : r) === +d[len];
  };
  return check(9) && check(10);
}

function validExp(v) {
  const [m, y] = v.split("/").map(Number);
  if (!m || m > 12 || y === undefined) return false;
  const now = new Date();
  const yy = now.getFullYear() % 100;
  return y > yy || (y === yy && m >= now.getMonth() + 1);
}

function errorFor(input) {
  const v = input.value.trim();
  if (input.required && !v) return "Campo obrigatório";
  if (input.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return "E-mail inválido";
  if (input.minLength > 0 && v.length < input.minLength) return "Incompleto";
  if (input.dataset.validate === "cpf" && !validCPF(v)) return "CPF inválido";
  if (input.dataset.validate === "exp" && !validExp(v)) return "Data inválida";
  return "";
}

function validate(input) {
  const msg = errorFor(input);
  const slot = input.parentElement.querySelector(".field__error");
  if (slot) slot.textContent = msg;
  input.classList.toggle("is-invalid", !!msg);
  input.setAttribute("aria-invalid", !!msg);
  return !msg;
}

const form = $("coForm");
form.addEventListener("focusout", (e) => {
  if (e.target.matches(".field input") && e.target.value) validate(e.target);
});
form.addEventListener("input", (e) => {
  if (e.target.classList.contains("is-invalid")) validate(e.target);
});

// Envio do pedido
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const fields = [...form.querySelectorAll(".field input[required]")].filter(
    (i) => !i.dataset.payField || i.dataset.payField === state.pay
  );
  const invalid = fields.filter((i) => !validate(i));
  const termsOk = $("terms").checked;
  $("termsError").textContent = termsOk ? "" : "Aceite os termos para continuar";

  if (invalid.length || !termsOk) {
    (invalid[0] || $("terms")).focus();
    invalid[0]?.scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }

  const btn = $("placeOrder");
  btn.disabled = true;
  btn.textContent = "Processando…";

  setTimeout(() => {
    const t = totals();
    const id = "OB" + String(Math.floor(100000 + Math.random() * 900000));
    const payLabel =
      state.pay === "cartao"
        ? `Cartão final ${digits($("cardNumber").value).slice(-4)} — ${$("installments").value}x`
        : state.pay === "pix" ? "Pix — QR Code enviado por e-mail" : "Boleto — enviado por e-mail";
    const esc = (s) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
    const val = (id) => esc($(id).value.trim());
    const address =
      state.shipping === "retirada"
        ? "Retirada na loja — São Paulo, Oscar Freire"
        : `${val("street")}, ${val("number")}${val("complement") ? " — " + val("complement") : ""}<br>${val("district")} — ${val("city")}<br>${val("cep")}`;

    $("orderId").textContent = id;
    $("doneText").textContent = `Enviamos a confirmação para ${$("email").value}. Você vai receber o código de rastreio assim que o pedido sair do nosso estoque.`;
    $("doneAddress").innerHTML = `${val("fullname")}<br>${address}`;
    $("donePayment").textContent = payLabel;
    $("doneTotal").textContent = brl(t.total);

    // Salva o pedido no histórico (sem nenhum dado de cartão)
    const raw = (id) => $(id).value.trim();
    const shipTo = {
      name: raw("fullname"), cep: raw("cep"), street: raw("street"), number: raw("number"),
      complement: raw("complement"), district: raw("district"), city: raw("city"),
    };
    Account.addOrder({
      id,
      date: new Date().toISOString(),
      status: "Em preparação",
      email: raw("email"),
      items: items.map((i) => ({ ...i, price: findProduct(i.id).price })),
      subtotal: t.subtotal, discount: t.discount, shipping: t.shipping, total: t.total,
      shippingMethod: state.shipping,
      address: state.shipping === "retirada" ? null : shipTo,
      payment: payLabel,
    });
    if (Account.user() && state.shipping !== "retirada" && !Account.addresses().length) {
      Account.setAddresses([{ ...shipTo, id: Date.now().toString(36), default: true }]);
    }

    form.reset(); // não mantém dados de cartão na página
    Cart.write([]);
    document.querySelector(".nav--checkout > a:first-child").style.visibility = "hidden";
    $("checkoutView").hidden = true;
    $("doneView").hidden = false;
    document.title = "Pedido confirmado — Obra Studios";
    window.scrollTo(0, 0);
  }, 1200);
});

// Conta aberta: preenche contato e endereço padrão
const user = Account.user();
if (user) {
  const fill = (id, v) => { if (v) $(id).value = v; };
  fill("email", user.email);
  fill("phone", user.phone);
  fill("cpf", user.cpf);
  fill("fullname", user.name);
  const a = Account.defaultAddress();
  if (a) {
    ["cep", "street", "number", "complement", "district", "city"].forEach((k) => fill(k, a[k]));
    if (a.name) fill("fullname", a.name);
  }
}

renderSummary();
