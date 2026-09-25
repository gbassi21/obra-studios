"""Marca uma nova versão nos arquivos CSS e JS de todas as páginas.

O GitHub Pages manda o navegador guardar CSS e JS por 10 minutos. Sem um número
de versão, quem já visitou o site pode ver páginas novas misturadas com arquivos
antigos. Rode este script antes de cada envio ao GitHub:

    python atualizar-versao.py
"""
import glob
import re
import time

versao = time.strftime("%Y%m%d%H%M")
padrao = re.compile(r'((?:href|src)="(?!https?:)[^"?]+\.(?:css|js))(?:\?v=\d+)?"')

for pagina in glob.glob("*.html"):
    texto = open(pagina, encoding="utf-8").read()
    novo = padrao.sub(rf'\1?v={versao}"', texto)
    if novo != texto:
        open(pagina, "w", encoding="utf-8").write(novo)

print(f"versão {versao} aplicada")
