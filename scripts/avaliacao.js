const parametros = new URLSearchParams(window.location.search);

const produto = parametros.get("produto");
const classificacao = parametros.get("classificacao");
const data = parametros.get("data");
const submissionId = parametros.get("submissionId");

const contadorElemento = document.querySelector("#contador");
const mensagemElemento = document.querySelector("#mensagem");

const CHAVE_CONTADOR = "contadorAvaliacoes";
const CHAVE_PROCESSADOS = "avaliacoesProcessadas";

// Recupera o total salvo no navegador.
let contador = Number(localStorage.getItem(CHAVE_CONTADOR)) || 0;

// Recupera os identificadores das avaliações já contabilizadas.
let processados = [];

try {
    const dadosSalvos = localStorage.getItem(CHAVE_PROCESSADOS);
    processados = dadosSalvos ? JSON.parse(dadosSalvos) : [];

    if (!Array.isArray(processados)) {
        processados = [];
    }
} catch (erro) {
    processados = [];
}

// Confere se os campos obrigatórios foram enviados.
const envioValido =
    Boolean(produto) &&
    Boolean(classificacao) &&
    Boolean(data) &&
    Boolean(submissionId);

if (envioValido) {
    // Só contabiliza um identificador uma vez.
    if (!processados.includes(submissionId)) {
        contador++;

        localStorage.setItem(
            CHAVE_CONTADOR,
            String(contador)
        );

        processados.push(submissionId);

        localStorage.setItem(
            CHAVE_PROCESSADOS,
            JSON.stringify(processados)
        );
    }

    mensagemElemento.textContent =
        "Sua avaliação foi registrada com sucesso.";
} else {
    mensagemElemento.textContent =
        "Nenhuma nova avaliação foi registrada. Preencha e envie o formulário para contabilizar uma avaliação.";
}

// Mostra o total atualizado na página.
contadorElemento.textContent = contador;