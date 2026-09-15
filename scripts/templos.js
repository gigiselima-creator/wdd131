const mainnav = document.querySelector('.navigation');
const hambutton = document.querySelector('#menu');

if (hambutton && mainnav) {
    hambutton.addEventListener('click', () => {
        mainnav.classList.toggle('open');
        hambutton.classList.toggle('open');
    });
}

// Datas do Footer
const currentYearElem = document.getElementById("currentyear");
const lastModifiedElem = document.getElementById("lastModified");

if (currentYearElem) {
    currentYearElem.textContent = new Date().getFullYear();
}

if (lastModifiedElem) {
    lastModifiedElem.textContent = `Última Modificação: ${document.lastModified}`;
}