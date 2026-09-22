// Atualização de ano e última modificação no rodapé
document.getElementById("currentyear").textContent = new Date().getFullYear();
document.getElementById("lastModified").textContent = `Última modificação: ${document.lastModified}`;

// Obtenção dos valores estáticos do HTML
const temp = parseFloat(document.getElementById("temp").textContent);
const wind = parseFloat(document.getElementById("wind").textContent);

// Função de Sensação Térmica em 1 linha de retorno (Métrica)
const calcularSensacaoTermica = (t, v) => 
  (13.12 + 0.6215 * t - 11.37 * Math.pow(v, 0.16) + 0.3965 * t * Math.pow(v, 0.16)).toFixed(1);

// Validação dos critérios de cálculo
const chillElement = document.getElementById("chill");

if (temp <= 10 && wind > 4.8) {
  chillElement.textContent = `${calcularSensacaoTermica(temp, wind)} °C`;
} else {
  chillElement.textContent = "N/A";
}