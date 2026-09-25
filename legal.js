// Índice lateral das páginas de texto legal
const headings = [...document.querySelectorAll("#legalBody h2")];
const toc = document.getElementById("toc");

toc.innerHTML = headings
  .map((h) => `<a href="#${h.id}" class="label" data-nav="${h.id}">${h.textContent.replace(/^\d+\.\s*/, "")}</a>`)
  .join("");

// Destaca o item da seção visível
const links = [...toc.querySelectorAll("a")];
const spy = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) links.forEach((a) => a.classList.toggle("is-active", a.dataset.nav === e.target.id));
  });
}, { rootMargin: "-15% 0px -75% 0px" });
headings.forEach((h) => spy.observe(h));
