const produtos = [
    {
        id: "fc-1888",
        nome: "Capacitor de fluxo",
        classificacaomedia: 4.5
    },
    {
        id: "fc-2050",
        nome: "Fios elétricos",
        classificacaomedia: 4.7
    },
    {
        id: "fs-1987",
        nome: "Circuitos de tempo",
        classificacaomedia: 3.5
    },
    {
        id: "ac-2000",
        nome: "Reator de baixa tensão",
        classificacaomedia: 3.9
    },
    {
        id: "jj-1969",
        nome: "Equalizador de distorção",
        classificacaomedia: 5.0
    }
];

const selectProduto = document.querySelector("#produto");

// Preenche o menu com os nomes dos produtos.
if (selectProduto) {
    produtos.forEach((produto) => {
        const option = document.createElement("option");

        option.value = produto.id;
        option.textContent = produto.nome;

        selectProduto.appendChild(option);
    });
}

const formulario = document.querySelector("form");

// Cria um identificador diferente para cada novo envio.
if (formulario) {
    formulario.addEventListener("submit", () => {
        const campoIdentificador =
            document.querySelector("#submissionId");

        if (campoIdentificador) {
            campoIdentificador.value =
                `${Date.now()}-${Math.random().toString(36).slice(2)}`;
        }
    });
}