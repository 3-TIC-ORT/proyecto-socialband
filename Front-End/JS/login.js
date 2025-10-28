connect2Server();

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
    return;
  }

  let datosLogin = {
    email: email.value.trim(),
    contraseña: pass.value.trim()
  };

  postEvent("loginUsuario", datosLogin, (respuestaServidor) => {
    if (respuestaServidor?.ok) {
      localStorage.setItem("logueado", "true");
      mensaje.textContent = "Inicio de sesión exitoso";
      setTimeout(() => {
        window.location.href = "home.html";
      }, 1000);
    } else {
      mensaje.textContent =
        respuestaServidor?.mensaje || "Credenciales incorrectas.";
    }
  });
});
