// Página da sacola
function renderBag() {
  const items = Cart.read().filter((i) => findProduct(i.id));
  const count = items.reduce((s, i) => s + i.qty, 0);
  const subtotal = Cart.subtotal();
  const shipping = shippingFor(subtotal);

  document.getElementById("bagCount").textContent = count;
  document.querySelector(".bag__layout").hidden = count === 0;
  document.getElementById("empty").hidden = count > 0;

  document.getElementById("bagList").innerHTML = items
    .map((item, i) => {
      const p = findProduct(item.id);
      return `
      <li class="bag__item">
        <a href="produto.html?id=${p.id}" class="bag__thumb"><img src="${productImg(p.id, 1, 400, 533)}" alt="${p.name}"></a>
        <div class="bag__details">
          <div>
            <a href="produto.html?id=${p.id}" class="label">${p.name}</a>
            <p class="label muted">${item.color}</p>
            <p class="label muted">Tamanho ${item.size}</p>
          </div>
          <div class="qty" aria-label="Quantidade">
            <button class="label" data-qty="${i}" data-delta="-1" aria-label="Diminuir">−</button>
            <span class="label">${item.qty}</span>
            <button class="label" data-qty="${i}" data-delta="1" aria-label="Aumentar">+</button>
          </div>
          <button class="label bag__remove" data-remove="${i}">Remover</button>
        </div>
        <span class="label bag__price">${brl(p.price * item.qty)}</span>
      </li>`;
    })
    .join("");

  document.getElementById("subtotal").textContent = brl(subtotal);
  document.getElementById("shipping").textContent = shipping ? brl(shipping) : "Grátis";
  document.getElementById("shippingNote").textContent = shipping
    ? `Faltam ${brl(FREE_SHIPPING - subtotal)} para o frete grátis.`
    : "Você ganhou frete grátis.";
  document.getElementById("total").textContent = brl(subtotal + shipping);
}

document.getElementById("bagList").addEventListener("click", (e) => {
  const q = e.target.closest("[data-qty]");
  const r = e.target.closest("[data-remove]");
  const items = Cart.read();
  if (q) {
    const i = +q.dataset.qty;
    Cart.setQty(i, items[i].qty + +q.dataset.delta);
  }
  if (r) Cart.setQty(+r.dataset.remove, 0);
});

document.addEventListener("cart:change", renderBag);
renderBag();
