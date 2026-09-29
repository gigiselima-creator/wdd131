// Array de Objetos de Templos
const templos = [
  {
    nomeDoTemplo: "Aba Nigeria",
    localizacao: "Aba, Nigéria",
    consagracao: "2005, 7 de agosto",
    area: 11500,
    urlDaImagem: "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/aba-nigeria/400x250/aba-nigeria-temple-lds-273999-wallpaper.jpg"
  },
  {
    nomeDoTemplo: "Manti Utah",
    localizacao: "Manti, Utah, Estados Unidos",
    consagracao: "1888, 21 de maio",
    area: 74792,
    urlDaImagem: "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/manti-utah/400x250/manti-temple-768192-wallpaper.jpg"
  },
  {
    nomeDoTemplo: "Payson Utah",
    localizacao: "Payson, Utah, Estados Unidos",
    consagracao: "2015, 7 de junho",
    area: 96630,
    urlDaImagem: "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/payson-utah/400x225/payson-utah-temple-exterior-1416671-wallpaper.jpg"
  },
  {
    nomeDoTemplo: "Yigo Guam",
    localizacao: "Yigo, Guam",
    consagracao: "2020, 2 de maio",
    area: 6861,
    urlDaImagem: "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/yigo-guam/400x250/yigo_guam_temple_2.jpg"
  },
  {
    nomeDoTemplo: "Washington D.C.",
    localizacao: "Kensington, Maryland, Estados Unidos",
    consagracao: "1974, 19 de novembro",
    area: 156558,
    urlDaImagem: "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/washington-dc/400x250/washington_dc_temple-exterior-2.jpeg"
  },
  {
    nomeDoTemplo: "Lima Peru",
    localizacao: "Lima, Peru",
    consagracao: "1986, 10 de janeiro",
    area: 9600,
    urlDaImagem: "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/lima-peru/400x250/lima-peru-temple-evening-1075606-wallpaper.jpg"
  },
  {
    nomeDoTemplo: "Cidade do México, México",
    localizacao: "Cidade do México, México",
    consagracao: "1983, 2 de dezembro",
    area: 116642,
    urlDaImagem: "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/mexico-city-mexico/400x250/mexico-city-temple-exterior-1518361-wallpaper.jpg"
  },
  /* 3 Objetos Adicionais */
  {
    nomeDoTemplo: "São Paulo Brasil",
    localizacao: "São Paulo, Brasil",
    consagracao: "1978, 30 de outubro",
    area: 59246,
    urlDaImagem: "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/sao-paulo-brazil/400x250/sao-paulo-brazil-temple-lds-187030-wallpaper.jpg"
  }
];

// Seleção de elementos do DOM
const galeriaContainer = document.querySelector("#galeria-cards");
const tituloCategoria = document.querySelector("#titulo-categoria");
const mainnav = document.querySelector('.navigation');
const hambutton = document.querySelector('#menu');

// Função para renderizar os cartões dos templos
function criarCartoesTemplos(listaTemplos) {
    galeriaContainer.innerHTML = ""; // Limpa a galeria antes de renderizar

    listaTemplos.forEach(templo => {
        const card = document.createElement("figure");

        const nome = document.createElement("h3");
        nome.textContent = templo.nomeDoTemplo;

        const local = document.createElement("p");
        local.innerHTML = `<span class="rotulo">Localização:</span> ${templo.localizacao}`;

        const consagracao = document.createElement("p");
        consagracao.innerHTML = `<span class="rotulo">Consagração:</span> ${templo.consagracao}`;

        const area = document.createElement("p");
        area.innerHTML = `<span class="rotulo">Área:</span> ${templo.area.toLocaleString('pt-BR')} sq ft`;

        const imagem = document.createElement("img");
        imagem.setAttribute("src", templo.urlDaImagem);
        imagem.setAttribute("alt", `Templo de ${templo.nomeDoTemplo}`);
        imagem.setAttribute("loading", "lazy"); // Carregamento lento nativo
        imagem.setAttribute("width", "400");
        imagem.setAttribute("height", "250");

        // Monta o cartão
        card.appendChild(nome);
        card.appendChild(local);
        card.appendChild(consagracao);
        card.appendChild(area);
        card.appendChild(imagem);

        galeriaContainer.appendChild(card);
    });
}

// Extrai o ano numérico da string de consagração
function extrairAno(consagracaoStr) {
    return parseInt(consagracaoStr.split(",")[0].trim());
}

// Filtros de Evento do Menu
document.querySelector("#home").addEventListener("click", (e) => {
    e.preventDefault();
    tituloCategoria.textContent = "Página Inicial";
    criarCartoesTemplos(templos);
});

document.querySelector("#old").addEventListener("click", (e) => {
    e.preventDefault();
    tituloCategoria.textContent = "Templos Antigos (antes de 1900)";
    const antigos = templos.filter(templo => extrairAno(templo.consagracao) < 1900);
    criarCartoesTemplos(antigos);
});

document.querySelector("#new").addEventListener("click", (e) => {
    e.preventDefault();
    tituloCategoria.textContent = "Templos Novos (depois de 2000)";
    const novos = templos.filter(templo => extrairAno(templo.consagracao) > 2000);
    criarCartoesTemplos(novos);
});

document.querySelector("#large").addEventListener("click", (e) => {
    e.preventDefault();
    tituloCategoria.textContent = "Templos Grandes (mais de 90.000 sq ft)";
    const grandes = templos.filter(templo => templo.area > 90000);
    criarCartoesTemplos(grandes);
});

document.querySelector("#small").addEventListener("click", (e) => {
    e.preventDefault();
    tituloCategoria.textContent = "Templos Pequenos (menos de 10.000 sq ft)";
    const pequenos = templos.filter(templo => templo.area < 10000);
    criarCartoesTemplos(pequenos);
});

// Menu Hambúrguer Responsivo
if (hambutton && mainnav) {
    hambutton.addEventListener('click', () => {
        mainnav.classList.toggle('open');
        hambutton.classList.toggle('open');
    });
}

// Atualização de Datas no Rodapé
const currentYearElem = document.getElementById("currentyear");
const lastModifiedElem = document.getElementById("lastModified");

if (currentYearElem) {
    currentYearElem.textContent = new Date().getFullYear();
}

if (lastModifiedElem) {
    lastModifiedElem.textContent = `Última Modificação: ${document.lastModified}`;
}

// Renderização inicial com todos os templos
criarCartoesTemplos(templos);