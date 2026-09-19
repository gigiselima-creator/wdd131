// Atualização das informações do Rodapé
document.getElementById("currentyear").textContent = new Date().getFullYear();
document.getElementById("lastModified").textContent = `Última modificação: ${document.lastModified}`;

// Variáveis estáticas de temperatura (°C) e vento (km/h)
const tempCelsius = 8;
const windSpeedKmH = 10;

// Função que calcula a sensação térmica (fórmula em sistema métrico)
const calcularSensacaoTermica = (t, v) => 
  (13.12 + 0.6215 * t - 11.37 * Math.pow(v, 0.16) + 0.3965 * t * Math.pow(v, 0.16)).toFixed(1);

// Verificação dos critérios para aplicação do cálculo
const chillElement = document.getElementById("chill");

if (tempCelsius <= 10 && windSpeedKmH > 4.8) {
  chillElement.textContent = `${calcularSensacaoTermica(tempCelsius, windSpeedKmH)} °C`;
} else {
  chillElement.textContent = "N/A";
}