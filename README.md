# Obra Studios

Protótipo de loja de moda — site estático (HTML, CSS e JavaScript), sem servidor.

Demonstração: nenhum pagamento é processado e nenhum dado é enviado. Fotos: [Unsplash](https://unsplash.com).

Para abrir localmente, sirva a pasta com qualquer servidor estático, por exemplo:

```
python -m http.server 5510
```

## Publicar uma atualização

Antes de enviar ao GitHub, rode `python atualizar-versao.py`. Ele coloca um número de versão nos arquivos CSS e JS de todas as páginas, para quem já visitou o site não ver páginas novas misturadas com arquivos antigos guardados pelo navegador.

As fotos ficam na pasta `img/` (e as miniaturas em `img/sm/`), em WebP.
