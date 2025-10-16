const inputBuscar = document.getElementById("buscar");
const botonBuscar = document.getElementById("boton-buscar");
const resultado = document.getElementById("resultado");

botonBuscar.addEventListener("click", function() {
  const texto = inputBuscar.value;
  if (texto === "") {
    resultado.textContent = "no escribiste nada.";
  } else {
    resultado.textContent = "buscaste: " + texto;
  }
});