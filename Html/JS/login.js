console.log("login.js cargado correctamente");

const form = document.getElementById("login");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  console.log("Evento submit detectado");

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (email === "" || password === "") {
    alert("Completá todos los campos.");
    return;
  }

  alert("Inicio de sesión exitoso, ingresando a la pagina");
  window.location.href = "home.html";
});