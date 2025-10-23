let email = document.getElementById("email");
let pass = document.getElementById("password");
let entrar = document.getElementById("entrar");
let mensaje = document.getElementById("mensaje");

if (localStorage.getItem("logueado") === "true") {
  window.location.href = "home.html";
}

entrar.addEventListener("click", () => {
  if (email.value.trim() === "" || pass.value.trim() === "") {
    mensaje.textContent = "Completa todos los campos.";
  } else {
    localStorage.setItem("logueado", "true");
    window.location.href = "home.html";
  }
});