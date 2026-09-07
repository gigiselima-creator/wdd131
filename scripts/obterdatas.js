// Preenche dinamicamente o ano de direitos autorais no rodapé
const elementoAno = document.getElementById("anoatual");
if (elementoAno) {
  elementoAno.textContent = new Date().getFullYear();
}

// Preenche a data de última modificação do documento
const elementoModificacao = document.getElementById("ultimaModificacao");
if (elementoModificacao) {
  elementoModificacao.textContent = `Última Modificação: ${document.lastModified}`;
}