let btnClaro = document.getElementById("claro");
let btnOscuro = document.getElementById("oscuro");
let brillo = document.getElementById("brillo");

window.addEventListener("DOMContentLoaded", () => {
  let modo = localStorage.getItem("modo") || "claro";
  aplicarModo(modo);

  let brilloGuardado = localStorage.getItem("brillo") || 100;
  if (brillo) brillo.value = brilloGuardado;

  actualizarBrillo(brilloGuardado);
});

btnClaro?.addEventListener("click", () => {
  localStorage.setItem("modo", "claro");
  aplicarModo("claro");
});

btnOscuro?.addEventListener("click", () => {
  localStorage.setItem("modo", "oscuro");
  aplicarModo("oscuro");
});

brillo?.addEventListener("input", () => {
  actualizarBrillo(brillo.value);
  localStorage.setItem("brillo", brillo.value);
});

function aplicarModo(modo) {
  if (modo === "oscuro") {
    document.documentElement.classList.add("modo-oscuro");
    document.documentElement.classList.remove("modo-claro");
  } else {
    document.documentElement.classList.add("modo-claro");
    document.documentElement.classList.remove("modo-oscuro");
  }
}

function actualizarBrillo(valor) {
  document.documentElement.style.filter = `brightness(${valor}%)`;
}
