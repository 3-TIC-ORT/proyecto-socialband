if (localStorage.getItem("logueado") !== "true") {
  window.location.href = "login.html";
}

document.getElementById("cerrarSesion").addEventListener("click", () => {
  localStorage.removeItem("logueado");
  window.location.href = "login.html";
});
