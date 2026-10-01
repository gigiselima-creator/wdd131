```javascript id="f3e7k1"
let contador = Number(localStorage.getItem("contadorAvaliacoes")) || 0;

contador++;

localStorage.setItem("contadorAvaliacoes", contador);

document.querySelector("#contador").textContent = contador;
```
