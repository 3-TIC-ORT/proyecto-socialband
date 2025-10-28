connect2Server();

let inputEmail = document.getElementById("email");
let inputPass = document.getElementById("password");
let btnEntrar = document.getElementById("entrar");
let mensaje = document.getElementById("mensaje");

function mostrarMensajeLogin(texto, color) {
  mensaje.innerText = texto;
  if (color) mensaje.style.color = color;
}

if (localStorage.getItem("logueado") === "true") {
  window.location.href = "home.html";
}

btnEntrar.addEventListener("click", function() {
  let email = inputEmail.value.trim();
  let contraseña = inputPass.value;

  if (email === "" || contraseña === "") {
    mostrarMensajeLogin("Completá ambos campos.", "orange");
    return;
  }

  let datosLogin = { email: email, contraseña: contraseña };

  postEvent("loginUsuario", datosLogin, function(res) {
    if (res && res.exito) {
      mostrarMensajeLogin(res.msg, "green");
      localStorage.setItem("logueado", "true");
      localStorage.setItem("emailLogged", email);
      setTimeout(function() {
        window.location.href = "home.html";
      }, 700);
    } else {
      mostrarMensajeLogin((res && res.msg) ? res.msg : "Error en login.", "red");
    }
  });
});
