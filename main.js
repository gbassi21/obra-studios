// Página inicial
document.getElementById("productGrid").innerHTML =
  PRODUCTS.filter((p) => p.section === "novidades").map(productCell).join("");
document.getElementById("productGrid2").innerHTML =
  PRODUCTS.filter((p) => p.section === "masculino").map(productCell).join("");

// Logo aparece na barra quando o hero sai de vista
const nav = document.getElementById("nav");
new IntersectionObserver(([entry]) => {
  nav.classList.toggle("is-scrolled", !entry.isIntersecting);
}, { rootMargin: "-40% 0px 0px 0px" }).observe(document.querySelector(".hero"));
