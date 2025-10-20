console.log("login.js cargado correctamente");
let form = document.getElementById("login");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  console.log("Evento submit detectado");

  let email = document.getElementById("email").value.trim();
  let password = document.getElementById("password").value.trim();

  if (email === "" || password === "") {
    alert("Completá todos los campos.");
    return;
  }

  alert("Inicio de sesión exitoso, ingresando a la pagina");
  window.location.href = "home.html";
});