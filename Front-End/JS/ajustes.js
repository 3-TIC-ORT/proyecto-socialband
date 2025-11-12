connect2Server();

const volumen = document.getElementById("volumen");

window.addEventListener("DOMContentLoaded", () => {
  let volumenGuardado = localStorage.getItem("volumen") || 50;
  volumen.value = volumenGuardado;
});

volumen.addEventListener("input", () => {
  localStorage.setItem("volumen", volumen.value);
});
