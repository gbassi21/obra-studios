// Catálogo de exemplo — troque pelas suas peças e fotos reais
const PRODUCTS = [
  { id: "jeans-1977", slot: "baixo", fit: "jeans", cut: "regular", images: ["1683126257977-5142e52acc7e", "1578693082747-50c396cacd81", "1598554747436-c9293d6a588f", "1602293589930-45aad59ba3ab"], section: "novidades", cat: "Jeans feminino", name: "Jeans 1977 reto", price: 1490,
    colors: ["Azul claro", "Preto"], sizes: ["34", "36", "38", "40", "42"],
    desc: "Jeans de cintura alta e perna reta, em denim rígido de algodão com lavagem vintage. Modelagem inspirada nos arquivos dos anos 70.",
    comp: "100% algodão. Lavar à mão ou à máquina a 30°. Não usar secadora." },
  { id: "cachecol-la", slot: "acessorio", fit: null, cut: null, images: ["1609594480207-0ca5ae53a68a", "1535982368253-05d640fe0755", "1712668055625-a881a5ea88c2", "1789845137167-5a6fed517e65"], section: "novidades", cat: "Cachecóis", name: "Cachecol de lã canelado", price: 890,
    colors: ["Cinza mescla", "Areia"], sizes: ["Único"],
    desc: "Cachecol longo em malha canelada de lã macia, com franjas nas extremidades e etiqueta bordada.",
    comp: "100% lã. Lavagem a seco." },
  { id: "bolsa-musubi", slot: "acessorio", fit: null, cut: null, images: ["1614179689702-355944cd0918", "1711113456675-889254dc9f02", "1664187284276-2f3254cdc7dc", "1683921470299-b8f0f3331657"], section: "novidades", cat: "Bolsas", name: "Bolsa Musubi média", price: 6200,
    colors: ["Preto", "Cinza"], sizes: ["Único"],
    desc: "Bolsa estruturada em couro, com alças duplas, ferragens prateadas e fecho magnético. Forro em algodão e bolso interno.",
    comp: "Couro bovino. Limpar com pano seco." },
  { id: "camiseta-oversized", slot: "cima", fit: "feminino", cut: "amplo", images: ["1627225924765-552d49cf47ad", "1616006897093-5e4635c0de35", "1622023828943-b4e6afb60516", "1622445275992-e7efb32d2257"], section: "novidades", cat: "Camisetas", name: "Camiseta oversized", price: 590,
    colors: ["Branco", "Preto", "Cinza"], sizes: ["PP", "P", "M", "G", "GG"],
    desc: "Camiseta de modelagem ampla em jersey de algodão orgânico, com ombro caído e logo discreto no peito.",
    comp: "100% algodão orgânico. Lavar à máquina a 30°." },
  { id: "casaco-la", slot: "cima", fit: "feminino", cut: "regular", images: ["1678700266327-8959be9622fd", "1539533113208-f6df8cc8b543", "1539533018447-63fcce2678e3", "1635097247472-dfc3e652db97"], section: "novidades", cat: "Casacos", name: "Casaco de lã com cinto", price: 7900,
    colors: ["Camelo", "Grafite"], sizes: ["PP", "P", "M", "G"],
    desc: "Casaco longo em lã dupla face, com cinto removível, lapela ampla e bolsos embutidos.",
    comp: "90% lã, 10% cashmere. Lavagem a seco." },
  { id: "cardiga-mohair", slot: "cima", fit: "feminino", cut: "amplo", images: ["1762112210886-8c0cad0ec75d", "1773747310674-b42a55d72003", "1773747488278-1c45a72f4458", "1608113378106-2a7267a9aaf3"], section: "novidades", cat: "Malhas", name: "Cardigã mohair", price: 2300,
    colors: ["Off-white", "Lilás"], sizes: ["P", "M", "G"],
    desc: "Cardigã de tricô aberto em mistura de mohair, com botões de madrepérola e acabamento canelado.",
    comp: "60% mohair, 30% poliamida, 10% lã. Lavar à mão." },
  { id: "bota-couro", slot: "calcado", fit: "calcados", cut: "regular", images: ["1763661300203-aa3e2702f510", "1602250523342-d2212b96a297", "1618947085672-1dcb69696c33", "1613673720017-56e42d90fee4"], section: "novidades", cat: "Calçados", name: "Bota de couro", price: 4100,
    colors: ["Preto"], sizes: ["35", "36", "37", "38", "39", "40"],
    desc: "Bota de cano médio em couro liso, bico quadrado e salto bloco de 5 cm. Solado de borracha.",
    comp: "Couro bovino, solado de borracha." },
  { id: "gorro-la", slot: "acessorio", fit: null, cut: null, images: ["1618354691792-d1d42acfd860", "1606453914790-b9be7cdb321f", "1510598969022-c4c6c5d05769", "1576871337632-b9aef4c17ab9"], section: "novidades", cat: "Acessórios", name: "Gorro de lã", price: 450,
    colors: ["Preto", "Verde", "Grafite"], sizes: ["Único"],
    desc: "Gorro canelado em lã com barra dobrada e patch de rosto costurado na frente.",
    comp: "100% lã. Lavar à mão." },
  { id: "jeans-2003", slot: "baixo", fit: "jeans", cut: "amplo", images: ["1697677791984-5bb30a8a6a25", "1626596662792-12cdc7ecce71", "1774413511100-54f34b2912e5", "1697678207628-6758ecf9a2cc"], section: "masculino", cat: "Jeans masculino", name: "Jeans 2003 relaxed", price: 1590,
    colors: ["Cinza lavado", "Azul médio"], sizes: ["38", "40", "42", "44", "46"],
    desc: "Jeans de cintura baixa e perna solta, com barra longa que se acumula sobre o sapato.",
    comp: "100% algodão. Lavar à máquina a 30°." },
  { id: "moletom-patch", slot: "cima", fit: "masculino", cut: "regular", images: ["1554568218-ffd1e72a2151", "1554568218-9a456cea00cf", "1714023498720-ccb2fdaa6a7d", "1778787826955-f846a9776c6f"], section: "masculino", cat: "Moletons", name: "Moletom com patch", price: 1290,
    colors: ["Cinza mescla", "Verde água"], sizes: ["P", "M", "G", "GG"],
    desc: "Moletom de gola careca em felpa de algodão, com patch de rosto aplicado no peito.",
    comp: "100% algodão. Lavar à máquina a 30°." },
  { id: "jaqueta-couro", slot: "cima", fit: "masculino", cut: "justo", images: ["1675877879221-871aa9f7c314", "1521223890158-f9f7c3d5d504", "1551028719-00167b16eac5", "1727518154538-59e7dc479f8f"], section: "masculino", cat: "Jaquetas", name: "Jaqueta de couro", price: 9400,
    colors: ["Preto"], sizes: ["P", "M", "G", "GG"],
    desc: "Jaqueta motociclista em couro de cordeiro, com zíperes metálicos e forro de viscose.",
    comp: "Couro de cordeiro. Limpeza especializada." },
  { id: "camisa-popeline", slot: "cima", fit: "masculino", cut: "regular", images: ["1612541122840-bf7071c968a2", "1621072156002-e2fccdc0b176", "1776633733518-d81137214dc9", "1584713945776-55f3daca7a5b"], section: "masculino", cat: "Camisas", name: "Camisa de popeline", price: 1100,
    colors: ["Branco", "Azul listrado"], sizes: ["P", "M", "G", "GG"],
    desc: "Camisa de modelagem reta em popeline de algodão, com gola clássica e botões de osso.",
    comp: "100% algodão. Lavar à máquina a 30°." },
];

// Tabelas de medidas do corpo (cm) — usadas na Ajuda e no Provador
const SIZE_TABLES = {
  feminino: { head: ["Tamanho", "Busto", "Cintura", "Quadril"], rows: [
    ["PP", 80, 62, 88], ["P", 84, 66, 92], ["M", 88, 70, 96], ["G", 94, 76, 102], ["GG", 100, 82, 108] ] },
  masculino: { head: ["Tamanho", "Peito", "Cintura", "Quadril"], rows: [
    ["P", 92, 78, 94], ["M", 98, 84, 100], ["G", 104, 90, 106], ["GG", 110, 96, 112] ] },
  jeans: { head: ["Tamanho", "Cintura", "Quadril", "Entrepernas"], rows: [
    ["34", 64, 90, 80], ["36", 68, 94, 81], ["38", 72, 98, 82], ["40", 76, 102, 83], ["42", 80, 106, 84], ["44", 84, 110, 85], ["46", 88, 114, 86] ] },
  calcados: { head: ["Tamanho BR", "EU", "Pé"], rows: [
    ["35", 36, 23], ["36", 37, 23.7], ["37", 38, 24.3], ["38", 39, 25], ["39", 40, 25.7], ["40", 41, 26.3] ], noConvert: [1] },
};

// Recomendação de tamanho a partir das medidas do corpo (cm)
// body: { busto, cintura, quadril, pe, pref: "justo" | "regular" | "solto" }
const BODY_LABELS = { busto: "busto/peito", cintura: "cintura", quadril: "quadril", pe: "pé" };
const BODY_ARTICLE = { busto: "Seu", cintura: "Sua", quadril: "Seu", pe: "Seu" };
const FIT_DIMS = {
  feminino: [["busto", 1], ["cintura", 2], ["quadril", 3]],
  masculino: [["busto", 1], ["cintura", 2], ["quadril", 3]],
  jeans: [["cintura", 1], ["quadril", 2]],
  calcados: [["pe", 2]],
};

function recommendSize(p, body = {}) {
  if (!p.fit) return { status: "unico", size: p.sizes[0], text: "Tamanho único — serve para todos." };
  const rows = SIZE_TABLES[p.fit].rows.filter((r) => p.sizes.includes(String(r[0])));
  const dims = FIT_DIMS[p.fit];
  const missing = dims.filter(([k]) => !(body[k] > 0)).map(([k]) => BODY_LABELS[k]);
  if (missing.length) return { status: "falta", missing, text: `Informe ${missing.join(", ")} para ver o tamanho.` };

  // Posição fracionária de cada medida na grade (0 = menor tamanho)
  const pos = (x, col) => {
    const v = rows.map((r) => r[col]);
    const n = v.length - 1;
    if (x <= v[0]) return (x - v[0]) / (v[1] - v[0]);
    if (x >= v[n]) return n + (x - v[n]) / (v[n] - v[n - 1]);
    for (let i = 0; i < n; i++) if (x <= v[i + 1]) return i + (x - v[i]) / (v[i + 1] - v[i]);
  };
  const scored = dims.map(([k, col]) => ({ k, x: body[k], p: pos(body[k], col) }));
  const crit = scored.reduce((a, b) => (b.p > a.p ? b : a));

  const cutAdj = p.fit === "calcados" ? 0 : { amplo: -0.35, justo: 0.25 }[p.cut] || 0;
  const prefAdj = p.fit === "calcados" ? 0 : { justo: -0.3, solto: 0.3 }[body.pref] || 0;
  const adj = crit.p + cutAdj + prefAdj;
  const last = rows.length - 1;

  if (adj < -0.75) return { status: "fora", text: `Suas medidas ficam abaixo do menor tamanho (${rows[0][0]}) desta peça.` };
  if (adj > last + 0.75) return { status: "fora", text: `Suas medidas ficam acima do maior tamanho (${rows[last][0]}) desta peça.` };

  const i = Math.min(last, Math.max(0, Math.round(adj)));
  const size = String(rows[i][0]);
  const off = adj - i;
  const alt = Math.abs(off) > 0.3 ? rows[i + Math.sign(off)]?.[0] : null;
  const cutNote = { amplo: " Modelagem ampla: já veste mais solta.", justo: " Modelagem justa: consideramos um pouco mais de folga." }[p.cut] || "";
  const why = p.fit === "calcados"
    ? `Seu pé (${String(crit.x).replace(".", ",")} cm) corresponde ao ${size}.`
    : `${BODY_ARTICLE[crit.k]} ${BODY_LABELS[crit.k]} (${String(crit.x).replace(".", ",")} cm) é a medida que define o tamanho nesta peça.${cutNote}`;
  return { status: alt ? "entre" : "ideal", size, alt: alt ? String(alt) : null, text: why };
}

// Fotos do Unsplash (licença gratuita). Troque pelos IDs ou URLs das suas fotos.
function unsplash(photoId, w = 800, h = 1066) {
  return `https://images.unsplash.com/photo-${photoId}?w=${w}&h=${h}&fit=crop&crop=faces,center&auto=format&q=75`;
}

function productImg(id, n, w = 800, h = 1066) {
  const imgs = findProduct(id)?.images || [];
  return imgs.length ? unsplash(imgs[(n - 1) % imgs.length], w, h) : "";
}

function findProduct(id) {
  return PRODUCTS.find((p) => p.id === id);
}
