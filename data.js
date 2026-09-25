// Catálogo de exemplo — troque pelas suas peças e fotos reais
const PRODUCTS = [
  { id: "jeans-1977", images: ["1683126257977-5142e52acc7e", "1578693082747-50c396cacd81", "1598554747436-c9293d6a588f", "1602293589930-45aad59ba3ab"], section: "novidades", cat: "Jeans feminino", name: "Jeans 1977 reto", price: 1490,
    colors: ["Azul claro", "Preto"], sizes: ["34", "36", "38", "40", "42"],
    desc: "Jeans de cintura alta e perna reta, em denim rígido de algodão com lavagem vintage. Modelagem inspirada nos arquivos dos anos 70.",
    comp: "100% algodão. Lavar à mão ou à máquina a 30°. Não usar secadora." },
  { id: "cachecol-la", images: ["1609594480207-0ca5ae53a68a", "1535982368253-05d640fe0755", "1712668055625-a881a5ea88c2", "1789845137167-5a6fed517e65"], section: "novidades", cat: "Cachecóis", name: "Cachecol de lã canelado", price: 890,
    colors: ["Cinza mescla", "Areia"], sizes: ["Único"],
    desc: "Cachecol longo em malha canelada de lã macia, com franjas nas extremidades e etiqueta bordada.",
    comp: "100% lã. Lavagem a seco." },
  { id: "bolsa-musubi", images: ["1614179689702-355944cd0918", "1711113456675-889254dc9f02", "1664187284276-2f3254cdc7dc", "1683921470299-b8f0f3331657"], section: "novidades", cat: "Bolsas", name: "Bolsa Musubi média", price: 6200,
    colors: ["Preto", "Cinza"], sizes: ["Único"],
    desc: "Bolsa estruturada em couro, com alças duplas, ferragens prateadas e fecho magnético. Forro em algodão e bolso interno.",
    comp: "Couro bovino. Limpar com pano seco." },
  { id: "camiseta-oversized", images: ["1627225924765-552d49cf47ad", "1616006897093-5e4635c0de35", "1622023828943-b4e6afb60516", "1622445275992-e7efb32d2257"], section: "novidades", cat: "Camisetas", name: "Camiseta oversized", price: 590,
    colors: ["Branco", "Preto", "Cinza"], sizes: ["PP", "P", "M", "G", "GG"],
    desc: "Camiseta de modelagem ampla em jersey de algodão orgânico, com ombro caído e logo discreto no peito.",
    comp: "100% algodão orgânico. Lavar à máquina a 30°." },
  { id: "casaco-la", images: ["1678700266327-8959be9622fd", "1539533113208-f6df8cc8b543", "1539533018447-63fcce2678e3", "1635097247472-dfc3e652db97"], section: "novidades", cat: "Casacos", name: "Casaco de lã com cinto", price: 7900,
    colors: ["Camelo", "Grafite"], sizes: ["PP", "P", "M", "G"],
    desc: "Casaco longo em lã dupla face, com cinto removível, lapela ampla e bolsos embutidos.",
    comp: "90% lã, 10% cashmere. Lavagem a seco." },
  { id: "cardiga-mohair", images: ["1762112210886-8c0cad0ec75d", "1773747310674-b42a55d72003", "1773747488278-1c45a72f4458", "1608113378106-2a7267a9aaf3"], section: "novidades", cat: "Malhas", name: "Cardigã mohair", price: 2300,
    colors: ["Off-white", "Lilás"], sizes: ["P", "M", "G"],
    desc: "Cardigã de tricô aberto em mistura de mohair, com botões de madrepérola e acabamento canelado.",
    comp: "60% mohair, 30% poliamida, 10% lã. Lavar à mão." },
  { id: "bota-couro", images: ["1763661300203-aa3e2702f510", "1602250523342-d2212b96a297", "1618947085672-1dcb69696c33", "1613673720017-56e42d90fee4"], section: "novidades", cat: "Calçados", name: "Bota de couro", price: 4100,
    colors: ["Preto"], sizes: ["35", "36", "37", "38", "39", "40"],
    desc: "Bota de cano médio em couro liso, bico quadrado e salto bloco de 5 cm. Solado de borracha.",
    comp: "Couro bovino, solado de borracha." },
  { id: "gorro-la", images: ["1618354691792-d1d42acfd860", "1606453914790-b9be7cdb321f", "1510598969022-c4c6c5d05769", "1576871337632-b9aef4c17ab9"], section: "novidades", cat: "Acessórios", name: "Gorro de lã", price: 450,
    colors: ["Preto", "Verde", "Grafite"], sizes: ["Único"],
    desc: "Gorro canelado em lã com barra dobrada e patch de rosto costurado na frente.",
    comp: "100% lã. Lavar à mão." },
  { id: "jeans-2003", images: ["1697677791984-5bb30a8a6a25", "1626596662792-12cdc7ecce71", "1774413511100-54f34b2912e5", "1697678207628-6758ecf9a2cc"], section: "masculino", cat: "Jeans masculino", name: "Jeans 2003 relaxed", price: 1590,
    colors: ["Cinza lavado", "Azul médio"], sizes: ["38", "40", "42", "44", "46"],
    desc: "Jeans de cintura baixa e perna solta, com barra longa que se acumula sobre o sapato.",
    comp: "100% algodão. Lavar à máquina a 30°." },
  { id: "moletom-patch", images: ["1554568218-ffd1e72a2151", "1554568218-9a456cea00cf", "1714023498720-ccb2fdaa6a7d", "1778787826955-f846a9776c6f"], section: "masculino", cat: "Moletons", name: "Moletom com patch", price: 1290,
    colors: ["Cinza mescla", "Verde água"], sizes: ["P", "M", "G", "GG"],
    desc: "Moletom de gola careca em felpa de algodão, com patch de rosto aplicado no peito.",
    comp: "100% algodão. Lavar à máquina a 30°." },
  { id: "jaqueta-couro", images: ["1675877879221-871aa9f7c314", "1521223890158-f9f7c3d5d504", "1551028719-00167b16eac5", "1727518154538-59e7dc479f8f"], section: "masculino", cat: "Jaquetas", name: "Jaqueta de couro", price: 9400,
    colors: ["Preto"], sizes: ["P", "M", "G", "GG"],
    desc: "Jaqueta motociclista em couro de cordeiro, com zíperes metálicos e forro de viscose.",
    comp: "Couro de cordeiro. Limpeza especializada." },
  { id: "camisa-popeline", images: ["1612541122840-bf7071c968a2", "1621072156002-e2fccdc0b176", "1776633733518-d81137214dc9", "1584713945776-55f3daca7a5b"], section: "masculino", cat: "Camisas", name: "Camisa de popeline", price: 1100,
    colors: ["Branco", "Azul listrado"], sizes: ["P", "M", "G", "GG"],
    desc: "Camisa de modelagem reta em popeline de algodão, com gola clássica e botões de osso.",
    comp: "100% algodão. Lavar à máquina a 30°." },
];

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
