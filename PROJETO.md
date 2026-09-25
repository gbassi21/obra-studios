# Obra Studios — guia completo do projeto

> Documento de passagem de contexto. Foi escrito para que outra pessoa ou outra IA consiga entender o projeto inteiro e fazer mudanças com segurança. Última atualização: 24/09/2026.

---

## 1. O que é

**Obra Studios** é o protótipo de uma loja de moda online, de uma marca **fictícia**. O visual foi inspirado no site da **Acne Studios** (acnestudios.com), mas o nome, os textos e a identidade são próprios. Nome, logo e fotos da Acne **não** foram usados, de propósito, para não imitar uma marca real.

- **Site no ar:** https://gbassi21.github.io/obra-studios/ (GitHub Pages)
- **Repositório:** https://github.com/gbassi21/obra-studios (público, branch `main`)
- **Pasta local:** `D:\ia\obra-studios` (Windows)
- **Idioma:** tudo em português do Brasil (textos, comentários de código, commits).
- **Status:** demonstração para amigos testarem. **Não é uma loja real**: nenhum pagamento é processado, nenhum dado sai do navegador e não há servidor.

### Público e objetivo
O dono do projeto quer mostrar o site a amigos (link compartilhável) e, no futuro, talvez transformar em loja real. Por enquanto, a prioridade é a experiência visual e as interações parecerem reais.

---

## 2. Stack e princípios

- **HTML + CSS + JavaScript puros.** Não há framework, bundler, `npm` nem etapa de build.
- **Site 100% estático:** cada página é um `.html` que carrega scripts comuns e um script próprio.
- **Estado no navegador:** sacola, conta, pedidos e medidas ficam no `localStorage`, sempre com `try/catch`.
- **Sem backend.** Tudo que num site real dependeria de servidor (pagamento, login, envio de formulários) é simulado e marcado como "demonstração" na interface.
- **Fontes:** Google Fonts (Inter e Manrope). É o único recurso externo, junto com a API ViaCEP.
- **Fotos:** guardadas no próprio projeto em `img/` (WebP), baixadas do Unsplash (licença gratuita). O crédito "Fotos: Unsplash" fica no rodapé.

### Como rodar localmente
```bash
cd D:\ia\obra-studios
python -m http.server 5510
# abrir http://localhost:5510
```
Abrir o `.html` direto pelo sistema de arquivos (`file://`) **não** é recomendado: use sempre um servidor estático.

---

## 3. Mapa de arquivos

| Arquivo | Papel |
|---|---|
| `index.html` + `main.js` | Página inicial: capa dividida (feminino/masculino) com o nome da marca, duas grades de produtos e uma faixa editorial de 5 fotos. |
| `categoria.html` + `categoria.js` | Listagem com filtros (tipo, tamanho, cor, preço), ordenação, etiquetas de filtros ativos, visualização em 2 ou 4 colunas e painel lateral. Estado na URL. |
| `produto.html` + `produto.js` | Página de produto: galeria, cor, tamanho, tamanho recomendado, lista de desejos, "adicionar à sacola", seções expansíveis e produtos relacionados. |
| `sacola.html` + `sacola.js` | Sacola: quantidades, remover, subtotal, frete e total. |
| `checkout.html` + `checkout.js` | Finalizar compra (demonstração): contato, endereço (CEP pelo ViaCEP), envio, pagamento (cartão, Pix, boleto), cupom, validação e confirmação. |
| `conta.html` + `conta.js` | Conta: entrar ou criar conta; abas Visão geral, Pedidos, Lista de desejos, Endereços e Dados pessoais. |
| `desfile.html` + `desfile.js` | Desfile: capa, texto da coleção, grade de looks, tela cheia com "Comprar o look", bastidores, ficha técnica e arquivo de temporadas. |
| `provador.html` + `provador.js` | Provador: recomendação de tamanho por medidas e montagem de looks. |
| `ajuda.html` + `ajuda.js` | Ajuda: busca nas perguntas frequentes, rastreio de pedido, guia de medidas (cm/pol) e contato. |
| `lojas.html` + `lojas.js` | Lojas físicas com filtro por cidade e status "aberta agora" calculado pelo horário. |
| `carreiras.html` + `carreiras.js` | Vagas com filtros e formulário de candidatura (demonstração). |
| `sobre.html`, `sustentabilidade.html` | Páginas institucionais estáticas. |
| `privacidade.html`, `termos.html` + `legal.js` | Textos legais-modelo; `legal.js` monta o índice lateral a partir dos `<h2>`. |
| `data.js` | **Catálogo e regras de negócio:** produtos, tabelas de medidas, recomendação de tamanho e caminhos das fotos. |
| `shared.js` | **Código comum:** formatação em reais, frete, sacola, armazenamento, conta, medidas, cabeçalho, busca, rodapé, aviso de "adicionado" e célula de produto. |
| `styles.css` | Todo o CSS do site (um arquivo só). |
| `img/` e `img/sm/` | 104 fotos em WebP (até 820 px de largura; capas largas até 1400 px) e 48 miniaturas de produto (400 px). |
| `atualizar-versao.py` | Coloca `?v=AAAAMMDDHHmm` nos links de CSS/JS de todas as páginas. **Rodar antes de cada publicação.** |
| `robots.txt` | Pede aos buscadores para não indexar o site. |
| `README.md` | Resumo curto. |
| `PROJETO.md` | Este documento. |

### Ordem de carregamento dos scripts (em todas as páginas)
```html
<script src="data.js?v=..."></script>      <!-- 1. catálogo e regras -->
<script src="shared.js?v=..."></script>    <!-- 2. utilidades + monta cabeçalho e rodapé -->
<script src="pagina.js?v=..."></script>    <!-- 3. lógica da página -->
```
Os scripts são clássicos (não são módulos ES), então compartilham o escopo global. **Cuidado:** cada script de página declara `const $ = (id) => document.getElementById(id)`. Isso só funciona porque cada página carrega um único script próprio. Nunca carregue dois scripts de página na mesma página.

### Esqueleto de toda página
```html
<body data-page="nome">          <!-- identifica a página (home, produto, checkout...) -->
  <div id="site-header"></div>   <!-- shared.js troca pelo cabeçalho -->
  <main>...</main>
  <div id="site-footer"></div>   <!-- shared.js troca pelo rodapé -->
  <!-- scripts -->
</body>
```
- `data-page="home"`: o nome da marca no cabeçalho só aparece depois de rolar a capa.
- `data-page="checkout"`: cabeçalho e rodapé mínimos, sem menu, para não distrair a compra.
- Todas as páginas têm `<meta name="robots" content="noindex, nofollow">`.

---

## 4. Modelo de dados (`data.js`)

### Produto
```js
{
  id: "casaco-la",               // usado na URL: produto.html?id=casaco-la
  slot: "cima",                  // Provador: "cima" | "baixo" | "calcado" | "acessorio"
  fit: "feminino",               // tabela de medidas: "feminino" | "masculino" | "jeans" | "calcados" | null (tamanho único)
  cut: "regular",                // modelagem: "justo" | "regular" | "amplo" | null
  images: ["1678700266327-...", ...], // 4 IDs de foto; o arquivo é img/<id>.webp (miniatura em img/sm/<id>.webp)
  section: "novidades",          // "novidades" = feminino, "masculino" = masculino
  cat: "Casacos",                // categoria exibida e usada nos filtros
  name: "Casaco de lã com cinto",
  price: 7900,                   // em reais, número inteiro
  colors: ["Camelo", "Grafite"],
  sizes: ["PP", "P", "M", "G"],  // precisam existir na tabela SIZE_TABLES[fit]
  desc: "...",                   // descrição
  comp: "..."                    // composição e cuidados
}
```
São 12 produtos: 8 em `novidades` (feminino) e 4 em `masculino`. Os filtros da categoria, as cores, os tamanhos e a busca são **derivados automaticamente** do catálogo. Para adicionar um produto, basta incluir um objeto no array e colocar as fotos em `img/`.

### Fotos
- `photo(id)` → `img/<id>.webp`
- `productImg(productId, n, w)` → n-ésima foto do produto (1 a 4, cíclica); se `w <= 400`, usa a miniatura `img/sm/`.
- Os IDs são os IDs originais do Unsplash (`photo-<id>`). Para usar fotos próprias: salve `img/nome.webp` (e `img/sm/nome.webp` para produtos) e troque o ID pelo `nome`.
- Na grade, a primeira foto é a principal e a segunda aparece ao passar o mouse.
- As fotos são cortadas por CSS (`object-fit: cover`, centralizado).

### Tabelas de medidas (`SIZE_TABLES`)
Medidas do **corpo** em cm, por tamanho. São usadas na Ajuda (guia de medidas) e no Provador.
- `feminino`: Tamanho, Busto, Cintura, Quadril (PP a GG)
- `masculino`: Tamanho, Peito, Cintura, Quadril (P a GG)
- `jeans`: Tamanho, Cintura, Quadril, Entrepernas (34 a 46)
- `calcados`: Tamanho BR, EU, Pé (35 a 40); `noConvert: [1]` impede converter a coluna EU para polegadas.

**Os valores são de exemplo** e precisam ser trocados pelas medidas reais da modelagem.

### Recomendação de tamanho (`recommendSize(produto, corpo)`)
- `corpo = { busto, cintura, quadril, pe, pref }`, com `pref` = `"justo"`, `"regular"` ou `"solto"`.
- Para cada medida relevante (`FIT_DIMS[fit]`), calcula a **posição fracionária** na grade, interpolando entre os tamanhos.
- Usa a medida **mais crítica** (a maior posição), porque a peça precisa servir na parte mais larga.
- Ajustes: modelagem `amplo` −0,35 e `justo` +0,25; preferência `justo` −0,3 e `solto` +0,3. Calçados não recebem ajuste.
- Arredonda para o tamanho mais próximo que o produto oferece.
- Retorna `{ status, size, alt, text }`, com `status` = `ideal` | `entre` (e `alt` = o outro tamanho) | `unico` | `falta` (medidas ausentes) | `fora` (fora da grade).
- O `text` explica o motivo em português, por exemplo: "Sua cintura (71 cm) é a medida que define o tamanho nesta peça."

---

## 5. Código comum (`shared.js`)

| Nome | O que faz |
|---|---|
| `brl(n)` | Formata em reais. Sem centavos para inteiros ("R$ 1.490") e com 2 casas quando há centavos ("R$ 793,33"). |
| `FREE_SHIPPING = 1000`, `SHIPPING = 45`, `shippingFor(subtotal)` | Regras de frete padrão. |
| `Cart` | Sacola no `localStorage` (`obra-cart`): `read`, `write`, `add(id, cor, tamanho, qtd)`, `setQty(i, qtd)`, `count`, `subtotal`. Dispara o evento `cart:change` e sincroniza entre abas. |
| `Store` | `get(chave, padrão)` e `set(chave, valor)` com JSON e `try/catch`. |
| `Account` | Perfil, sessão, pedidos, endereços e lista de desejos. **Nunca guarda senha.** |
| `Body` | Medidas do Provador (`obra-body`). |
| `renderChrome()` | Troca `#site-header` e `#site-footer` pelo HTML real, liga o menu do celular e a busca com resultados ao digitar. |
| `showToast(produto, cor, tamanho)` | Aviso "Adicionado à sacola" no canto da tela. |
| `productCell(p)` | HTML da célula de produto, usada em todas as grades. Inclui os botões de adicionar rápido por tamanho (`data-add`, `data-size`). |
| Clique global em `[data-add]` | Adiciona à sacola com a primeira cor e o tamanho do botão. |

### Chaves do `localStorage`
| Chave | Conteúdo |
|---|---|
| `obra-cart` | `[{ id, color, size, qty }]` |
| `obra-profile` | `{ name, email, phone, cpf, birth, news, sms, pref, since }` |
| `obra-session` | `true` ou `false` (sair não apaga o perfil) |
| `obra-orders` | Pedidos: `{ id, date, status, email, items[{...price}], subtotal, discount, shipping, total, shippingMethod, address, payment }`. **Sem dados de cartão.** |
| `obra-addresses` | `[{ id, name, cep, street, number, complement, district, city, default }]` |
| `obra-wishlist` | `["produto-id", ...]` |
| `obra-body` | `{ busto, cintura, quadril, pe, pref }` |
| `obra-cols` | Visualização da categoria: `"2"` ou `"4"` |

---

## 6. Design system

O estilo segue um guia de referência da Acne Studios: uma revista de moda aberta sobre mármore.

- **Fundo branco**, fotos de ponta a ponta sem espaço entre elas, quase nenhum "enfeite" de interface.
- **Sem sombras, sem cantos arredondados** (raio 0 em tudo), **sem botões preenchidos coloridos**. Os botões são contornados em preto e ficam preenchidos de preto ao passar o mouse.
- **Rótulos:** 10px, MAIÚSCULAS, espaçamento de letras 0,033em. É a assinatura tipográfica do site (classe `.label`).
- **Azul cobalto `#0018a8`** só em links e estados ativos (classe `.link`), nunca como fundo de botão.
- **Títulos grandes** em Manrope 500 (substituindo a fonte própria da marca), com espaçamento negativo.
- **Separação por espaço em branco**, não por caixas. Linhas finas `#f2f2f2` quando necessário.

### Tokens (`:root` em `styles.css`)
```css
--color-cobalt: #0018a8;  --color-ink: #000000;  --color-graphite: #6b6b6b;
--color-paper: #ffffff;   --color-bone: #f2f2f2;
--font-ui: "Helvetica Neue", Helvetica, Inter, Arial, sans-serif;
--font-wordmark: Manrope, "GT Walsheim", "Helvetica Neue", sans-serif;
--text-label: 10px; --tracking-label: 0.033em; --text-display: 120px;
--space-edge: 10px; --space-element: 10px; --space-nav: 30px; --section-gap: 60px;
```
Cor de erro fora da paleta: `#b00020` (só em validação de formulário).

### Convenções de CSS
- Nomes no padrão BEM simplificado: `.bloco__elemento--variante` (ex.: `.fit-row__big`, `.board__slot--cima`).
- Classes utilitárias: `.label`, `.muted`, `.link`, `.btn`, `.btn--ghost`, `.option` (opção selecionável), `.is-active`, `.is-open`, `.is-invalid`, `.hide-sm`, `.show-sm`.
- `[hidden] { display: none !important; }` é global: use `el.hidden = true/false` para mostrar e esconder.
- **Responsivo:** há blocos `@media (max-width: 900px)` e `@media (max-width: 640px)` em mais de um ponto do arquivo. Ao adicionar regras de celular, coloque-as **depois** da regra base correspondente, porque a ordem do cascade importa.
- `prefers-reduced-motion` desliga as transições.
- O nome da marca na capa usa `mix-blend-mode: difference` com cor branca, para ficar legível sobre foto clara ou escura.

---

## 7. Comportamento de cada página (detalhes importantes)

- **URLs com parâmetros:** `produto.html?id=`, `categoria.html?g=feminino|masculino|todos&tipo=&tam=&cor=&preco=&ordem=`, `desfile.html?s=oi26|pv26|oi25|pv25`, `provador.html?id=` (destaca a peça) e `?look=id,id,id` (look compartilhado), `lojas.html?cidade=`. Âncoras como `ajuda.html#envios-3` abrem uma pergunta específica.
- **Categoria:** a contagem de cada opção de filtro ignora o próprio grupo. As opções que dariam 0 resultados ficam desativadas. O foco do teclado é preservado ao redesenhar o painel.
- **Checkout:** máscaras (CPF, CEP, celular, cartão, validade), CPF validado pelos dígitos verificadores e validade que não aceita datas passadas. Cupom `OBRA10` (10%), Pix com 5% de desconto, parcelas até 10x com mínimo de R$ 100 e frete expresso de R$ 90. Com a conta aberta, os campos vêm preenchidos. Ao confirmar: salva o pedido (sem cartão), limpa a sacola e mostra a confirmação. Textos digitados são escapados antes de ir para `innerHTML`.
- **Conta:** login de demonstração (qualquer e-mail com senha de 6 ou mais caracteres). A senha nunca é guardada. O status do pedido avança com o tempo: em preparação, depois enviado (após 1 dia), depois entregue (após 5 dias).
- **Desfile:** 30 fotos de looks (`LOOKS`); cada temporada começa num ponto diferente da lista. `lookProducts(n)` associa de 1 a 3 produtos a cada look por uma fórmula fixa, **não curada**.
- **Provador:** as medidas são validadas pelos `min`/`max` dos campos. "Salvar" grava em `obra-body`; a partir daí a página de produto mostra "Seu tamanho: M" e já seleciona o tamanho. Na montagem de looks, calçado e acessório podem ser removidos, e o botão de compartilhar copia um link `?look=`.
- **Lojas:** o horário vem no formato `hours: [domingo..sábado]`, cada dia como `[abre, fecha]` ou `null` (fechada). Calcula "Aberta agora" ou "Fechada — abre amanhã às 10h".
- **Formulários de contato e candidatura:** não enviam nada. Mostram "demonstração — nada foi enviado".

---

## 8. Publicação (GitHub Pages)

1. Fazer as mudanças e testar no `localhost`.
2. **`python atualizar-versao.py`** (obrigatório, veja a seção 9).
3. Enviar ao GitHub:
   ```bash
   git add -A
   git commit -m "Descrição da mudança"
   git push origin main
   ```
4. O GitHub Pages republica em cerca de 1 minuto. Para verificar: `gh api repos/gbassi21/obra-studios/pages/builds/latest`.

- Os commits usam o e-mail anônimo do GitHub (`175359064+gbassi21@users.noreply.github.com`), para o e-mail pessoal não ficar público.
- O `gh` (GitHub CLI) está instalado em `C:\Program Files\GitHub CLI\gh.exe`, com login na conta `gbassi21`.
- O dono pediu que cada novidade concluída seja enviada ao GitHub logo em seguida.

---

## 9. Armadilhas conhecidas (leia antes de mudar)

1. **Cache do GitHub Pages.** O servidor manda o navegador guardar CSS e JS por 10 minutos (`Cache-Control: max-age=600`). Sem o `?v=` nos links, quem já visitou o site recebe o HTML novo com JavaScript antigo e a página quebra. Isso já aconteceu com o Provador. **Sempre rode `atualizar-versao.py` antes de publicar.**
2. **`const` globais duplicadas.** Os scripts compartilham o escopo global. Declarar em um script de página um nome que já existe em `data.js` ou `shared.js` (ex.: `Cart`, `brl`, `photo`) causa erro e a página inteira para de funcionar.
3. **Caminhos relativos.** O site fica em `/obra-studios/`, não na raiz do domínio. Use sempre caminhos relativos (`produto.html`, `img/...`), nunca `/produto.html`.
4. **Letras maiúsculas em nomes de arquivos.** O Windows ignora a diferença, mas o GitHub Pages não. Mantenha tudo em minúsculas.
5. **Tamanhos precisam existir na tabela.** Se um produto tiver um tamanho que não está em `SIZE_TABLES[fit]`, a recomendação ignora esse tamanho.
6. **`innerHTML` com texto de usuário:** sempre escape (há funções `esc()` em `checkout.js`, `conta.js` e `ajuda.js`).
7. **Fotos:** não use links do Unsplash de volta (bloqueadores e redes podem impedir). Guarde em `img/` como WebP, com cerca de 820 px de largura e qualidade ~62.

---

## 10. O que é conteúdo de exemplo (trocar antes de virar loja real)

- Nome da marca, textos institucionais, linha do tempo ("Ano 1", "Ano 2"...).
- Preços, cores, tamanhos, descrições e **tabelas de medidas**.
- Contatos: WhatsApp `(11) 00000-0000`, `0800 000 0000`, e-mails `@exemplo.com` e endereços com número `000`.
- Lojas, horários, vagas, benefícios e metas de sustentabilidade. **Não publicar metas falsas como se fossem reais.**
- Temporadas, datas e textos do desfile; ficha técnica ("Nome Sobrenome").
- **Privacidade e Termos:** modelos. Precisam de revisão de um advogado e de razão social, CNPJ e encarregado de dados.
- Fotos: são do Unsplash e algumas mostram logos de outras marcas nas roupas. O ideal são fotos próprias.
- Redes sociais do rodapé (Instagram, Pinterest, Spotify) estão sem link.

---

## 11. Como o projeto foi criado (histórico)

Construído em conversa com o Claude (Claude Code, no app desktop), em etapas, cada uma testada no navegador antes de seguir:

1. **Guia de estilo:** o dono colou um guia da Acne Studios (tokens de cor, tipografia, espaçamento e componentes) e pediu um site com essa base. Foi criada a marca fictícia Obra Studios para não imitar a marca real.
2. **Página inicial:** capa dividida, grades sem espaço entre as fotos, faixa editorial e rodapé.
3. **Produto e sacola:** extração de `data.js` e `shared.js`; sacola no `localStorage`; aviso de "adicionado".
4. **Checkout:** formulário em 4 etapas, máscaras, validação, ViaCEP, cupom, Pix e parcelas, confirmação.
5. **Categoria com filtros:** painel lateral, contagens, estado na URL.
6. **Desfile:** looks em tela cheia com navegação por teclado e toque, arquivo de temporadas.
7. **Conta:** perfil, pedidos (o checkout passou a salvá-los), endereços, lista de desejos; checkout preenchido pela conta.
8. **Ajuda:** busca nas perguntas, rastreio, guia de medidas, contato.
9. **Páginas do rodapé:** Sobre, Lojas, Carreiras, Sustentabilidade, Privacidade, Termos.
10. **Fotos reais:** as fotos aleatórias foram trocadas por fotos do Unsplash escolhidas por peça, conferidas visualmente.
11. **Publicação:** GitHub Pages, com `noindex` e repositório público.
12. **Provador:** recomendação de tamanho e montagem de looks; tabelas de medidas centralizadas em `data.js`.
13. **Correção:** o site quebrou para quem já tinha visitado (cache). Foram adicionados a versão nos arquivos e as fotos dentro do projeto.

---

## 12. Ideias de próximos passos

- Hospedar no **Cloudflare Pages** ou na **Netlify** se virar loja comercial (os termos do GitHub Pages não permitem lojas).
- Ligar o checkout a um meio de pagamento real (Mercado Pago, Pagar.me, Stripe) e a um backend para pedidos, estoque e login.
- Provador com foto por IA (FASHN, fal.ai, Replicate), usando um pequeno servidor para esconder a chave. Exige cuidados com a LGPD.
- Curar manualmente as peças de cada look do desfile (`lookProducts`).
- Fotos próprias das peças e tabelas de medidas reais.
- Tema escuro (hoje o site é só claro, de propósito).
