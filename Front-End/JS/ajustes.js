let btnClaro = document.getElementById("claro");
let btnOscuro = document.getElementById("oscuro");
let brillo = document.getElementById("brillo");

window.addEventListener("DOMContentLoaded", () => {
  let modo = localStorage.getItem("modo") || "claro";
  aplicarModo(modo);

  let brilloGuardado = localStorage.getItem("brillo");
  if (brilloGuardado) {
    brillo.value = brilloGuardado;
    document.body.style.filter = `brightness(${brillo.value}%)`;
  }
});

btnClaro.addEventListener("click", () => {
  localStorage.setItem("modo", "claro");
  aplicarModo("claro");
});

btnOscuro.addEventListener("click", () => {
  localStorage.setItem("modo", "oscuro");
  aplicarModo("oscuro");
});

brillo.addEventListener("input", () => {
  document.body.style.filter = `brightness(${brillo.value}%)`;
  localStorage.setItem("brillo", brillo.value);
});

function aplicarModo(modo) {
  if (modo === "oscuro") {
    document.body.style.backgroundColor = "#1e1e1e";
    document.body.style.color = "#ffffff";
  } else {
    document.body.style.backgroundColor = "#ffffff";
    document.body.style.color = "#000000";
  }
}
